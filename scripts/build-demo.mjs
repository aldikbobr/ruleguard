#!/usr/bin/env node
// RuleGuard demo build: loads Kalshi, Polymarket, Limitless and Manifold, matches pairs across every venue pair,
// compares the rules and writes demo/index.html (the data is embedded in the page, so no server is required).
//
// Usage:  node scripts/build-demo.mjs [--per-venue-pair 100] [--kalshi-pages 30]
//         node scripts/build-demo.mjs --from-cache   (re-render the page from saved data only)
//         add --static <file> or --static-page <file> to also write a hosted snapshot (no live prices or refresh buttons),
//         --data-out <file> to write the page's data as JSON (the live data the hosted demo serves)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collect, recompare, enrich } from "../src/build.mjs";
import { fill } from "../src/page.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []));
const t0 = Date.now();

// hosts that wrap the page in their own <html>/<head>/<body> get only the title, the styles and the body
function fragment(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta[^>]*>\s*/g, "");
  const body = html.match(/<body>([\s\S]*)<\/body>/)[1];
  return `${head.trim()}\n${body.trim()}\n`;
}

function renderDemo(data) {
  enrich(data);
  const template = fs.readFileSync(path.join(ROOT, "demo", "template.html"), "utf8");
  fs.writeFileSync(path.join(ROOT, "demo", "index.html"), fill(template, data));
  // --static <file>: a snapshot for hosting without the local server (refresh controls hidden), as a fragment
  // for hosts that add their own <html>/<head>/<body>; --static-page <file>: the same snapshot as a complete page
  if (args.static) {
    fs.writeFileSync(path.resolve(args.static), fragment(fill(template, { ...data, static: true })));
    console.log(`Static snapshot: ${path.resolve(args.static)}`);
  }
  // --data-out <file>: the page's data as JSON, which the refresh workflow publishes for the hosted demo
  if (args["data-out"]) fs.writeFileSync(path.resolve(args["data-out"]), JSON.stringify(data));
  if (args["static-page"]) {
    fs.writeFileSync(path.resolve(args["static-page"]), fill(template, { ...data, static: true }));
    console.log(`Static page: ${path.resolve(args["static-page"])}`);
  }
}

// --from-cache: re-render the page from research/pairs-all.json without fetching the venues
if ("from-cache" in args) {
  const data = recompare(JSON.parse(fs.readFileSync(path.join(ROOT, "research", "pairs-all.json"), "utf8")));
  renderDemo(data);
  console.log(`Demo re-rendered from cache (${data.generated_at}): ${path.join(ROOT, "demo", "index.html")}`);
  process.exit(0);
}

console.log("Loading venues…");
const data = await collect({ kalshiPages: Number(args["kalshi-pages"] ?? 30), perVenuePair: Number(args["per-venue-pair"] ?? 100), log: console.log });

fs.mkdirSync(path.join(ROOT, "research"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "research", "pairs-all.json"), JSON.stringify(data, null, 2));

renderDemo(data);

const by = c => data.pairs.filter(p => p.cmp.cls === c).length;
console.log(`\nPairs: ${data.pairs.length} | different: ${by("different")} | check: ${by("check")} | looks_equivalent: ${by("looks_equivalent")} | reviewed in depth: ${data.pairs.filter(p => p.verdict).length}`);
console.log(`Demo: ${path.join(ROOT, "demo", "index.html")}  (${Math.round((Date.now() - t0) / 1000)} s)`);
