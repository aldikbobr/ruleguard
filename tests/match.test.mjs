// Pair matching: the vetoes that stop look-alike questions from being paired
import test from "node:test";
import assert from "node:assert/strict";
import { veto, similarity, matchVenues } from "../src/match.mjs";

const market = (title, outcome = "", venue = "a") => ({ venue, id: `${venue}:${title}:${outcome}`, event: title, title, outcome, rules: "…" });

test("the same question on two venues passes every veto", () => {
  const q = "Will Bitcoin reach $100,000 by December 31, 2026?";
  assert.equal(veto(market(q), market(q, "", "b")), null);
  assert.equal(similarity(market(q), market(q, "", "b")), 1);
});

test("different thresholds are not a pair (92–93° vs 90–91°)", () => {
  assert.equal(veto(market("Highest temperature in NYC 92-93°"), market("Highest temperature in NYC 90-91°")), "numbers");
});

test("different years are not a pair", () => {
  assert.equal(veto(market("Will Republicans win the Senate in 2026?"), market("Will Republicans win the Senate in 2028?")), "year");
});

test("different candidates are not a pair (Bayrou vs Baroin)", () => {
  assert.equal(veto(market("Next French Prime Minister", "François Bayrou"), market("Next French Prime Minister", "François Baroin")), "outcome");
});

test("opposite directions are not a pair (dip vs reach)", () => {
  assert.equal(veto(market("Will Ethereum dip to $2,600 in September?"), market("Will Ethereum reach $2,600 in September?")), "direction");
});

test("a name on only one side is not a pair (Putin–Zelenskyy vs Trump–Putin)", () => {
  assert.equal(veto(market("Will Putin and Zelenskyy meet in 2026?"), market("Will Trump and Putin meet in 2026?")), "proper_noun");
});

test("different parties are not a pair", () => {
  assert.equal(veto(market("Will Republicans win Pennsylvania?"), market("Will Democrats win Pennsylvania?")), "party");
});

test("matchVenues pairs the real match and skips the vetoed look-alike", () => {
  const as = [market("Will Nvidia be the largest company by market cap at the end of 2026?")];
  const bs = [
    market("Will Nvidia be the largest company by market cap at the end of 2027?", "", "b"),
    market("Nvidia largest company by market cap at the end of 2026?", "", "b")
  ];
  const pairs = matchVenues(as, bs);
  assert.equal(pairs.length, 1);
  assert.equal(pairs[0].b, bs[1]);
});
