#!/usr/bin/env node
// Publishes RuleGuard pair verdicts to Solana devnet as Solana Attestation Service attestations.
// Addresses and signatures are saved to research/attestations.json for the demo page.
//
// Usage:  node scripts/attest.mjs --sample [--limit N] [--dry-run]   the 30 labeled random-sample pairs
//         node scripts/attest.mjs --all [--limit N] [--dry-run]      every matched pair that has a verdict
//         node scripts/attest.mjs ... [--delay MS]                    pause between pairs (default 2000)
//         node scripts/attest.mjs --read "<pair key>"                 read one verdict back from the chain
//         node scripts/attest.mjs --setup                             key, devnet SOL, credential and schema only
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../src/env.mjs";
import { VERDICTS } from "../src/verdicts.mjs";
import { lookup, loadCache, JUDGE_VERSION } from "../src/ai/review.mjs";
import {
  PROGRAM, CREDENTIAL_NAME, SCHEMA, connect, loadAuthority, addresses, encode, rulesHash, balance, ensureFunded,
  ensureIssuer, publishVerdict, readVerdict, explorer
} from "../src/solana/sas.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
loadEnv(ROOT);
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]?.startsWith("--") ? true : arr[i + 1] ?? true]] : acc), []));
const OUT = path.join(ROOT, "research", "attestations.json");
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, "research", f), "utf8"));
const sol = lamports => (Number(lamports) / 1e9).toFixed(4) + " SOL";

// Verdicts of a labeled sample: the label, the rule texts it was made from, and the snapshot time
function labeledVerdicts(sampleFile, labelsFile) {
  if (!fs.existsSync(path.join(ROOT, "research", sampleFile)) || !fs.existsSync(path.join(ROOT, "research", labelsFile))) return [];
  const sample = read(sampleFile);
  const labels = new Map(read(labelsFile).labels.map(l => [l.n, l]));
  const checkedAt = Math.floor(Date.parse(sample.snapshot) / 1000);
  return sample.pairs.filter(p => labels.has(p.n)).map(p => ({
    pairKey: p.key,
    verdict: labels.get(p.n).label,
    method: "ai-label-v0", // labeled by an AI assistant, not yet re-checked by a human
    rulesHash: rulesHash(p.a.rules, p.b.rules),
    checkedAt
  }));
}
const sampleVerdicts = () => labeledVerdicts("random-sample.json", "random-labels.json");

// Every matched pair with a verdict, in the demo's priority order: in-depth review (written by an AI assistant,
// src/verdicts.mjs) → labeled samples (random and held-out) → AI judge. Keyword-only pairs are not attested.
function allVerdicts() {
  const data = read("pairs-all.json");
  const snapshot = Math.floor(Date.parse(data.generated_at) / 1000);
  const labeled = new Map([...labeledVerdicts("random-sample.json", "random-labels.json"),
    ...labeledVerdicts("holdout-sample.json", "holdout-labels.json")].map(v => [v.pairKey, v]));
  const { verdictOf } = lookup(loadCache(path.join(ROOT, "research", "ai-cache.json")));
  const out = [];
  for (const p of data.pairs) {
    const pairKey = `${p.a.venue}:${p.a.id}|${p.b.venue}:${p.b.id}`;
    const review = VERDICTS[`${p.a.id}|${p.b.id}`];
    const ai = verdictOf(p);
    if (review) out.push({ pairKey, verdict: review.verdict, method: "ai-review-v0", rulesHash: rulesHash(p.a.rules, p.b.rules), checkedAt: snapshot });
    else if (labeled.has(pairKey)) out.push(labeled.get(pairKey));
    else if (ai) out.push({ pairKey, verdict: ai.verdict, method: `ai-judge-v${JUDGE_VERSION}`, rulesHash: rulesHash(p.a.rules, p.b.rules), checkedAt: ai.at ? Math.floor(Date.parse(ai.at) / 1000) : snapshot });
  }
  return out;
}

const authority = await loadAuthority(ROOT);
console.log(`Authority ${authority.address} · program ${PROGRAM} · devnet`);

if (args.read) {
  const client = connect();
  const r = await readVerdict(client, authority, String(args.read));
  console.log(r.exists ? { attestation: r.attestation, ...r.data, checked_at: Number(r.data.checked_at), signer: r.signer, expiry: new Date(r.expiry * 1000).toISOString() } : `No attestation for this pair (${r.attestation})`);
  process.exit(0);
}

let verdicts = args.all ? allVerdicts() : args.sample ? sampleVerdicts() : [];
if (!args.all && !args.sample && !args.setup) { console.error("Choose --all, --sample, --read or --setup"); process.exit(1); }
if (args.limit) verdicts = verdicts.slice(0, Number(args.limit));

if (args["dry-run"]) {
  for (const v of verdicts) {
    const { attestation } = await addresses(authority, v.pairKey);
    console.log(`${v.verdict.padEnd(10)} ${encode(v).length} bytes → ${attestation}  ${v.pairKey}`);
  }
  console.log(`\nDry run: ${verdicts.length} verdicts encoded, nothing sent.`);
  process.exit(0);
}

const client = connect();
const before = await ensureFunded(client, authority);
const issuer = await ensureIssuer(client, authority);
console.log(`Credential "${CREDENTIAL_NAME}" ${issuer.credential}\nSchema "${SCHEMA.name}" v${SCHEMA.version} ${issuer.schema}${issuer.created.length ? ` (created now)` : ""}`);

const saved = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { items: {} };
const counts = { created: 0, updated: 0, unchanged: 0, failed: 0 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PAUSE_MS = Number(args.delay) || 2000; // the public devnet RPC rate-limits bursts (HTTP 429)

// Retries rate-limit and connection errors with a growing wait; a rerun is safe because publishing is idempotent
async function publishWithRetry(v) {
  for (const wait of [10_000, 30_000, 60_000, null]) {
    try {
      return await publishVerdict(client, authority, v);
    } catch (e) {
      if (wait === null || !/429|Too Many|WebSocket|fetch failed|ECONNRESET|timed? ?out/i.test(e.message)) throw e;
      console.log(`  (rate-limited, retrying in ${wait / 1000} s)`);
      await sleep(wait);
    }
  }
}

for (const v of verdicts) {
  try {
    const r = await publishWithRetry(v);
    await sleep(PAUSE_MS);
    counts[r.status]++;
    const prev = saved.items[v.pairKey] || {};
    saved.items[v.pairKey] = {
      attestation: r.attestation, signature: r.signature ?? prev.signature,
      verdict: v.verdict, method: v.method, rules_hash: v.rulesHash, checked_at: v.checkedAt
    };
    console.log(`  ${r.status.padEnd(9)} ${v.verdict.padEnd(10)} ${v.pairKey}`);
  } catch (e) {
    counts.failed++;
    console.log(`  failed    ${v.pairKey}: ${e.message}`);
  }
}

Object.assign(saved, {
  network: "devnet", program: PROGRAM, authority: authority.address,
  credential: issuer.credential, schema: issuer.schema, schema_name: SCHEMA.name, schema_version: SCHEMA.version,
  explorer: { credential: explorer("address", issuer.credential), schema: explorer("address", issuer.schema) },
  updated: new Date().toISOString()
});
fs.writeFileSync(OUT, JSON.stringify(saved, null, 2) + "\n");
const after = await balance(client, authority);
console.log(`\nCreated ${counts.created}, updated ${counts.updated}, unchanged ${counts.unchanged}, failed ${counts.failed}. Spent ${sol(before - after)}, balance ${sol(after)}.`);
console.log(`Saved to research/attestations.json · schema: ${explorer("address", issuer.schema)}`);
