// Manifold: игровая валюта (mana), реальных денег нет. В списке рынков правил нет —
// текст (textDescription) подгружается отдельно, только для рынков, попавших в пары.
import { getJson, mapLimit, num } from "../util.mjs";

const API = "https://api.manifold.markets/v0";

export const meta = { id: "manifold", name: "Manifold", money: "play", color: "#7c3aed" };

export async function load({ perSort = 1000 } = {}) {
  const byId = new Map();
  for (const sort of ["liquidity", "24-hour-vol"]) {
    let data = [];
    try { data = await getJson(`${API}/search-markets?sort=${sort}&filter=open&contractType=BINARY&limit=${perSort}`); }
    catch (e) { console.warn(`  manifold ${sort}: ${e.message}`); }
    for (const m of data) {
      if (m.outcomeType !== "BINARY" || byId.has(m.id)) continue;
      byId.set(m.id, {
        venue: meta.id,
        id: m.id,
        event: m.question,
        title: m.question,
        outcome: "",
        rules: null, // подгружается в hydrateRules
        close: m.closeTime ? new Date(m.closeTime).toISOString() : null,
        yes: num(m.probability),
        no: m.probability != null ? 1 - m.probability : null,
        volume: num(m.volume),
        url: m.url
      });
    }
  }
  return [...byId.values()];
}

export async function hydrateRules(markets) {
  await mapLimit(markets.filter(m => m.rules == null), 5, async m => {
    try {
      const full = await getJson(`${API}/market/${m.id}`);
      m.rules = (full.textDescription || "").trim() || "";
    } catch { m.rules = ""; }
  });
}
