// AI rule review in two steps, with a cache so each market is analyzed once:
//   1) market passport — the terms that decide settlement, each backed by a verbatim quote
//      (a quote not found in the rules is dropped and the term becomes "unknown");
//   2) pair verdict — equivalent | caveats | different | uncertain, a one-line why and a divergence scenario.
import fs from "node:fs";
import crypto from "node:crypto";
import { generateJSON } from "./gemini.mjs";

export const PROMPT_VERSION = 1; // bump when the prompts or schemas change, so cached results are recomputed

const FIELDS = ["event", "threshold", "deadline", "window_start", "source", "counts", "does_not_count", "edge_case", "fallback_outcome"];

const PASSPORT_SYSTEM = `You extract the settlement terms of prediction-market contracts.
For each market, list every term in its rules that decides how it resolves. Each item has:
- field: one of ${FIELDS.join(", ")};
- value: a short plain-English summary (at most 20 words);
- quote: a span copied verbatim from the rules (at most 30 words), character for character.
Only include terms the rules actually state; never infer or add outside knowledge. If a term isn't stated, leave it out.
Always capture: what must happen, any numeric threshold, the deadline and time zone, when the window starts, the resolution source,
what counts and what explicitly doesn't count (e.g. interim/acting officeholders, de facto vs official status, parts of a territory),
edge cases (postponement, cancellation, missing data, revisions, ties, a participant not playing, disputes) and fallback outcomes (Other, No one, 50/50).`;

const JUDGE_SYSTEM = `You compare pairs of prediction markets that look like the same question on two venues.
Using only the extracted terms given for each side, classify each pair:
- equivalent: every term that affects settlement matches in substance;
- caveats: they match except for rare edge cases or settlement timing;
- different: there is a plausible, realistic scenario where one resolves YES and the other NO, or one resolves to a different outcome such as Other or No one;
- uncertain: key terms are missing or ambiguous, so you can't tell.
When in doubt between equivalent and anything else, do not say equivalent. A term missing on one side is not by itself a difference — say uncertain if it matters.
why: one line, at most 15 words, naming the key difference, e.g. "Deadline — Kalshi: 2028 · Polymarket: 2026". For equivalent pairs, say what makes them the same.
scenario: one or two sentences with a concrete situation where they settle differently; empty for equivalent pairs.`;

const passportSchema = {
  type: "object",
  properties: {
    markets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: { field: { type: "string", enum: FIELDS }, value: { type: "string" }, quote: { type: "string" } },
              required: ["field", "value", "quote"]
            }
          }
        },
        required: ["id", "items"]
      }
    }
  },
  required: ["markets"]
};

const verdictSchema = {
  type: "object",
  properties: {
    pairs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          verdict: { type: "string", enum: ["equivalent", "caveats", "different", "uncertain"] },
          why: { type: "string" },
          scenario: { type: "string" }
        },
        required: ["id", "verdict", "why", "scenario"]
      }
    }
  },
  required: ["pairs"]
};

// ---------- cache ----------

export const hash = s => crypto.createHash("sha256").update(String(s)).digest("hex").slice(0, 16);
export const marketKey = m => `${m.venue}:${m.id}`;
const passportKey = m => `${marketKey(m)}#${hash(m.rules)}#v${PROMPT_VERSION}`;
const verdictKey = (p, pa, pb) => `${marketKey(p.a)}|${marketKey(p.b)}#${hash(JSON.stringify([pa.items, pb.items]))}#v${PROMPT_VERSION}`;

// Read-only lookups into the cache (no API calls) — used by the demo build
export function lookup(cache) {
  const passportOf = m => cache.passports?.[passportKey(m)] || null;
  const verdictOf = p => {
    const pa = passportOf(p.a), pb = passportOf(p.b);
    return pa && pb ? cache.verdicts?.[verdictKey(p, pa, pb)] || null : null;
  };
  return { passportOf, verdictOf };
}

