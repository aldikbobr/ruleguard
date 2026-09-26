// GET /api/pair?key=<venue:id|venue:id>[&ai=0] on the hosted demo: refetch one pair's prices and rules and re-compare
// them; the AI review is redone only when the rules changed and GEMINI_API_KEY is set (a few per minute at most)
import { refreshPair } from "../src/live.mjs";
import { send, query } from "./_lib.mjs";

export default async function handler(req, res) {
  const q = query(req);
  try { send(res, 200, await refreshPair(q.get("key") || "", { ai: q.get("ai") !== "0" })); }
  catch (e) { send(res, e.status || 502, { error: e.message }); }
}
