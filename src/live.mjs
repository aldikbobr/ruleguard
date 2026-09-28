// Live data for the demo page: current prices for every matched market, and a refresh of one pair (prices, rules,
// comparison and, when the rules changed, the AI review). Shared by the local server (scripts/serve.mjs) and the
// hosted functions (api/*.mjs on Vercel), so both behave the same.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as kalshi from "./venues/kalshi.mjs";
import * as polymarket from "./venues/polymarket.mjs";
import * as limitless from "./venues/limitless.mjs";
import * as manifold from "./venues/manifold.mjs";
import { compareRules, rawEdge } from "./compare.mjs";
import { loadCache, saveCache, lookup, passports, verdicts } from "./ai/review.mjs";
import { geminiReady } from "./ai/gemini.mjs";
import { getJson } from "./util.mjs";
import { pairsSig } from "./page.mjs";
import { collect, enrich } from "./build.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const DATA = path.join(ROOT, "research", "pairs-all.json");
const AI_CACHE = path.join(ROOT, "research", "ai-cache.json");
const VENUES = { kalshi, polymarket, limitless, manifold };

// Live prices: one shared request to the venues for all open tabs, reused for PRICE_TTL_MS
// (shorter than the fastest auto-refresh option on the page, 30 s)
const PRICE_TTL_MS = 25_000;
// "Refresh this pair" is cached briefly: this only absorbs double clicks
const PAIR_TTL_MS = 3_000;
const MAX_RULES = 8000; // same truncation as scripts/build-demo.mjs, so texts compare like for like
const AI_TIMEOUT_MS = 25_000; // the ↻ button never waits longer than this for the AI
// A public deployment must not let anyone burn the free Gemini quota: at most this many fresh AI reviews a minute
const AI_PER_MINUTE = 4;

// On Vercel the pairs come from the live-data branch, which .github/workflows/refresh.yml rebuilds every 5 minutes,
// or from this server's own rescan when that is newer; locally, and when neither exists, from research/pairs-all.json
const LIVE_DATA_URL = process.env.LIVE_DATA_URL
  ?? (process.env.VERCEL ? "https://raw.githubusercontent.com/aldikbobr/ruleguard/live-data/live-data.json" : "");
const LIVE_TTL_MS = 30_000;
const liveCache = { at: 0, data: null };

const newest = (...sets) => sets.filter(Boolean).sort((x, y) => Date.parse(y.generated_at) - Date.parse(x.generated_at))[0] ?? null;

// The latest page data this server knows: the published live data or its own rescan, whichever is newer;
// null when there is neither (then the deployed snapshot is used)
export async function liveData() {
  if (!LIVE_DATA_URL) return rescanned.data;
  if (!liveCache.data || Date.now() - liveCache.at >= LIVE_TTL_MS) {
    try {
      // the query string gets past GitHub's 5-minute raw-file cache
      const data = await getJson(`${LIVE_DATA_URL}?t=${Math.floor(Date.now() / LIVE_TTL_MS)}`);
      if (data?.pairs?.length) Object.assign(liveCache, { at: Date.now(), data });
    } catch { /* keep serving the last good copy or the snapshot */ }
  }
  return newest(liveCache.data, rescanned.data);
}

// "Refresh all pairs" on the hosted demo: scan the four venues again right now (about 20 s) instead of waiting for
// the refresh workflow. At most once a minute per server, and only when someone asks, which keeps it inside the
// free tier's CPU budget; concurrent requests share one scan.
const RESCAN_MIN_MS = 60_000;
const rescanned = { at: 0, data: null, pending: null };
export async function rescan() {
  if (rescanned.data && Date.now() - rescanned.at < RESCAN_MIN_MS) return rescanned.data;
  rescanned.pending ??= (async () => {
    const data = enrich(await collect());
    const safe = await liveData();
    // a venue outage must not replace a good set with a half-empty one
    if (safe && data.pairs.length < safe.pairs.length * 0.5) return safe;
    Object.assign(rescanned, { at: Date.now(), data });
    resetCaches();
    return data;
  })().finally(() => { rescanned.pending = null; });
  return rescanned.pending;
}
const readData = async () => (await liveData()) ?? JSON.parse(fs.readFileSync(DATA, "utf8"));
// When the pairs were built and which set it is (see pairsSig), for /api/status
export async function snapshotInfo() {
  try {
    const data = await readData();
    return { generated_at: data.generated_at ?? null, pairs_sig: pairsSig(data.pairs) };
  } catch { return { generated_at: null, pairs_sig: null }; }
}

const priceCache = { at: 0, body: null, pending: null };
const pairCache = new Map();
const aiRuns = [];

export function resetCaches() {
  Object.assign(priceCache, { at: 0, body: null });
  pairCache.clear();
}

