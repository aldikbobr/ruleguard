# Contributing to RuleGuard

Thanks for your interest in RuleGuard, the rule-equivalence layer for prediction markets.

## Reporting a pair

The most useful contribution is a pair of "identical" markets that settle under different rules, or a pair we flag that is actually the same contract. Open an issue with both market links, the clause that differs, and the scenario in which the two markets would settle differently.

## Development

Requires Node.js 22+. Market data comes from public APIs, so no venue keys are needed.

```bash
npm install                                # only the Solana attestations need dependencies
npm test                                   # unit tests
node scripts/build-demo.mjs --from-cache   # re-render the demo from the saved data
node scripts/serve.mjs                     # http://localhost:4173
```

Keys (Gemini for the AI review, optional DFlow) go in `.env`, which is git-ignored; see `.env.example`. Never commit keys or the devnet signing key in `.solana/`.

## Pull requests

1. Create a branch: `git checkout -b feat/short-name`.
2. Keep the change focused, and add a test in `tests/` when you touch matching or rule comparison.
3. Make sure `npm test` passes; CI runs it on every push.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) style messages, for example `fix: veto pairs with different tournament stages`.

## Ground rules

- A pair verdict must be backed by the rule text. When in doubt, the verdict is `uncertain`, not `equivalent`.
- Everything in this repository is in English.
- RuleGuard is an informational tool, not financial advice. It never executes trades.
