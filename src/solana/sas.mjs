// Pair verdicts as Solana Attestation Service (SAS) attestations.
// One credential ("RuleGuard"), one schema, one attestation per pair. The attestation address is derived from
// sha256(pair key), so anyone who knows the pair can find its verdict on-chain without asking our server.
// Devnet only for now: mainnet waits for a security review.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  airdropFactory, appendTransactionMessageInstructions, createKeyPairSignerFromBytes, createSolanaRpc,
  createSolanaRpcSubscriptions, createTransactionMessage, getAddressDecoder, getSignatureFromTransaction, lamports,
  pipe, sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners
} from "@solana/kit";
import {
  deriveAttestationPda, deriveCredentialPda, deriveSchemaPda, deserializeAttestationData, fetchMaybeAttestation,
  fetchMaybeCredential, fetchMaybeSchema, fetchSchema, getCloseAttestationInstruction, getCreateAttestationInstruction,
  getCreateCredentialInstruction, getCreateSchemaInstruction, serializeAttestationData,
  SOLANA_ATTESTATION_SERVICE_PROGRAM_ADDRESS
} from "sas-lib";

export const PROGRAM = SOLANA_ATTESTATION_SERVICE_PROGRAM_ADDRESS;
export const CREDENTIAL_NAME = "RuleGuard";
export const SCHEMA = {
  name: "ruleguard-pair-verdict",
  version: 1,
  description: "RuleGuard verdict: do two prediction markets settle under equivalent rules?",
  fields: ["pair_key", "verdict", "method", "rules_hash", "checked_at"],
  layout: [12, 12, 12, 12, 8] // string, string, string, string, i64 (SAS compact layout codes)
};
const EXPIRY_DAYS = 365;
// Each attestation account holds a ~0.004 SOL rent deposit (returned when it is closed); 0.15 SOL covers
// the credential, the schema and the 30-pair sample with room for updates
const MIN_BALANCE = 150_000_000n;

export const explorer = (kind, id, network = "devnet") => `https://explorer.solana.com/${kind}/${id}?cluster=${network}`;

export function connect() {
  const http = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
  if (/mainnet/i.test(http)) throw new Error("Mainnet is disabled until the security review (SOLANA_RPC_URL points to mainnet)");
  const ws = process.env.SOLANA_WS_URL || http.replace(/^http/, "ws");
  return { rpc: createSolanaRpc(http), rpcSubscriptions: createSolanaRpcSubscriptions(ws), network: "devnet" };
}

// Devnet key in Solana CLI format (64-byte JSON array), created on first use. The folder is git-ignored.
export async function loadAuthority(root) {
  const file = path.join(root, ".solana", "devnet-authority.json");
  if (!fs.existsSync(file)) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
    const seed = privateKey.export({ format: "der", type: "pkcs8" }).subarray(-32);
    const pub = publicKey.export({ format: "der", type: "spki" }).subarray(-32);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify([...seed, ...pub]), { mode: 0o600 });
  }
  return createKeyPairSignerFromBytes(Uint8Array.from(JSON.parse(fs.readFileSync(file, "utf8"))));
}

export const pairNonce = pairKey => getAddressDecoder().decode(crypto.createHash("sha256").update(pairKey).digest());

// Hash of both rule texts exactly as they were compared (line endings normalized)
export const rulesHash = (a, b) => crypto.createHash("sha256")
  .update([a, b].map(t => String(t ?? "").replace(/\r\n/g, "\n")).join("\n␞\n")).digest("hex");

export async function addresses(authority, pairKey) {
  const [credential] = await deriveCredentialPda({ authority: authority.address, name: CREDENTIAL_NAME });
  const [schema] = await deriveSchemaPda({ credential, name: SCHEMA.name, version: SCHEMA.version });
  const out = { credential, schema };
  if (pairKey) [out.attestation] = await deriveAttestationPda({ credential, schema, nonce: pairNonce(pairKey) });
  return out;
}

// Offline check that a verdict fits the schema, without touching the network.
// On-chain field names are stored joined: u32 little-endian length + UTF-8 bytes, per field.
const joinedFieldNames = () => Buffer.concat(SCHEMA.fields.map(f => {
  const bytes = Buffer.from(f, "utf8"), len = Buffer.alloc(4);
  len.writeUInt32LE(bytes.length);
  return Buffer.concat([len, bytes]);
}));
export const encode = verdict => serializeAttestationData(
  { layout: Uint8Array.from(SCHEMA.layout), fieldNames: joinedFieldNames() }, toRecord(verdict));

