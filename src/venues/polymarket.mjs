// Polymarket: крипто-площадка (Polygon). Gamma API, правила в description.
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
      const prices = parseArr(m.outcomePrices);
      const outcomes = parseArr(m.outcomes);
      const yesIdx = outcomes.findIndex(o => String(o).toLowerCase() === "yes");
      markets.push({
        venue: meta.id,
        id: m.slug,
        event: m.events?.[0]?.title || "",
        title: m.question,
        outcome: m.groupItemTitle || "",
        rules: [m.description, m.resolutionSource ? `Resolution source: ${m.resolutionSource}` : ""].filter(Boolean).join("\n\n"),
        close: m.endDate,
        yes: num(m.bestAsk) ?? (yesIdx >= 0 ? num(prices[yesIdx]) : null),
        no: m.bestBid != null ? round(1 - Number(m.bestBid)) : (yesIdx >= 0 ? num(prices[1 - yesIdx]) : null),
        volume: num(m.volumeNum ?? m.volume),
        url: `https://polymarket.com/market/${m.slug}`
      });
    }
    await sleep(150);
  }
  return markets.filter(m => m.rules);
}
