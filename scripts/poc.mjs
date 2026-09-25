#!/usr/bin/env node
// RuleGuard — шаг 1: проверка идеи.
// Загружает открытые рынки Kalshi и Polymarket, находит пары «одинаковых» рынков,
// сравнивает правила расчёта простыми правилами (без ИИ) и пишет отчёт в research/.
//
// Запуск:  node scripts/poc.mjs [--kalshi-pages 30] [--poly-pages 20] [--top 60]
// Требуется Node 20+. Ключи не нужны: оба API публичные.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = path.join(ROOT, "research");
const KALSHI = "https://api.elections.kalshi.com/trade-api/v2";
const GAMMA = "https://gamma-api.polymarket.com";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]]] : acc), [])
);
const KALSHI_PAGES = Number(args["kalshi-pages"] ?? 30);
const POLY_PAGES = Number(args["poly-pages"] ?? 20);
const TOP = Number(args.top ?? 60);
const MIN_SCORE = Number(args["min-score"] ?? 0.45);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) { await sleep(1000 * (i + 1)); continue; }
    throw new Error(`${res.status} ${url}`);
  }
  throw new Error(`failed after retries: ${url}`);
}

// ---------- загрузка ----------

async function loadKalshi() {
  const markets = [];
  let cursor = "";
  for (let page = 0; page < KALSHI_PAGES; page++) {
    const url = `${KALSHI}/events?status=open&with_nested_markets=true&limit=200${cursor ? `&cursor=${cursor}` : ""}`;
    const data = await getJson(url);
    for (const ev of data.events ?? []) {
      for (const m of ev.markets ?? []) {
        if (m.status && !["active", "open"].includes(m.status)) continue;
        markets.push({
          venue: "kalshi",
          id: m.ticker,
          event: ev.title,
          category: ev.category,
          title: m.title,
          outcome: m.yes_sub_title || "",
          rules: [m.rules_primary, m.rules_secondary].filter(Boolean).join("\n\n"),
          close: m.close_time,
          yes: num(m.yes_ask_dollars),
          no: num(m.no_ask_dollars),
          liquidity: num(m.liquidity_dollars),
          volume: num(m.volume_fp),
          url: `https://kalshi.com/markets/${(ev.series_ticker || ev.event_ticker || "").toLowerCase()}`
        });
      }
    }
    cursor = data.cursor;
    if (!cursor) break;
    await sleep(150);
  }
  return markets;
}

async function loadPolymarket() {
  const markets = [];
  for (let page = 0; page < POLY_PAGES; page++) {
    const url = `${GAMMA}/markets?active=true&closed=false&limit=100&offset=${page * 100}&order=volume24hr&ascending=false`;
    let data;
    try { data = await getJson(url); } catch (e) { console.warn(`polymarket page ${page}: ${e.message}`); break; }
    if (!Array.isArray(data) || data.length === 0) break;
    for (const m of data) {
      const prices = parseArr(m.outcomePrices);
      const outcomes = parseArr(m.outcomes);
      const yesIdx = outcomes.findIndex(o => String(o).toLowerCase() === "yes");
      markets.push({
        venue: "polymarket",
        id: m.slug,
        event: m.events?.[0]?.title || "",
        category: "",
        title: m.question,
        outcome: m.groupItemTitle || "",
        rules: [m.description, m.resolutionSource ? `Resolution source: ${m.resolutionSource}` : ""].filter(Boolean).join("\n\n"),
        close: m.endDate,
        yes: num(m.bestAsk) ?? (yesIdx >= 0 ? num(prices[yesIdx]) : null),
        no: m.bestBid != null ? round(1 - Number(m.bestBid)) : (yesIdx >= 0 ? num(prices[1 - yesIdx]) : null),
        liquidity: num(m.liquidityNum ?? m.liquidity),
        volume: num(m.volumeNum ?? m.volume),
        url: `https://polymarket.com/market/${m.slug}`
      });
    }
    await sleep(150);
  }
  return markets;
}

