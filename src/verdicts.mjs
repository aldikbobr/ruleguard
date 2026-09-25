// Ручной разбор пар (25.09.2026, по кратким правилам Kalshi rules_primary и description Polymarket).
// Ключ: "<id на первой площадке>|<id на второй>". Выборка не случайная — см. research/FINDINGS.md.

export const VERDICTS = {
  "KXVENEZDEFACTO-27JAN01-DROD|will-delcy-rodrguez-be-the-leader-of-venezuela-end-of-2026": {
    verdict: "different",
    short: "Kalshi — фактическая власть, Polymarket — официальное назначение",
    summary: "Kalshi считает главой того, кто правит де-факто, независимо от титула. Polymarket — того, кто официально назначен и приведён к присяге (при неясности — по списку ООН).",
    scenario: "Если на конец 2026 года власть фактически у одного человека, а официальный статус у другого, рынки рассчитаются противоположно, и «арбитраж» проиграет обе ноги."
  },
  "KXVENEZDEFACTO-27JAN01-NMAD|will-nicols-maduro-be-the-leader-of-venezuela-end-of-2026": {
    verdict: "different",
    short: "Kalshi — фактическая власть, Polymarket — официальный статус",
    summary: "Та же пара правил, что и у Делси Родригес: де-факто против официального статуса.",
    scenario: "Если Мадуро официально остаётся главой, а фактически правит другой человек, Polymarket рассчитается «Да», а Kalshi — «Нет». Разница в цене отражает разные вопросы, а не ошибку рынка."
  },
  "KXPUTINZELENSKYYLOCATION-28-RUS|will-zelenskyy-and-putin-meet-next-in-russia": {
    verdict: "different",
    short: "Дедлайн: Kalshi — 2028, Polymarket — 2026",
    summary: "Kalshi: встреча до 31.12.2028. Polymarket: до 31.12.2026, а территории под контролем России (например, Крым) считаются Россией.",
    scenario: "Встреча в России в 2027 году: Polymarket рассчитывается как «встречи не было», Kalshi как «Да». Позиция YES на Polymarket + NO на Kalshi проигрывает обе ноги."
  },
  "KXTOPAI-27-JAN01-META|will-meta-have-the-best-ai-model-at-the-end-of-september-2026-20260717143137054": {
    verdict: "different",
    short: "Kalshi — №1 когда-либо до 2027, Polymarket — №1 ровно 30.09.2026",
    summary: "Kalshi: модель №1 в любой момент до 2027 года. Polymarket: №1 на arena.ai ровно 30.09.2026 в 12:00 ET.",
    scenario: "Если Meta станет №1 в ноябре 2026, Kalshi рассчитается как «Да», а Polymarket как «Нет»."
  },
  "KXTOPAI-27-JAN01-NVID|will-nvidia-have-the-best-ai-model-at-the-end-of-september-2026-20260717143137066": {
    verdict: "different",
    short: "Kalshi — №1 когда-либо до 2027, Polymarket — №1 ровно 30.09.2026",
    summary: "Как у Meta: «когда-либо до 2027» против «в конкретный момент 30.09.2026 на arena.ai».",
    scenario: "Любое лидерство после 30.09.2026 засчитывается только на Kalshi."
  },
  "KXNEXTISRAELPM-45JAN01-NBEN|will-naftali-bennett-be-the-next-prime-minister-of-israel": {
    verdict: "different",
    short: "Kalshi засчитывает временного премьера, Polymarket — нет",
    summary: "Kalshi: временно исполняющий обязанности считается; если тот же человек остаётся у власти, все исходы «Нет». Polymarket: временный не считается, рынок привязан к выборам 2026 года.",
    scenario: "Назначение временного премьера засчитывается на Kalshi и игнорируется на Polymarket."
  },
  "KXBOND-30-HAR|harris-dickinson-announced-as-next-james-bond": {
    verdict: "different",
    short: "Kalshi — утверждён до 2030, Polymarket — объявлен до конца 2026",
    summary: "Kalshi: утверждён на роль до 01.01.2030. Polymarket: официально объявлен до 31.12.2026.",
    scenario: "Объявление в 2027–2029 годах засчитывается только на Kalshi."
  },
  "KXPUTINDJTLOCATION-29-TUR|will-trump-and-putin-meet-next-in-turkey-213": {
    verdict: "different",
    short: "Дедлайн: Kalshi — 2029, Polymarket — 2026",
    summary: "Kalshi: до 01.01.2029. Polymarket: до 31.12.2026 и с подробным определением «встречи» (рукопожатие или разговор, простое присутствие в одном зале не считается).",
    scenario: "Встреча в Турции в 2027 году засчитывается только на Kalshi."
  },
  "KXGREENLAND-29-27|will-trump-acquire-greenland-before-2027": {
    verdict: "different",
    short: "Kalshi — покупка хотя бы части, Polymarket — объявление о суверенитете",
    summary: "Kalshi: США покупают хотя бы часть Гренландии. Polymarket: официальное объявление, что большая часть территории переходит под суверенитет США (сам переход может ещё не состояться).",
    scenario: "Покупка небольшого участка засчитывается на Kalshi, но не на Polymarket. Объявление о суверенитете без покупки — наоборот."
  },
  "KXNEXTROMANIAPM-45JAN01-MGEO|will-mircea-geoan-be-the-next-prime-minister-of-romania": {
    verdict: "different",
    short: "Polymarket требует вотум доверия и не засчитывает временных",
    summary: "Polymarket требует вотум доверия парламента и исключает временных премьеров, дедлайн 2027. Kalshi: «первый новый человек на посту», без явного дедлайна.",
    scenario: "Временный премьер без вотума доверия засчитывается на Kalshi (вероятно) и не засчитывается на Polymarket."
  },
  "KXISRAELPM-26OCT27-BNET|will-benjamin-netanyahu-be-the-next-prime-minister-of-israel": {
    verdict: "caveats",
    short: "Разные исходы, если объявят повторные выборы",
    summary: "Обе площадки исключают временных премьеров. Но если до формирования правительства объявят повторные выборы, Kalshi рассчитывается как «No one», а Polymarket ждёт итога следующих выборов.",
    scenario: "Повторные выборы (в Израиле такое было в 2019–2020) разводят рынки."
  },
  "KXHURPATHHAWAII-26DEC|will-a-hurricane-make-landfall-in-hawaii-before-2027-20260721182828397": {
    verdict: "caveats",
    short: "Kalshi без атолла Мидуэй, Polymarket — с ним",
    summary: "Kalshi исключает атолл Мидуэй и Северо-Западные острова, Polymarket их включает. У Kalshi срок — «сезон 2026», у Polymarket — до 31.12.2026.",
    scenario: "Ураган, вышедший на берег Мидуэя или в декабре, засчитывается только на Polymarket."
  },
  "SENATESD-26-R|will-the-republicans-win-the-south-dakota-senate-race-in-2026": {
    verdict: "caveats",
    short: "Kalshi — присяга, Polymarket — победа на выборах",
    summary: "Kalshi: республиканец приведён к присяге. Polymarket: победитель выборов по AP, Fox и NBC, партия определяется через номинанта.",
    scenario: "Расходятся только в редких случаях: оспоренный результат, смерть или отказ до присяги."
  },
  "KXFRENCHPRES-27-EPHI|will-douard-philippe-win-the-2027-french-presidential-election": {
    verdict: "caveats",
    short: "Почти одинаково; у Polymarket «Other» при задержке выборов",
    summary: "Почти одинаково. У Polymarket есть исход «Other», если результаты неизвестны к концу 2027 года.",
    scenario: "Расходятся только при сильной задержке выборов."
  },
  "KXBALLONDOR-26-LYAM|will-lamine-yamal-win-the-2026-ballon-dor": {
    verdict: "caveats",
    short: "Почти одинаково; у Polymarket «Other» при переносе церемонии",
    summary: "Почти одинаково. У Polymarket исход «Other», если приз не вручён к 31.12.2026, источник — France Football.",
    scenario: "Расходятся только при переносе или отмене церемонии."
  },
  "KXSATOSHIBTCYEAR-27|will-satoshi-move-any-bitcoin-in-2026": {
    verdict: "caveats",
    short: "Почти одинаково; у Polymarket окно начинается 09.01.2026",
    summary: "Общий источник (Arkham Intel Explorer). Окно у Polymarket начинается 09.01.2026. Если Arkham недоступен, Polymarket переходит на консенсус источников.",
    scenario: "Расходятся при недоступности Arkham или при движении монет до 09.01.2026."
  }
};
