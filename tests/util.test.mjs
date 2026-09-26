// HTTP helper: rate limits are waited out, other errors fail fast
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { getJson } from "../src/util.mjs";

function server(responses) {
  let calls = 0;
  const srv = http.createServer((req, res) => {
    const [status, body] = responses[Math.min(calls++, responses.length - 1)];
    res.writeHead(status, { "content-type": "application/json", ...(status === 429 ? { "retry-after": "1" } : {}) });
    res.end(JSON.stringify(body));
  });
  return new Promise(resolve => srv.listen(0, "127.0.0.1", () => resolve({ url: `http://127.0.0.1:${srv.address().port}/`, calls: () => calls, close: () => srv.close() })));
}

test("a 429 is retried after Retry-After, then the data comes through", async () => {
  const s = await server([[429, {}], [200, { ok: true }]]);
  try {
    assert.deepEqual(await getJson(s.url), { ok: true });
    assert.equal(s.calls(), 2);
  } finally { s.close(); }
});

test("a 404 fails at once without retries", async () => {
  const s = await server([[404, {}]]);
  try {
    await assert.rejects(getJson(s.url), /404/);
    assert.equal(s.calls(), 1);
  } finally { s.close(); }
});
