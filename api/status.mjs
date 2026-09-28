// GET /api/status on the hosted demo: when the pairs were last rebuilt and which keys are set (yes/no only).
// The pairs are rebuilt by the refresh workflow; "Refresh all pairs" on the page reloads when a newer set exists
// and otherwise refreshes every pair in place.
import { keyStatus } from "../src/env.mjs";
import { snapshotInfo } from "../src/live.mjs";
import { send } from "./_lib.mjs";

export default async function handler(req, res) {
  send(res, 200, { ...(await snapshotInfo()), hosted: true, refreshing: false, keys: keyStatus() });
}
