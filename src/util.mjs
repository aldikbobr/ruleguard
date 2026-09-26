// Shared helpers: HTTP with retries, numbers, HTML cleanup.

export const sleep = ms => new Promise(r => setTimeout(r, ms));

// Rate limits (429), server errors and network hiccups are retried with growing pauses (1, 2, 4… s, at most 60 s),
// or as long as the venue's Retry-After asks. Long batch jobs pass more tries; the live page keeps the default.
export async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const last = i === tries - 1;
    let res;
    try { res = await fetch(url, { headers: { accept: "application/json" } }); }
    catch (e) { if (last) throw e; await sleep(Math.min(60000, 1000 * 2 ** i)); continue; }
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && !last) {
      const after = Number(res.headers.get("retry-after"));
      await sleep(after > 0 ? Math.min(120000, after * 1000) : Math.min(60000, 1000 * 2 ** i));
      continue;
    }
    throw new Error(`${res.status} ${url}`);
  }
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
