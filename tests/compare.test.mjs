// Keyword rule comparison and the raw spread
import test from "node:test";
import assert from "node:assert/strict";
import { compareRules, rawEdge } from "../src/compare.mjs";

const side = rules => ({ title: "Who will lead Venezuela at the end of 2026?", outcome: "", rules });

test("de facto power vs official appointment is flagged as different (the Venezuela case)", () => {
  const kalshi = side("Resolves to the person who holds power de facto, regardless of formal title.");
  const poly = side("Resolves to the person who is formally appointed and sworn in.");
  const r = compareRules(kalshi, poly, ["Kalshi", "Polymarket"]);
  assert.equal(r.cls, "different");
  assert.ok(r.flags.some(f => f.field === "de facto vs official"));
  assert.equal(r.facts.a.status, "de facto power");
  assert.equal(r.facts.b.status, "official status");
});

test("deadlines more than a week apart are a material difference", () => {
  const a = side("Resolves Yes if they meet before December 31, 2028.");
  const b = side("Resolves Yes if they meet before December 31, 2026.");
  const r = compareRules(a, b, ["A", "B"]);
  assert.equal(r.cls, "different");
  assert.equal(r.facts.a.deadline, "2028-12-31");
  assert.equal(r.facts.b.deadline, "2026-12-31");
});

test("identical plain rules raise no flags", () => {
  const text = "Resolves Yes if the event happens. Otherwise No.";
  assert.equal(compareRules(side(text), side(text), ["A", "B"]).cls, "looks_equivalent");
});

test("rawEdge takes the better of the two YES + NO combinations", () => {
  // 1 − (0.40 + 0.58) = 0.02 beats 1 − (0.45 + 0.62) = −0.07
  assert.equal(rawEdge({ yes: 0.4, no: 0.62 }, { yes: 0.45, no: 0.58 }), 0.02);
  assert.equal(rawEdge({ yes: null, no: null }, { yes: 0.5, no: 0.5 }), null);
});
