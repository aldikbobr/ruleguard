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

Details and limitations: [`research/FINDINGS.md`](research/FINDINGS.md). The pairs in the table above were reviewed in depth by an AI assistant (Claude), not yet re-checked by a person, and were picked as illustrative examples; they are **not** a random sample.

## Demo

**Hosted snapshot:** https://claude.ai/artifact/B61ZXiuoWxCx1THjtmREUC (data of Sep 25, 2026; search, filters and side-by-side rules work, but prices are frozen and there are no refresh buttons). It is built with `node scripts/build-demo.mjs --from-cache --static <file>`.

**Pitch deck:** https://aldikbobr.github.io/ruleguard-deck/

For the live version, serve the demo locally (opening `demo/index.html` directly also works, without live prices):

```bash
node scripts/serve.mjs      # http://localhost:4173
```

When served, the page shows how fresh the data is (green < 15 min, amber < 2 h, red older) and has a **Refresh data** button that re-runs the pipeline on the local server (one run at a time, at most once per minute; the server listens on 127.0.0.1 only).

**Live prices:** while the page is open, prices for all matched markets are refreshed via `GET /api/prices` (Kalshi and Polymarket in batches, Limitless and Manifold per market; ~350 markets in ~4 s; cached for 25 s on the server). No venue API keys are needed — market data on all four venues is public.

**Auto-refresh (⏱ in the header):** choose how often prices update (30 s – 5 min, or off) and how often pairs and rules are fully rebuilt (15 min – 3 h, or off). Settings are saved in the browser; periodic work runs only while the tab is visible.

**Refresh one pair:** every row has a ↻ button that refetches both markets' prices and rules in about half a second (`GET /api/pair?key=…`), re-compares them and flags ⚠ if the rules changed since the snapshot — in which case an in-depth review may be outdated. It works without expanding the row.

Rebuild with fresh data from all four venues (public APIs, no keys needed, ~2 min):

```bash
node scripts/build-demo.mjs
node scripts/build-demo.mjs --from-cache   # re-render the page only
```

Requires Node.js 20+. The demo and the AI review have no dependencies; only the Solana attestations need `npm install` (see below).

## AI rule review (Gemini)

