// Hosted functions (api/): the handler shape Vercel calls, without the network
import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/status.mjs";

function fakeRes() {
  const res = { statusCode: 0, headers: {}, body: "" };
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  res.end = b => { res.body = b; };
  return res;
}

test("/api/status says it is the hosted demo and reports keys as yes/no only", () => {
  const res = fakeRes();
  handler({ url: "/api/status", method: "GET" }, res);
  assert.equal(res.statusCode, 200);
  assert.match(res.headers["content-type"], /application\/json/);
  const body = JSON.parse(res.body);
  assert.equal(body.hosted, true);
  assert.ok(body.generated_at, "snapshot time from research/pairs-all.json");
  for (const v of Object.values(body.keys)) assert.equal(typeof v, "boolean");
});
