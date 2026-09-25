# RuleGuard — findings

**Date:** Sep 25, 2026 · **Scripts:** `scripts/poc.mjs` (step 1), `scripts/build-demo.mjs` (demo), `scripts/sample.mjs` (random sample)

## Headline: random sample of 30 pairs

`scripts/sample.mjs` drew 30 of the 163 matched real-money pairs at random (seed 20260925, reproducible) from the data snapshot of Sep 25, 2026. Each pair was labeled against the rule texts (`research/random-labels.json`); the stats are computed by `scripts/build-demo.mjs`.

| Group | Pairs | 🔴 different | 🟡 caveats | 🟢 equivalent |
|---|---|---|---|---|
| **Different operators** (Kalshi ↔ Polymarket / Limitless) | 11 | **5** | **5** | **1** |
| Polymarket ↔ Limitless (Limitless copies Polymarket's rules) | 19 | 1 | 1 | 17 |
| Whole sample | 30 | 6 | 6 | 18 |

- *different* — there is a plausible scenario in which the two markets settle differently;
- *caveats* — they match except for rare edge cases or settlement timing;
- *equivalent* — the rules match in substance.

**Pitch line:** *“In a random sample of pairs between Kalshi and other venues, the rules fully matched in only 1 of 11. In 5 of them there is a plausible scenario where the markets settle differently.”*

Even among the Polymarket ↔ Limitless “copies” one pair asks a different question (US–Iran: “any senior-level meeting” vs “a new formal round of peace talks”).

⚠️ **Limitations:** the sample is small (11 pairs in the main group); some pairs share one event (Israeli PM candidates under the same rules), so the observations aren't independent; the labels were made by Claude and not re-checked by a human; Kalshi's API exposes only summary rules; the population is the pairs our algorithm found (Polymarket's top 2,000 markets, at most 3 pairs per event), not every market on the venues. Treat the numbers as indicative, not as a precise rate.

## AI rule review (Gemini) vs the manual labels

`scripts/ai-analyze.mjs --sample` ran the AI review on the same 30 random-sample pairs (Sep 25, 2026; `gemini-3.5-flash-lite` on the free tier — the stronger `gemini-3.8-flash` had used up its daily free quota). Report: `research/ai-eval.json`.

| Manual label ↓ / AI → | equivalent | caveats | different | uncertain |
|---|---|---|---|---|
| equivalent (18) | **18** | 0 | 0 | 0 |
| caveats (6) | 2 | **4** | 0 | 0 |
| different (6) | 0 | 1 | **5** | 0 |

- **Same label in 27 of 30.** It caught **5 of 6** “different” pairs, and every pair it called “different” was different (5 of 5).
- **Errors lean the risky way:** two pairs with caveats were called “equivalent” (Maine Senate: swearing-in vs election win; F1: a missing early-settlement clause), and one “different” pair was called “caveats” (it still named the deadline gap).
- **Quotes:** 284 of 299 extracted quotes (95%) were found verbatim in the rules; the rest were discarded and the terms marked unknown.
- The full run reviewed all 187 current pairs in ~9 minutes at no cost (1,458 of 1,551 quotes verified).

⚠️ The “manual labels” were made by Claude (a different model) and not re-checked by a human, the sample is small, and a light model did most of the work — treat this as indicative. The prompts tell the model to prefer “uncertain” over “equivalent”, but in this run it never said “uncertain”; the two false “equivalent” calls are the thing to fix next.

## Step 1: proof of concept

- Loaded **54,636** open Kalshi markets and the **2,000** most active Polymarket markets (both APIs are public; no keys needed).
- Found **67 pairs** of “identical” markets (at most 3 pairs per Kalshi event).
- Automatic rule comparison (no AI) plus a **manual review of 14 illustrative pairs**.

The step-1 files in `research/` (`report.html`, `pairs.csv`, `pairs.json`) were regenerated later with the translated script, so their counts and prices differ slightly from the original run described here.

### Key technical answers

| Question | Answer |
|---|---|
| Does Polymarket expose rules through its API? | ✅ **Yes**, the `description` field (plus `resolutionSource`, sometimes empty) |
| Does Kalshi? | ✅ Yes, `rules_primary` + `rules_secondary`. ⚠️ This is a **summary**: some markets say “See full rules”, and the full terms live elsewhere |
| Does simple matching work? | ✅ With vetoes (numbers, key words, outcome, proper nouns) all 67 pairs looked correct. Without them we saw Bayrou↔Baroin, “Putin and Zelenskyy”↔“Trump and Putin”, NBA↔WNBA |
| Are keyword rules enough to classify pairs? | ❌ **No.** Keyword checks are noisy, and they flagged the key case (Venezuela) only as “check”. This needs semantic analysis — the AI market passport |

### The largest “arbitrage” spreads were different contracts

**All five largest spreads in the step-1 run were explained by different rules, not by mispricing:**

| Spread* | Pair | Why they are different contracts |
|---|---|---|
| **44¢** | Delcy Rodríguez as head of state of Venezuela at the end of 2026 (Kalshi YES 0.91 · Polymarket YES 0.37) | Kalshi: whoever governs **de facto**, regardless of title. Polymarket: whoever is **officially** appointed and sworn in, falling back to the UN list |
| **41¢** | Nicolás Maduro, same question (Kalshi 0.19 · Polymarket 0.60) | same split: de facto vs de jure |
| **9.8¢** | Meta has the top AI model (Kalshi 0.15 · Polymarket 0.002) | Kalshi: #1 **at any point before 2027**. Polymarket: #1 on arena.ai **at 12:00 PM ET on Sep 30, 2026** |
| **4.9¢** | Putin and Zelenskyy next meet in Russia (Kalshi 0.08 · Polymarket 0.011) | Kalshi: **by end of 2028**. Polymarket: **by end of 2026**, and Crimea counts as Russia. A meeting in Russia in 2027 → **both legs** of the “arbitrage” lose |
| **4.9¢** | Nvidia has the top AI model | same as Meta |

\* Raw spread = 1 − (YES on one venue + NO on the other), using ask prices, **without fees or slippage**. A rough guide, not available profit.

> ⚠️ **Same-day update:** prices are live. An hour later the Kalshi book for Venezuela had almost emptied (the NO ask rose from 0.19 to 0.61, a 52-pt YES/NO gap) and the “44¢ spread” became 2¢. **Raw spread is not a number to pitch.** The robust claim is that *prices for “the same” event diverge a lot because they are different questions*. That is why the demo ranks “Arbitrage traps” by the gap between **mid** prices, on liquid markets only (YES/NO gap ≤ 15 pts).

### Manual review of 14 illustrative pairs

| Pair | Verdict | Key difference |
|---|---|---|
| Venezuela: Delcy Rodríguez | 🔴 different | de facto vs official |
| Putin–Zelenskyy meet in Russia | 🔴 different | deadline 2028 vs 2026; Polymarket counts Crimea as Russia |
| Meta has the top AI model | 🔴 different | “any time before 2027” vs “one moment on Sep 30”; Kalshi's summary rules don't name a source |
| Naftali Bennett as next Israeli PM | 🔴 different | Kalshi: **an interim PM counts**, and if the same person stays, every outcome resolves NO. Polymarket: **interim PMs don't count**, tied to the 2026 election |
| Harris Dickinson as James Bond | 🔴 different | “cast before 2030” vs “announced by end of 2026” |
| Trump–Putin next meet in Turkey | 🔴 different | deadline 2029 vs 2026; Polymarket defines a “meeting” in detail |
| Trump buys Greenland | 🔴 different | Kalshi: **buys at least part**. Polymarket: an **official announcement** of US sovereignty over **most** of the territory, even before the transfer |
| Next Romanian PM | 🔴 different | Polymarket requires a confidence vote, excludes interim PMs, deadline 2027. Kalshi: “the first new person to hold the office”, no deadline before 2045 |
| Netanyahu after the 2026 election | 🟡 caveats | both exclude interim PMs, **but** after a repeat election Kalshi resolves to “No one” while Polymarket waits for the next result. Israel has had repeat elections (2019–2020) |
| Hurricane landfall in Hawaii | 🟡 caveats | Kalshi **excludes** Midway and the Northwestern Islands, Polymarket **includes** them; “2026 season” (to Nov 30) vs “by Dec 31” |
| Republicans win South Dakota Senate | 🟡 caveats | Kalshi: **sworn in**. Polymarket: **wins the election** per AP+Fox+NBC, party defined by nomination |
| Édouard Philippe wins the French election | 🟡 caveats | Polymarket resolves to “Other” if the result isn't known by the end of 2027 |
| Lamine Yamal wins the Ballon d'Or | 🟡 caveats | Polymarket resolves to “Other” if no winner by the end of 2026; source France Football |
| Satoshi moves any bitcoin | 🟡 caveats | same source (Arkham), but Polymarket's window starts Jan 9, 2026, with a fallback if Arkham goes offline |

**Total for the 14:** 🔴 8 different · 🟡 6 with caveats · 🟢 0 fully equivalent.

⚠️ These 14 were **hand-picked** as illustrative. “8 of 14” and “5 of the 5 largest spreads” **must not be generalized** to all pairs — the random sample above is the honest number.

## General limitations

1. **Kalshi rules are summaries** (`rules_primary`). The full terms may add clauses that remove some differences.
2. **Prices are API asks at the time of the run**, without fees, book depth or slippage.
3. **Polymarket is limited to its 2,000 most active markets** (an API pagination limit), so some pairs are missed.
4. The reviews were made by one reviewer (Claude) without an independent check.

## Decision

**The idea passes the first check — continue.** Rules are available on every venue we tried. Material differences are common, including in the most visible price gaps. Keyword automation can't handle them reliably, which is **exactly why a product with semantic rule analysis is needed**.

## Next steps

1. An independent human check of the random-sample labels.
2. **AI market passport** — structured rule extraction with an exact quote per field (needs a Claude API key in `.env`).
3. Find a way to get Kalshi's full contract terms.
4. Solana: Kalshi markets via DFlow (needs a DFlow API key).
