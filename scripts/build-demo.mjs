#!/usr/bin/env node
// RuleGuard — демо: загружает Kalshi, Polymarket, Limitless и Manifold, ищет пары между всеми площадками,
// сравнивает правила и собирает страницу demo/index.html (данные встраиваются в страницу, сервер не нужен).
//
// Запуск:  node scripts/build-demo.mjs [--per-venue-pair 100] [--kalshi-pages 30]
//          node scripts/build-demo.mjs --from-cache   (только пересобрать страницу из сохранённых данных)

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

function renderDemo(data) {
  const template = fs.readFileSync(path.join(ROOT, "demo", "template.html"), "utf8");
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  fs.writeFileSync(path.join(ROOT, "demo", "index.html"), template.replace("/*__DATA__*/null", json));
}

// --from-cache: только пересобрать страницу из research/pairs-all.json, без загрузки площадок
if ("from-cache" in args) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, "research", "pairs-all.json"), "utf8"));
  for (const p of data.pairs) p.verdict = VERDICTS[`${p.a.id}|${p.b.id}`] || null;
  renderDemo(data);
  console.log(`Демо пересобрано из кэша (${data.generated_at}): ${path.join(ROOT, "demo", "index.html")}`);
  process.exit(0);
}

console.log("Загружаю площадки…");
const loaded = await Promise.all(VENUES.map(async v => {
  try {
    const markets = await v.load(v === kalshi ? { pages: Number(args["kalshi-pages"] ?? 30) } : {});
    console.log(`  ${v.meta.name}: ${markets.length} рынков`);
    return markets;
  } catch (e) {
    console.warn(`  ${v.meta.name}: ошибка загрузки — ${e.message}`);
    return [];
  }
}));

const pairs = [];
const pairStats = [];
for (let i = 0; i < VENUES.length; i++) {
  for (let j = i + 1; j < VENUES.length; j++) {
    const [va, vb] = [VENUES[i].meta, VENUES[j].meta];
    // у Manifold вопросы пишут пользователи в свободной форме — нужен более строгий порог схожести
    const minScore = va.id === "manifold" || vb.id === "manifold" ? 0.6 : 0.45;
    let found = matchVenues(loaded[i], loaded[j], { minScore }).slice(0, PER_PAIR);
    // у Manifold правила подгружаются только для рынков, попавших в пары
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
    console.log(`  пары ${va.name} ↔ ${vb.name}: ${found.length}`);
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
console.log(`\nВсего пар: ${pairs.length} | different: ${by("different")} | check: ${by("check")} | looks_equivalent: ${by("looks_equivalent")} | проверено вручную: ${pairs.filter(p => p.verdict).length}`);
console.log(`Демо: ${path.join(ROOT, "demo", "index.html")}  (${Math.round((Date.now() - t0) / 1000)} с)`);
