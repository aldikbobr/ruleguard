#!/usr/bin/env node
// Serves demo/ at http://localhost:4173 and refreshes the data from a button on the page.
//   GET  /api/status   — data snapshot time, whether a refresh is running, which keys are connected (yes/no only)
//   POST /api/refresh  — runs scripts/build-demo.mjs in the background (one refresh at a time)
//   GET  /api/prices   — live prices for every market in the matched pairs (cached for 45 s; no venue keys needed)
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
    Object.assign(job, { running: false, finishedAt: Date.now(), ok: code === 0, error: code === 0 ? null : `the build exited with code ${code}` });
    console.log(code === 0 ? "Refresh complete" : `Refresh failed (code ${code})`);
  });
  child.on("error", e => Object.assign(job, { running: false, finishedAt: Date.now(), ok: false, error: e.message }));
}

// Live prices: one shared request to the venues for all open tabs; the result lives for PRICE_TTL_MS
const PRICE_TTL_MS = 45_000;
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
