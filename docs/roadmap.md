# Roadmap

## Built during the hackathon (Sep 2026)

- [x] Loaders for Kalshi, Polymarket, Limitless and Manifold (public APIs, rule texts included)
- [x] Pair matching with vetoes on numbers, dates, parties, direction, outcomes and names
- [x] Keyword rule comparison as a second opinion
- [x] AI market passports with verified verbatim quotes, and pair verdicts (Gemini, free tier)
- [x] Random labeled sample and a held-out accuracy check of the AI
- [x] Demo with live prices, full and per-pair refresh, and a hosted snapshot
- [x] Verdicts of all matched pairs published on Solana devnet (Solana Attestation Service)

## Next

- [ ] Study of settled pairs: how often "the same" market settled in opposite directions (`scripts/closed-pairs.mjs`, in progress)
- [ ] Human re-check of the 60 labeled pairs
- [ ] Fix the two "caveats" patterns the AI still calls equivalent, checked on a fresh sample
- [ ] Re-attest automatically when a verdict or the rules change
- [ ] Kalshi markets on Solana via DFlow as one side of a pair (needs a DFlow API key)
- [ ] Hosted REST API and alerts for aggregators and bots

## Later

- [ ] Attestations on mainnet after a security review
- [ ] More venues and rule-change alerts
- [ ] Paid tiers for aggregator feeds and a pro API
