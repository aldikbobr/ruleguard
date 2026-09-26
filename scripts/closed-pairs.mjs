#!/usr/bin/env node
// Closed-pairs study: markets on Kalshi and Polymarket that looked identical and have already settled.
// How often did "the same" market settle one way on one venue and the other way on the other, and why?
//
// Usage:  node scripts/closed-pairs.mjs [--poly-pages-per-month 20] [--refetch | --refetch-kalshi | --refetch-polymarket]
// Raw markets are cached in research/.cache/ (git-ignored); the matched pairs go to research/closed-pairs.json.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getJson, mapLimit, num, parseArr, sleep } from "../src/util.mjs";
import { matchVenues } from "../src/match.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]?.startsWith("--") ? true : arr[i + 1] ?? true]] : acc), []));
const CACHE = path.join(ROOT, "research", ".cache");
const OUT = path.join(ROOT, "research", "closed-pairs.json");
const K = "https://api.elections.kalshi.com/trade-api/v2";
const P = "https://gamma-api.polymarket.com";

// Kalshi series worth matching: event questions, not games, weather or price ranges; no daily or faster series
const CATEGORIES = new Set(["Politics", "Elections", "Economics", "World", "Science and Technology", "Companies", "Health", "Social", "AI", "Entertainment", "Mentions"]);
const SKIP_FREQUENCY = new Set(["daily", "hourly", "fifteen_min"]);
// "The same" question asked for a different period is not a pair: settlement times must be this close
const MAX_GAP_DAYS = 60;
// a long batch job: wait out rate limits instead of failing (up to ~2 minutes per request)
const TRIES = 8;

// Loaders save their progress to <name>.partial.json, so an interrupted run resumes where it stopped
function progress(name) {
  const file = path.join(CACHE, `${name}.partial.json`);
  const state = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { done: [], items: [] };
  if (state.done.length) console.log(`  ${name}: resuming, ${state.done.length} parts already loaded`);
  return {
    done: new Set(state.done), items: state.items,
    save() { fs.mkdirSync(CACHE, { recursive: true }); fs.writeFileSync(file, JSON.stringify({ done: [...this.done], items: this.items })); },
    finish() { fs.rmSync(file, { force: true }); }
  };
}

async function cached(name, load, refetch) {
  const file = path.join(CACHE, `${name}.json`);
  if (!refetch && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  const data = await load();
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data));
  return data;
}

// Kalshi: every settled market of the chosen series (the settled-events feed is newest first and is dominated by
// daily price markets, so it is read series by series instead); only markets that settled Yes or No
async function loadKalshi() {
  const { series } = await getJson(`${K}/series`);
  const chosen = series.filter(s => CATEGORIES.has(s.category) && !SKIP_FREQUENCY.has(s.frequency));
  console.log(`  kalshi: ${chosen.length} of ${series.length} series`);
  const st = progress("closed-kalshi");
  let done = st.done.size, failed = 0;
  await mapLimit(chosen.filter(s => !st.done.has(s.ticker)), 10, async s => {
    const found = [];
    let cursor = "";
    do {
      let d;
      try { d = await getJson(`${K}/markets?series_ticker=${encodeURIComponent(s.ticker)}&status=settled&limit=1000${cursor ? `&cursor=${cursor}` : ""}`, TRIES); }
      catch (e) { failed++; console.warn(`  kalshi ${s.ticker}: ${e.message}`); return; }
      for (const m of d.markets ?? []) {
        if (!["yes", "no"].includes(m.result)) continue;
        found.push({
          venue: "kalshi", id: m.ticker, event: m.event_ticker, category: s.category,
          title: m.title, outcome: m.yes_sub_title || "",
          rules: [m.rules_primary, m.rules_secondary].filter(Boolean).join("\n\n"),
          close: m.close_time, settled: m.settlement_ts || m.expiration_time || m.close_time,
          result: m.result, volume: num(m.volume_fp),
          url: `https://kalshi.com/markets/${s.ticker.toLowerCase()}`
        });
      }
      cursor = d.cursor;
      await sleep(100);
    } while (cursor);
    st.items.push(...found);
    st.done.add(s.ticker);
    if (++done % 250 === 0) { st.save(); console.log(`  kalshi: ${done} series, ${st.items.length} settled markets`); }
  });
  if (failed) {
    st.save();
    throw new Error(`kalshi: ${failed} series could not be read even after retries; rerun to resume`);
  }
  st.finish();
  return st.items;
}

