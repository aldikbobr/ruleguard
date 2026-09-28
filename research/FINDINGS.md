# RuleGuard — findings

**Date:** Sep 25–28, 2026 · **Scripts:** `scripts/poc.mjs` (step 1), `scripts/build-demo.mjs` (demo), `scripts/sample.mjs` (random sample), `scripts/closed-pairs.mjs` (settled pairs)

## Settled pairs: how often "the same" market actually paid out differently

`scripts/closed-pairs.mjs` loaded the settled markets we could reach on both venues (Sep 28, 2026): 158,123 traded Kalshi markets with rules, from its politics, elections, economics, world, science and technology, companies, entertainment and mentions series, 2023 to Sep 2026, including Kalshi's historical archive; and 31,960 resolved Yes/No Polymarket markets, the most traded ones of each month since Jan 2024. The demo's matcher paired them: 584 pairs. Pairs that settled more than 60 days apart are almost always the same question asked for different periods, so they are kept in `research/closed-pairs.json` but left out of the headline.

| Settled pairs (Kalshi ↔ Polymarket, within 60 days) | 341 |
|---|---|
| Paid out the same way | **332 (97%)** |
| Paid out in opposite directions because of the rules | **7 (2%)** |
| Opposite, but a matching error (different questions) | 2 |

Every opposite result was checked against both rule texts:

| Pair | Kalshi | Polymarket | What decided it |
|---|---|---|---|
| **Same question, different fine print** | | | |
| Netflix says "Warner Bros" on its Jan 20, 2026 earnings call | No | Yes | Same call. The venues count word forms differently: Kalshi the exact phrase or its plural/possessive only, Polymarket any usage, compounds included |
| Kari Lake joins the Trump administration | No | Yes | The venues define "the administration" differently; Polymarket counts any formal appointment to a federal role |
| **Look-alike questions, different windows or definitions** | | | |
| Trump meets Putin: Kalshi "before 2025" vs Polymarket "in August" | No | Yes | Kalshi's rules count only Jun 1 – Jul 1, 2025 |
| Trump meets Xi: Kalshi "before 2025" vs Polymarket "in August" | Yes | No | Kalshi counts all of 2025 |
| Trump and Maduro: Kalshi "meet" vs Polymarket "talk in November" | No | Yes | Kalshi: in person, Nov 29 – Dec 31; Polymarket: phone calls count, November |
| Anthropic has the top AI model: "before 2027" vs "end of January 2026" | Yes | No | Any moment vs one check on Jan 31, 2026 |
| TikTok back on the App Store: "before 2026" vs "before February" | Yes | No | Kalshi until the end of 2025; Polymarket Jan 20–31, 2025 |
| **Matching errors** | | | |
| Musk at the inauguration vs Trump says "Elon Musk" in the speech | Yes | No | Different questions |
| A nominee withdraws vs Trump tweets on inauguration day | No | Yes | Different questions |

Two more same-question pairs settled months apart and also paid out in opposite directions because of the fine print. They are left out of the table above:

- **"Will Trump meet with Vladimir Putin before 2026?" (Kalshi) vs "…in 2025?" (Polymarket):** Kalshi's rules count only Oct 16 – Dec 31, 2025, so the Aug 15, 2025 Alaska summit didn't count. Kalshi paid No, Polymarket Yes.
- **"Will Elon Musk join the Trump administration?":** Kalshi counts only appointments made after its market opened; Polymarket counted his 2025 role. Kalshi paid No, Polymarket Yes.

And across venues outside this study, "Bitcoin reaches $86,000, Sep 21–27" paid Yes on Limitless and No on Polymarket (see the AI review section).

**What this means:** rule gaps rarely flip the result (about 2% of settled pairs here), but when they do, a hedge across the two venues loses one leg completely, and the flip never shows in the price beforehand. Most of the flips are look-alike questions whose titles differ only in the fine print of a date, which is exactly what a title-based scanner pairs.

⚠️ **Limitations:** Polymarket coverage is limited to the most traded markets of each month; Kalshi's rules are its summary texts; untraded Kalshi markets were excluded because Kalshi closed them in bulk as "No" even when the event happened; the review of the opposite results was done by an AI assistant (Claude) against the rule texts, not yet re-checked by a person.

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

