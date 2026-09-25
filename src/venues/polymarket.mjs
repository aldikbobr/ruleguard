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
      const { yes, no } = quote(m);
      markets.push({
        venue: meta.id,
        id: m.slug,
        event: m.events?.[0]?.title || "",
        title: m.question,
        outcome: m.groupItemTitle || "",
        rules: [m.description, m.resolutionSource ? `Resolution source: ${m.resolutionSource}` : ""].filter(Boolean).join("\n\n"),
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

// Цена покупки YES = bestAsk; покупка NO ≈ 1 − bestBid. Без стакана — последние цены исходов.
function quote(m) {
  const prices = parseArr(m.outcomePrices);
  const yesIdx = parseArr(m.outcomes).findIndex(o => String(o).toLowerCase() === "yes");
  return {
    yes: num(m.bestAsk) ?? (yesIdx >= 0 ? num(prices[yesIdx]) : null),
    no: m.bestBid != null ? round(1 - Number(m.bestBid)) : (yesIdx >= 0 ? num(prices[1 - yesIdx]) : null)
  };
}

// Живые цены по списку slug: пачками по 40 через повторяющийся ?slug=
export async function prices(ids) {
  const out = new Map();
  for (let i = 0; i < ids.length; i += 40) {
    const qs = ids.slice(i, i + 40).map(s => `slug=${encodeURIComponent(s)}`).join("&");
    const data = await getJson(`${API}/markets?${qs}&limit=100`);
    for (const m of Array.isArray(data) ? data : []) out.set(m.slug, quote(m));
  }
  return out;
}