function parseArr(v) { try { return Array.isArray(v) ? v : JSON.parse(v || "[]"); } catch { return []; } }
function num(v) { const n = Number(v); return v == null || v === "" || Number.isNaN(n) ? null : n; }
function round(n, d = 3) { return Math.round(n * 10 ** d) / 10 ** d; }

// ---------- сопоставление ----------

const STOP = new Set("the a an of in on at to by for will be is are was and or before after than this that with from as it its his her their who what which when during end 2025 2026 2027 yes no market".split(" "));
// слова, которые меняют смысл вопроса: если есть только с одной стороны — не пара
const PIVOTS = ["closest", "margin", "before", "after", "above", "below", "over", "under", "between", "least", "most", "win", "lose", "leave", "out", "resign", "nominee", "nomination", "primary", "popular", "electoral", "senate", "house", "governor", "mayor", "cut", "hike", "raise", "increase", "decrease", "first", "second", "third"];
const MONTHS = "january february march april may june july august september october november december".split(" ");

function textOf(m) { return `${m.title} ${m.outcome}`.toLowerCase(); }
function tokens(s) { return s.replace(/[^a-z0-9%.$ ]/g, " ").split(/\s+/).filter(t => t && !STOP.has(t) && t.length > 1); }
function numbersIn(s) {
  return new Set((s.match(/\d+(?:[.,]\d+)?/g) || []).map(x => x.replace(",", "")).filter(x => !/^20[2-3]\d$/.test(x)));
}

function vetoes(a, b) {
  const ta = textOf(a), tb = textOf(b);
  const na = numbersIn(ta), nb = numbersIn(tb);
  if ((na.size || nb.size) && (na.size !== nb.size || [...na].some(x => !nb.has(x)))) return "numbers";
  const wa = new Set(tokens(ta)), wb = new Set(tokens(tb));
  for (const p of PIVOTS) if (wa.has(p) !== wb.has(p)) return `pivot:${p}`;
  const ma = MONTHS.filter(x => wa.has(x)), mb = MONTHS.filter(x => wb.has(x));
  if (ma.length && mb.length && ma.join() !== mb.join()) return "month";
  // исход (кандидат, страна, команда) должен совпадать по последнему слову: Bayrou ≠ Baroin, Osborn ≠ Independent
  const oa = lastWord(a.outcome), ob = lastWord(b.outcome);
  if (oa && ob && oa !== ob) return "outcome";
  // имена собственные: «Putin и Zelenskyy» ≠ «Trump и Putin», «Jalen Williams (NBA)» ≠ «Gabby Williams (WNBA)»
  const pa = properNouns(a), pb = properNouns(b);
  const missing = (xs, ys) => xs.some(x => !ys.some(y => y.slice(0, 5) === x.slice(0, 5)));
  if (pa.length && pb.length && (missing(pa, pb) || missing(pb, pa))) return "proper_noun";
  return null;
}