// Polymarket: closed Yes/No markets by volume; the result is read from the final outcome prices.
// Gamma returns at most 100 markets per request and refuses offsets past ~2,500, so the markets are fetched
// month by month of their end date, the most traded first.
async function loadPolymarket(pagesPerMonth) {
  const st = progress("closed-polymarket");
  const seen = new Set(st.items.map(m => m.id));
  for (let d = new Date(Date.UTC(2024, 0, 1)); d < new Date(); d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))) {
    const from = d.toISOString(), to = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1)).toISOString();
    const month = from.slice(0, 7);
    if (st.done.has(month)) continue;
    for (let page = 0; page < pagesPerMonth; page++) {
      // an error here stops the run; the months already loaded are kept for the next run
      const data = await getJson(`${P}/markets?closed=true&end_date_min=${from}&end_date_max=${to}&limit=100&offset=${page * 100}&order=volumeNum&ascending=false`, TRIES);
      if (!Array.isArray(data) || !data.length) break;
      for (const m of data) {
        if (seen.has(m.slug)) continue;
        seen.add(m.slug);
        const item = polyItem(m);
        if (item) st.items.push(item);
      }
      if (data.length < 100) break;
      await sleep(150);
    }
    st.done.add(month);
    st.save();
    console.log(`  polymarket: through ${month}, ${st.items.length} settled markets`);
  }
  st.finish();
  return st.items;
}

function polyItem(m) {
  const outcomes = parseArr(m.outcomes).map(o => String(o).toLowerCase());
  const yesIdx = outcomes.indexOf("yes");
  if (yesIdx < 0 || outcomes.length !== 2) return null;
  const yes = num(parseArr(m.outcomePrices)[yesIdx]);
  // 1/0 is a normal settlement; 0.5 is a 50-50 settlement, which is also a divergence from a Yes/No venue
  const result = yes == null ? null : yes >= 0.99 ? "yes" : yes <= 0.01 ? "no" : Math.abs(yes - 0.5) < 0.01 ? "50-50" : null;
  if (!result) return null;
  return {
    venue: "polymarket", id: m.slug, event: m.events?.[0]?.title || "",
    title: m.question, outcome: m.groupItemTitle || "",
    rules: [m.description, m.resolutionSource ? `Resolution source: ${m.resolutionSource}` : ""].filter(Boolean).join("\n\n"),
    close: m.endDate, settled: m.closedTime ? new Date(m.closedTime.replace(" ", "T").replace(/\+00$/, "Z")).toISOString() : m.endDate,
    result, volume: num(m.volumeNum),
    url: `https://polymarket.com/market/${m.slug}`
  };
}

const t0 = Date.now();
console.log("Loading settled markets…");
// --refetch reloads both venues; --refetch-polymarket or --refetch-kalshi reloads one
const refetch = venue => Boolean(args.refetch || args[`refetch-${venue}`]);
const [kalshi, poly] = await Promise.all([
  cached("closed-kalshi", () => loadKalshi(), refetch("kalshi")),
  cached("closed-polymarket", () => loadPolymarket(Number(args["poly-pages-per-month"] ?? 20)), refetch("polymarket"))
]);
console.log(`Kalshi: ${kalshi.length} settled markets · Polymarket: ${poly.length}`);

const days = (x, y) => Math.abs(Date.parse(x) - Date.parse(y)) / 864e5;
const matched = matchVenues(kalshi, poly, { minScore: 0.5, perEvent: 5 });
const far = matched.filter(p => !(days(p.a.settled, p.b.settled) <= MAX_GAP_DAYS));
const pairs = matched.filter(p => days(p.a.settled, p.b.settled) <= MAX_GAP_DAYS).map(p => ({
  score: Math.round(p.score * 100) / 100,
  gap_days: Math.round(days(p.a.settled, p.b.settled)),
  agree: p.a.result === p.b.result,
  a: p.a, b: p.b
}));

const disagree = pairs.filter(p => !p.agree);
const data = {
  generated_at: new Date().toISOString(),
  kalshi_markets: kalshi.length, polymarket_markets: poly.length,
  matched: matched.length, dropped_far_apart: far.length, max_gap_days: MAX_GAP_DAYS,
  pairs: pairs.length, disagree: disagree.length,
  items: pairs.sort((x, y) => Number(x.agree) - Number(y.agree) || y.score - x.score)
};
fs.writeFileSync(OUT, JSON.stringify(data, null, 2));

console.log(`\nMatched ${matched.length} pairs; ${far.length} dropped (settled more than ${MAX_GAP_DAYS} days apart); ${pairs.length} kept.`);
console.log(`Settled the same way: ${pairs.length - disagree.length} · differently: ${disagree.length}\n`);
for (const p of disagree) {
  console.log(`[${p.score}] Kalshi ${p.a.result.toUpperCase()} vs Polymarket ${p.b.result.toUpperCase()} (${p.gap_days} d apart)`);
  console.log(`   K: ${p.a.title}${p.a.outcome && !p.a.title.includes(p.a.outcome) ? " · " + p.a.outcome : ""}  (${p.a.id})`);
  console.log(`   P: ${p.b.title}  (${p.b.id})`);
}
console.log(`\nSaved ${path.relative(ROOT, OUT)} (${Math.round((Date.now() - t0) / 1000)} s)`);
