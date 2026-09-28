// Hosted functions (api/): the handler shape Vercel calls, without the network
import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/status.mjs";
import page from "../api/page.mjs";
import fs from "node:fs";
import { pairsSig } from "../src/page.mjs";

function fakeRes() {
  const res = { statusCode: 0, headers: {}, body: "" };
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  res.end = b => { res.body = b; };
  return res;
}

test("/ serves the page (the deployed snapshot when there is no live data)", async () => {
  const res = fakeRes();
  await page({ url: "/", method: "GET" }, res);
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<title>RuleGuard Demo<\/title>/);
  assert.doesNotMatch(res.body, /\/\*__DATA__\*\/null/, "the data is filled in");
});

test("pairsSig ignores order and matches the page's copy of the algorithm", () => {
  const pair = (a, b) => ({ a: { venue: "kalshi", id: a }, b: { venue: "polymarket", id: b } });
  const x = [pair("A", "a"), pair("B", "b")];
  assert.equal(pairsSig(x), pairsSig([...x].reverse()));
  assert.notEqual(pairsSig(x), pairsSig([pair("A", "a"), pair("C", "c")]));
  assert.match(pairsSig(x), /^2-/);
  const template = fs.readFileSync(new URL("../demo/template.html", import.meta.url), "utf8");
  assert.ok(template.includes("h = (h * 33 + s.charCodeAt(i)) >>> 0"), "the page must hash the pairs the same way");
});

test("/api/status says it is the hosted demo and reports keys as yes/no only", async () => {
  const res = fakeRes();
  await handler({ url: "/api/status", method: "GET" }, res);
  assert.equal(res.statusCode, 200);
  assert.match(res.headers["content-type"], /application\/json/);
  const body = JSON.parse(res.body);
  assert.equal(body.hosted, true);
  assert.ok(body.generated_at, "snapshot time from research/pairs-all.json");
  for (const v of Object.values(body.keys)) assert.equal(typeof v, "boolean");
});