export function loadCache(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return { passports: {}, verdicts: {} }; }
}
export function saveCache(file, cache) { fs.writeFileSync(file, JSON.stringify(cache, null, 1)); }

// ---------- step 1: passports ----------

const squash = s => String(s || "").toLowerCase().replace(/[“”"]/g, '"').replace(/[‘’']/g, "'").replace(/\s+/g, " ").trim();

// A quote counts only if it appears in the rules (ignoring case, spacing and quote styles)
function verify(market, items) {
  const rules = squash(market.rules);
  return items.map(it => {
    const quote = squash(it.quote).replace(/^"|"$/g, "").replace(/…$|\.\.\.$/, "").trim();
    const ok = quote.length >= 3 && rules.includes(quote);
    return ok ? { field: it.field, value: it.value, quote: it.quote } : { field: it.field, value: "unknown", quote: null, unverified: it.value };
  });
}

export async function passports(markets, cache, { batch = 6, onProgress = () => {} } = {}) {
  const todo = markets.filter(m => !cache.passports[passportKey(m)]);
  for (let i = 0; i < todo.length; i += batch) {
    const chunk = todo.slice(i, i + batch);
    const prompt = chunk.map((m, j) => `### Market ${j + 1}\nid: ${marketKey(m)}\nvenue: ${m.venue}\nquestion: ${m.title}${m.outcome ? ` — outcome: ${m.outcome}` : ""}\nrules:\n${m.rules}`).join("\n\n");
    const { data, model } = await generateJSON({ system: PASSPORT_SYSTEM, prompt, schema: passportSchema });
    for (const m of chunk) {
      const got = (data.markets || []).find(x => x.id === marketKey(m));
      if (!got) continue; // left out by the model — retried on the next run
      cache.passports[passportKey(m)] = { items: verify(m, got.items || []), model, at: new Date().toISOString() };
    }
    onProgress({ step: "passports", done: Math.min(i + batch, todo.length), total: todo.length, model });
  }
  return m => cache.passports[passportKey(m)] || null;
}

// ---------- step 2: pair verdicts ----------

const describe = (m, pp) => `${m.venue} — "${m.title}${m.outcome && !m.title.includes(m.outcome) ? ` · ${m.outcome}` : ""}"\n` +
  (pp.items.length ? pp.items.map(it => `  - ${it.field}: ${it.value}`).join("\n") : "  (no terms extracted)");

export async function verdicts(pairs, cache, passportOf, { batch = 5, onProgress = () => {} } = {}) {
  const ready = pairs.map(p => ({ p, pa: passportOf(p.a), pb: passportOf(p.b) })).filter(x => x.pa && x.pb);
  const todo = ready.filter(x => !cache.verdicts[verdictKey(x.p, x.pa, x.pb)]);
  for (let i = 0; i < todo.length; i += batch) {
    const chunk = todo.slice(i, i + batch);
    const prompt = chunk.map((x, j) => `### Pair ${j + 1}\nid: ${marketKey(x.p.a)}|${marketKey(x.p.b)}\nA: ${describe(x.p.a, x.pa)}\nB: ${describe(x.p.b, x.pb)}`).join("\n\n");
    const { data, model } = await generateJSON({ system: JUDGE_SYSTEM, prompt, schema: verdictSchema });
    for (const x of chunk) {
      const got = (data.pairs || []).find(v => v.id === `${marketKey(x.p.a)}|${marketKey(x.p.b)}`);
      if (got) cache.verdicts[verdictKey(x.p, x.pa, x.pb)] = { verdict: got.verdict, why: got.why, scenario: got.scenario, model, at: new Date().toISOString() };
    }
    onProgress({ step: "verdicts", done: Math.min(i + batch, todo.length), total: todo.length, model });
  }
  return p => {
    const pa = passportOf(p.a), pb = passportOf(p.b);
    return pa && pb ? cache.verdicts[verdictKey(p, pa, pb)] || null : null;
  };
}