`scripts/ai-analyze.mjs` reviews pairs with Gemini on the free tier (key from [aistudio.google.com](https://aistudio.google.com) in `.env` as `GEMINI_API_KEY`):

1. **Market passport** — the model lists each market's settlement terms (event, threshold, deadline, window start, source, what counts and doesn't, edge cases, fallback outcomes), each with a verbatim quote. Quotes are checked against the rule text; a quote that isn't there is discarded and the term becomes `unknown`.
2. **Pair verdict** — `equivalent`, `caveats`, `different` or `uncertain`, with a one-line reason and a divergence scenario. When in doubt the model is told to say `uncertain`, not `equivalent`.

Results are cached in `research/ai-cache.json` (per market and rule-text hash), so reruns only analyze new markets and changed rules. `--sample` also scores the model against the 30 labeled pairs of the random sample (`research/ai-eval.json`). The free tier is rate-limited and busy models return 503, so requests are spaced out and fall back from `gemini-3.8-flash` to `gemini-3.5-flash-lite`; the model used is recorded with each verdict.

```bash
node scripts/ai-analyze.mjs --sample   # 30 labeled pairs + accuracy report
node scripts/ai-analyze.mjs --all      # every matched pair
node scripts/build-demo.mjs --from-cache
```

**Accuracy on a held-out sample** (30 pairs never used for tuning, seed 20260926, labeled before looking at the AI verdicts; judge prompt v2, `gemini-3.5-flash-lite`): the same label in 26 of 30. All 7 "different" pairs were caught, and 7 of the AI's 8 "different" calls were right. 2 dangerous false "equivalent" calls, both on "caveats" pairs, and 1 "uncertain". 291 of 299 quotes (97%) were found verbatim in the rule texts. The labels were made by an AI assistant and not yet re-checked by a human, and the sample is small, so treat these numbers as indicative. Confusion matrix and the tuning-set numbers: [`research/FINDINGS.md`](research/FINDINGS.md).

## Solana: verdicts as attestations (devnet)

Every pair verdict can be published on Solana through the [Solana Attestation Service](https://solana.com/docs/tools/attestations) (SAS), the Solana Foundation's public attestation program (`22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG`). RuleGuard is the credential (issuer). The schema `ruleguard-pair-verdict` holds `pair_key`, `verdict`, `method`, `rules_hash` (sha256 of both rule texts) and `checked_at`. Each pair's attestation lives at an address derived from `sha256(pair key)`, so any program, bot or frontend that knows the pair can look up its verdict without calling our server. When a verdict or the rules change, the old attestation is closed and a new one is issued, and the history stays on-chain.

```bash
npm install                                  # sas-lib, @solana/kit
node scripts/attest.mjs --sample --dry-run   # encode the 30 labeled verdicts offline, nothing sent
node scripts/attest.mjs --setup              # devnet key, devnet SOL, credential and schema
node scripts/attest.mjs --sample             # publish or update the 30 verdicts → research/attestations.json
node scripts/attest.mjs --all                # every matched pair: in-depth review → labeled samples → AI verdict
node scripts/attest.mjs --read "<pair key>"  # read one verdict back from the chain
```

The devnet signing key is created on first run in `.solana/devnet-authority.json` (git-ignored). Mainnet is refused in code until a security review. **Status: live on devnet.** Every matched pair has an attestation, 191 in total (Sep 26, 2026): all 187 pairs in the current snapshot plus 4 labeled sample pairs that have since dropped out of it. The `method` field says where each verdict comes from: 120 AI verdicts (`ai-judge-v2`), 56 labels from the random and held-out samples (`ai-label-v0`), and 15 in-depth reviews (`ai-review-v0`). All of these were produced by AI, and none has been re-checked by a human yet. credential [`92cf2ssE…Wy9t`](https://explorer.solana.com/address/92cf2ssEpn7KbqrgFj6PWKouiDwbW276Fk7s1WUwMy9t?cluster=devnet), schema [`8LCZ1hTu…GkJM`](https://explorer.solana.com/address/8LCZ1hTuWkRrxcQHUXGjqBYGkotqdnoeY5fYD3vMGkJM?cluster=devnet). Every attestation address and transaction is listed in `research/attestations.json`. Publishing all of them cost about 0.49 devnet SOL (free test tokens), mostly refundable rent deposits. The public devnet RPC rate-limits bursts, so the script pauses between pairs and retries on HTTP 429.

## How it works

1. **Load** open markets and their rule texts: Kalshi (`rules_primary`/`rules_secondary`), Polymarket Gamma (`description`), Limitless (`description`), Manifold (`textDescription`, play money).
2. **Match** candidate pairs by title similarity, with vetoes for mismatched numbers, years, months, parties, direction (up/down), tournament stage, outcomes and proper nouns.
3. **Compare rules**: the AI review above (market passports with verified quotes → pair verdict), plus keyword checks as a second opinion: resolution sources, deadlines stated in the rules, edge cases, interim officeholders, de facto vs official.
4. **Prices**: mid-price gap and raw spread (asks only, no fees or depth). Thin books make raw spreads unstable, so the "traps" view uses mid-price gaps for liquid markets only.
5. **Attest** (optional): publish verdicts to Solana devnet as SAS attestations.

| Path | Purpose |
|---|---|
| `src/venues/` | one loader per venue |
| `src/match.mjs` | pair matching and vetoes |
| `src/compare.mjs` | keyword rule comparison and raw spread |
| `src/ai/`, `scripts/ai-analyze.mjs` | AI market passports and pair verdicts (Gemini) |
| `src/verdicts.mjs` | in-depth reviews of illustrative pairs (🔍 in the demo) |
| `src/solana/sas.mjs`, `scripts/attest.mjs` | verdicts as Solana Attestation Service attestations |
| `scripts/build-demo.mjs` | pipeline → `research/pairs-all.json` + `demo/index.html` |
| `scripts/poc.mjs` | first proof of concept (Kalshi ↔ Polymarket) |

## Roadmap

- Done: 4-venue pipeline and demo; random labeled sample; AI passports and verdicts on all matched pairs; held-out accuracy check; verdicts for all matched pairs attested on Solana devnet, with Explorer links in the demo
- Next: human re-check of the labels; fix the two missed "caveats" patterns; re-attest automatically when a venue changes its rules
- Then: Kalshi markets on Solana via DFlow as one side of a pair; a study of closed pairs (how many actually settled differently); API and alerts for aggregators and bots
- Later: attestations on mainnet after a security review

## What was built during the hackathon

- **Timing:** the project started during the event. The first commit is from Sep 25, 2026, and there is no earlier codebase; everything in this repository was built within the hackathon window (Sep 14 – Oct 12, 2026).
- **Reused components:** public market-data APIs of Kalshi, Polymarket (Gamma), Limitless and Manifold; the Gemini API (free tier) for the AI review; the npm packages `sas-lib` and `@solana/kit` and the Solana Attestation Service program. The matching-with-vetoes approach follows a public write-up: [Matching Kalshi and Polymarket contracts is harder than it looks](https://dev.to/myfirstcodeo/matching-kalshi-and-polymarket-contracts-is-harder-than-it-looks-and-how-i-made-it-mostly-work-4m4n).
- **AI assistance:** code, research notes and the pitch deck were written with the help of AI coding assistants (Claude Code). The random-sample labels were made by an AI assistant and are not yet re-checked by a human; pair verdicts in the AI review come from Gemini.
- **Team and roles:** [names and who built what — fill in before submission]

## Built for

Colosseum Crypto World's Fair hackathon (Sep 14 – Oct 12, 2026).

Informational prototype. Not financial advice.
