// Pairs reviewed by hand (Sep 25, 2026), based on Kalshi's summary rules (rules_primary) and Polymarket's description.
// Key: "<id on the first venue>|<id on the second>". Hand-picked examples, not a random sample — see research/FINDINGS.md.

export const VERDICTS = {
  "KXVENEZDEFACTO-27JAN01-DROD|will-delcy-rodrguez-be-the-leader-of-venezuela-end-of-2026": {
    verdict: "different",
    short: "Kalshi: de facto power · Polymarket: official appointment",
    summary: "Kalshi counts whoever actually governs, regardless of title. Polymarket counts whoever is formally appointed and sworn in (falling back to the UN list if unclear).",
    scenario: "If at the end of 2026 one person holds real power and another holds the official title, the markets settle in opposite directions and the “arbitrage” loses on both legs."
  },
  "KXVENEZDEFACTO-27JAN01-NMAD|will-nicols-maduro-be-the-leader-of-venezuela-end-of-2026": {
    verdict: "different",
    short: "Kalshi: de facto power · Polymarket: official status",
    summary: "Same pair of rules as for Delcy Rodríguez: de facto power vs official status.",
    scenario: "If Maduro remains the official head of state while someone else actually governs, Polymarket settles YES and Kalshi settles NO. The price gap reflects two different questions, not a mispricing."
  },
  "KXPUTINZELENSKYYLOCATION-28-RUS|will-zelenskyy-and-putin-meet-next-in-russia": {
    verdict: "different",
    short: "Deadline — Kalshi: 2028 · Polymarket: 2026",
    summary: "Kalshi: a meeting before Dec 31, 2028. Polymarket: before Dec 31, 2026, and Russian-controlled territory (e.g. Crimea) counts as Russia.",
    scenario: "A meeting in Russia in 2027: Polymarket settles as “no meeting”, Kalshi settles YES. YES on Polymarket plus NO on Kalshi loses on both legs."
  },
  "KXTOPAI-27-JAN01-META|will-meta-have-the-best-ai-model-at-the-end-of-september-2026-20260717143137054": {
    verdict: "different",
    short: "Kalshi: #1 at any point before 2027 · Polymarket: #1 on Sep 30, 2026",
    summary: "Kalshi: a #1-ranked model at any time before 2027. Polymarket: #1 on arena.ai at exactly 12:00 PM ET on Sep 30, 2026.",
    scenario: "If Meta takes #1 in November 2026, Kalshi settles YES and Polymarket settles NO."
  },
  "KXTOPAI-27-JAN01-NVID|will-nvidia-have-the-best-ai-model-at-the-end-of-september-2026-20260717143137066": {
    verdict: "different",
    short: "Kalshi: #1 at any point before 2027 · Polymarket: #1 on Sep 30, 2026",
    summary: "Same as Meta: “any time before 2027” vs “at one moment on Sep 30, 2026 on arena.ai”.",
    scenario: "Any #1 ranking after Sep 30, 2026 counts only on Kalshi."
  },
  "KXNEXTISRAELPM-45JAN01-NBEN|will-naftali-bennett-be-the-next-prime-minister-of-israel": {
    verdict: "different",
    short: "Kalshi counts an interim PM · Polymarket doesn't",
    summary: "Kalshi: an acting or interim PM counts, and if the same person stays in office every outcome resolves NO. Polymarket: interim PMs don't count, and the market is tied to the 2026 election.",
    scenario: "An interim PM appointment counts on Kalshi and is ignored on Polymarket."
  },
  "KXBOND-30-HAR|harris-dickinson-announced-as-next-james-bond": {
    verdict: "different",
    short: "Kalshi: cast before 2030 · Polymarket: announced by end of 2026",
    summary: "Kalshi: cast in the role before Jan 1, 2030. Polymarket: officially announced by Dec 31, 2026.",
    scenario: "An announcement in 2027–2029 counts only on Kalshi."
  },
  "KXPUTINDJTLOCATION-29-TUR|will-trump-and-putin-meet-next-in-turkey-213": {
    verdict: "different",
    short: "Deadline — Kalshi: 2029 · Polymarket: 2026",
    summary: "Kalshi: before Jan 1, 2029. Polymarket: by Dec 31, 2026, with a detailed definition of a “meeting” (a handshake or conversation; merely being in the same room doesn't count).",
    scenario: "A meeting in Turkey in 2027 counts only on Kalshi."
  },
  "KXGREENLAND-29-27|will-trump-acquire-greenland-before-2027": {
    verdict: "different",
    short: "Kalshi: buys any part · Polymarket: sovereignty announced",
    summary: "Kalshi: the US purchases at least part of Greenland. Polymarket: an official announcement that most of the territory will come under US sovereignty (the transfer itself may not have happened yet).",
    scenario: "Buying a small parcel counts on Kalshi but not on Polymarket; a sovereignty announcement without a purchase is the reverse."
  },
  "KXNEXTROMANIAPM-45JAN01-MGEO|will-mircea-geoan-be-the-next-prime-minister-of-romania": {
    verdict: "different",
    short: "Polymarket requires a confidence vote and excludes interim PMs",
    summary: "Polymarket requires a parliamentary confidence vote, excludes interim PMs and has a 2027 deadline. Kalshi: “the first new person to hold the office”, with no explicit deadline.",
    scenario: "An interim PM without a confidence vote likely counts on Kalshi and does not count on Polymarket."
  },
  "KXISRAELPM-26OCT27-BNET|will-benjamin-netanyahu-be-the-next-prime-minister-of-israel": {
    verdict: "caveats",
    short: "Different outcomes if a repeat election is called",
    summary: "Both exclude interim PMs. But if a repeat election is called before a government forms, Kalshi resolves to “No one” while Polymarket waits for the next election's result.",
    scenario: "A repeat election (Israel had several in 2019–2020) splits the two markets."
  },
  "KXHURPATHHAWAII-26DEC|will-a-hurricane-make-landfall-in-hawaii-before-2027-20260721182828397": {
    verdict: "caveats",
    short: "Kalshi excludes Midway Atoll · Polymarket includes it",
    summary: "Kalshi excludes Midway Atoll and the Northwestern Islands; Polymarket includes them. Kalshi covers “the 2026 hurricane season”, Polymarket runs to Dec 31, 2026.",
    scenario: "A landfall on Midway, or in December, counts only on Polymarket."
  },
  "SENATESD-26-R|will-the-republicans-win-the-south-dakota-senate-race-in-2026": {
    verdict: "caveats",
    short: "Kalshi: sworn in · Polymarket: wins the election",
    summary: "Kalshi: a Republican is sworn in. Polymarket: the election winner as called by AP, Fox and NBC, with party defined by nomination.",
    scenario: "They split only in rare cases: a contested result, or death or withdrawal before the swearing-in."
  },
  "KXFRENCHPRES-27-EPHI|will-douard-philippe-win-the-2027-french-presidential-election": {
    verdict: "caveats",
    short: "Nearly identical; Polymarket has “Other” if the election is delayed",
    summary: "Nearly identical. Polymarket resolves to “Other” if the result isn't known by the end of 2027.",
    scenario: "They split only if the election is badly delayed."
  },
  "KXBALLONDOR-26-LYAM|will-lamine-yamal-win-the-2026-ballon-dor": {
    verdict: "caveats",
    short: "Nearly identical; Polymarket has “Other” if the ceremony slips",
    summary: "Nearly identical. Polymarket resolves to “Other” if no winner is announced by Dec 31, 2026; its source is France Football.",
    scenario: "They split only if the ceremony is postponed or cancelled."
  },
  "KXSATOSHIBTCYEAR-27|will-satoshi-move-any-bitcoin-in-2026": {
    verdict: "caveats",
    short: "Nearly identical; Polymarket's window starts Jan 9, 2026",
    summary: "Same source (Arkham Intel Explorer). Polymarket's window starts Jan 9, 2026, and it falls back to a consensus of sources if Arkham goes offline.",
    scenario: "They split if Arkham is unavailable or if coins moved before Jan 9, 2026."
  }
};
