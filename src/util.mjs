// Shared helpers: HTTP with retries, numbers, HTML cleanup.

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) { await sleep(1000 * (i + 1)); continue; }
    throw new Error(`${res.status} ${url}`);
  }
  throw new Error(`failed after retries: ${url}`);
}

// Runs fn for every item with limited concurrency
export async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const worker = async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); } };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

export function num(v) { const n = Number(v); return v == null || v === "" || Number.isNaN(n) ? null : n; }
export function round(n, d = 3) { return n == null ? null : Math.round(n * 10 ** d) / 10 ** d; }
export function parseArr(v) { try { return Array.isArray(v) ? v : JSON.parse(v || "[]"); } catch { return []; } }

export function stripHtml(s) {
  return String(s || "")
    .replace(/<\/(p|li|div|h\d)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n\n").trim();
}
