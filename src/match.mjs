// Поиск пар «одинаковых» рынков между двумя площадками: сходство слов + вето на ложные совпадения.

const STOP = new Set("the a an of in on at to by for will be is are was and or before after than this that with from as it its his her their who what which when during end 2025 2026 2027 yes no market".split(" "));
// слова, которые меняют смысл вопроса: если есть только с одной стороны — не пара
const PIVOTS = ["closest", "margin", "before", "after", "above", "below", "over", "under", "between", "least", "most", "win", "lose", "leave", "out", "resign", "nominee", "nomination", "primary", "popular", "electoral", "senate", "house", "governor", "mayor", "cut", "hike", "raise", "increase", "decrease", "first", "second", "third", "runoff", "qualify", "nominated", "champion", "quarterfinal", "quarterfinals", "semifinal", "semifinals", "final", "finals", "playoffs"];
export const MONTHS = "january february march april may june july august september october november december".split(" ");
const GENERIC_CAPS = new Set("will who what which where when the next us usa u.s. presidential president election general party senate house race seat republican republicans democratic democrats democratics independent prime minister premier governor mayor nfl mvp award year before after following".split(" "));

export function textOf(m) { return `${m.title} ${m.outcome}`.toLowerCase(); }
export function tokens(s) { return s.replace(/[^a-z0-9%.$ ]/g, " ").split(/\s+/).filter(t => t && !STOP.has(t) && t.length > 1); }
export function numbersIn(s) {
  return new Set((s.match(/\d+(?:[.,]\d+)?/g) || []).map(x => x.replace(",", "")).filter(x => !/^20[2-3]\d$/.test(x)));
}

function lastWord(s) {
  const w = String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  return w.length ? w[w.length - 1] : "";
}

// Годы из вопроса; «before 2027» означает 2026
function yearsIn(s) {
  const out = new Set();
  for (const m of s.matchAll(/\b(before\s+)?(20[2-4]\d)\b/g)) out.add(m[1] ? Number(m[2]) - 1 : Number(m[2]));
  return out;
}

function direction(m) {
  if (/↑/.test(m.outcome)) return "up";
  if (/↓/.test(m.outcome)) return "down";
  const t = m.title.toLowerCase();
  if (/\b(dip|below|under|fall to|drop)\b/.test(t)) return "down";
  if (/\b(reach|above|over)\b/.test(t)) return "up";
  return null;
}

function parties(s) {
  const p = new Set();
  if (/republican|\bgop\b|\(r\)/.test(s)) p.add("R");
  if (/democrat|\(d\)/.test(s)) p.add("D");
  return p;
}

function properNouns(m) {
  const words = `${m.title} ${m.outcome}`.normalize("NFD").replace(/[̀-ͯ]/g, "").match(/\b[A-Z][A-Za-z'’-]{3,}\b|\b[A-Z]{2,}\b/g) || [];
  return [...new Set(words.map(w => w.toLowerCase()).filter(w => !GENERIC_CAPS.has(w) && !MONTHS.includes(w)))];
}

export function veto(a, b) {
  const ta = textOf(a), tb = textOf(b);
  const na = numbersIn(ta), nb = numbersIn(tb);
  if ((na.size || nb.size) && (na.size !== nb.size || [...na].some(x => !nb.has(x)))) return "numbers";
  const wa = new Set(tokens(ta)), wb = new Set(tokens(tb));
  for (const p of PIVOTS) if (wa.has(p) !== wb.has(p)) return `pivot:${p}`;
  const ma = MONTHS.filter(x => wa.has(x)), mb = MONTHS.filter(x => wb.has(x));
  if (ma.length && mb.length && ma.join() !== mb.join()) return "month";
  // «Сенат 2028» ≠ «Сенат 2026»; «до конца 2026» ≠ «до конца 2027»
  const ya = yearsIn(ta), yb = yearsIn(tb);
  if (ya.size && yb.size && ![...ya].some(y => yb.has(y))) return "year";
  const ra = parties(ta), rb = parties(tb);
  if (ra.size && rb.size && ![...ra].some(x => rb.has(x))) return "party";
  // направление: «упадёт до $2 600» ≠ «вырастет до $2 600»
  const da = direction(a), db = direction(b);
  if (da && db && da !== db) return "direction";
  // исход должен совпадать по последнему слову: Bayrou ≠ Baroin, Osborn ≠ Independent
  const oa = lastWord(a.outcome), ob = lastWord(b.outcome);
  if (oa && ob && oa !== ob) return "outcome";
  // имена собственные одной стороны должны встречаться в тексте другой (сравнение по первым 5 буквам):
  // «Putin и Zelenskyy» ≠ «Trump и Putin», «Senate race in Indiana» ≠ «Senate in 2026»
  const words = m => textOf(m).normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9'’-]+/).filter(Boolean);
  const missing = (nouns, other) => nouns.some(x => !other.some(y => y.slice(0, 5) === x.slice(0, 5)));
  if (missing(properNouns(a), words(b)) || missing(properNouns(b), words(a))) return "proper_noun";
  return null;
}

export function similarity(a, b) {
  const A = new Set(tokens(textOf(a))), B = new Set(tokens(textOf(b)));
  if (!A.size || !B.size) return 0;
  let inter = 0; for (const t of A) if (B.has(t)) inter++;
  return 0.5 * (inter / (A.size + B.size - inter)) + 0.5 * (inter / Math.min(A.size, B.size));
}

// Пары между площадками A и B: жадно один к одному, не больше perEvent пар из одного события A
export function matchVenues(as, bs, { minScore = 0.45, perEvent = 3 } = {}) {
  const index = new Map();
  bs.forEach((m, i) => { for (const t of new Set(tokens(textOf(m)))) { if (!index.has(t)) index.set(t, []); index.get(t).push(i); } });
  const cands = [];
  for (const a of as) {
    const shared = new Map();
    // годы не считаются общими словами: «US … 2030» и «US … 2030» ещё не один вопрос
    for (const t of new Set(tokens(textOf(a)))) {
      if (/^20\d\d$/.test(t)) continue;
      for (const i of index.get(t) || []) shared.set(i, (shared.get(i) || 0) + 1);
    }
    for (const [i, n] of shared) {
      if (n < 2) continue;
      const b = bs[i];
      const score = similarity(a, b);
      if (score < minScore || veto(a, b)) continue;
      cands.push({ a, b, score });
    }
  }
  cands.sort((x, y) => y.score - x.score);
  const usedA = new Set(), usedB = new Set(), perEv = new Map(), pairs = [];
  for (const c of cands) {
    if (usedA.has(c.a.id) || usedB.has(c.b.id)) continue;
    const n = (perEv.get(c.a.event) || 0) + 1;
    if (n > perEvent) continue;
    usedA.add(c.a.id); usedB.add(c.b.id); perEv.set(c.a.event, n);
    pairs.push(c);
  }
  return pairs;
}
