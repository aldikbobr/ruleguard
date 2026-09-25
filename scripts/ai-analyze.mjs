#!/usr/bin/env node
// AI rule review with Gemini (free tier). Results are cached in research/ai-cache.json, so a rerun only
// analyzes new markets and changed rules, and an interrupted run resumes where it stopped.
//
// Usage:  node scripts/ai-analyze.mjs --sample   (the 30 labeled random-sample pairs + an accuracy report)
//         node scripts/ai-analyze.mjs --all      (every pair in research/pairs-all.json)
//         [--limit N]  analyze at most N pairs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../src/env.mjs";
import { loadCache, saveCache, passports, verdicts, marketKey, PROMPT_VERSION } from "../src/ai/review.mjs";
import { geminiReady, defaultModels } from "../src/ai/gemini.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
loadEnv(ROOT);
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]?.startsWith("--") ? true : arr[i + 1] ?? true]] : acc), []));
const CACHE = path.join(ROOT, "research", "ai-cache.json");
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, "research", f), "utf8"));

if (!geminiReady()) { console.error("GEMINI_API_KEY is not set in .env"); process.exit(1); }

let pairs, labels = null;
if (args.sample) {
  const sample = read("random-sample.json");
  const byN = new Map(read("random-labels.json").labels.map(l => [l.n, l]));
  pairs = sample.pairs.map(p => ({ ...p, human: byN.get(p.n) }));
  labels = true;
} else if (args.all) {
  pairs = read("pairs-all.json").pairs;
} else {
  console.error("Choose --sample or --all");
  process.exit(1);
}
if (args.limit) pairs = pairs.slice(0, Number(args.limit));

const markets = [...new Map(pairs.flatMap(p => [p.a, p.b]).map(m => [marketKey(m), m])).values()];
const cache = loadCache(CACHE);
const t0 = Date.now();
console.log(`Models: ${defaultModels().join(" → ")} · prompt v${PROMPT_VERSION} · ${pairs.length} pairs, ${markets.length} markets`);

const progress = ({ step, done, total, model }) => {
  saveCache(CACHE, cache); // persist after every request, so an interrupted run resumes
  console.log(`  ${step}: ${done}/${total} (${model}) ${Math.round((Date.now() - t0) / 1000)} s`);
};
const passportOf = await passports(markets, cache, { onProgress: progress });
const verdictOf = await verdicts(pairs, cache, passportOf, { onProgress: progress });
saveCache(CACHE, cache);

const results = pairs.map(p => ({ p, ai: verdictOf(p) }));
const missing = results.filter(r => !r.ai).length;
const quotes = markets.flatMap(m => passportOf(m)?.items || []);
const unverified = quotes.filter(q => q.quote == null).length;
console.log(`\nDone in ${Math.round((Date.now() - t0) / 1000)} s. Verdicts: ${results.length - missing}/${results.length}${missing ? ` (${missing} missing — rerun to retry)` : ""}. Quotes verified: ${quotes.length - unverified}/${quotes.length}.`);

if (labels) {
  // Compare with the manual labels of the random sample
  const rows = results.filter(r => r.ai && r.p.human);
  const H = ["equivalent", "caveats", "different"], A = ["equivalent", "caveats", "different", "uncertain"];
  const matrix = Object.fromEntries(H.map(h => [h, Object.fromEntries(A.map(a => [a, 0]))]));
  for (const r of rows) matrix[r.p.human.label][r.ai.verdict]++;
  const agree = rows.filter(r => r.ai.verdict === r.p.human.label).length;
  const falseEquivalent = rows.filter(r => r.ai.verdict === "equivalent" && r.p.human.label !== "equivalent");
  const humanDiff = rows.filter(r => r.p.human.label === "different");
  const caughtDiff = humanDiff.filter(r => r.ai.verdict === "different").length;
  const aiDiff = rows.filter(r => r.ai.verdict === "different");
  const report = {
    at: new Date().toISOString(), prompt_version: PROMPT_VERSION, models: [...new Set(rows.map(r => r.ai.model))],
    n: rows.length, exact_agreement: agree, matrix,
    different_recall: `${caughtDiff}/${humanDiff.length}`,
    different_precision: `${aiDiff.filter(r => r.p.human.label === "different").length}/${aiDiff.length}`,
    false_equivalent: falseEquivalent.map(r => ({ n: r.p.n, human: r.p.human.label, ai_why: r.ai.why })),
    pairs: rows.map(r => ({ n: r.p.n, venues: r.p.venues.join("-"), title: r.p.a.title, human: r.p.human.label, ai: r.ai.verdict, why: r.ai.why, scenario: r.ai.scenario, model: r.ai.model }))
  };
  fs.writeFileSync(path.join(ROOT, "research", "ai-eval.json"), JSON.stringify(report, null, 2));
  console.log(`\nAccuracy vs manual labels (${rows.length} pairs):`);
  console.log(`  exact agreement: ${agree}/${rows.length}`);
  console.log(`  "different" caught: ${report.different_recall} · AI "different" correct: ${report.different_precision}`);
  console.log(`  dangerous errors (AI "equivalent", human not): ${falseEquivalent.length}`);
  console.log("  human ↓ / AI →   " + A.map(a => a.padEnd(11)).join(""));
  for (const h of H) console.log(`  ${h.padEnd(16)} ${A.map(a => String(matrix[h][a]).padEnd(11)).join("")}`);
  for (const r of rows.filter(r => r.ai.verdict !== r.p.human.label)) console.log(`  #${r.p.n} human=${r.p.human.label} ai=${r.ai.verdict}: ${r.ai.why}`);
  console.log("Report: research/ai-eval.json");
}
