#!/usr/bin/env node
// Воспроизводимая случайная выборка пар для ручной разметки.
// Берёт пары между площадками с реальными деньгами из research/pairs-all.json,
// перемешивает с фиксированным зерном и сохраняет первые N в research/random-sample.json.
//
// Запуск:  node scripts/sample.mjs [--n 30] [--seed 20260925]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []));
const N = Number(args.n ?? 30);
const SEED = Number(args.seed ?? 20260925);

// mulberry32: простой детерминированный генератор, чтобы выборку мог повторить любой
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "research", "pairs-all.json"), "utf8"));
const population = data.pairs.filter(p => p.edge != null); // только реальные деньги (без Manifold)
const rand = rng(SEED);
const shuffled = population.map(p => [rand(), p]).sort((x, y) => x[0] - y[0]).map(([, p]) => p);
const sample = shuffled.slice(0, N).map((p, i) => ({ n: i + 1, key: `${p.a.venue}:${p.a.id}|${p.b.venue}:${p.b.id}`, venues: p.venues, auto: p.cmp.cls, a: p.a, b: p.b }));

const byPair = {};
for (const p of population) byPair[p.venues.join("-")] = (byPair[p.venues.join("-")] || 0) + 1;
const out = { snapshot: data.generated_at, seed: SEED, population: population.length, population_by_venue_pair: byPair, n: sample.length, pairs: sample };
fs.writeFileSync(path.join(ROOT, "research", "random-sample.json"), JSON.stringify(out, null, 2));

console.log(`Снимок данных: ${data.generated_at}`);
console.log(`Генеральная совокупность: ${population.length} пар с реальными деньгами`, byPair);
console.log(`Выборка: ${sample.length} пар, зерно ${SEED} → research/random-sample.json`);
for (const p of sample) console.log(`${String(p.n).padStart(2)} ${p.venues.join("-").padEnd(21)} ${p.auto.padEnd(16)} ${p.a.title} ${p.a.outcome || ""}`);
