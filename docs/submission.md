# Черновик заявки Colosseum (Crypto World's Fair)

Поля — по официальной странице https://colosseum.com/hackathon (проверено 25.09.2026). Ответы на английском, их можно вставлять в форму как есть. `[…]` — заполнить вам.

---

**Product name:** RuleGuard

**One-liner:** The rule-equivalence layer for prediction markets. We check whether "identical" markets on different venues actually settle the same way.

**Description:**
Markets that look identical across Kalshi, Polymarket and Limitless often settle under different rules: different deadlines, resolution sources, "de facto" vs "official" status, how interim officeholders count, or what happens if a player doesn't play. Price scanners show these gaps as arbitrage. In reality they're different contracts, and a "risk-free" hedge can lose on both legs.

RuleGuard matches "the same" market across four venues (~59k open markets per run, 187 matched pairs). An AI then extracts each market's settlement terms into a passport where every term is backed by a verbatim quote from the rules (unverifiable quotes are discarded), and compares the passports term by term. The verdict is equivalent, caveats, different or uncertain, together with the concrete scenario in which the pair splits.

Evidence so far: in our first scan, all five of the largest Kalshi–Polymarket spreads were different contracts. In a random sample, the rules fully matched in only 1 of 11 cross-operator pairs. On 30 held-out pairs, the AI caught 7 of 7 "different" pairs, and 97% of its quotes were found verbatim in the rules. All labels were made by an AI assistant and haven't been re-checked by a human yet, so we treat the numbers as indicative.

Verdicts are published on Solana as Solana Attestation Service attestations, signed by the RuleGuard issuer and stored at an address derived from the pair, so routers, bots and wallets can check a pair on-chain before they route. On devnet today, every matched pair has an attestation (191 in total), and each demo pair links to its record in Solana Explorer.

**Blockchains and tools integrated:**
- Solana (devnet): Solana Attestation Service (program `22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG`); issuer `92cf2ssEpn7KbqrgFj6PWKouiDwbW276Fk7s1WUwMy9t`; schema `ruleguard-pair-verdict` `8LCZ1hTuWkRrxcQHUXGjqBYGkotqdnoeY5fYD3vMGkJM`; `@solana/kit`, `sas-lib`
- Market data: Kalshi, Polymarket (Gamma), Limitless, Manifold (public APIs)
- AI review: Google Gemini (free tier)
- Node.js 20+
- Planned: DFlow (Kalshi markets tokenized on Solana), once we have an API key

**Team:** […name — role — background, one line each]

**Team location:** […]

**Logo:** `docs/logo.png` (1024×1024) or `docs/logo.svg`

**GitHub repository:** https://github.com/aldikbobr/ruleguard (private; make it public or give the judges access before submitting)

**Presentation video (2–3 min):** […YouTube link] (script: `docs/video-scripts.md`)

**Product demo video (≤ 3 min):** […YouTube link]

**Links:** pitch deck https://aldikbobr.github.io/ruleguard-deck/ · demo snapshot https://claude.ai/artifact/B61ZXiuoWxCx1THjtmREUC

**Go-to-market strategy:**
1. **Routers and aggregators first** (Capitola, DFlow frontends, pmxt users). Every time they route "the same" event to the cheaper venue, they risk putting a user into a different contract. We offer a pair-verdict feed with rule-change alerts, and on-chain attestations they can read for free.
2. **Arbitrage bots and quants**: an API with an "equivalent only" filter. One rule gap can erase many small wins.
3. **Traders and hedgers** as the acquisition channel: a free web app and a Telegram channel with daily pairs showing the rule difference and its scenario.
Business model (proposed): free to see, paid to route. Web, Telegram and on-chain reads are free; the aggregator feed with an SLA and the Pro API are paid.

**Demand validation:**
Before collecting results we set this bar for Oct 11: 30+ Telegram subscribers, 2–3 aggregator or bot teams trying the API, and 3+ traders describing a real loss from a rule gap. Current results: […numbers from the table in docs/outreach.md]. Public evidence of the problem so far: DarkHorse Odds' guide (Sep 22, 2026) documents a +$3 hedge that lost $47 on a player-DNP rule gap, and a dev.to write-up (Sep 23, 2026) flags the biggest cross-venue spreads as "VERIFY RULES".

**Distribution plan:** outreach to aggregator and bot teams (X, Discord), trader communities (r/Kalshi, r/Polymarket), and a daily Telegram channel. On-chain attestations let other Solana programs integrate without talking to us.

**Past work disclosure:** The project started during the hackathon: the first commit is from Sep 25, 2026, and there is no earlier codebase. Reused components: the venues' public APIs, Gemini, `sas-lib`/`@solana/kit` and the Solana Attestation Service program. Code, research notes and the deck were written with the help of AI coding assistants (Claude Code). Details are in the README section "What was built during the hackathon".
