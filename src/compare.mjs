// Compares the rules of two markets without AI: resolution sources, deadlines, edge cases, interim officeholders.
// These are signals to check, not a verdict on equivalence.
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
  ["postponed/cancelled", /postpone|cancel|reschedul|delay/i],
  ["participant didn't play", /does not play|did not play|inactive|not participate|doesn'?t play|dnp/i],
  ["data revisions", /revis/i],
  ["no data available", /no data|not available|unavailable|not published/i],
  ["tie", /\btie\b|tied|draw/i],
  ["overtime", /overtime|extra time/i],
  ["50/50 settlement", /50-50|50\/50|fifty/i],
  ["last traded price", /last traded price|last trade/i],
  ["disputes/clarifications", /clarif|dispute|\buma\b/i]
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

// How the rules treat an interim/acting officeholder: counts | excluded | mentioned | silent
const interimRe = /interim|caretaker|acting/i;
const stance = t => /(acting|interim)[^.]{0,80}count as/i.test(t) ? "counts"
  : /(interim|caretaker|acting)[^.]{0,80}(will not|won'?t|does not|do not|not) count/i.test(t) ? "excluded"
  : interimRe.test(t) ? "mentioned" : "silent";
const deFacto = t => /de facto|regardless of[^.]{0,60}(formal|title)/i.test(t);
const official = t => /officially holds|formally appointed|sworn in|official(ly)? (appointed|confirmed)/i.test(t);

// A short structured summary of one side's rules, for the compact comparison table on the page
function factsOf(m) {
  const d = latestDate(m.rules);
  return {
    deadline: d ? iso(d) : null,
    sources: detect(SOURCE_PATTERNS, m.rules),
    interim: stance(m.rules),
    status: deFacto(m.rules) ? "de facto power" : official(m.rules) ? "official status" : null,
    edges: detect(EDGE_PATTERNS, m.rules)
  };
}

export function compareRules(a, b, names) {
  const [A, B] = names;
  const flags = [];

  const sa = detect(SOURCE_PATTERNS, a.rules), sb = detect(SOURCE_PATTERNS, b.rules);
  if (sa.some(s => !sb.includes(s)) || sb.some(s => !sa.includes(s)))
    flags.push({ field: "source", level: "check", detail: `${A}: ${sa.join(", ") || "—"} | ${B}: ${sb.join(", ") || "—"}` });

  // the event deadline comes from the latest date in the rule text, not from the trading close time
  const da = latestDate(a.rules), db = latestDate(b.rules);
  if (da && db) {
    const days = Math.abs(da - db) / 864e5;
    if (days > 1) flags.push({ field: "deadline", level: days > 7 ? "material" : "check", detail: `${A} ${iso(da)}, ${B} ${iso(db)} (${Math.round(days)} days apart)` });
  } else if (da || db) {
    flags.push({ field: "deadline", level: "check", detail: `only ${da ? A : B} states a date (${iso(da || db)})` });
  }

  if (interimRe.test(a.rules) || interimRe.test(b.rules)) {
    const xa = stance(a.rules), xb = stance(b.rules);
    const opposite = (xa === "counts" && xb === "excluded") || (xa === "excluded" && xb === "counts");
    if (xa !== xb) flags.push({ field: "interim officeholder", level: opposite ? "material" : "check", detail: `${A}: ${xa}, ${B}: ${xb}` });
  }

  // de facto power vs official status (the Venezuela case)
  if ((deFacto(a.rules) && official(b.rules) && !deFacto(b.rules)) || (deFacto(b.rules) && official(a.rules) && !deFacto(a.rules)))
    flags.push({ field: "de facto vs official", level: "material", detail: `${deFacto(a.rules) ? A : B} resolves on de facto power, ${deFacto(a.rules) ? B : A} on official status` });

  const ea = detect(EDGE_PATTERNS, a.rules), eb = detect(EDGE_PATTERNS, b.rules);
  const onlyA = ea.filter(s => !eb.includes(s)), onlyB = eb.filter(s => !ea.includes(s));
  if (onlyA.length || onlyB.length)
    flags.push({ field: "edge cases", level: "check", detail: `only ${A}: ${onlyA.join(", ") || "—"} | only ${B}: ${onlyB.join(", ") || "—"}` });

  const qNums = numbersIn(textOf(a));
  const na = numbersIn(a.rules.toLowerCase()), nb = numbersIn(b.rules.toLowerCase());
  const missing = [...qNums].filter(n => !na.has(n) || !nb.has(n));
  if (missing.length) flags.push({ field: "threshold", level: "check", detail: `a number from the question is missing from one side's rules: ${missing.join(", ")}` });

  if (!a.rules.trim() || !b.rules.trim()) flags.push({ field: "rule text", level: "material", detail: "one side has no rule text" });

  const cls = flags.some(f => f.level === "material") ? "different" : flags.length ? "check" : "looks_equivalent";
  return { cls, flags, facts: { a: factsOf(a), b: factsOf(b) } };
}

// YES on one venue + NO on the other, at ask prices, without fees or slippage. Real-money venues only.
export function rawEdge(a, b) {
  const x = a.yes != null && b.no != null ? 1 - (a.yes + b.no) : null;
  const y = b.yes != null && a.no != null ? 1 - (b.yes + a.no) : null;
  const best = [x, y].filter(v => v != null).sort((p, q) => q - p)[0];
  return best == null ? null : round(best);
}
