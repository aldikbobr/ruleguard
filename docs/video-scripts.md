# Сценарии видео для заявки Colosseum

Требования Colosseum: **питч-видео 2–3 минуты** и **демо-видео не длиннее 3 минут**. Текст для записи — на английском (ниже), пометки — по-русски. Записывать можно бесплатно: Xbox Game Bar (`Win+G`) или OBS; загрузить на YouTube с доступом «по ссылке».

Ссылки:
- Презентация: https://aldikbobr.github.io/ruleguard-deck/ (или оригинал в Claude)
- Демо для судей: https://claude.ai/artifact/B61ZXiuoWxCx1THjtmREUC (снимок) либо локально `node scripts/serve.mjs` → http://localhost:4173 (живые цены)

---

## 1. Питч-видео (~2:30) — листаем презентацию и говорим

| Время | Слайд | Текст |
|---|---|---|
| 0:00–0:15 | 1 · Cover | Hi, we're [team]. This is RuleGuard, the rule-equivalence layer for prediction markets. Here's one market on two venues on the same day: Kalshi at 91 cents, Polymarket at 37. A scanner calls that arbitrage. It isn't. They're two different contracts. |
| 0:15–0:35 | 2 · Problem | A trader hedged a player prop across Kalshi and Polymarket to lock in three dollars. The player didn't play. Polymarket settled No, Kalshi settled at the last price, and the three-dollar hedge lost forty-seven. Nothing was mispriced. The rules were different. |
| 0:35–0:55 | 3 · Top 5 spreads | In our first scan of 67 Kalshi–Polymarket pairs, all five of the biggest spreads were different contracts: de facto versus official, a time window versus a single moment, 2028 versus 2026. Scanners rank exactly these as their best trades. |
| 0:55–1:15 | 4 · Random sample | To avoid cherry-picking, we drew a random sample. Across operators, the rules fully matched in only one pair out of eleven. It's a small sample, so we treat it as indicative, but the pattern is clear. |
| 1:15–1:45 | 5 · How it works | RuleGuard loads about 59 thousand markets from four venues and matches pairs. An AI then writes a market passport where every term is backed by a verbatim quote. Passports are compared term by term into a verdict with the scenario where the pair splits. On 30 unseen pairs it caught all seven "different" pairs, and 97 percent of its quotes were verified. When unsure, it says uncertain. |
| 1:45–2:05 | 6 · Solana | Every verdict is published on Solana through the Solana Attestation Service. It's signed by RuleGuard and includes a hash of the rules we checked, at an address derived from the pair, so any router or bot can check it on-chain before it routes. It's live on devnet today. |
| 2:05–2:20 | 7–8 · Competition, business | Scanners stop at the price, and we check the contract. Aggregators and bots pay for the feed and the API, traders see it for free, and on-chain reads stay free. |
| 2:20–2:35 | 9–10 · Roadmap, team | Next: a human re-check of the labels, the API, and Kalshi markets via DFlow. Same title, different contract. RuleGuard checks the rules before you trade. Thank you. |

Совет: говорить спокойно, по одной фразе на смену слайда; если выходит дольше 3:00 — сократить слайды 7–8.

---

## 2. Демо-видео (≤ 3:00) — экран с демо, голос за кадром

| Время | Действие на экране | Текст |
|---|---|---|
| 0:00–0:15 | Открыть демо, показать шапку и плитки (рынки, пары, 🤖, ⛓) | This is the RuleGuard demo. It loads open markets from Kalshi, Polymarket, Limitless and Manifold and matches "the same" market across venues. |
| 0:15–0:45 | Прокрутить к **Arbitrage traps**, кликнуть первую карточку | These are the arbitrage traps: liquid pairs with a big price gap where the rules differ. A scanner would show them as opportunities. |
| 0:45–1:25 | В раскрытой паре: таблица площадка против площадки, различия, 🤖 вердикт ИИ со сценарием | For each pair we show the venues side by side: deadline, source and special conditions, with the differences highlighted. The AI verdict explains how the pair diverges, and every claim comes from a quoted rule. |
| 1:25–1:50 | Нажать **↻** в строке пары | The refresh button re-fetches both markets' prices and rules in about half a second, and flags the pair if the rules changed since we checked. |
| 1:50–2:20 | В паре с ⛓ нажать **view on Solana Explorer ↗**, показать аккаунт аттестации | The verdict is also on Solana. This is the attestation in Solana Explorer, signed by our issuer and readable by any program. |
| 2:20–2:50 | Прокрутить к блоку random sample: полосы и строка точности ИИ на held-out | And here's the honest part: a random sample and the AI's accuracy on 30 pairs it was never tuned on. Where it's unsure, it says so. |
| 2:50–3:00 | Вернуться наверх | RuleGuard: check the contract, not just the price. |

Перед записью: закрыть лишние вкладки, масштаб страницы 110–125 %, проверить, что пара с ⛓ и рабочей ссылкой на Explorer есть на экране.

---

## 3. Еженедельный видео-апдейт (~1 минута, раз в неделю)

Правила Colosseum «настоятельно рекомендуют» такие апдейты. Можно записать на телефон или экран, без монтажа. Шаблон (EN), в скобках — что подставить:

> Hi, this is [name] from RuleGuard, week [N] update.
> **Shipped:** [1–2 things, e.g. "every matched pair now has a verdict on Solana devnet, 191 attestations" / "AI accuracy on 30 unseen pairs: 7 of 7 different pairs caught"].
> **Learned:** [one finding, e.g. "the biggest price gaps keep being rule differences, not mispricing"].
> **Users:** [demand numbers: channel subscribers, teams we talked to, one quote from a trader].
> **Next week:** [1–2 goals].
> Thanks!

Готовые пункты на первую неделю (25–27.09):
- Shipped: a 4-venue pipeline (~59k markets, 187 pairs); AI rule review with verified quotes; every verdict published on Solana devnet via the Solana Attestation Service (191 attestations).
- Learned: in a random sample, only 1 of 11 cross-operator pairs had fully matching rules. On 30 unseen pairs, the AI caught 7 of 7 "different" pairs.
- Next: a human re-check of the labels, a study of closed pairs, and outreach to aggregators and traders.
