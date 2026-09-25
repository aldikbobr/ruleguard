// Limitless: крипто-площадка (Base). Правила в description (HTML). Бывают групповые рынки с вложенными markets.
import { getJson, num, stripHtml, sleep } from "../util.mjs";

const API = "https://api.limitless.exchange";

export const meta = { id: "limitless", name: "Limitless", money: "real", color: "#c2410c" };

// Короткие рынки «вверх/вниз за 5–15 минут» не имеют аналогов на других площадках — пропускаем
const SHORT_TERM = /\b(5|15|30)\s*min\b|minutely|hourly/i;

export async function load({ pages = 30, pageSize = 25 } = {}) {
  const raw = [];
  for (let page = 1; page <= pages; page++) {
    let data;
    try { data = await getJson(`${API}/markets/active?limit=${pageSize}&page=${page}`); }
    catch (e) { console.warn(`  limitless page ${page}: ${e.message}`); break; }
    const items = data.data ?? [];
    raw.push(...items);
    if (items.length < pageSize) break;
    await sleep(150);
  }

  const markets = [];
  const push = (m, group) => {
    const [yesAsk, noAsk] = m.tradePrices?.buy?.market ?? [];
    const [yesMid, noMid] = m.prices ?? [];
    markets.push({
      venue: meta.id,
      id: m.slug,
      event: group?.title || m.title,
      title: group ? `${group.title}` : m.title,
      outcome: group ? m.title : "",
      rules: stripHtml(m.description || group?.description),
      close: m.expirationTimestamp ? new Date(m.expirationTimestamp).toISOString() : null,
      yes: num(yesAsk) ?? num(yesMid),
      no: num(noAsk) ?? num(noMid),
      volume: num(m.volumeFormatted ?? m.volume),
      url: `https://limitless.exchange/markets/${group?.slug || m.slug}`
    });
  };
  for (const m of raw) {
    if (SHORT_TERM.test(`${m.title} ${(m.categories || []).join(" ")}`)) continue;
    if (Array.isArray(m.markets) && m.markets.length) for (const child of m.markets) push(child, m);
    else push(m);
  }
  return markets.filter(m => m.rules);
}
