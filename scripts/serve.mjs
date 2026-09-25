#!/usr/bin/env node
// Serves demo/ at http://localhost:4173 and refreshes the data from a button on the page.
//   GET  /api/status   — data snapshot time, whether a refresh is running, which keys are connected (yes/no only)
//   POST /api/refresh  — runs scripts/build-demo.mjs in the background (one refresh at a time)
//   GET  /api/prices   — live prices for every market in the matched pairs (cached for 25 s; no venue keys needed)
//   GET  /api/pair?key=<venue:id|venue:id> — refetch one pair's prices and rules and re-compare them (cached for 3 s);
//                      if the rules changed and GEMINI_API_KEY is set, the AI review of that pair is redone too
// Listens on 127.0.0.1 only: the server is not reachable from other machines.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadEnv, keyStatus } from "../src/env.mjs";
import * as kalshi from "../src/venues/kalshi.mjs";
import * as polymarket from "../src/venues/polymarket.mjs";
import * as limitless from "../src/venues/limitless.mjs";
import * as manifold from "../src/venues/manifold.mjs";
import { compareRules, rawEdge } from "../src/compare.mjs";
import { loadCache, saveCache, lookup, passports, verdicts } from "../src/ai/review.mjs";
import { geminiReady } from "../src/ai/gemini.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, "demo");
const DATA = path.join(ROOT, "research", "pairs-all.json");
const PORT = Number(process.env.PORT ?? 4173);
const MIN_INTERVAL_MS = 60_000; // at most once a minute: the build polls the venues' public APIs
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

loadEnv(ROOT);

const job = { running: false, startedAt: null, finishedAt: null, ok: null, error: null, log: [] };

function snapshotTime() {
  try { return JSON.parse(fs.readFileSync(DATA, "utf8")).generated_at ?? null; } catch { return null; }
}

function startRefresh() {
  Object.assign(job, { running: true, startedAt: Date.now(), ok: null, error: null, log: [] });
  const child = spawn(process.execPath, [path.join(ROOT, "scripts", "build-demo.mjs")], { cwd: ROOT, env: process.env });
  const collect = chunk => { job.log.push(...String(chunk).split(/\r?\n/).filter(Boolean)); job.log = job.log.slice(-20); };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);
  child.on("close", code => {
    Object.assign(priceCache, { at: 0, body: null }); // the set of pairs may have changed
    pairCache.clear();
    Object.assign(job, { running: false, finishedAt: Date.now(), ok: code === 0, error: code === 0 ? null : `the build exited with code ${code}` });
    console.log(code === 0 ? "Refresh complete" : `Refresh failed (code ${code})`);
  });
  child.on("error", e => Object.assign(job, { running: false, finishedAt: Date.now(), ok: false, error: e.message }));
}

// Live prices: one shared request to the venues for all open tabs; the result lives for PRICE_TTL_MS
// (shorter than the fastest auto-refresh option on the page, 30 s)
const PRICE_TTL_MS = 25_000;
const VENUES = { kalshi, polymarket, limitless, manifold };
const priceCache = { at: 0, body: null, pending: null };

async function fetchPrices() {
  const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const ids = {};
  for (const p of data.pairs) for (const m of [p.a, p.b]) (ids[m.venue] ??= new Set()).add(m.id);
  const prices = {}, errors = [];
  await Promise.all(Object.entries(ids).map(async ([venue, set]) => {
    try {
      const got = await VENUES[venue].prices([...set]);
      for (const [id, q] of got) prices[`${venue}:${id}`] = q;
    } catch (e) { errors.push(`${venue}: ${e.message}`); }
  }));
  return { fetched_at: new Date().toISOString(), snapshot: data.generated_at, count: Object.keys(prices).length, prices, errors };
}

async function livePrices() {
  if (priceCache.body && Date.now() - priceCache.at < PRICE_TTL_MS) return priceCache.body;
  priceCache.pending ??= fetchPrices()
    .then(body => Object.assign(priceCache, { at: Date.now(), body }).body)
    .finally(() => { priceCache.pending = null; });
  return priceCache.pending;
}

// "Refresh this pair": refetch both markets, keep the cached rules when a venue returns none,
// re-compare, and report whether the rules changed since the snapshot (a manual review may then be outdated)
const PAIR_TTL_MS = 3_000; // short: a pair can be refreshed again within seconds; this only absorbs double clicks
const MAX_RULES = 8000; // same truncation as scripts/build-demo.mjs, so texts compare like for like
const pairCache = new Map();
const clip = s => (s.length > MAX_RULES ? s.slice(0, MAX_RULES) + " …" : s);
const squash = s => String(s || "").replace(/\s+/g, " ").trim();
const pairKey = p => `${p.a.venue}:${p.a.id}|${p.b.venue}:${p.b.id}`;

