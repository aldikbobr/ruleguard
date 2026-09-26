# Architecture

RuleGuard answers one question for a pair of prediction markets: **do they settle under the same rules?** The pipeline runs in Node.js with no framework and no database; each stage writes plain JSON that the next stage reads.

```
 Kalshi ─────┐
 Polymarket ─┤   ┌──────────┐   ┌──────────┐   ┌────────────┐   ┌─────────┐   ┌────────────────┐
 Limitless ──┼──▶│  Load    │──▶│  Match   │──▶│  Passport  │──▶│ Verdict │──▶│ Demo · Solana  │
 Manifold ───┘   │ markets  │   │ + vetoes │   │ (AI+quotes)│   │ (AI)    │   │ attestations   │
                 └──────────┘   └──────────┘   └────────────┘   └─────────┘   └────────────────┘
                   public APIs    src/match.mjs  src/ai/review.mjs              demo/ · src/solana/
```

## 1. Load (`src/venues/`)

One module per venue. Each exports `meta`, `load()` (open markets with their rule texts), `prices(ids)` (live quotes) and `market(id)` (one market's current prices and rules).

| Venue | Source | Rule text | Money |
|---|---|---|---|
| Kalshi | `api.elections.kalshi.com/trade-api/v2` events with nested markets | `rules_primary` + `rules_secondary` (a summary of the full contract) | real |
| Polymarket | Gamma API `gamma-api.polymarket.com/markets` | `description` + `resolutionSource` | real |
| Limitless | `api.limitless.exchange/markets` | `description` (HTML stripped) | real |
| Manifold | `api.manifold.markets/v0` | `textDescription`, fetched only for matched markets | play |

No keys are needed: market data on all four venues is public.

## 2. Match (`src/match.mjs`)

Candidate pairs share at least two title words and score at least 0.45 on similarity (half Jaccard, half containment; 0.6 when Manifold is involved). A pair is then **vetoed** when the two questions differ in a way that changes the answer:

- numbers (92–93° is not 90–91°), years ("before 2027" counts as 2026), months;
- pivot words present on one side only (before/after, above/below, win/lose, primary, runoff, quarterfinal…);
- parties, direction (dip vs reach), the outcome's last word (Bayrou vs Baroin);
- proper nouns missing from the other side (Putin–Zelenskyy vs Trump–Putin).

Assignment is greedy and one-to-one, with at most three pairs per event on the first venue. Tests: `tests/match.test.mjs`.

## 3. Compare

Two independent opinions are kept for every pair.

**Keyword checks** (`src/compare.mjs`) extract structured facts from each side: the latest date stated in the rules, named resolution sources, the stance on interim officeholders (counts / excluded / mentioned / silent), de facto vs official status, and edge-case clauses. They flag differences but never declare two markets equivalent on their own.

**AI review** (`src/ai/`, Gemini on the free tier):

1. **Market passport:** for each market the model fills event, threshold, deadline, window start, source, what counts, what does not count, edge cases and fallback outcome, each with a **verbatim quote**. `verify()` checks every quote against the rule text; a quote that is not found is discarded and the field becomes `unknown`.
2. **Pair verdict:** a judge prompt compares the two passports (with their verified quotes) and returns `equivalent`, `caveats`, `different` or `uncertain`, a one-line reason and a divergence scenario. A clause present on only one side that can change the outcome or its timing is at least `caveats`; when in doubt the answer is `uncertain`.

Results are cached in `research/ai-cache.json` by the hash of the rule text and the prompt version, so reruns only analyze new or changed rules. The demo shows the most careful label available: in-depth review (`src/verdicts.mjs`) → labeled sample → AI verdict → keyword checks.

## 4. Publish

- **Demo** (`scripts/build-demo.mjs` → `demo/index.html`): the data is embedded in one static page. `scripts/serve.mjs` adds live prices, a full refresh and a per-pair refresh ([docs/api.md](api.md)).
- **Solana attestations** (`src/solana/sas.mjs`, `scripts/attest.mjs`): every pair verdict is published through the Solana Attestation Service on devnet. The attestation address is derived from `sha256(pair key)`, so any program or bot can look up a verdict without calling our server. The schema `ruleguard-pair-verdict` stores `pair_key`, `verdict`, `method`, `rules_hash` (sha256 of both rule texts) and `checked_at`. When a verdict or the rules change, the old attestation is closed and a new one is issued. Mainnet is refused in code until a security review.

## Evaluation

- `scripts/sample.mjs` draws reproducible random samples of pairs (fixed seeds) for labeling.
- `scripts/ai-analyze.mjs --sample | --holdout` scores the AI against the labels; the held-out set was labeled before looking at any AI verdict.
- `scripts/closed-pairs.mjs` studies markets that have already settled on both Kalshi and Polymarket and counts how often "the same" market settled in opposite directions.

Results and limitations: [research/FINDINGS.md](../research/FINDINGS.md).

## Files

| Path | Purpose |
|---|---|
| `src/venues/` | one loader per venue |
| `src/match.mjs` | pair matching and vetoes |
| `src/compare.mjs` | keyword rule comparison and raw spread |
| `src/ai/gemini.mjs`, `src/ai/review.mjs` | Gemini client, market passports, pair verdicts |
| `src/verdicts.mjs` | in-depth reviews of illustrative pairs |
| `src/solana/sas.mjs` | Solana Attestation Service client |
| `src/util.mjs` | HTTP with retries on rate limits, helpers |
| `scripts/build-demo.mjs` | pipeline → `research/pairs-all.json` + `demo/index.html` |
| `scripts/serve.mjs` | local server for the live demo |
| `scripts/ai-analyze.mjs` | AI review runs and accuracy reports |
| `scripts/attest.mjs` | publish and read verdicts on devnet |
| `scripts/closed-pairs.mjs` | settled-pairs study |
| `scripts/poc.mjs` | first proof of concept (Kalshi ↔ Polymarket) |
| `research/` | data snapshots, labels, AI cache and reports |
| `tests/` | unit tests (`npm test`) |
