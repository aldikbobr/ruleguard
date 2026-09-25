// Сравнение правил двух рынков без ИИ: источники, дедлайны, пограничные случаи, временные должностные лица.
// Это сигналы для проверки, а не вывод об эквивалентности.
import { MONTHS, numbersIn, textOf } from "./match.mjs";
import { round } from "./util.mjs";

const SOURCE_PATTERNS = [
  ["AP", /\bassociated press\b|\bthe ap\b|\bap\b(?= (?:news|call|calls|declares))/i],
  ["NYT", /new york times|\bnyt\b/i],
  ["White House", /white house/i],
  ["Federal Reserve", /federal reserve|\bfomc\b/i],
  ["BLS", /bureau of labor statistics|\bbls\b/i],
  ["BEA", /bureau of economic analysis|\bbea\b/i],
  ["NOAA/NWS/CPHC", /\bnoaa\b|national weather service|\bnws\b|hurricane center|\bcphc\b|\bnhc\b/i],
  ["The Weather Company", /weather company|weather\.com/i],
  ["Chainlink", /chainlink/i],
  ["Binance", /binance/i],
  ["Coinbase", /coinbase/i],
  ["CoinGecko", /coingecko/i],
  ["CoinMarketCap", /coinmarketcap/i],
  ["Pyth", /\bpyth\b/i],
  ["Arkham", /arkham/i],
  ["arena.ai / LMArena", /arena\.ai|lmarena|lmsys/i],
  ["UN", /\bun\b|united nations|un\.org/i],
  ["Congress.gov", /congress\.gov/i],
  ["Official league/org", /official (?:nba|nfl|mlb|nhl|fifa|uefa|league|website)/i],
  ["Credible reporting consensus", /consensus of credible reporting|credible reporting|credible sources/i],
  ["Kalshi Source Agency", /source agency/i]
];
const EDGE_PATTERNS = [
  ["перенос/отмена", /postpone|cancel|reschedul|delay/i],
  ["участник не вышел", /does not play|did not play|inactive|not participate|doesn'?t play|dnp/i],
  ["пересмотр данных", /revis/i],
  ["нет данных", /no data|not available|unavailable|not published/i],
  ["ничья", /\btie\b|tied|draw/i],
  ["овертайм", /overtime|extra time/i],
  ["расчёт 50/50", /50-50|50\/50|fifty/i],
  ["последняя цена", /last traded price|last trade/i],
  ["споры/уточнения", /clarif|dispute|\buma\b/i]
];

const MONTH_RE = new RegExp(`\\b(${MONTHS.join("|")})\\s+(\\d{1,2}),?\\s+(20\\d\\d)`, "gi");
const MONTH_ABBR = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(20\d\d)/gi;

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
const detect = (patterns, text) => patterns.filter(([, re]) => re.test(text)).map(([name]) => name);

export function compareRules(a, b, names) {
  const [A, B] = names;
  const flags = [];

  const sa = detect(SOURCE_PATTERNS, a.rules), sb = detect(SOURCE_PATTERNS, b.rules);
  if (sa.some(s => !sb.includes(s)) || sb.some(s => !sa.includes(s)))
    flags.push({ field: "источник", level: "check", detail: `${A}: ${sa.join(", ") || "—"} | ${B}: ${sb.join(", ") || "—"}` });

  // дедлайн события — по последней дате в тексте правил, а не по времени закрытия торгов
  const da = latestDate(a.rules), db = latestDate(b.rules);
  if (da && db) {
    const days = Math.abs(da - db) / 864e5;
    if (days > 1) flags.push({ field: "дедлайн", level: days > 7 ? "material" : "check", detail: `${A} ${iso(da)}, ${B} ${iso(db)} (разница ${Math.round(days)} дн.)` });
  } else if (da || db) {
    flags.push({ field: "дедлайн", level: "check", detail: `дата в правилах есть только у ${da ? A : B} (${iso(da || db)})` });
  }

  const interimRe = /interim|caretaker|acting/i;
  const stance = t => /(acting|interim)[^.]{0,80}count as/i.test(t) ? "включает"
    : /(interim|caretaker|acting)[^.]{0,80}(will not|won'?t|does not|do not|not) count/i.test(t) ? "исключает"
    : interimRe.test(t) ? "упоминает" : "молчит";
  if (interimRe.test(a.rules) || interimRe.test(b.rules)) {
    const xa = stance(a.rules), xb = stance(b.rules);
    const opposite = (xa === "включает" && xb === "исключает") || (xa === "исключает" && xb === "включает");
    if (xa !== xb) flags.push({ field: "временно исполняющий", level: opposite ? "material" : "check", detail: `${A} ${xa}, ${B} ${xb}` });
  }

  // де-факто против официального статуса (случай Венесуэлы)
  const deFacto = t => /de facto|regardless of[^.]{0,60}(formal|title)/i.test(t);
  const official = t => /officially holds|formally appointed|sworn in|official(ly)? (appointed|confirmed)/i.test(t);
  if ((deFacto(a.rules) && official(b.rules) && !deFacto(b.rules)) || (deFacto(b.rules) && official(a.rules) && !deFacto(a.rules)))
    flags.push({ field: "де-факто / официально", level: "material", detail: `${deFacto(a.rules) ? A : B} считает фактическую власть, ${deFacto(a.rules) ? B : A} — официальный статус` });

  const ea = detect(EDGE_PATTERNS, a.rules), eb = detect(EDGE_PATTERNS, b.rules);
  const onlyA = ea.filter(s => !eb.includes(s)), onlyB = eb.filter(s => !ea.includes(s));
  if (onlyA.length || onlyB.length)
    flags.push({ field: "пограничные случаи", level: "check", detail: `только ${A}: ${onlyA.join(", ") || "—"} | только ${B}: ${onlyB.join(", ") || "—"}` });

  const qNums = numbersIn(textOf(a));
  const na = numbersIn(a.rules.toLowerCase()), nb = numbersIn(b.rules.toLowerCase());
  const missing = [...qNums].filter(n => !na.has(n) || !nb.has(n));
  if (missing.length) flags.push({ field: "порог", level: "check", detail: `число из вопроса не найдено в правилах одной из сторон: ${missing.join(", ")}` });

  if (!a.rules.trim() || !b.rules.trim()) flags.push({ field: "текст правил", level: "material", detail: "у одной из сторон нет текста правил" });

  const cls = flags.some(f => f.level === "material") ? "different" : flags.length ? "check" : "looks_equivalent";
  return { cls, flags };
}

// YES на одной площадке + NO на другой, по ценам ask, без комиссий и проскальзывания. Только для реальных денег.
export function rawEdge(a, b) {
  const x = a.yes != null && b.no != null ? 1 - (a.yes + b.no) : null;
  const y = b.yes != null && a.no != null ? 1 - (b.yes + a.no) : null;
  const best = [x, y].filter(v => v != null).sort((p, q) => q - p)[0];
  return best == null ? null : round(best);
}
