# API

RuleGuard exposes its verdicts in two ways today: a local HTTP server that powers the live demo, and on-chain attestations on Solana devnet that any program can read. A hosted REST API for aggregators is on the [roadmap](roadmap.md).

## Local server

```bash
node scripts/serve.mjs   # http://localhost:4173, listens on 127.0.0.1 only
```

| Method | Path | What it does |
|---|---|---|
| `GET` | `/api/status` | Snapshot time, whether a refresh is running, the last log lines, and which keys are connected (`true`/`false` only, never the keys) |
| `POST` | `/api/refresh` | Re-runs the whole pipeline. Requires the header `X-RuleGuard: 1`. Returns `202` when started, `409` if a refresh is already running, `429` if the last one was less than a minute ago |
| `GET` | `/api/prices` | Current YES/NO ask prices for every matched market, cached for 25 s |
| `GET` | `/api/pair?key=<venue:id>\|<venue:id>[&ai=0]` | Refetches both markets' prices and rules, re-compares them, and re-runs the AI review if the rules changed since the snapshot (`ai=0` skips a fresh AI review; "Refresh all pairs" uses it). Cached for 3 s |

## Hosted demo (Vercel)

The same endpoints run as serverless functions from `api/` (`status`, `prices`, `pair`), sharing their logic with the local server through `src/live.mjs`; `vercel.json` builds the page from the committed data. Kalshi and Limitless don't allow browser requests from other sites (no CORS), which is why the live buttons need a server rather than a static page. On the hosted demo there is no `/api/refresh` (no writable storage), so "Refresh all pairs" refetches the prices and rules of every pair in place. At most four fresh AI reviews run per minute, so a public page can't exhaust the free Gemini quota; set `GEMINI_API_KEY` in the Vercel project to enable them.

### `GET /api/pair` response

```json
{
  "fetched_at": "2026-09-26T08:26:44.166Z",
  "a": { "venue": "kalshi", "id": "…", "title": "…", "rules": "…", "yes": 0.91, "no": 0.1 },
  "b": { "venue": "polymarket", "id": "…", "title": "…", "rules": "…", "yes": 0.37, "no": 0.64 },
  "cmp": { "cls": "different", "flags": [ { "field": "de facto vs official", "level": "material", "detail": "…" } ], "facts": { "a": {}, "b": {} } },
  "edge": 0.26,
  "rules_changed": { "a": false, "b": false },
  "ai": { "verdict": "different", "why": "…", "scenario": "…", "model": "gemini-3.5-flash-lite" },
  "ai_fresh": true
}
```

`edge` is the raw spread, 1 − (YES on one venue + NO on the other) at ask prices, without fees or depth; it is `null` for play-money pairs. `ai_note` explains a missing verdict (no key, timeout, error).

## On-chain verdicts (Solana devnet)

Every pair verdict is an attestation of the Solana Attestation Service program `22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG`.

| | Address |
|---|---|
| Credential (issuer "RuleGuard") | `92cf2ssEpn7KbqrgFj6PWKouiDwbW276Fk7s1WUwMy9t` |
| Schema `ruleguard-pair-verdict` v1 | `8LCZ1hTuWkRrxcQHUXGjqBYGkotqdnoeY5fYD3vMGkJM` |

Schema fields:

| Field | Type | Meaning |
|---|---|---|
| `pair_key` | string | `<venue>:<market id>\|<venue>:<market id>` |
| `verdict` | string | `equivalent`, `caveats`, `different` or `uncertain` |
| `method` | string | how it was made: `ai-judge-v2`, `ai-label-v0` (labeled sample), `ai-review-v0` (in-depth review) |
| `rules_hash` | string | sha256 of both rule texts as they were compared |
| `checked_at` | i64 | Unix time of the check |

The attestation for a pair sits at the PDA derived from the credential, the schema and the nonce `sha256(pair_key)`, so a reader only needs the pair key:

```bash
node scripts/attest.mjs --read "kalshi:KXVENEZDEFACTO-27JAN01-DROD|polymarket:will-delcy-rodrguez-be-the-leader-of-venezuela-end-of-2026"
```

The addresses and signatures of all published attestations are listed in `research/attestations.json`.
