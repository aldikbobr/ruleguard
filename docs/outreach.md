# Проверка спроса: кому писать и что

Цель до 11.10 (слайд 9 презентации): **30+** подписчиков Telegram-канала, **2–3** команды агрегаторов или ботов пробуют API, **3+** трейдера описали реальный убыток из-за разницы в правилах. Результаты записывать в таблицу внизу: это доказательства для заявки (раздел «demand validation»).

Правила: не спамить, не обещать доход, писать «informational tool, not financial advice». На Reddit сначала прочитать правила сабреддита о самопродвижении.

## Кому писать

| Кто | Где (публичные ссылки) | Зачем |
|---|---|---|
| Capitola — мета-агрегатор prediction markets, 1-е место Consumer Apps на Colosseum Cypherpunk, акселератор C4 | X: https://twitter.com/capitola_xyz · проект: https://colosseum.com/projects/explore/capitola | маршрутизирует ордера между площадками, первый кандидат на API |
| PredictionSwap — агрегатор с ИИ-аналитикой (Colosseum Breakout) | X: https://twitter.com/predictionswap | агрегатор, та же боль |
| pmxt — единое API для prediction markets | https://www.pmxt.dev/ | их пользователи сопоставляют рынки между площадками |
| PolyRouter | https://polymark.et/product/polyrouter | маршрутизация |
| Команды на DFlow (Kalshi на Solana) | через DFlow и их анонсы интеграций | фронтенды, которые показывают рынки Kalshi |
| Трейдеры | r/Kalshi, r/Polymarket, Discord-сообщества площадок, X | реальные случаи убытков |

Контакты берём только из публичных профилей. Контакты людей не собираем и никуда не записываем.

## 1. Сообщение агрегатору или команде бота (EN)

> Hi! I'm building RuleGuard for the Colosseum Crypto World's Fair: a rule-equivalence check for prediction markets. We match "the same" market across Kalshi, Polymarket and Limitless and compare the resolution rules clause by clause.
>
> Why it matters for routing: in our random sample, only 1 of 11 cross-operator pairs had fully matching rules, and the five biggest Kalshi–Polymarket spreads we found were all different contracts (de facto vs official, a deadline window vs a single moment, 2028 vs 2026).
>
> Quick question: when you route "the same" event across venues today, how do you check the two markets settle the same way? Would a free API that returns a verdict (equivalent / caveats / different) plus the divergence scenario be useful to try?

## 2. Пост для трейдеров (Reddit / Discord, EN)

Спрашиваем о прошлом поведении, а не о том, «нравится ли вам идея».

> **Have you ever lost money because Kalshi and Polymarket settled "the same" market differently?**
>
> I'm researching cross-venue rule differences (e.g. a player who doesn't play: one venue settles No, the other at the last price). Four quick questions:
> 1. When did you last trade the same event on two venues?
> 2. How did you check the rules matched, and how long did it take?
> 3. Did a rule difference ever cost you money? Roughly how much?
> 4. What do you use for this now, and do you pay for it?
>
> I'm building a free checker for this (not financial advice). Happy to share what I find.

## 3. Первые посты Telegram-канала

Формат: «пара → чем отличаются правила → при каком сценарии рынки разойдутся». Текущие цены смотреть в демо перед публикацией: цены из снимка 25.09 устарели.

**Пост 1. Венесуэла, кто у власти в конце 2026**
Kalshi считает того, кто правит фактически. Polymarket — того, кто официально назначен и принёс присягу (запасной источник — список ООН). Сценарий: если власть у одного человека, а титул у другого, рынки рассчитаются в разные стороны, и «арбитраж» проиграет с обеих сторон.

**Пост 2. У кого лучшая ИИ-модель (Meta)**
Kalshi: №1 в любой момент до 2027 года. Polymarket: №1 на arena.ai ровно 30.09.2026 в 12:00 ET. Сценарий: Meta выходит на первое место в ноябре — Kalshi платит YES, Polymarket NO.

**Пост 3. Встреча Путина и Зеленского в России**
Дедлайн на Kalshi — конец 2028, на Polymarket — конец 2026, и Polymarket считает Крым Россией. Сценарий: встреча в России в 2027 — Polymarket «встречи не было», Kalshi YES.

Подпись к каждому посту: «RuleGuard — проверка эквивалентности правил. Информация, не финансовый совет.»

## Таблица результатов

| Дата | Кто (публичный ник или команда) | Канал | Ответил? | Готов попробовать API? | Терял деньги из-за правил? Сколько? | Что сказал (коротко) |
|---|---|---|---|---|---|---|
| | | | | | | |