function toRecord(v) {
  return { pair_key: v.pairKey, verdict: v.verdict, method: v.method, rules_hash: v.rulesHash, checked_at: BigInt(v.checkedAt) };
}

async function send(client, signer, instructions) {
  const { value: blockhash } = await client.rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    m => setTransactionMessageFeePayerSigner(signer, m),
    m => setTransactionMessageLifetimeUsingBlockhash(blockhash, m),
    m => appendTransactionMessageInstructions(instructions, m)
  );
  const tx = await signTransactionMessageWithSigners(message);
  await sendAndConfirmTransactionFactory(client)(tx, { commitment: "confirmed" });
  return getSignatureFromTransaction(tx);
}

export async function balance(client, authority) {
  return (await client.rpc.getBalance(authority.address).send()).value;
}

export async function ensureFunded(client, authority) {
  const have = await balance(client, authority);
  if (have >= MIN_BALANCE) return have;
  // The public devnet faucet allows about one airdrop per IP per day and often refuses 1 SOL while granting less
  let error;
  for (const amount of [1_000_000_000n, 500_000_000n, 200_000_000n]) {
    try {
      await airdropFactory(client)({ recipientAddress: authority.address, lamports: lamports(amount), commitment: "confirmed" });
      return balance(client, authority);
    } catch (e) {
      error = e;
    }
  }
  throw new Error(`Devnet airdrop failed (${error.message}). Send at least 0.2 devnet SOL to ${authority.address} via https://faucet.solana.com (network: devnet) and rerun.`);
}

// Creates the credential and the schema once; later runs only read them
export async function ensureIssuer(client, authority) {
  const { credential, schema } = await addresses(authority);
  const created = [];
  if (!(await fetchMaybeCredential(client.rpc, credential)).exists) {
    created.push(await send(client, authority, [getCreateCredentialInstruction({
      payer: authority, authority, credential, name: CREDENTIAL_NAME, signers: [authority.address]
    })]));
  }
  if (!(await fetchMaybeSchema(client.rpc, schema)).exists) {
    created.push(await send(client, authority, [getCreateSchemaInstruction({
      payer: authority, authority, credential, schema, name: SCHEMA.name, description: SCHEMA.description,
      layout: Uint8Array.from(SCHEMA.layout), fieldNames: SCHEMA.fields
    })]));
  }
  return { credential, schema, created };
}

export async function readVerdict(client, authority, pairKey) {
  const { schema, attestation } = await addresses(authority, pairKey);
  const account = await fetchMaybeAttestation(client.rpc, attestation);
  if (!account.exists) return { attestation, exists: false };
  const schemaAccount = await fetchSchema(client.rpc, schema);
  const data = deserializeAttestationData(schemaAccount.data, Uint8Array.from(account.data.data));
  return { attestation, exists: true, data, signer: account.data.signer, expiry: Number(account.data.expiry) };
}

// Creates the attestation, or replaces it (close + create) when the verdict, method or rules changed
export async function publishVerdict(client, authority, verdict) {
  const { credential, schema, attestation } = await addresses(authority, verdict.pairKey);
  const current = await readVerdict(client, authority, verdict.pairKey);
  const same = current.exists && ["verdict", "method", "rules_hash"].every(f => current.data[f] === toRecord(verdict)[f]);
  if (same) return { attestation, status: "unchanged" };
  if (current.exists) await send(client, authority, [getCloseAttestationInstruction({ payer: authority, authority, credential, attestation })]);
  const schemaAccount = await fetchSchema(client.rpc, schema);
  const signature = await send(client, authority, [getCreateAttestationInstruction({
    payer: authority, authority, credential, schema, attestation,
    nonce: pairNonce(verdict.pairKey),
    expiry: Math.floor(Date.now() / 1000) + EXPIRY_DAYS * 86400,
    data: serializeAttestationData(schemaAccount.data, toRecord(verdict))
  })]);
  return { attestation, signature, status: current.exists ? "updated" : "created" };
}
