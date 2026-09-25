#!/usr/bin/env node
// Раздаёт demo/ по адресу http://localhost:4173 и умеет обновлять данные по кнопке на странице.
//   GET  /api/status   — время снимка данных, идёт ли обновление, какие ключи подключены (только да/нет)
//   POST /api/refresh  — запускает scripts/build-demo.mjs в фоне (одно обновление за раз)
// Слушает только 127.0.0.1: с других компьютеров сервер недоступен.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadEnv, keyStatus } from "../src/env.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, "demo");
const DATA = path.join(ROOT, "research", "pairs-all.json");
const PORT = Number(process.env.PORT ?? 4173);
const MIN_INTERVAL_MS = 60_000; // не чаще раза в минуту: сборка опрашивает публичные API площадок
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
    Object.assign(job, { running: false, finishedAt: Date.now(), ok: code === 0, error: code === 0 ? null : `сборка завершилась с кодом ${code}` });
    console.log(code === 0 ? "Обновление готово" : `Обновление не удалось (код ${code})`);
  });
  child.on("error", e => Object.assign(job, { running: false, finishedAt: Date.now(), ok: false, error: e.message }));
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

  if (url.pathname === "/api/refresh") {
    if (req.method !== "POST") return json(res, 405, { error: "нужен POST" });
    // собственный заголовок: чужой сайт не сможет запустить обновление из браузера без CORS-разрешения
    if (req.headers["x-ruleguard"] !== "1") return json(res, 403, { error: "нет заголовка X-RuleGuard" });
    if (job.running) return json(res, 409, { error: "обновление уже идёт" });
    const wait = job.finishedAt ? MIN_INTERVAL_MS - (Date.now() - job.finishedAt) : 0;
    if (wait > 0) return json(res, 429, { error: `обновлять можно раз в минуту, подождите ${Math.ceil(wait / 1000)} с` });
    startRefresh();
    return json(res, 202, { started: true });
  }

  const rel = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
  const file = path.join(DIR, rel);
  if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`RuleGuard demo: http://localhost:${PORT}`));
