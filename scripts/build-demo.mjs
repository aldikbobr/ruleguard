#!/usr/bin/env node
// RuleGuard demo build: loads Kalshi, Polymarket, Limitless and Manifold, matches pairs across every venue pair,
// compares the rules and writes demo/index.html (the data is embedded in the page, so no server is required).
//
// Usage:  node scripts/build-demo.mjs [--per-venue-pair 100] [--kalshi-pages 30]
//         node scripts/build-demo.mjs --from-cache   (re-render the page from saved data only)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as kalshi from "../src/venues/kalshi.mjs";
import * as polymarket from "../src/venues/polymarket.mjs";
import * as limitless from "../src/venues/limitless.mjs";
import * as manifold from "../src/venues/manifold.mjs";
import { matchVenues } from "../src/match.mjs";
import { compareRules, rawEdge } from "../src/compare.mjs";
import { VERDICTS } from "../src/verdicts.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []));
const PER_PAIR = Number(args["per-venue-pair"] ?? 100);
const MAX_RULES = 8000;

const VENUES = [kalshi, polymarket, limitless, manifold];
const t0 = Date.now();

// Labeled random sample (scripts/sample.mjs + research/random-labels.json):
// labels are attached to pairs by key, and the stats are computed here rather than by hand
function attachSample(data) {
  const sp = path.join(ROOT, "research", "random-sample.json"), lp = path.join(ROOT, "research", "random-labels.json");
  if (!fs.existsSync(sp) || !fs.existsSync(lp)) return;
  const sample = JSON.parse(fs.readFileSync(sp, "utf8"));
  const labels = JSON.parse(fs.readFileSync(lp, "utf8"));
  const byN = new Map(labels.labels.map(l => [l.n, l]));
  const byKey = new Map(sample.pairs.map(p => [p.key, { ...byN.get(p.n), venues: p.venues }]));
  for (const p of data.pairs) {
    const s = byKey.get(`${p.a.venue}:${p.a.id}|${p.b.venue}:${p.b.id}`);
    p.sample = s?.label ? { n: s.n, label: s.label, short: s.short, reason: s.reason } : null;
  }
  const count = rows => ({ n: rows.length, equivalent: rows.filter(r => r.label === "equivalent").length, caveats: rows.filter(r => r.label === "caveats").length, different: rows.filter(r => r.label === "different").length });
  const rows = [...byKey.values()].filter(r => r.label);
  const copy = r => r.venues.join("-") === "polymarket-limitless";
  data.sample_stats = {
    snapshot: sample.snapshot, seed: sample.seed, population: sample.population, reviewer: labels.reviewer, method: labels.method,
    attached: data.pairs.filter(p => p.sample).length,
    all: count(rows),
    cross_operator: count(rows.filter(r => !copy(r))),
    polymarket_limitless: count(rows.filter(copy))
  };
}

function renderDemo(data) {
  attachSample(data);
  const template = fs.readFileSync(path.join(ROOT, "demo", "template.html"), "utf8");
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  fs.writeFileSync(path.join(ROOT, "demo", "index.html"), template.replace("/*__DATA__*/null", json));
}

// --from-cache: re-render the page from research/pairs-all.json without fetching the venues
if ("from-cache" in args) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, "research", "pairs-all.json"), "utf8"));
  const names = Object.fromEntries(VENUES.map(v => [v.meta.id, v.meta.name]));
  for (const p of data.pairs) {
    p.verdict = VERDICTS[`${p.a.id}|${p.b.id}`] || null;
    p.cmp = compareRules(p.a, p.b, [names[p.a.venue], names[p.b.venue]]); // the rules are cached, so recompute the comparison
  }
  renderDemo(data);
  console.log(`Demo re-rendered from cache (${data.generated_at}): ${path.join(ROOT, "demo", "index.html")}`);
  process.exit(0);
}

console.log("Loading venues…");
const loaded = await Promise.all(VENUES.map(async v => {
  try {
    const markets = await v.load(v === kalshi ? { pages: Number(args["kalshi-pages"] ?? 30) } : {});
    console.log(`  ${v.meta.name}: ${markets.length} markets`);
    return markets;
  } catch (e) {
    console.warn(`  ${v.meta.name}: failed to load — ${e.message}`);
    return [];
  }
}));

const pairs = [];
const pairStats = [];
for (let i = 0; i < VENUES.length; i++) {
  for (let j = i + 1; j < VENUES.length; j++) {
    const [va, vb] = [VENUES[i].meta, VENUES[j].meta];
    // Manifold questions are free-form and user-written, so they need a stricter similarity threshold
    const minScore = va.id === "manifold" || vb.id === "manifold" ? 0.6 : 0.45;
    let found = matchVenues(loaded[i], loaded[j], { minScore }).slice(0, PER_PAIR);
    // Manifold rules are fetched only for markets that ended up in pairs
    const needRules = found.flatMap(p => [p.a, p.b]).filter(m => m.venue === "manifold");
    if (needRules.length) await manifold.hydrateRules(needRules);
    const before = found.length;
    found = found.filter(p => p.a.rules && p.b.rules);
    pairStats.push({ a: va.id, b: vb.id, pairs: found.length, dropped_no_rules: before - found.length });
    for (const p of found) {
      const play = va.money === "play" || vb.money === "play";
      const v = VERDICTS[`${p.a.id}|${p.b.id}`] || null;
      pairs.push({
        venues: [va.id, vb.id],
        score: Math.round(p.score * 100) / 100,
        edge: play ? null : rawEdge(p.a, p.b),
        cmp: compareRules(p.a, p.b, [va.name, vb.name]),
        verdict: v,
        a: slim(p.a),
        b: slim(p.b)
      });
    }
    console.log(`  pairs ${va.name} ↔ ${vb.name}: ${found.length}`);
  }
}

function slim(m) {
  return { venue: m.venue, id: m.id, title: m.title, outcome: m.outcome, rules: m.rules.length > MAX_RULES ? m.rules.slice(0, MAX_RULES) + " …" : m.rules, close: m.close, yes: m.yes, no: m.no, url: m.url };
}

const data = {
  generated_at: new Date().toISOString(),
  venues: VENUES.map((v, i) => ({ ...v.meta, markets: loaded[i].length })),
  pair_stats: pairStats,
  pairs
};

fs.mkdirSync(path.join(ROOT, "research"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "research", "pairs-all.json"), JSON.stringify(data, null, 2));

renderDemo(data);

const by = c => pairs.filter(p => p.cmp.cls === c).length;
console.log(`\nPairs: ${pairs.length} | different: ${by("different")} | check: ${by("check")} | looks_equivalent: ${by("looks_equivalent")} | reviewed by hand: ${pairs.filter(p => p.verdict).length}`);
console.log(`Demo: ${path.join(ROOT, "demo", "index.html")}  (${Math.round((Date.now() - t0) / 1000)} s)`);
