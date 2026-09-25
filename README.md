# RuleGuard

**A rule-equivalence layer for prediction markets.**

Markets that look identical across Kalshi, Polymarket, Limitless and Manifold often settle under different rules — different deadlines, resolution sources, treatment of interim officeholders, "de facto" vs "official" status. Price scanners show these gaps as arbitrage; in reality they are different contracts, and a "risk-free" hedge can lose on both legs.

RuleGuard matches "the same" market across venues, compares the resolution rules clause by clause, and flags pairs that are not actually equivalent.

## Example findings (Sep 25, 2026)

| Pair | Why it's not the same contract |
|---|---|
| Venezuela head of state at end of 2026 (Kalshi vs Polymarket) | Kalshi resolves on **de facto** power; Polymarket on **official** appointment (UN list as fallback) |
| Putin–Zelenskyy next meeting in Russia | Kalshi deadline **2028**, Polymarket **2026**; Polymarket counts Crimea as Russia |
| Meta has the top AI model | Kalshi: #1 **at any time before 2027**; Polymarket: #1 on arena.ai **on Sep 30, 2026 at 12:00 ET** |
| Hurricane landfall in Hawaii | Kalshi **excludes** Midway and the Northwestern Islands; Polymarket **includes** them |

**Random sample** (30 of 163 real-money pairs, seed 20260925, `scripts/sample.mjs`): across different operators (Kalshi vs Polymarket/Limitless) the rules fully matched in only **1 of 11** pairs; **5 of 11** have a plausible scenario where the markets settle differently. Polymarket vs Limitless pairs are mostly verbatim copies (17 of 19 identical). Small sample, clustered events, labeled by an AI assistant without human re-check — treat as indicative.

Details and limitations: [`research/FINDINGS.md`](research/FINDINGS.md). The manually reviewed pairs in the table above were hand-picked as illustrative; they are **not** a random sample.

## Demo

Open `demo/index.html` in a browser, or serve it:

```bash
node scripts/serve.mjs      # http://localhost:4173
```

When served, the page shows how fresh the data is (green < 15 min, amber < 2 h, red older) and has a **Refresh data** button that re-runs the pipeline on the local server (one run at a time, at most once per minute; the server listens on 127.0.0.1 only).

Rebuild with fresh data from all four venues (public APIs, no keys needed, ~2 min):

```bash
node scripts/build-demo.mjs
node scripts/build-demo.mjs --from-cache   # re-render the page only
```

Requires Node.js 20+. No dependencies.

## How it works

1. **Load** open markets and their rule texts: Kalshi (`rules_primary`/`rules_secondary`), Polymarket Gamma (`description`), Limitless (`description`), Manifold (`textDescription`, play money).
2. **Match** candidate pairs by title similarity, with vetoes for mismatched numbers, years, months, parties, direction (up/down), tournament stage, outcomes and proper nouns.
3. **Compare rules** (currently keyword-based, no AI): resolution sources, deadlines stated in the rules, edge cases, interim officeholders, de facto vs official.
4. **Prices**: mid-price gap and raw spread (asks only, no fees or depth). Thin books make raw spreads unstable, so the "traps" view uses mid-price gaps for liquid markets only.

| Path | Purpose |
|---|---|
| `src/venues/` | one loader per venue |
| `src/match.mjs` | pair matching and vetoes |
| `src/compare.mjs` | rule comparison and raw spread |
| `src/verdicts.mjs` | manual reviews |
| `scripts/build-demo.mjs` | pipeline → `research/pairs-all.json` + `demo/index.html` |
| `scripts/poc.mjs` | first proof of concept (Kalshi ↔ Polymarket) |

## Roadmap

- AI "market passport": structured extraction of rules with an exact quote per field; conservative `uncertain` by default
- Random labeled sample to measure how often "identical" pairs differ
- Solana: Kalshi markets via DFlow; on-chain equivalence registry readable by other programs
- API and alerts for aggregators and bots

## Built for

Colosseum Crypto World's Fair hackathon (Sep 14 – Oct 12, 2026).

Informational prototype. Not financial advice.