async function refreshPair(key) {
  const hit = pairCache.get(key);
  if (hit && Date.now() - hit.at < PAIR_TTL_MS) return hit.body;
  const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const p = data.pairs.find(x => pairKey(x) === key);
  if (!p) throw Object.assign(new Error("this pair is not in the current data — reload the page"), { status: 404 });
  const fresh = await Promise.all([p.a, p.b].map(m => VENUES[m.venue].market(m.id)));
  const [a, b] = [p.a, p.b].map((m, i) => {
    const f = fresh[i];
    const rules = f.rules ? clip(f.rules) : m.rules;
    return { market: { ...m, yes: f.yes, no: f.no, close: f.close ?? m.close, rules }, changed: Boolean(f.rules) && squash(rules) !== squash(m.rules) };
  });
  const [ma, mb] = [VENUES[p.a.venue].meta, VENUES[p.b.venue].meta];
  const current = { a: a.market, b: b.market }; // the pair with today's prices and rules
  const body = {
    fetched_at: new Date().toISOString(),
    a: a.market,
    b: b.market,
    cmp: compareRules(a.market, b.market, [ma.name, mb.name]),
    edge: ma.money === "play" || mb.money === "play" ? null : rawEdge(a.market, b.market),
    rules_changed: { a: a.changed, b: b.changed },
    ...(await aiFor(current))
  };
  pairCache.set(key, { at: Date.now(), body });
  return body;
}

// AI verdict for a pair with its current rules: from the cache when the rules are unchanged; otherwise ask Gemini
// (two passports at most plus one verdict), giving up after AI_TIMEOUT_MS so the ↻ button never hangs.
const AI_CACHE = path.join(ROOT, "research", "ai-cache.json");
const AI_TIMEOUT_MS = 25_000;
async function aiFor(pair) {
  const cache = loadCache(AI_CACHE);
  const cached = lookup(cache).verdictOf(pair);
  if (cached) return { ai: pick(cached), ai_fresh: true };
  if (!geminiReady()) return { ai: null, ai_fresh: false, ai_note: "no Gemini key" };
  const run = (async () => {
    const passportOf = await passports([pair.a, pair.b], cache);
    const verdictOf = await verdicts([pair], cache, passportOf);
    saveCache(AI_CACHE, cache);
    return verdictOf(pair);
  })();
  const timeout = new Promise(resolve => setTimeout(() => resolve("timeout"), AI_TIMEOUT_MS));
  try {
    const v = await Promise.race([run, timeout]);
    if (v === "timeout") return { ai: null, ai_fresh: false, ai_note: "AI review is taking longer than usual — try again in a minute" };
    return v ? { ai: pick(v), ai_fresh: true } : { ai: null, ai_fresh: false, ai_note: "AI returned no verdict" };
  } catch (e) {
    return { ai: null, ai_fresh: false, ai_note: `AI review failed: ${e.message.slice(0, 120)}` };
  }
}
const pick = v => ({ verdict: v.verdict, why: v.why, scenario: v.scenario, model: v.model });

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/status" && req.method === "GET") {
    return json(res, 200, {
      generated_at: snapshotTime(),
      refreshing: job.running,
      started_at: job.startedAt,
      finished_at: job.finishedAt,
      ok: job.ok,
      error: job.error,
      log: job.log.slice(-6),
      keys: keyStatus()
    });
  }

  if (url.pathname === "/api/prices" && req.method === "GET") {
    livePrices().then(body => json(res, 200, body)).catch(e => json(res, 502, { error: e.message }));
    return;
  }

  if (url.pathname === "/api/pair" && req.method === "GET") {
    const key = url.searchParams.get("key") || "";
    refreshPair(key).then(body => json(res, 200, body)).catch(e => json(res, e.status || 502, { error: e.message }));
    return;
  }

  if (url.pathname === "/api/refresh") {
    if (req.method !== "POST") return json(res, 405, { error: "POST required" });
    // a custom header: another website can't trigger a refresh from the browser without a CORS preflight we never allow
    if (req.headers["x-ruleguard"] !== "1") return json(res, 403, { error: "missing X-RuleGuard header" });
    if (job.running) return json(res, 409, { error: "a refresh is already running" });
    const wait = job.finishedAt ? MIN_INTERVAL_MS - (Date.now() - job.finishedAt) : 0;
    if (wait > 0) return json(res, 429, { error: `refreshes are limited to one a minute — try again in ${Math.ceil(wait / 1000)} s` });
    startRefresh();
    return json(res, 202, { started: true });
  }

  const rel = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
  const file = path.join(DIR, rel);
  if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`RuleGuard demo: http://localhost:${PORT}`));
