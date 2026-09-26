#!/usr/bin/env node
// Publishes RuleGuard pair verdicts to Solana devnet as Solana Attestation Service attestations.
// Addresses and signatures are saved to research/attestations.json for the demo page.
//
// Usage:  node scripts/attest.mjs --sample [--limit N] [--dry-run]   the 30 labeled random-sample pairs
//         node scripts/attest.mjs --read "<pair key>"                 read one verdict back from the chain
//         node scripts/attest.mjs --setup                             key, devnet SOL, credential and schema only
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../src/env.mjs";
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

// Verdicts of the labeled random sample: the label, the rule texts it was made from, and the snapshot time
function sampleVerdicts() {
  const sample = read("random-sample.json");
  const labels = new Map(read("random-labels.json").labels.map(l => [l.n, l]));
  const checkedAt = Math.floor(Date.parse(sample.snapshot) / 1000);
  return sample.pairs.filter(p => labels.has(p.n)).map(p => ({
    pairKey: p.key,
    verdict: labels.get(p.n).label,
    method: "ai-label-v0", // labeled by an AI assistant, not yet re-checked by a human
    rulesHash: rulesHash(p.a.rules, p.b.rules),
    checkedAt
  }));
}

const authority = await loadAuthority(ROOT);
console.log(`Authority ${authority.address} · program ${PROGRAM} · devnet`);

if (args.read) {
  const client = connect();
  const r = await readVerdict(client, authority, String(args.read));
  console.log(r.exists ? { attestation: r.attestation, ...r.data, checked_at: Number(r.data.checked_at), signer: r.signer, expiry: new Date(r.expiry * 1000).toISOString() } : `No attestation for this pair (${r.attestation})`);
  process.exit(0);
}

let verdicts = args.sample ? sampleVerdicts() : [];
if (!args.sample && !args.setup) { console.error("Choose --sample, --read or --setup"); process.exit(1); }
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
for (const v of verdicts) {
  try {
    const r = await publishVerdict(client, authority, v);
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
