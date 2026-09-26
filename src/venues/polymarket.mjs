// Polymarket: crypto venue (Polygon). Gamma API; rules in description.
import { getJson, num, round, parseArr, sleep } from "../util.mjs";

const API = "https://gamma-api.polymarket.com";

export const meta = { id: "polymarket", name: "Polymarket", money: "real", color: "#2d6cdf" };

export async function load({ pages = 20 } = {}) {
  const markets = [];
  for (let page = 0; page < pages; page++) {
    let data;
    try { data = await getJson(`${API}/markets?active=true&closed=false&limit=100&offset=${page * 100}&order=volume24hr&ascending=false`); }
    catch (e) { console.warn(`  polymarket page ${page}: ${e.message}`); break; }
    if (!Array.isArray(data) || data.length === 0) break;
    for (const m of data) {
      const { yes, no } = quote(m);
      markets.push({
        venue: meta.id,
        id: m.slug,
        event: m.events?.[0]?.title || "",
        title: m.question,
        outcome: m.groupItemTitle || "",
        rules: rulesOf(m),
        close: m.endDate,
        yes, no,
        volume: num(m.volumeNum ?? m.volume),
        url: `https://polymarket.com/market/${m.slug}`
      });
    }
    await sleep(150);
  }
  return markets.filter(m => m.rules);
}

const rulesOf = m => [m.description, m.resolutionSource ? `Resolution source: ${m.resolutionSource}` : ""].filter(Boolean).join("\n\n");

// One market with its current prices and rules (for "refresh this pair")
export async function market(id) {
  // Gamma leaves closed markets out unless asked, and a matched market may have closed since the snapshot
  const find = async extra => (await getJson(`${API}/markets?slug=${encodeURIComponent(id)}${extra}&limit=1`))[0];
  const m = (await find("")) ?? (await find("&closed=true"));
  if (!m) throw new Error(`market not found: ${id}`);
  return { rules: rulesOf(m), close: m.endDate, ...quote(m) };
}

// Buying YES = bestAsk; buying NO ≈ 1 − bestBid. Without a book, fall back to the last outcome prices.
function quote(m) {
  const prices = parseArr(m.outcomePrices);
  const yesIdx = parseArr(m.outcomes).findIndex(o => String(o).toLowerCase() === "yes");
  return {
    yes: num(m.bestAsk) ?? (yesIdx >= 0 ? num(prices[yesIdx]) : null),
    no: m.bestBid != null ? round(1 - Number(m.bestBid)) : (yesIdx >= 0 ? num(prices[1 - yesIdx]) : null)
  };
}

// Live prices for a list of slugs: batches of 40 via repeated ?slug=
export async function prices(ids) {
  const out = new Map();
  for (let i = 0; i < ids.length; i += 40) {
    const qs = ids.slice(i, i + 40).map(s => `slug=${encodeURIComponent(s)}`).join("&");
    const data = await getJson(`${API}/markets?${qs}&limit=100`);
    for (const m of Array.isArray(data) ? data : []) out.set(m.slug, quote(m));
  }
  return out;
}