**Judge v2 (current)** — after v1 missed two one-sided clauses, the judge prompt now says that a clause stated on only one side that could change the outcome or its timing is at least “caveats”, and the judge sees the verified quotes, not just summaries.

| Manual label ↓ / AI → | equivalent | caveats | different | uncertain |
|---|---|---|---|---|
| equivalent (18) | **18** | 0 | 0 | 0 |
| caveats (6) | 1 | **2** | 3 | 0 |
| different (6) | 0 | 0 | **6** | 0 |

| | v1 | **v2** |
|---|---|---|
| Same label | 27/30 | 26/30 |
| “Different” pairs caught | 5/6 | **6/6** |
| Dangerous: called “equivalent” when not | 2 | **1** (F1: a missing early-settlement clause) |
| False alarm: called “different” when “caveats” | 0 | 3 |

- **v2 errs on the safe side**, which is what a risk tool should do. Two of the three false alarms are arguable (“sworn in” vs “wins the election” can split on a contested result; an Oct vs Dec 2027 deadline can split if a government forms in between).
- **Quotes:** 284 of 299 extracted quotes (95%) were found verbatim in the rules; the rest were discarded and the terms marked unknown.
- All 187 current pairs were reviewed at no cost: passports in ~9 minutes, the v2 re-judging in ~3 minutes (1,458 of 1,551 quotes verified).
- **Refresh with AI:** when a pair's rules change, the ↻ button re-runs the AI for that pair (~10–15 s). In a simulated change (a “resolves 50-50 if unknown by Dec 31” clause added to one side) the verdict moved from “equivalent” to “different” with a concrete scenario.

### Held-out check (the honest number)

To test v2 fairly, `scripts/sample.mjs --seed 20260926 --exclude random-sample.json` drew **30 other pairs** that were never used to tune the prompts. They were labeled against the rule texts **before** looking at any AI verdict for them (`research/holdout-labels.json`); the AI verdicts come from the same v2 run over all pairs (`research/ai-eval-holdout.json`).

| Manual label ↓ / AI → | equivalent | caveats | different | uncertain |
|---|---|---|---|---|
| equivalent (10) | **10** | 0 | 0 | 0 |
| caveats (13) | 2 | **9** | 1 | 1 |
| different (7) | 0 | 0 | **7** | 0 |

- **Same label in 26 of 30** on unseen pairs.
- **Caught all 7 “different” pairs**; 7 of its 8 “different” calls were right (one false alarm: the F1 early-settlement clause, labeled “caveats”).
- **Two dangerous “equivalent” calls**, both on “caveats” pairs: a clarification that only Limitless includes (Maduro, Aug 25, 2026), and “inaugurated” vs “wins the election” (Ocasio-Cortez) — while the identical Buttigieg pair was judged correctly, so the model isn't fully consistent.
- One “uncertain” (Kalshi's one-line rule summary for the French election), which is the intended behavior when a side says too little.
- **Quotes:** 291 of 299 (97%) found verbatim.

**A right class with a wrong scenario.** For "Bitcoin reaches $86,000, Sep 21–27" (Polymarket vs Limitless) the AI correctly called the pair `different` because the windows start on different days, but its scenario had the logic reversed. The real split: Polymarket counts prices only after its market opened (Sep 23, 16:57 UTC), Limitless from 12:00 AM ET on Sep 21. That is how they settled: Limitless resolved Yes, Polymarket resolved No (Sep 28, 2026). RuleGuard had flagged the pair as `different` while Polymarket's market was still open (its Yes traded at 7.5¢ on Sep 26); Limitless had already resolved by then. An in-depth review now replaces the AI scenario for this pair in the demo. The scenario text is less reliable than the class, which is why the pitch materials quote only in-depth reviews.

⚠️ v2 was tuned after seeing v1's errors **on the first 30 pairs**, so the table above that one is optimistic; the held-out table is the one to quote. The “manual labels” were made by Claude (a different model) and not re-checked by a human, the sample is small, and a light model did most of the work — treat all of this as indicative.

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

1. An independent human check of the 60 labeled pairs (random and held-out).
2. ~~AI market passport~~ — done (Gemini, see above).
3. Find a way to get Kalshi's full contract terms.
4. Solana: Kalshi markets via DFlow (needs a DFlow API key); verdicts are already attested on devnet.
5. Settled pairs: how often "the same" market actually settled in opposite directions (`scripts/closed-pairs.mjs`).
