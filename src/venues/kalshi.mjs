// Kalshi: регулируемая площадка в США. Публичный API, правила в rules_primary/rules_secondary.
import { getJson, num, sleep } from "../util.mjs";

const API = "https://api.elections.kalshi.com/trade-api/v2";

export const meta = { id: "kalshi", name: "Kalshi", money: "real", color: "#0aa37f" };

export async function load({ pages = 30 } = {}) {
  const markets = [];
  let cursor = "";
  for (let page = 0; page < pages; page++) {
    const data = await getJson(`${API}/events?status=open&with_nested_markets=true&limit=200${cursor ? `&cursor=${cursor}` : ""}`);
    for (const ev of data.events ?? []) {
      for (const m of ev.markets ?? []) {
        if (m.status && !["active", "open"].includes(m.status)) continue;
        markets.push({
          venue: meta.id,
          id: m.ticker,
          event: ev.title,
          title: m.title,
          outcome: m.yes_sub_title || "",
          rules: [m.rules_primary, m.rules_secondary].filter(Boolean).join("\n\n"),
          close: m.close_time,
          yes: num(m.yes_ask_dollars),
          no: num(m.no_ask_dollars),
          volume: num(m.volume_fp),
          url: `https://kalshi.com/markets/${(ev.series_ticker || ev.event_ticker || "").toLowerCase()}`
        });
      }
    }
    cursor = data.cursor;
    if (!cursor) break;
    await sleep(150);
  }
  return markets.filter(m => m.rules);
}
