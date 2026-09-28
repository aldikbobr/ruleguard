// The demo's data pipeline: load the four venues, match pairs, compare the rules (collect), and attach the labels,
// AI verdicts and attestations (enrich). Used by scripts/build-demo.mjs and by the hosted demo's rescan (src/live.mjs).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as kalshi from "./venues/kalshi.mjs";
import * as polymarket from "./venues/polymarket.mjs";
import * as limitless from "./venues/limitless.mjs";
import * as manifold from "./venues/manifold.mjs";
import { matchVenues } from "./match.mjs";
import { compareRules, rawEdge } from "./compare.mjs";
import { VERDICTS } from "./verdicts.mjs";
import { loadCache, lookup } from "./ai/review.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MAX_RULES = 8000;
export const VENUES = [kalshi, polymarket, limitless, manifold];
const NAMES = Object.fromEntries(VENUES.map(v => [v.meta.id, v.meta.name]));

const slim = m => ({ venue: m.venue, id: m.id, title: m.title, outcome: m.outcome, rules: m.rules.length > MAX_RULES ? m.rules.slice(0, MAX_RULES) + " …" : m.rules, close: m.close, yes: m.yes, no: m.no, url: m.url });

// Loads open markets on all venues and matches them pair by pair of venues
export async function collect({ kalshiPages = 30, perVenuePair = 100, log = () => {} } = {}) {
  const loaded = await Promise.all(VENUES.map(async v => {
    try {
      const markets = await v.load(v === kalshi ? { pages: kalshiPages } : {});
      log(`  ${v.meta.name}: ${markets.length} markets`);
      return markets;
    } catch (e) {
      log(`  ${v.meta.name}: failed to load — ${e.message}`);
      return [];
    }
  }));
  const pairs = [], pairStats = [];
  for (let i = 0; i < VENUES.length; i++) {
    for (let j = i + 1; j < VENUES.length; j++) {
      const [va, vb] = [VENUES[i].meta, VENUES[j].meta];
      // Manifold questions are free-form and user-written, so they need a stricter similarity threshold
      const minScore = va.id === "manifold" || vb.id === "manifold" ? 0.6 : 0.45;
      let found = matchVenues(loaded[i], loaded[j], { minScore }).slice(0, perVenuePair);
      // Manifold rules are fetched only for markets that ended up in pairs
      const needRules = found.flatMap(p => [p.a, p.b]).filter(m => m.venue === "manifold");
      if (needRules.length) await manifold.hydrateRules(needRules);
      const before = found.length;
      found = found.filter(p => p.a.rules && p.b.rules);
      pairStats.push({ a: va.id, b: vb.id, pairs: found.length, dropped_no_rules: before - found.length });
      for (const p of found) {
        const play = va.money === "play" || vb.money === "play";
        pairs.push({
          venues: [va.id, vb.id],
          score: Math.round(p.score * 100) / 100,
          edge: play ? null : rawEdge(p.a, p.b),
          cmp: compareRules(p.a, p.b, [va.name, vb.name]),
          verdict: VERDICTS[`${p.a.id}|${p.b.id}`] || null,
          a: slim(p.a),
          b: slim(p.b)
        });
      }
      log(`  pairs ${va.name} ↔ ${vb.name}: ${found.length}`);
    }
  }
  return { generated_at: new Date().toISOString(), venues: VENUES.map((v, i) => ({ ...v.meta, markets: loaded[i].length })), pair_stats: pairStats, pairs };
}

// Saved data: re-attach the in-depth reviews and recompute the comparison (the rules are cached)
export function recompare(data) {
  for (const p of data.pairs) {
    p.verdict = VERDICTS[`${p.a.id}|${p.b.id}`] || null;
    p.cmp = compareRules(p.a, p.b, [NAMES[p.a.venue], NAMES[p.b.venue]]);
  }
  return data;
}

// Labels, AI verdicts and attestations, from the files in research/
export function enrich(data) {
  attachSample(data);
  attachAI(data);
  attachChain(data);
  return data;
}

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

// AI verdicts from research/ai-cache.json (made by scripts/ai-analyze.mjs) and the accuracy report, if present
function attachAI(data) {
  const { verdictOf } = lookup(loadCache(path.join(ROOT, "research", "ai-cache.json")));
  for (const p of data.pairs) {
    const v = verdictOf(p);
    p.ai = v ? { verdict: v.verdict, why: v.why, scenario: v.scenario, model: v.model } : null;
  }
  // the held-out report (pairs never used to tune the prompts) is the honest number; the tuning-set report is kept for reference
  const readEval = f => {
    const file = path.join(ROOT, "research", f);
    if (!fs.existsSync(file)) return null;
    const ev = JSON.parse(fs.readFileSync(file, "utf8"));
    return { n: ev.n, exact_agreement: ev.exact_agreement, different_recall: ev.different_recall, different_precision: ev.different_precision, false_equivalent: ev.false_equivalent.length, at: ev.at };
  };
  data.ai_stats = {
    reviewed: data.pairs.filter(p => p.ai).length,
    models: [...new Set(data.pairs.filter(p => p.ai).map(p => p.ai.model))],
    eval: readEval("ai-eval.json"),
    holdout: readEval("ai-eval-holdout.json")
  };
}

// Verdicts published on Solana by scripts/attest.mjs (Solana Attestation Service), if present
function attachChain(data) {
  const file = path.join(ROOT, "research", "attestations.json");
  if (!fs.existsSync(file)) return;
  const att = JSON.parse(fs.readFileSync(file, "utf8"));
  const explorer = address => `https://explorer.solana.com/address/${address}?cluster=${att.network}`;
  for (const p of data.pairs) {
    const it = att.items?.[`${p.a.venue}:${p.a.id}|${p.b.venue}:${p.b.id}`];
    p.chain = it ? { verdict: it.verdict, method: it.method, url: explorer(it.attestation) } : null;
  }
  const items = Object.values(att.items || {});
  data.chain_stats = {
    network: att.network, total: items.length, attached: data.pairs.filter(p => p.chain).length,
    by_method: items.reduce((acc, it) => ({ ...acc, [it.method]: (acc[it.method] || 0) + 1 }), {}),
    credential: explorer(att.credential), schema: explorer(att.schema), schema_name: att.schema_name
  };
}
