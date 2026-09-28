// GET /api/data[?rescan=1] on the hosted demo: the page's data (pairs, labels, verdicts) as JSON. With rescan=1 the
// server scans the four venues again first (about 20 s, at most once a minute), which is what "Refresh all pairs" uses.
import { liveData, rescan } from "../src/live.mjs";
import { send, query } from "./_lib.mjs";

export default async function handler(req, res) {
  try {
    const data = query(req).get("rescan") === "1" ? await rescan() : await liveData();
    if (!data) return send(res, 404, { error: "no live data yet" });
    send(res, 200, data);
  } catch (e) {
    send(res, 502, { error: e.message });
  }
}