const GENERIC_CAPS = new Set("will who what which where when the next us usa u.s. presidential president election general party senate house race seat republican republicans democratic democrats democratics independent prime minister premier governor mayor nfl mvp award year before after following".split(" "));
function properNouns(m) {
  const words = `${m.title} ${m.outcome}`.normalize("NFD").replace(/[̀-ͯ]/g, "").match(/\b[A-Z][A-Za-z'’-]{3,}\b|\b[A-Z]{2,}\b/g) || [];
  return [...new Set(words.map(w => w.toLowerCase()).filter(w => !GENERIC_CAPS.has(w) && !MONTHS.includes(w)))];
}

function lastWord(s) {
  const w = String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  return w.length ? w[w.length - 1] : "";
}

function similarity(a, b) {
  const A = new Set(tokens(textOf(a))), B = new Set(tokens(textOf(b)));
  if (!A.size || !B.size) return 0;
  let inter = 0; for (const t of A) if (B.has(t)) inter++;
  const jaccard = inter / (A.size + B.size - inter);
  const containment = inter / Math.min(A.size, B.size);
  return 0.5 * jaccard + 0.5 * containment;
}

function matchMarkets(kalshi, poly) {
  // инвертированный индекс по токенам Polymarket, чтобы не сравнивать всё со всем
  const index = new Map();
  poly.forEach((m, i) => { for (const t of new Set(tokens(textOf(m)))) { if (!index.has(t)) index.set(t, []); index.get(t).push(i); } });
  const cands = [];
  for (const k of kalshi) {
    const seen = new Map();
    for (const t of new Set(tokens(textOf(k)))) for (const i of index.get(t) || []) seen.set(i, (seen.get(i) || 0) + 1);
    for (const [i, shared] of seen) {
      if (shared < 2) continue;
      const p = poly[i];
      const score = similarity(k, p);
      if (score < MIN_SCORE) continue;
      const veto = vetoes(k, p);
      if (veto) continue;
      cands.push({ k, p, score });
    }
  }
  // жадное назначение один к одному
  cands.sort((x, y) => y.score - x.score);
  const usedK = new Set(), usedP = new Set(), pairs = [];
  for (const c of cands) {
    if (usedK.has(c.k.id) || usedP.has(c.p.id)) continue;
    usedK.add(c.k.id); usedP.add(c.p.id); pairs.push(c);
  }
  return pairs;
}

// ---------- сравнение правил (без ИИ) ----------

const SOURCE_PATTERNS = [
  ["AP", /\bassociated press\b|\bthe ap\b|\bap\b(?= (?:news|call|calls|declares))/i],
  ["NYT", /new york times|\bnyt\b/i],
  ["White House", /white house/i],
  ["Federal Reserve", /federal reserve|\bfomc\b/i],
  ["BLS", /bureau of labor statistics|\bbls\b/i],
  ["BEA", /bureau of economic analysis|\bbea\b/i],
  ["NOAA/NWS", /\bnoaa\b|national weather service|\bnws\b/i],
  ["The Weather Company", /weather company|weather\.com/i],
  ["CoinGecko", /coingecko/i],
  ["CoinMarketCap", /coinmarketcap/i],
  ["Binance", /binance/i],
  ["Coinbase", /coinbase/i],
  ["Chainlink", /chainlink/i],
  ["Congress.gov", /congress\.gov/i],
  ["Official league/org", /official (?:nba|nfl|mlb|nhl|fifa|uefa|league|website)/i],
  ["Credible reporting consensus", /consensus of credible reporting|credible reporting/i],
  ["Kalshi Source Agency", /source agency/i]
];
const EDGE_PATTERNS = [
  ["postponed/cancelled", /postpone|cancel|reschedul|delay/i],
  ["did not play/participate", /does not play|did not play|inactive|not participate|doesn'?t play|dnp/i],
  ["data revision", /revis/i],
  ["no data available", /no data|not available|unavailable|not published/i],
  ["tie", /\btie\b|tied|draw/i],
  ["overtime", /overtime|extra time|\bot\b/i],
  ["resolves 50-50 / other", /50-50|50\/50|fifty/i],
  ["last traded price", /last traded price|last trade/i],
  ["clarification / dispute", /clarif|dispute|\buma\b/i]
];

const MONTH_RE = new RegExp(`\\b(${MONTHS.join("|")})\\s+(\\d{1,2}),?\\s+(20\\d\\d)`, "gi");
const MONTH_ABBR = new RegExp(`\\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?\\s+(\\d{1,2}),?\\s+(20\\d\\d)`, "gi");
function latestDate(text) {
  let best = null;
  for (const re of [MONTH_RE, MONTH_ABBR]) {
    for (const m of String(text).matchAll(re)) {
      const t = Date.parse(`${m[1]} ${m[2]}, ${m[3]} UTC`);
      if (!Number.isNaN(t) && (best == null || t > best)) best = t;
    }
  }
  return best;
}
const iso = t => new Date(t).toISOString().slice(0, 10);

function detect(patterns, text) { return patterns.filter(([, re]) => re.test(text)).map(([name]) => name); }

function compareRules(k, p) {
  const flags = [];
  const kSrc = detect(SOURCE_PATTERNS, k.rules), pSrc = detect(SOURCE_PATTERNS, p.rules);
  const onlyK = kSrc.filter(s => !pSrc.includes(s)), onlyP = pSrc.filter(s => !kSrc.includes(s));
  // Разные источники — сигнал для проверки, а не вывод: «официальные данные + NYT» и «официальные данные + консенсус СМИ» обычно совпадают
  if (onlyK.length || onlyP.length) flags.push({ field: "source", level: "check", detail: `Kalshi: ${kSrc.join(", ") || "—"} | Polymarket: ${pSrc.join(", ") || "—"}` });

  // Дедлайн события берём из текста правил (последняя упомянутая дата), а не из времени закрытия торгов:
  // у Kalshi close_time бывает 2045 годом у бессрочных рынков, это не дедлайн события.
  const kDl = latestDate(k.rules), pDl = latestDate(p.rules);
  if (kDl && pDl) {
    const days = Math.abs(kDl - pDl) / 864e5;
    if (days > 1) flags.push({ field: "deadline", level: days > 7 ? "material" : "check", detail: `дедлайн в правилах: Kalshi ${iso(kDl)}, Polymarket ${iso(pDl)} (разница ${Math.round(days)} дн.)` });
  } else if (kDl || pDl) {
    flags.push({ field: "deadline", level: "check", detail: `дата в правилах есть только у ${kDl ? "Kalshi" : "Polymarket"} (${iso(kDl || pDl)})` });
  }

  // Временные/исполняющие обязанности: одна сторона включает, другая исключает
  const interimRe = /interim|caretaker|acting/i;
  const excl = t => /(interim|caretaker|acting)[^.]{0,80}(will not|won'?t|does not|do not|not) count/i.test(t);
  const incl = t => /(acting|interim)[^.]{0,80}count as/i.test(t);
  if (interimRe.test(k.rules) || interimRe.test(p.rules)) {
    const ks = incl(k.rules) ? "включает" : excl(k.rules) ? "исключает" : interimRe.test(k.rules) ? "упоминает" : "молчит";
    const ps = incl(p.rules) ? "включает" : excl(p.rules) ? "исключает" : interimRe.test(p.rules) ? "упоминает" : "молчит";
    if (ks !== ps) flags.push({ field: "interim_officeholder", level: (ks === "включает" && ps === "исключает") || (ks === "исключает" && ps === "включает") ? "material" : "check", detail: `временно исполняющий обязанности: Kalshi ${ks}, Polymarket ${ps}` });
  }

  const kEdge = detect(EDGE_PATTERNS, k.rules), pEdge = detect(EDGE_PATTERNS, p.rules);
  const edgeOnlyK = kEdge.filter(s => !pEdge.includes(s)), edgeOnlyP = pEdge.filter(s => !kEdge.includes(s));
  if (edgeOnlyK.length || edgeOnlyP.length) flags.push({ field: "edge_cases", level: "check", detail: `только Kalshi: ${edgeOnlyK.join(", ") || "—"} | только Polymarket: ${edgeOnlyP.join(", ") || "—"}` });

  const kNums = numbersIn(k.rules.toLowerCase()), pNums = numbersIn(p.rules.toLowerCase());
  const titleNums = numbersIn(textOf(k));
  const missing = [...titleNums].filter(n => !pNums.has(n) || !kNums.has(n));
  if (missing.length) flags.push({ field: "threshold", level: "check", detail: `число из вопроса не найдено в правилах одной из сторон: ${missing.join(", ")}` });

  if (!k.rules.trim() || !p.rules.trim()) flags.push({ field: "rules_text", level: "material", detail: "у одной из сторон нет текста правил" });

  const cls = flags.some(f => f.level === "material") ? "different?" : flags.length ? "check" : "looks_equivalent";
  return { cls, flags };
}

function rawEdge(k, p) {
  // YES на одной площадке + NO на другой; без комиссий и проскальзывания — только ориентир
  const a = k.yes != null && p.no != null ? 1 - (k.yes + p.no) : null;
  const b = p.yes != null && k.no != null ? 1 - (p.yes + k.no) : null;
  const best = [a, b].filter(x => x != null).sort((x, y) => y - x)[0];
  return best == null ? null : round(best);
}

// ---------- отчёт ----------

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const csvCell = s => `"${String(s ?? "").replace(/"/g, '""')}"`;

function writeReports(pairs, stats) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString();

  const header = ["pair_id", "match_score", "class", "flags", "kalshi_id", "kalshi_title", "kalshi_yes", "kalshi_no", "kalshi_close", "poly_id", "poly_title", "poly_yes", "poly_no", "poly_close", "raw_edge", "human_label", "human_note"];
  const rows = pairs.map((x, i) => [i + 1, round(x.score, 2), x.cmp.cls, x.cmp.flags.map(f => `${f.field}:${f.level}`).join("; "), x.k.id, `${x.k.title} ${x.k.outcome}`.trim(), x.k.yes, x.k.no, x.k.close, x.p.id, `${x.p.title} ${x.p.outcome}`.trim(), x.p.yes, x.p.no, x.p.close, x.edge, "", ""]);
  fs.writeFileSync(path.join(OUT_DIR, "pairs.csv"), "﻿" + [header, ...rows].map(r => r.map(csvCell).join(",")).join("\n"));
  fs.writeFileSync(path.join(OUT_DIR, "pairs.json"), JSON.stringify({ generated_at: stamp, stats, pairs: pairs.map(x => ({ score: x.score, edge: x.edge, cmp: x.cmp, kalshi: x.k, polymarket: x.p })) }, null, 2));

  const badge = c => ({ "different?": "#d64545", check: "#d8a106", looks_equivalent: "#2f9e5b" }[c]);
  const cards = pairs.map((x, i) => `
  <details class="pair" data-cls="${x.cmp.cls}">
    <summary>
      <span class="n">#${i + 1}</span>
      <span class="cls" style="background:${badge(x.cmp.cls)}">${x.cmp.cls}</span>
      <span class="t">${esc(x.k.title)} ${esc(x.k.outcome)}</span>
      <span class="meta">match ${round(x.score, 2)} · edge ${x.edge ?? "—"}</span>
    </summary>
    <ul class="flags">${x.cmp.flags.map(f => `<li><b>${f.field}</b> (${f.level}): ${esc(f.detail)}</li>`).join("") || "<li>автоматические проверки различий не нашли — это не доказательство эквивалентности</li>"}</ul>
    <div class="cols">
      <div><h4>Kalshi · <a href="${esc(x.k.url)}" target="_blank">${esc(x.k.id)}</a></h4>
        <p class="q">${esc(x.k.title)} ${esc(x.k.outcome)}</p>
        <p class="px">YES ${x.k.yes ?? "—"} · NO ${x.k.no ?? "—"} · закрытие ${esc(x.k.close?.slice(0, 16))}</p>
        <pre>${esc(x.k.rules) || "—"}</pre></div>
      <div><h4>Polymarket · <a href="${esc(x.p.url)}" target="_blank">${esc(x.p.id)}</a></h4>
        <p class="q">${esc(x.p.title)} ${esc(x.p.outcome)}</p>
        <p class="px">YES ${x.p.yes ?? "—"} · NO ${x.p.no ?? "—"} · закрытие ${esc(x.p.close?.slice(0, 16))}</p>
        <pre>${esc(x.p.rules) || "—"}</pre></div>
    </div>
  </details>`).join("");

  const count = c => pairs.filter(x => x.cmp.cls === c).length;
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>RuleGuard PoC</title>
<style>
:root{--bg:#fafafa;--fg:#1d1d1f;--muted:#666;--card:#fff;--line:#e3e3e3}
@media (prefers-color-scheme:dark){:root{--bg:#141416;--fg:#ececec;--muted:#9a9a9a;--card:#1e1e22;--line:#333}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif;padding:16px;max-width:1200px;margin-inline:auto}
h1{margin:.2em 0}.sub{color:var(--muted)}.stats{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0}
.stat{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:8px 12px}
.pair{background:var(--card);border:1px solid var(--line);border-radius:8px;margin:8px 0;padding:8px 12px}
summary{cursor:pointer;display:flex;gap:10px;align-items:center;flex-wrap:wrap}.n{color:var(--muted)}
.cls{color:#fff;border-radius:4px;padding:1px 6px;font-size:12px}.meta{color:var(--muted);font-size:13px;margin-left:auto}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media (max-width:760px){.cols{grid-template-columns:1fr}}
pre{white-space:pre-wrap;font-size:13px;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:8px;max-height:320px;overflow:auto}
.q{font-weight:600;margin:.2em 0}.px{color:var(--muted);font-size:13px;margin:.2em 0}.flags{margin:.5em 0}
a{color:inherit}
</style></head><body>
<h1>RuleGuard — проверка идеи</h1>
<p class="sub">Сгенерировано ${esc(stamp)}. Kalshi: ${stats.kalshi} рынков, Polymarket: ${stats.poly} рынков, пар найдено: ${pairs.length}.
Классы выставлены простыми правилами без ИИ: «different?» и «check» — сигналы для ручной проверки, а не вывод. «edge» — сырой спред без комиссий и проскальзывания.</p>
<div class="stats">
<div class="stat">🔴 different?: <b>${count("different?")}</b></div>
<div class="stat">🟡 check: <b>${count("check")}</b></div>
<div class="stat">🟢 looks_equivalent: <b>${count("looks_equivalent")}</b></div>
</div>
${cards}
</body></html>`;
  fs.writeFileSync(path.join(OUT_DIR, "report.html"), html);
}

// ---------- main ----------

const t0 = Date.now();
console.log("Загружаю Kalshi…");
const kalshi = (await loadKalshi()).filter(m => m.rules);
console.log(`  Kalshi: ${kalshi.length} рынков с правилами`);
console.log("Загружаю Polymarket…");
const poly = (await loadPolymarket()).filter(m => m.rules);
console.log(`  Polymarket: ${poly.length} рынков с правилами`);

// не больше PER_EVENT пар из одного события Kalshi, чтобы отчёт не состоял из кандидатов одних выборов
const PER_EVENT = Number(args["per-event"] ?? 3);
const perEvent = new Map();
const pairs = matchMarkets(kalshi, poly)
  .filter(x => { const n = (perEvent.get(x.k.event) || 0) + 1; perEvent.set(x.k.event, n); return n <= PER_EVENT; })
  .map(x => ({ ...x, cmp: compareRules(x.k, x.p), edge: rawEdge(x.k, x.p) }))
  .slice(0, TOP);

writeReports(pairs, { kalshi: kalshi.length, poly: poly.length });
const by = c => pairs.filter(x => x.cmp.cls === c).length;
console.log(`\nПар: ${pairs.length}  |  different?: ${by("different?")}  check: ${by("check")}  looks_equivalent: ${by("looks_equivalent")}`);
console.log(`Отчёт: ${path.join(OUT_DIR, "report.html")}`);
console.log(`Таблица для разметки: ${path.join(OUT_DIR, "pairs.csv")}  (${Math.round((Date.now() - t0) / 1000)} с)`);
