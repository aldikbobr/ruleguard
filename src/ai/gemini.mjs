// Gemini API client (REST generateContent with a JSON schema). Free tier: a few requests per minute,
// and busy models answer 503 — so calls are spaced out and fall back to the next model in the list.
import { sleep } from "../util.mjs";

const API = "https://generativelanguage.googleapis.com/v1beta/models";

// Read at call time (after .env is loaded). Models are tried in order: the stronger one first,
// the lighter one when the first is overloaded. The interval keeps us at ≤ ~13 requests a minute.
export const defaultModels = () => (process.env.GEMINI_MODELS || "gemini-3.8-flash,gemini-3.5-flash-lite").split(",").map(s => s.trim()).filter(Boolean);
const minIntervalMs = () => Number(process.env.GEMINI_MIN_INTERVAL_MS ?? 4500);
let lastCallAt = 0;

export function geminiReady() { return Boolean(process.env.GEMINI_API_KEY); }

async function once(model, body) {
  const wait = lastCallAt + minIntervalMs() - Date.now();
  if (wait > 0) await sleep(wait);
  lastCallAt = Date.now();
  const res = await fetch(`${API}/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

// Models whose daily free quota is used up: skipped for the rest of this process
const exhausted = new Set();
const isDailyQuota = error => (error?.details || []).some(d => (d.violations || []).some(v => /PerDay/i.test(v.quotaId || "")));

// Seconds to wait from a 429 error ("retryDelay": "31s"), or a default
function retryDelayMs(error) {
  const info = (error?.details || []).find(d => String(d["@type"]).includes("RetryInfo"));
  const s = parseFloat(String(info?.retryDelay || "").replace("s", ""));
  return Number.isFinite(s) ? (s + 1) * 1000 : 30_000;
}

// Returns { data, model, usage }. Throws when every model fails.
export async function generateJSON({ system, prompt, schema, models = defaultModels() }) {
  if (!geminiReady()) throw new Error("GEMINI_API_KEY is not set in .env");
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema, temperature: 0 }
  };
  const errors = [];
  for (const model of models.filter(m => !exhausted.has(m))) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { status, json } = await once(model, body);
      if (status === 200) {
        const text = json.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") ?? "";
        try { return { data: JSON.parse(text), model: json.modelVersion || model, usage: json.usageMetadata }; }
        catch { errors.push(`${model}: response was not valid JSON (finish: ${json.candidates?.[0]?.finishReason})`); break; }
      }
      const msg = `${model}: ${status} ${json.error?.status || ""} ${String(json.error?.message || "").slice(0, 120)}`;
      if (status === 429 && isDailyQuota(json.error)) { errors.push(msg); exhausted.add(model); break; } // daily quota: switch models, no point waiting
      if (status === 429) { errors.push(msg); await sleep(retryDelayMs(json.error)); continue; } // per-minute quota: wait and retry the same model
      if (status === 503 || status === 500) { errors.push(msg); if (attempt === 0) { await sleep(5000); continue; } break; } // busy: one short retry, then next model
      errors.push(msg);
      break; // 400/404 etc.: try the next model
    }
  }
  const daily = [...exhausted].join(", ");
  throw new Error(`Gemini failed${daily ? ` (daily free quota used up: ${daily} — rerun tomorrow, finished work is cached)` : ""} — ${errors.slice(-4).join(" | ")}`);
}
