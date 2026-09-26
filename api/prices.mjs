// GET /api/prices on the hosted demo: live YES/NO prices for every matched market (cached for 25 s)
import { livePrices } from "../src/live.mjs";
import { send } from "./_lib.mjs";

export default async function handler(req, res) {
  try { send(res, 200, await livePrices()); }
  catch (e) { send(res, 502, { error: e.message }); }
}
