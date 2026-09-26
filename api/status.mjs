// GET /api/status on the hosted demo: snapshot time and which keys are set (yes/no only). A full rebuild of the
// pairs is not available here (no writable storage); "refresh all pairs" refreshes every pair in place instead.
import { keyStatus } from "../src/env.mjs";
import { snapshotTime } from "../src/live.mjs";
import { send } from "./_lib.mjs";

export default function handler(req, res) {
  send(res, 200, { generated_at: snapshotTime(), hosted: true, refreshing: false, keys: keyStatus() });
}