async function fetchPrices() {
  const data = await readData();
  const ids = {};
  for (const p of data.pairs) for (const m of [p.a, p.b]) (ids[m.venue] ??= new Set()).add(m.id);
  const prices = {}, errors = [];
  await Promise.all(Object.entries(ids).map(async ([venue, set]) => {
    try {
      const got = await VENUES[venue].prices([...set]);
      for (const [id, q] of got) prices[`${venue}:${id}`] = q;
    } catch (e) { errors.push(`${venue}: ${e.message}`); }
  }));
  return { fetched_at: new Date().toISOString(), snapshot: data.generated_at, count: Object.keys(prices).length, prices, errors };
}

export async function livePrices() {
  if (priceCache.body && Date.now() - priceCache.at < PRICE_TTL_MS) return priceCache.body;
  priceCache.pending ??= fetchPrices()
    .then(body => Object.assign(priceCache, { at: Date.now(), body }).body)
    .finally(() => { priceCache.pending = null; });
  return priceCache.pending;
}

const clip = s => (s.length > MAX_RULES ? s.slice(0, MAX_RULES) + " …" : s);
const squash = s => String(s || "").replace(/\s+/g, " ").trim();
const pairKey = p => `${p.a.venue}:${p.a.id}|${p.b.venue}:${p.b.id}`;

// Refetch both markets, keep the cached rules when a venue returns none, re-compare, and report whether the rules
// changed since the snapshot (an in-depth review may then be outdated). With ai: false the AI step is skipped,
// which is what "refresh all pairs" uses, so a bulk refresh never waits on the model.
export async function refreshPair(key, { ai = true } = {}) {
  const cacheKey = `${key}#${ai ? 1 : 0}`;
  const hit = pairCache.get(cacheKey);
  if (hit && Date.now() - hit.at < PAIR_TTL_MS) return hit.body;
  const data = await readData();
  const p = data.pairs.find(x => pairKey(x) === key);
  if (!p) throw Object.assign(new Error("this pair is not in the current data — reload the page"), { status: 404 });
  const fresh = await Promise.all([p.a, p.b].map(m => VENUES[m.venue].market(m.id)));
  const [a, b] = [p.a, p.b].map((m, i) => {
    const f = fresh[i];
    const rules = f.rules ? clip(f.rules) : m.rules;
    return { market: { ...m, yes: f.yes, no: f.no, close: f.close ?? m.close, rules }, changed: Boolean(f.rules) && squash(rules) !== squash(m.rules) };
  });
  const [ma, mb] = [VENUES[p.a.venue].meta, VENUES[p.b.venue].meta];
  const current = { a: a.market, b: b.market };
  const rulesChanged = a.changed || b.changed;
  const body = {
    fetched_at: new Date().toISOString(),
    a: a.market,
    b: b.market,
    cmp: compareRules(a.market, b.market, [ma.name, mb.name]),
    edge: ma.money === "play" || mb.money === "play" ? null : rawEdge(a.market, b.market),
    rules_changed: { a: a.changed, b: b.changed },
    ...(await aiFor(current, { run: ai }))
  };
  if (!ai && rulesChanged && !body.ai) body.ai_note = "rules changed — press this pair's ↻ for a new AI review";
  pairCache.set(cacheKey, { at: Date.now(), body });
  return body;
}

// AI verdict for a pair with its current rules: from the cache when the rules are unchanged; otherwise ask Gemini
// (two passports at most plus one verdict) unless run is false. The cache is saved when the disk is writable
// (not on a hosted function).
async function aiFor(pair, { run: allowRun = true } = {}) {
  const cache = loadCache(AI_CACHE);
  const cached = lookup(cache).verdictOf(pair);
  if (cached) return { ai: pick(cached), ai_fresh: true };
  if (!allowRun) return { ai: null, ai_fresh: false };
  if (!geminiReady()) return { ai: null, ai_fresh: false, ai_note: "no Gemini key" };
  const now = Date.now();
  while (aiRuns.length && now - aiRuns[0] > 60_000) aiRuns.shift();
  if (aiRuns.length >= AI_PER_MINUTE) return { ai: null, ai_fresh: false, ai_note: "AI review is busy — try again in a minute" };
  aiRuns.push(now);
  const run = (async () => {
    const passportOf = await passports([pair.a, pair.b], cache);
    const verdictOf = await verdicts([pair], cache, passportOf);
    try { saveCache(AI_CACHE, cache); } catch { /* read-only file system on a hosted function */ }
    return verdictOf(pair);
  })();
  const timeout = new Promise(resolve => setTimeout(() => resolve("timeout"), AI_TIMEOUT_MS));
  try {
    const v = await Promise.race([run, timeout]);
    if (v === "timeout") return { ai: null, ai_fresh: false, ai_note: "AI review is taking longer than usual — try again in a minute" };
    return v ? { ai: pick(v), ai_fresh: true } : { ai: null, ai_fresh: false, ai_note: "AI returned no verdict" };
  } catch (e) {
    return { ai: null, ai_fresh: false, ai_note: `AI review failed: ${e.message.slice(0, 120)}` };
  }
}
const pick = v => ({ verdict: v.verdict, why: v.why, scenario: v.scenario, model: v.model });
