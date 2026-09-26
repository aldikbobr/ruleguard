# Перепроверка разметки: 60 пар (вслепую)

Зачем: все цифры точности сейчас с оговоркой «разметку делал ИИ, человек не перепроверял». Если человек разметит эти 60 пар сам, цифры станут «проверено человеком», и это сильно добавляет доверия у судей. Задача № 12 в `ПЛАН_ДО_ПОДАЧИ.md`.

**Как заполнять** (прямо на GitHub: открыть файл → ✏️ Edit → Commit changes):
1. Для каждой пары откройте обе ссылки или разверните «Rules» и прочитайте правила расчёта.
2. В таблице в конце файла впишите в колонку «Your label» одно из трёх:
   - **equivalent**: правила совпадают по сути;
   - **caveats**: совпадают, кроме редких крайних случаев или времени расчёта;
   - **different**: есть правдоподобный сценарий, при котором рынки рассчитаются по-разному.
3. В «Note» коротко напишите, чем отличаются правила (по-русски или по-английски).

Метки ИИ и прошлую разметку здесь **специально не показываем**, чтобы не влиять на ваше решение. Сравнение и пересчёт точности сделает чат «RuleGuard».

Правила — снимок от 25.09.2026. Если на сайте площадки текст уже другой, размечайте по тексту из «Rules» ниже.


## Выборка «random» (30 пар)

### R1. Titans vs. Giants

- **Polymarket:** [Titans vs. Giants](https://polymarket.com/market/nfl-ten-nyg-2026-09-27) · closes 2026-09-27
- **Limitless:** [Titans vs. Giants](https://limitless.exchange/markets/titans-vs-giants-1790010331995) · closes 2026-09-28

<details><summary>Rules — Polymarket</summary>

<pre>In the upcoming NFL game, scheduled for September 27 at 1:00PM ET:
If Titans wins, the market will resolve to "Titans".
If Giants wins, the market will resolve to "Giants".
If the game is postponed, this market will remain open until the game has been completed.
If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.

Resolution source: https://www.nfl.com/scores</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>In the upcoming NFL game, scheduled for September 27 at 1:00PM ET:
 If Titans wins, the market will resolve to "Titans".
 If Giants wins, the market will resolve to "Giants".
 If the game is postponed, this market will remain open until the game has been completed.
 If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.</pre>

</details>

### R2. Will the US confirm that aliens exist by September 30? — September 30

- **Polymarket:** [Will the US confirm that aliens exist by September 30? — September 30](https://polymarket.com/market/will-the-us-confirm-that-aliens-exist-by-september-30-396) · closes 2027-01-01
- **Limitless:** [Will the US confirm that aliens exist by...? — September 30](https://limitless.exchange/markets/will-the-us-confirm-that-aliens-exist-by-1787671443088) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to "Yes" if the President of the United States, any member of the Cabinet of the United States, any member of the Joint Chiefs of Staff, or any US federal agency definitively states that extraterrestrial life or technology exists by September 30, 2026, 11:59 PM ET. Otherwise, this market will resolve to "No".

The primary resolution source for this market will be official information from the government of the United States, however a consensus of credible reporting will also be used.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to "Yes" if the President of the United States, any member of the Cabinet of the United States, any member of the Joint Chiefs of Staff, or any US federal agency definitively states that extraterrestrial life or technology exists by September 30, 2026, 11:59 PM ET. Otherwise, this market will resolve to "No".

 The primary resolution source for this market will be official information from the government of the United States, however a consensus of credible reporting will also be used.</pre>

</details>

### R3. Will Democratics win the Senate race in Kansas? — Adam Hamilton

- **Kalshi:** [Will Democratics win the Senate race in Kansas? — Adam Hamilton](https://kalshi.com/markets/senateks) · closes 2027-11-03
- **Polymarket:** [Will the Democrats win the Kansas Senate race in 2026? — Adam Hamilton (D)](https://polymarket.com/market/will-the-democrats-win-the-kansas-senate-race-in-2026)

<details><summary>Rules — Kalshi</summary>

<pre>If a representative of the Democratic party is sworn in as a Senator of Kansas for the term beginning in 2027, then the market resolves to Yes.

This market is eligible for accelerated determination after a consensus of media organizations project the winner. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the winner of the 2026 midterm Kansas U.S. Senate election, inclusive of any run-offs.

A candidate shall be considered to represent a party in the event that he or she is the nominee of the party in question. Candidates other than the Democratic or Republican nominee (e.g., Greens, Libertarian, independent) may be added at a later date.

Candidates who run as independents will not be encompassed by the “Democrat” or “Republican” options regardless of any affiliation they may have with the party.

The candidates may be named in the contract for the convenience of traders. In the event that any named candidate is replaced as the nominee of their respective party prior to election day, the name in the contract will be updated and the market will resolve based on the replacement nominee of the party.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race in this state for the same candidate, this market will resolve based on the official certification.</pre>

</details>

### R4. Will J.D. Vance be the nominee for the Presidency for the Republican party? — J.D. Vance

- **Kalshi:** [Will J.D. Vance be the nominee for the Presidency for the Republican party? — J.D. Vance](https://kalshi.com/markets/kxpresnomr) · closes 2028-11-07
- **Limitless:** [Republican Presidential Nominee 2028 — J.D. Vance](https://limitless.exchange/markets/republican-presidential-nominee-2028-1768931335047) · closes 2028-11-08

<details><summary>Rules — Kalshi</summary>

<pre>If J.D. Vance wins and accepts the nomination for the Presidency for the Republican party in 2028, then the market resolves to Yes.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to “Yes” if the named individual wins and accepts the 2028 nomination of the Republican Party for U.S. president. Otherwise, this market will resolve to “No”. 
 The resolution source for this market will be a consensus of official Republican Party sources. 
 Any replacement of the Republican nominee before election day will not change the resolution of the market.</pre>

</details>

### R5. Will Bitcoin dip to $76,000 September 21-27? — ↓ 76,000

- **Polymarket:** [Will Bitcoin dip to $76,000 September 21-27? — ↓ 76,000](https://polymarket.com/market/will-bitcoin-dip-to-76k-september-21-27-2026) · closes 2026-09-28
- **Limitless:** [What price will Bitcoin hit September 21-27? — ↓ 76,000](https://limitless.exchange/markets/what-price-will-bitcoin-hit-september-21-27-2026-1789963519673) · closes 2026-09-28

<details><summary>Rules — Polymarket</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for Bitcoin (BTC/USDT) during the date range specified in the title (from 12:00 AM ET on the first date to 11:59 PM ET on the last) has a final "Low" price equal to or lower than the price specified in the title. Otherwise, this market will resolve to "No."

The resolution source for this market is Binance, specifically the BTC/USDT "Low" prices available at https://www.binance.com/en/trade/BTC_USDT, with the chart settings on "1m" candles selected on the top bar.

Please note that the outcome of this market depends solely on the price data from the Binance BTC/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for Bitcoin (BTC/USDT) during the date range specified in the title (from 12:00 AM ET on the first date to 11:59 PM ET on the last) has a final "Low" price equal to or lower than the price specified in the title. Otherwise, this market will resolve to "No."

 The resolution source for this market is Binance, specifically the BTC/USDT "Low" prices available at https://www.binance.com/en/trade/BTC_USDT , with the chart settings on "1m" candles selected on the top bar.

 Please note that the outcome of this market depends solely on the price data from the Binance BTC/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

### R6. Will Aleksandar Vučić become Prime Minister of Serbia following the next Serbian general election? — Aleksandar Vučić

- **Kalshi:** [Will Aleksandar Vučić become Prime Minister of Serbia following the next Serbian general election? — Aleksandar Vučić](https://kalshi.com/markets/kxserbiapm) · closes 2028-12-31
- **Polymarket:** [Will Aleksandar Vučić be the next Prime Minister of Serbia? — Aleksandar Vučić](https://polymarket.com/market/will-aleksandar-vucic-be-the-next-prime-minister-of-serbia-20260629223938643) · closes 2028-06-30

<details><summary>Rules — Kalshi</summary>

<pre>If Aleksandar Vučić becomes Prime Minister of Serbia as a result of government formation following the next Serbian general election and meets all constitutional requirements before Dec 31, 2028, then the market resolves to Yes.

The market resolves to the first person who, as a result of government formation following the election, is formally appointed, sworn in, or invested as Prime Minister according to the country's constitutional procedures, commands the confidence of the parliament/legislature, and exercises the full powers of the office (not serving in a caretaker/acting capacity from the previous government).

If no government forms by Dec 31, 2028, the Contract resolves to "No one" if that is an option and No for all other strikes. If new elections are called before government formation, the Contract resolves to "No one" immediately and No for all other strikes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to the next individual who officially assumes the office of Prime Minister of Serbia by June 30, 2028, 11:59 PM ET.

To count for resolution, the individual must be elected by the National Assembly and be formally sworn-in, resulting in the official formation of a new government. Any interim or caretaker Prime Minister who is not elected by the National Assembly will not count toward the resolution of this market.

If no such Prime Minister takes office by June 30, 2028, 11:59 PM ET, this market will resolve to “Other”.

This market will resolve based on a consensus of credible reporting. If there is ambiguity, this market will resolve solely based on official information from the Serbian government.</pre>

</details>

### R7. Will Benjamin Netanyahu become Prime Minister of Israel following the 2026 Israeli legislative election? — Benjamin Netanyahu

- **Kalshi:** [Will Benjamin Netanyahu become Prime Minister of Israel following the 2026 Israeli legislative election? — Benjamin Netanyahu](https://kalshi.com/markets/kxisraelpm) · closes 2027-10-27
- **Polymarket:** [Will Benjamin Netanyahu be the next Prime Minister of Israel? — Benjamin Netanyahu](https://polymarket.com/market/will-benjamin-netanyahu-be-the-next-prime-minister-of-israel) · closes 2026-10-27

<details><summary>Rules — Kalshi</summary>

<pre>If Benjamin Netanyahu becomes Prime Minister of Israel as a result of government formation following the 2026 Israeli legislative election and meets all constitutional requirements before Oct 27, 2027, then the market resolves to Yes.

The market resolves to the first person who, as a result of government formation following the election, is formally appointed, sworn in, or invested as Prime Minister according to the country's constitutional procedures, commands the confidence of the parliament/legislature, and exercises the full powers of the office (not serving in a caretaker/acting capacity from the previous government).

If no government forms by Oct 27, 2027, the Contract resolves to "No one" if that is an option and No for all other strikes. If new elections are called before government formation, the Contract resolves to "No one" immediately and No for all other strikes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>Legislative elections are schedule to be held in Israel on October 27, 2026. 

This market will resolve to the next individual who is officially appointed and sworn in as Prime Minister of Israel following the 2026 parliamentary election. If an election is called early, this market will immediately resolve to the individual who is officially appointed and sworn in after that election.

To count for resolution, the individual must be formally sworn in. Any interim or caretaker Prime Minister will not count toward the resolution of this market.

If no such Prime Minister is sworn in by December 31, 2027, 11:59 PM ET, this market will resolve to “Other”.

The primary resolution source for this market will be official information from the Government of Israel; however, a consensus of credible reporting may also be used.</pre>

</details>

### R8. US announces end of Iranian blockade by September 30, 2026? — September 30

- **Polymarket:** [US announces end of Iranian blockade by September 30, 2026? — September 30](https://polymarket.com/market/us-announces-end-of-iranian-blockade-by-september-30-2026-20260727171615364-722-649-646-561-213-644-414-831) · closes 2026-10-01
- **Limitless:** [US announces end of Iranian blockade by...? — September 30](https://limitless.exchange/markets/us-announces-end-of-iranian-blockade-by-1787654335165) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>On July 13, 2026, Trump announced the United States would reinstate its naval blockade of Iran, targeting Iranian ships and customers.

This market will resolve to “Yes” if the United States government, or an authorized representative of the United States government, publicly and officially announces the end, termination, lifting, or suspension of the United States’ naval blockade on Iranian ships and ships of Iranian customers, between market creation and the specified date, 11:59 PM ET. Otherwise, this market will resolve to “No”.

An announcement qualifies if it communicates that the United States will generally cease blocking vessel traffic for Iranian ships and customers, including an announcement that the blockade will not take effect at all, even if some restrictions remain (for example, an imposition of fees). An announcement does not qualify if it reflects only a limited or partial change that stops short of a general end or suspension of the blockade, for example, an exemption for a specific vessel, cargo, or port.

A qualifying announcement must be a declarative statement of the United States government’s present termination or suspension of the blockade, previously-unannounced prior termination or suspension of the blockade, or definitive decision to terminate or suspend the blockade.

A qualifying announcement must clearly and unambiguously identify the end or suspension of the blockade. Statements that merely allude to, reference, or describe an end to the blockade, without clearly communicating it, do not qualify. The announcement need not use specific terminology or reference the end of a blockade by name; an announcement of a resumption of prior obligations, the maintenance of a status quo, or a return to a previously agreed baseline qualifies, provided the substantive policy of ending or suspending the blockade is clearly and unambiguously communicated.

A qualifying announcement must be made through official channels, by an individual acting in an official capacity. Statements made incidentally or informally in a context not intended for official communication do not qualify.

The following do not qualify:

Anonymous, unattributed, or leaked statements not confirmed as official;
Statements by persons not authorized to speak for the United States government;
Third-party speculation, analysis, or predictions that the United States government will announce or implement an end to the blockade;
Satirical, fabricated, hacked, or impersonated communications; and
Statements that describe a prospective, contingent, probable, or conditional end to the blockade rather than announcing a present and decided position.

Once a qualifying announcement is made, this market will resolve to “Yes” regardless of whether it is later reversed, or whether the blockade actually ends in practice.

Resolution will be based on official information from the United States government, including the President, the Department of Defense, the Department of State, and United States Central Command (CENTCOM), or the official representatives of the United States government.
</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>On July 13, 2026, Trump announced the United States would reinstate its naval blockade of Iran, targeting Iranian ships and customers.
 This market will resolve to “Yes” if the United States government, or an authorized representative of the United States government, publicly and officially announces the end, termination, lifting, or suspension of the United States’ naval blockade on Iranian ships and ships of Iranian customers, between market creation and the specified date, 11:59 PM ET. Otherwise, this market will resolve to “No”.
 An announcement qualifies if it communicates that the United States will generally cease blocking vessel traffic for Iranian ships and customers, including an announcement that the blockade will not take effect at all, even if some restrictions remain (for example, an imposition of fees). An announcement does not qualify if it reflects only a limited or partial change that stops short of a general end or suspension of the blockade, for example, an exemption for a specific vessel, cargo, or port.
 A qualifying announcement must be a declarative statement of the United States government’s present termination or suspension of the blockade, previously-unannounced prior termination or suspension of the blockade, or definitive decision to terminate or suspend the blockade.
 A qualifying announcement must clearly and unambiguously identify the end or suspension of the blockade. Statements that merely allude to, reference, or describe an end to the blockade, without clearly communicating it, do not qualify. The announcement need not use specific terminology or reference the end of a blockade by name; an announcement of a resumption of prior obligations, the maintenance of a status quo, or a return to a previously agreed baseline qualifies, provided the substantive policy of ending or suspending the blockade is clearly and unambiguously communicated.
 A qualifying announcement must be made through official channels, by an individual acting in an official capacity. Statements made incidentally or informally in a context not intended for official communication do not qualify.
 The following do not qualify:
 Anonymous, unattributed, or leaked statements not confirmed as official;
 Statements by persons not authorized to speak for the United States government;
 Third-party speculation, analysis, or predictions that the United States government will announce or implement an end to the blockade;
 Satirical, fabricated, hacked, or impersonated communications; and
 Statements that describe a prospective, contingent, probable, or conditional end to the blockade rather than announcing a present and decided position.
 Once a qualifying announcement is made, this market will resolve to “Yes” regardless of whether it is later reversed, or whether the blockade actually ends in practice.
 Resolution will be based on official information from the United States government, including the President, the Department of Defense, the Department of State, and United States Central Command (CENTCOM), or the official representatives of the United States government.</pre>

</details>

### R9. Iran charges Hormuz fees by December 31? — December 31

- **Polymarket:** [Iran charges Hormuz fees by December 31? — December 31](https://polymarket.com/market/iran-charges-hormuz-fees-by-december-31-20260706203029175-553) · closes 2027-01-01
- **Limitless:** [Iran charges Hormuz fees by...? — December 31](https://limitless.exchange/markets/iran-charges-hormuz-fees-by-1787660046607) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>This market resolves to “Yes” if the Iranian government officially announces and begins collecting fees, tolls, charges, tariffs, or similar payments from commercial vessels which are mandatory for passage through or access to the Strait of Hormuz between market creation and the specified date, 11:59 PM ET. Otherwise, this market resolves to “No.”

A qualifying fee must be an announced policy which applies generally to all commercial vessels, or a defined subcategory of commercial vessels (e.g., vessels flagged to the US and its allies). Isolated demanded charges will not qualify.

A fee is mandatory if, in practice, affected commercial vessels cannot transit or access the Strait of Hormuz without paying it, regardless of whether Iran characterizes the payment as voluntary or a fee for services. Fees described as tolls, maritime fees, service charges, environmental fees, security fees, insurance charges, etc. will qualify provided they are recognized as mandatory for passage through or access to the Strait of Hormuz by a consensus of credible reporting (e.g., a mandatory insurance fee charged by the Iranian Persian Gulf Strait Authority would qualify).

Both of the following are required to occur prior to the specified date, 11:59 PM ET to satisfy this market’s resolution criteria:
1) An official announcement from the Iranian government that such a fee is being, or will be, implemented.
2) A consensus of credible reporting that collection of the fee has begun.

Fees charged by Oman, the United Arab Emirates, shipping insurers, private companies, or other non-Iranian entities do not qualify unless charged jointly with Iran, or if Iran directly receives the fee or controls the charging entity. Normal port fees, customs duties, sanctions-related costs, or shipping surcharges do not alone qualify. 

The resolution sources will be official announcements from the government of Iran and consensus of credible reporting.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market resolves to “Yes” if the Iranian government officially announces and begins collecting fees, tolls, charges, tariffs, or similar payments from commercial vessels which are mandatory for passage through or access to the Strait of Hormuz between market creation and the specified date, 11:59 PM ET. Otherwise, this market resolves to “No.”

 A qualifying fee must be an announced policy which applies generally to all commercial vessels, or a defined subcategory of commercial vessels (e.g., vessels flagged to the US and its allies). Isolated demanded charges will not qualify.

 A fee is mandatory if, in practice, affected commercial vessels cannot transit or access the Strait of Hormuz without paying it, regardless of whether Iran characterizes the payment as voluntary or a fee for services. Fees described as tolls, maritime fees, service charges, environmental fees, security fees, insurance charges, etc. will qualify provided they are recognized as mandatory for passage through or access to the Strait of Hormuz by a consensus of credible reporting (e.g., a mandatory insurance fee charged by the Iranian Persian Gulf Strait Authority would qualify).

 Both of the following are required to occur prior to the specified date, 11:59 PM ET to satisfy this market’s resolution criteria:
 1) An official announcement from the Iranian government that such a fee is being, or will be, implemented.
 2) A consensus of credible reporting that collection of the fee has begun.

 Fees charged by Oman, the United Arab Emirates, shipping insurers, private companies, or other non-Iranian entities do not qualify unless charged jointly with Iran, or if Iran directly receives the fee or controls the charging entity. Normal port fees, customs duties, sanctions-related costs, or shipping surcharges do not alone qualify. 

 The resolution sources will be official announcements from the government of Iran and consensus of credible reporting.</pre>

</details>

### R10. Panthers vs. Browns

- **Polymarket:** [Panthers vs. Browns](https://polymarket.com/market/nfl-car-cle-2026-09-27) · closes 2026-09-27
- **Limitless:** [Panthers vs. Browns](https://limitless.exchange/markets/panthers-vs-browns-1790010321196) · closes 2026-09-28

<details><summary>Rules — Polymarket</summary>

<pre>In the upcoming NFL game, scheduled for September 27 at 1:00PM ET:
If Panthers wins, the market will resolve to "Panthers".
If Browns wins, the market will resolve to "Browns".
If the game is postponed, this market will remain open until the game has been completed.
If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.

Resolution source: https://www.nfl.com/scores</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>In the upcoming NFL game, scheduled for September 27 at 1:00PM ET:
 If Panthers wins, the market will resolve to "Panthers".
 If Browns wins, the market will resolve to "Browns".
 If the game is postponed, this market will remain open until the game has been completed.
 If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.</pre>

</details>

### R11. Will Marine Le Pen win the 2027 French presidential election? — Marine Le Pen

- **Kalshi:** [Will Marine Le Pen win the 2027 French presidential election? — Marine Le Pen](https://kalshi.com/markets/kxfrenchpres) · closes 2028-05-30
- **Polymarket:** [Will Marine Le Pen win the 2027 French presidential election? — Marine Le Pen](https://polymarket.com/market/will-marine-le-pen-win-the-2027-french-presidential-election) · closes 2028-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If Marine Le Pen wins the next French presidential election, then the market resolves to Yes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>The next French presidential election is currently expected to be held around April 2027.  This market pertains to the outcome of the next French presidential election, regardless of whether it follows the scheduled end of the current term or is held earlier. 

The President of France is elected via a two-round system; a candidate must secure over 50% of the vote to win outright in the first round. If no candidate achieves this, the top two contenders advance to a runoff.

This market will resolve according to the candidate who wins this election.

This market includes any potential second round. If, for any reason, the results of the election are not known by December 31, 2027, 11:59 PM ET, this market will resolve to "Other".

This market will resolve based on the result of the election as indicated by a consensus of credible reporting. If there is ambiguity, this market will resolve based solely on the official results as reported by the French Government, specifically the Ministry of the Interior (https://www.interieur.gouv.fr/).</pre>

</details>

### R12. Will Ethereum reach $3,300 in September? — ↑ 3,300

- **Polymarket:** [Will Ethereum reach $3,300 in September? — ↑ 3,300](https://polymarket.com/market/will-ethereum-reach-3300-in-september-2026) · closes 2026-10-01
- **Limitless:** [What price will Ethereum hit in September? — ↑ 3,300](https://limitless.exchange/markets/what-price-will-ethereum-hit-in-september-2026-p) · closes 2026-10-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for ETH/USDT during the month specified in the title (from 00:00 AM ET on the first day to 11:59 PM ET on the last), has a final High price equal to or greater than the price specified in the title. Otherwise, this market will resolve to "No."

The resolution source for this market is Binance, specifically the ETH/USDT High prices available at https://www.binance.com/en/trade/ETH_USDT, with the chart settings on "1m" for one-minute candles selected on the top bar.

Please note that the outcome of this market depends solely on the price data from the Binance ETH/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for ETH/USDT during the month specified in the title (from 00:00 AM ET on the first day to 11:59 PM ET on the last), has a final High price equal to or greater than the price specified in the title. Otherwise, this market will resolve to "No."

 The resolution source for this market is Binance, specifically the ETH/USDT High prices available at https://www.binance.com/en/trade/ETH_USDT , with the chart settings on "1m" for one-minute candles selected on the top bar.

 Please note that the outcome of this market depends solely on the price data from the Binance ETH/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

### R13. Will Republican win the House race for VT-AL? — Gerald Malloy

- **Kalshi:** [Will Republican win the House race for VT-AL? — Gerald Malloy](https://kalshi.com/markets/kxhouserace) · closes 2027-11-03
- **Polymarket:** [Will the Republican Party win the VT-AL House seat? — Gerald Malloy (R)](https://polymarket.com/market/will-the-republican-party-win-the-vt-al-house-seat) · closes 2026-11-04

<details><summary>Rules — Kalshi</summary>

<pre>If the House member sworn in for VT-AL for the term beginning in 2027 is a member of the Republican Party, then the market resolves to Yes.

This market is eligible for accelerated determination after a consensus of media organizations project the winner. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the party of the candidate who wins the VT-AL congressional district seat in the U.S. House of Representatives in the 2026 midterm elections. The midterm elections will take place on November 3, 2026.

​A candidate's party will be determined by their ballot-listed or otherwise identifiable affiliation with that party at the time all of the 2026 House elections are conclusively called by this market's resolution sources. A candidate without a ballot-listed affiliation to either the Democrat or Republican parties will be considered a member of one of these parties based on the party with which they most recently expressed their intent to caucus at the time all of the House elections are conclusively called by this market's resolution sources.

This market will resolve based on the result of the election as indicated by a consensus of credible reporting. If there is ambiguity, this market will resolve based solely on the official results as reported by the United States government, specifically the Federal Election Commission (https://www.fec.gov/).</pre>

</details>

### R14. Eagles vs. Bears

- **Polymarket:** [Eagles vs. Bears](https://polymarket.com/market/nfl-phi-chi-2026-09-29) · closes 2026-09-29
- **Limitless:** [Eagles vs. Bears](https://limitless.exchange/markets/eagles-vs-bears-1790122806772) · closes 2026-09-30

<details><summary>Rules — Polymarket</summary>

<pre>In the upcoming NFL game, scheduled for September 28 at 8:15PM ET:
If Eagles wins, the market will resolve to "Eagles".
If Bears wins, the market will resolve to "Bears".
If the game is postponed, this market will remain open until the game has been completed.
If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.

Resolution source: https://www.nfl.com/scores</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>In the upcoming NFL game, scheduled for September 28 at 8:15PM ET:
 If Eagles wins, the market will resolve to "Eagles".
 If Bears wins, the market will resolve to "Bears".
 If the game is postponed, this market will remain open until the game has been completed.
 If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.</pre>

</details>

### R15. Will Gadi Eizenkot be the next Prime Minister of Israel? — Gadi Eizenkot

- **Polymarket:** [Will Gadi Eizenkot be the next Prime Minister of Israel? — Gadi Eizenkot](https://polymarket.com/market/will-gadi-eizenkot-be-the-next-prime-minister-of-israel) · closes 2026-10-27
- **Limitless:** [Who will be the next Prime Minister of Israel after next election? — Gadi Eizenkot](https://limitless.exchange/markets/who-will-be-the-next-prime-minister-of-israel-after-next-election-1769099103917) · closes 2028-01-01

<details><summary>Rules — Polymarket</summary>

<pre>Legislative elections are schedule to be held in Israel on October 27, 2026. 

This market will resolve to the next individual who is officially appointed and sworn in as Prime Minister of Israel following the 2026 parliamentary election. If an election is called early, this market will immediately resolve to the individual who is officially appointed and sworn in after that election.

To count for resolution, the individual must be formally sworn in. Any interim or caretaker Prime Minister will not count toward the resolution of this market.

If no such Prime Minister is sworn in by December 31, 2027, 11:59 PM ET, this market will resolve to “Other”.

The primary resolution source for this market will be official information from the Government of Israel; however, a consensus of credible reporting may also be used.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>Legislative elections are schedule to be held in Israel on October 27, 2026.
 This market will resolve to the next individual who is officially appointed and sworn in as Prime Minister of Israel following the 2026 parliamentary election. If an election is called early, this market will immediately resolve to the individual who is officially appointed and sworn in after that election.
 To count for resolution, the individual must be formally sworn in. Any interim or caretaker Prime Minister will not count toward the resolution of this market.
 If no such Prime Minister is sworn in by December 31, 2027, 11:59 PM ET, this market will resolve to “Other”.
 The primary resolution source for this market will be official information from the Government of Israel; however, a consensus of credible reporting may also be used.</pre>

</details>

### R16. US-Iran Hormuz Agreement by September 30? — September 30

- **Polymarket:** [US-Iran Hormuz Agreement by September 30? — September 30](https://polymarket.com/market/us-iran-hormuz-agreement-by-september-30) · closes 2026-10-01
- **Limitless:** [US-Iran Hormuz Agreement by...? — September 30](https://limitless.exchange/markets/us-iran-hormuz-agreement-by-1787666375367) · closes 2026-10-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to “Yes” if a diplomatic agreement between the United States and Iran over traffic in the strait of Hormuz is announced by the specified date, 11:59 PM ET.

A diplomatic agreement refers to an official agreement, treaty, deal, or substantially similar diplomatic instrument that establishes agreed actions, policies, obligations, or commitments between the United States and Iran.

A qualifying diplomatic agreement must establish Iranian policies, obligations, or commitments  aimed at permitting, restoring, or increasing vessel or shipping traffic through the Strait of Hormuz.

All listed countries must announce their acceptance of the same qualifying diplomatic agreement for the Payout Condition to be met. A joint announcement will qualify, as will separate announcements from each entity of its own acceptance of an agreement which, taken together, directly indicate that all the listed countries accepted the same agreement. Separate announcements of individual policies will not qualify if the policies are not announced as part of a diplomatic agreement.

Each announcement must be a declarative statement that clearly and unambiguously communicates acceptance of an agreement. Statements that reference ongoing negotiations or a prospective agreement, or that allude to or express support for an agreement without confirming acceptance of the agreement, do not qualify. A qualifying announcement need not reference the agreement by name or use specific terminology, provided it clearly communicates acceptance of an agreement.
 
Whether announcements from the listed countries represent a diplomatic agreement and whether such an agreement qualifies will be primarily determined through the announcements themselves. Where an announcement is made by all listed countries but, based on the announcements, it remains ambiguous whether the announcements represent a qualifying diplomatic agreement between the countries, this market will remain open until either i) definitive confirmation that the announcements represent a qualifying diplomatic agreement between the listed entities is achieved through further announcements from the listed countries or a consensus of credible reporting or ii) 14 calendar days (ET) have passed after the date that the last country made their first potentially qualifying announcement. If, at the end of the fourteenth calendar day, no definitive confirmation has been achieved, this market will resolve based on the totality of information available from the resolution sources at that time. No single statement, denial, or presentation of evidence will govern where it is contradicted by the totality of information.

The resolution sources for this market will be official information from the governments of the United States and Iran and a consensus of credible reporting.
</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to “Yes” if a diplomatic agreement between the United States and Iran over traffic in the strait of Hormuz is announced by the specified date, 11:59 PM ET.

 A diplomatic agreement refers to an official agreement, treaty, deal, or substantially similar diplomatic instrument that establishes agreed actions, policies, obligations, or commitments between the United States and Iran.

 A qualifying diplomatic agreement must establish Iranian policies, obligations, or commitments aimed at permitting, restoring, or increasing vessel or shipping traffic through the Strait of Hormuz.

 All listed countries must announce their acceptance of the same qualifying diplomatic agreement for the Payout Condition to be met. A joint announcement will qualify, as will separate announcements from each entity of its own acceptance of an agreement which, taken together, directly indicate that all the listed countries accepted the same agreement. Separate announcements of individual policies will not qualify if the policies are not announced as part of a diplomatic agreement.

 Each announcement must be a declarative statement that clearly and unambiguously communicates acceptance of an agreement. Statements that reference ongoing negotiations or a prospective agreement, or that allude to or express support for an agreement without confirming acceptance of the agreement, do not qualify. A qualifying announcement need not reference the agreement by name or use specific terminology, provided it clearly communicates acceptance of an agreement.

 Whether announcements from the listed countries represent a diplomatic agreement and whether such an agreement qualifies will be primarily determined through the announcements themselves. Where an announcement is made by all listed countries but, based on the announcements, it remains ambiguous whether the announcements represent a qualifying diplomatic agreement between the countries, this market will remain open until either i) definitive confirmation that the announcements represent a qualifying diplomatic agreement between the listed entities is achieved through further announcements from the listed countries or a consensus of credible reporting or ii) 14 calendar days (ET) have passed after the date that the last country made their first potentially qualifying announcement. If, at the end of the fourteenth calendar day, no definitive confirmation has been achieved, this market will resolve based on the totality of information available from the resolution sources at that time. No single statement, denial, or presentation of evidence will govern where it is contradicted by the totality of information.

 The resolution sources for this market will be official information from the governments of the United States and Iran and a consensus of credible reporting.</pre>

</details>

### R17. Texans vs. Colts

- **Polymarket:** [Texans vs. Colts](https://polymarket.com/market/nfl-hou-ind-2026-09-27) · closes 2026-09-27
- **Limitless:** [Texans vs. Colts](https://limitless.exchange/markets/texans-vs-colts-1790010328042) · closes 2026-09-28

<details><summary>Rules — Polymarket</summary>

<pre>In the upcoming NFL game, scheduled for September 27 at 1:00PM ET:
If Texans wins, the market will resolve to "Texans".
If Colts wins, the market will resolve to "Colts".
If the game is postponed, this market will remain open until the game has been completed.
If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.

Resolution source: https://www.nfl.com/scores</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>In the upcoming NFL game, scheduled for September 27 at 1:00PM ET:
 If Texans wins, the market will resolve to "Texans".
 If Colts wins, the market will resolve to "Colts".
 If the game is postponed, this market will remain open until the game has been completed.
 If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.</pre>

</details>

### R18. Metamask FDV above $2B one day after launch? — $2B

- **Polymarket:** [Metamask FDV above $2B one day after launch? — $2B](https://polymarket.com/market/metamask-fdv-above-2b-one-day-after-launch-222-955-573-228) · closes 2027-01-01
- **Limitless:** [Metamask FDV above $2B one day after launch?](https://limitless.exchange/markets/metamask-fdv-above-dollar2b-one-day-after-launch-1764857266348) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to "Yes" if the Fully Diluted Valuation of Metamask's token is greater than the value specified in the title 1 day after launch. Otherwise, the market will resolve to "No."

The token must be actively, publicly transferable and tradable to be considered a launch.

"1 day after launch" is defined as 4:00 PM ET on the calendar day following launch. The resolution source for this market is the most liquid price source available. If Metamask doesn't launch a token by December 31, 2026, 11:59 PM ET, this market will resolve to "No".</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to "Yes" if the Fully Diluted Valuation of Metamask's token is greater than $2B 1 day after launch. Otherwise, the market will resolve to "No."
 The token must be actively, publicly transferable and tradable to be considered a launch.
 "1 day after launch" is defined as 4:00 PM ET on the calendar day following launch. The resolution source for this market is the most liquid price source available. If Metamask doesn't launch a token by December 31, 2026, 11:59 PM ET, this market will resolve to "No".</pre>

</details>

### R19. Will Putin and Zelenskyy meet next in Turkey? — Turkey

- **Kalshi:** [Will Putin and Zelenskyy meet next in Turkey? — Turkey](https://kalshi.com/markets/kxputinzelenskyylocation) · closes 2028-12-31
- **Limitless:** [Where will Zelenskyy and Putin meet next before 2027? — Turkey](https://limitless.exchange/markets/where-will-zelenskyy-and-putin-meet-next-before-2027-1787248233057) · closes 2027-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If the next Putin and Zelenskyy meeting happens in Turkey before Dec 31, 2028, then the market resolves to Yes.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve according to the location of the next meeting between Volodymyr Zelenskyy and Vladimir Putin by December 31, 2026, 11:59 PM ET. If no meeting takes place by December 31 ET, this market will resolve to "No meeting before 2027".

 A meeting is defined as any encounter where Zelenskyy and Putin are both present and interact with each other in person.

 For the purpose of this market, a meeting held on Ukrainian territory under the de facto control of Russia (e.g., Crimea) will be considered part of Russia.

 The primary resolution source for this market will be a consensus of credible reporting.</pre>

</details>

### R20. Clarity Act (H.R.3633) signed into law in 2026?

- **Polymarket:** [Clarity Act (H.R.3633) signed into law in 2026?](https://polymarket.com/market/clarity-act-signed-into-law-in-2026) · closes 2027-01-01
- **Limitless:** [Clarity Act (H.R.3633) signed into law in 2026?](https://limitless.exchange/markets/clarity-act-hr3633-signed-into-law-in-2026-1789385165383) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to "Yes" if the Digital Asset Market Clarity Act of 2025 (H.R.3633) is passed by both chambers of the U.S. Congress and signed into law by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to "No".

The primary resolution source is Congress.gov’s legislation tracker (https://www.congress.gov/bill/119th-congress/house-bill/3633) and other official information from the government of the United States, however other credible reporting may be used.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to "Yes" if the Digital Asset Market Clarity Act of 2025 (H.R.3633) is passed by both chambers of the U.S. Congress and signed into law by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to "No".

 The primary resolution source is Congress.gov’s legislation tracker ( https://www.congress.gov/bill/119th-congress/house-bill/3633 ) and other official information from the government of the United States, however other credible reporting may be used.</pre>

</details>

### R21. Will Yair Golan be the next Prime Minister of Israel? — Yair Golan

- **Kalshi:** [Will Yair Golan be the next Prime Minister of Israel? — Yair Golan](https://kalshi.com/markets/kxnextisraelpm) · closes 2045-01-01
- **Limitless:** [Who will be the next Prime Minister of Israel after next election? — Yair Golan](https://limitless.exchange/markets/who-will-be-the-next-prime-minister-of-israel-after-next-election-1769099103917) · closes 2028-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If the first new person to hold Prime Minister of Israel after Issuance is Yair Golan, then the market resolves to Yes.

The market resolves based on who actually assumes the office of Prime Minister, not who is elected or nominated. Acting or interim appointments count as holding the position if they formally assume the office. The person must be different from whoever held the position at market issuance - if the same person continues in office through the expiration date, all markets resolve to No. Resolution is based on official announcements from the country's legislature or government, with The New York Times as a secondary source for confirmation.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>Legislative elections are schedule to be held in Israel on October 27, 2026.
 This market will resolve to the next individual who is officially appointed and sworn in as Prime Minister of Israel following the 2026 parliamentary election. If an election is called early, this market will immediately resolve to the individual who is officially appointed and sworn in after that election.
 To count for resolution, the individual must be formally sworn in. Any interim or caretaker Prime Minister will not count toward the resolution of this market.
 If no such Prime Minister is sworn in by December 31, 2027, 11:59 PM ET, this market will resolve to “Other”.
 The primary resolution source for this market will be official information from the Government of Israel; however, a consensus of credible reporting may also be used.</pre>

</details>

### R22. Will Avigdor Lieberman be the next Prime Minister of Israel? — Avigdor Lieberman

- **Kalshi:** [Will Avigdor Lieberman be the next Prime Minister of Israel? — Avigdor Lieberman](https://kalshi.com/markets/kxnextisraelpm) · closes 2045-01-01
- **Polymarket:** [Will Avigdor Lieberman be the next Prime Minister of Israel? — Avigdor Lieberman](https://polymarket.com/market/will-avigdor-lieberman-be-the-next-prime-minister-of-israel) · closes 2026-10-27

<details><summary>Rules — Kalshi</summary>

<pre>If the first new person to hold Prime Minister of Israel after Issuance is Avigdor Lieberman, then the market resolves to Yes.

The market resolves based on who actually assumes the office of Prime Minister, not who is elected or nominated. Acting or interim appointments count as holding the position if they formally assume the office. The person must be different from whoever held the position at market issuance - if the same person continues in office through the expiration date, all markets resolve to No. Resolution is based on official announcements from the country's legislature or government, with The New York Times as a secondary source for confirmation.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>Legislative elections are schedule to be held in Israel on October 27, 2026. 

This market will resolve to the next individual who is officially appointed and sworn in as Prime Minister of Israel following the 2026 parliamentary election. If an election is called early, this market will immediately resolve to the individual who is officially appointed and sworn in after that election.

To count for resolution, the individual must be formally sworn in. Any interim or caretaker Prime Minister will not count toward the resolution of this market.

If no such Prime Minister is sworn in by December 31, 2027, 11:59 PM ET, this market will resolve to “Other”.

The primary resolution source for this market will be official information from the Government of Israel; however, a consensus of credible reporting may also be used.</pre>

</details>

### R23. Where will Trump and Putin next meet? — China

- **Kalshi:** [Where will Trump and Putin next meet? — China](https://kalshi.com/markets/kxputindjtlocation) · closes 2029-01-01
- **Polymarket:** [Will Trump and Putin meet next in China? — China](https://polymarket.com/market/will-trump-and-putin-meet-next-in-china-784) · closes 2027-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If Trump and Putin's first meeting after their planned August 15, 2025 meeting in Alaska happens in China before Jan 1, 2029, then the market resolves to Yes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the location of the next meeting between Donald Trump and Vladimir Putin between market creation and December 31, 2026, 11:59 PM ET.

This market will resolve to "No meeting by December 31" if no qualifying meeting occurs during this market's timeframe.

A meeting is defined as any encounter where Putin and Trump are all present and interact with each other in person.

An exchange of words, handshake, direct conversation, or other clear personal interaction between the named individuals will qualify as a meeting. Merely standing in proximity, making eye contact, or being present in the same room or event without direct interaction will not qualify.

For this market, Gulf states are defined as the six members of the Gulf Cooperation Council (Bahrain, Kuwait, Oman, Qatar, Saudi Arabia, United Arab Emirates).

The primary resolution source for this market will be a consensus of credible reporting.</pre>

</details>

### R24. Will Ethereum reach $4,000 in September? — ↑ 4,000

- **Polymarket:** [Will Ethereum reach $4,000 in September? — ↑ 4,000](https://polymarket.com/market/will-ethereum-reach-4000-in-september-2026) · closes 2026-10-01
- **Limitless:** [What price will Ethereum hit in September? — ↑ 4,000](https://limitless.exchange/markets/what-price-will-ethereum-hit-in-september-2026-p) · closes 2026-10-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for ETH/USDT during the month specified in the title (from 00:00 AM ET on the first day to 11:59 PM ET on the last), has a final High price equal to or greater than the price specified in the title. Otherwise, this market will resolve to "No."

The resolution source for this market is Binance, specifically the ETH/USDT High prices available at https://www.binance.com/en/trade/ETH_USDT, with the chart settings on "1m" for one-minute candles selected on the top bar.

Please note that the outcome of this market depends solely on the price data from the Binance ETH/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for ETH/USDT during the month specified in the title (from 00:00 AM ET on the first day to 11:59 PM ET on the last), has a final High price equal to or greater than the price specified in the title. Otherwise, this market will resolve to "No."

 The resolution source for this market is Binance, specifically the ETH/USDT High prices available at https://www.binance.com/en/trade/ETH_USDT , with the chart settings on "1m" for one-minute candles selected on the top bar.

 Please note that the outcome of this market depends solely on the price data from the Binance ETH/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

### R25. Will Republicans win the Senate race in Maine? — Susan Collins

- **Kalshi:** [Will Republicans win the Senate race in Maine? — Susan Collins](https://kalshi.com/markets/senateme) · closes 2027-11-03
- **Polymarket:** [Will the Republicans win the Maine Senate race in 2026? — Susan Collins (R)](https://polymarket.com/market/will-the-republicans-win-the-maine-senate-race-in-2026)

<details><summary>Rules — Kalshi</summary>

<pre>If a representative of the Republican party is sworn in as a Senator of Maine for the term beginning in 2027, then the market resolves to Yes.

This market is eligible for accelerated determination after a consensus of media organizations project the winner. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the winner of the 2026 midterm Maine U.S. Senate election, inclusive of any run-offs.

A candidate shall be considered to represent a party in the event that he or she is the nominee of the party in question. Candidates other than the Democratic or Republican nominee (e.g., Greens, Libertarian, independent) may be added at a later date.

Candidates who run as independents will not be encompassed by the “Democrat” or “Republican” options regardless of any affiliation they may have with the party.

The candidates may be named in the contract for the convenience of traders. In the event that any named candidate is replaced as the nominee of their respective party prior to election day, the name in the contract will be updated and the market will resolve based on the replacement nominee of the party.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race in this state for the same candidate, this market will resolve based on the official certification.</pre>

</details>

### R26. US-Iran Final Nuclear Deal by December 31, 2026? — December 31

- **Polymarket:** [US-Iran Final Nuclear Deal by December 31, 2026? — December 31](https://polymarket.com/market/us-iran-final-nuclear-deal-by-december-31-2026-191) · closes 2026-06-15
- **Limitless:** [US-Iran Final Nuclear Deal by…? — December 31](https://limitless.exchange/markets/us-iran-final-nuclear-deal-by-1787657393555) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>On June 14, 2026, the United States and Iran announced a written diplomatic agreement, including a 60-day extendable period in which both countries committed to negotiate toward a “final deal” regarding Iran’s nuclear program and other topics.

This market resolves to “Yes” if a qualifying written diplomatic instrument between the United States and Iran has been mutually signed or adopted by the specified date, 11:59 PM ET. Otherwise, this market resolves to “No.”

Unless the written instrument is formally adopted without signature as described below, the instrument must be signed by both the United States and Iran. Both parties must either sign the same document or sign individual documents that substantively and directly indicate acceptance of the same underlying instrument, regardless of minor formatting, wording, or translation differences between the signed versions. Both physical signatures and officially-issued electronic signatures will qualify as signatures.

If the written instrument is recognized by the United States and Iran as not requiring signature for execution, formal adoption of the instrument by both countries without signature will qualify. Formal adoption may be established by official actions, including:

(i) an official joint statement announcing that the United States and Iran have adopted, approved, executed, concluded, or otherwise finalized the instrument;
(ii) mutual official confirmation that the same published instrument has been agreed to, adopted, approved, executed, or concluded by both countries;
(iii) adoption, approval, or endorsement through an official resolution, ministerial decision, executive decision, or equivalent institutional act, where that act is the mechanism by which the relevant country adopts the instrument; or
(iv) an exchange of official diplomatic notes or letters confirming acceptance of the same instrument.

A qualifying written diplomatic instrument must:

(i) Be identified as the final deal contemplated by the June 14, 2026, memorandum of understanding, either in official United States or Iranian communications, or by a consensus of credible reporting;
(ii) Establish at least one specific obligation limiting Iran's nuclear program through a concrete, measurable benchmark against which compliance could be tested, which may take the form of a defined limit, prohibition, or quantity (e.g., a specific cap on the purity level to which Iran may enrich uranium, or an explicit commitment for Iran to surrender, destroy, or dilute its enriched uranium stockpile). Non-specific or vague restrictions, with no defined metric (e.g., a pledge not to pursue nuclear weapons, a commitment to maintain the status quo, or an agreement to abide IAEA monitoring or inspections requirements that do not specifically restrict Iran’s nuclear program) will not qualify.

The content of the qualifying instrument must be expressed as an agreed obligation to be implemented. The following do not qualify: 

(i) a provision the substantive obligation of which remains explicitly subject to a future agreement, negotiation process, or mutually agreed follow-on instrument; 
(ii) a provision explicitly framed as a minimum requirement for a future negotiation, rather than a present obligation; 
(iii) a floor, placeholder, or minimum standard established explicitly for the purpose of structuring ongoing or future talks. 

A definite and unconditional obligation may qualify, even if technical or procedural details, including the exact implementation date, timeframe, or sequencing, remain subject to future arrangements, provided that the obligation still establishes a concrete, measurable benchmark against which compliance could be tested. Conditional obligations do not qualify.

Whether an instrument qualifies will be primarily determined by its officially released text. A qualifying instrument must be signed or formally adopted by both the United States and Iran by the specified date, 11:59 PM ET. If such an instrument is signed or formally adopted by that time, but the complete text has not been released, and genuine material ambiguity remains as to whether it satisfies this market’s requirements, this market may remain open for up to 28 calendar days after the specified date pending release of the text. If the text has still not been released after 28 calendar days, official and definitive announcements from the United States or Iran, and a consensus of credible reporting, will be used to determine whether the instrument qualifies.

An instrument to which parties other than the United States and Iran are also party will qualify, provided that both the United States and Iran are parties to the instrument and all other requirements are satisfied. 

Once a diplomatic instrument has been signed or formally adopted without signature by both the United States and Iran and confirmed to satisfy the requirements of a qualifying written diplomatic instrument, this market’s condition is met, regardless of whether the instrument later enters into force, is ratified, receives legislative or treaty consent, or is subsequently repudiated, withdrawn from, or not implemented by the United States or Iran.

The primary resolution sources for this market will be official communications from the governments of the United States and Iran, or their authorized representatives. A consensus of credible reporting from major news agencies of record may also be used.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>On June 14, 2026, the United States and Iran announced a written diplomatic agreement, including a 60-day extendable period in which both countries committed to negotiate toward a “final deal” regarding Iran’s nuclear program and other topics.
 This market resolves to “Yes” if a qualifying written diplomatic instrument between the United States and Iran has been mutually signed or adopted by the specified date, 11:59 PM ET. Otherwise, this market resolves to “No.”
 Unless the written instrument is formally adopted without signature as described below, the instrument must be signed by both the United States and Iran. Both parties must either sign the same document or sign individual documents that substantively and directly indicate acceptance of the same underlying instrument, regardless of minor formatting, wording, or translation differences between the signed versions. Both physical signatures and officially-issued electronic signatures will qualify as signatures.
 If the written instrument is recognized by the United States and Iran as not requiring signature for execution, formal adoption of the instrument by both countries without signature will qualify. Formal adoption may be established by official actions, including:
 (i) an official joint statement announcing that the United States and Iran have adopted, approved, executed, concluded, or otherwise finalized the instrument;
 (ii) mutual official confirmation that the same published instrument has been agreed to, adopted, approved, executed, or concluded by both countries;
 (iii) adoption, approval, or endorsement through an official resolution, ministerial decision, executive decision, or equivalent institutional act, where that act is the mechanism by which the relevant country adopts the instrument; or
 (iv) an exchange of official diplomatic notes or letters confirming acceptance of the same instrument.
 A qualifying written diplomatic instrument must:
 (i) Be identified as the final deal contemplated by the June 14, 2026, memorandum of understanding, either in official United States or Iranian communications, or by a consensus of credible reporting;
 (ii) Establish at least one specific obligation limiting Iran's nuclear program through a concrete, measurable benchmark against which compliance could be tested, which may take the form of a defined limit, prohibition, or quantity (e.g., a specific cap on the purity level to which Iran may enrich uranium, or an explicit commitment for Iran to surrender, destroy, or dilute its enriched uranium stockpile). Non-specific or vague restrictions, with no defined metric (e.g., a pledge not to pursue nuclear weapons, a commitment to maintain the status quo, or an agreement to abide IAEA monitoring or inspections requirements that do not specifically restrict Iran’s nuclear program) will not qualify.
 The content of the qualifying instrument must be expressed as an agreed obligation to be implemented. The following do not qualify:
 (i) a provision the substantive obligation of which remains explicitly subject to a future agreement, negotiation process, or mutually agreed follow-on instrument;
 (ii) a provision explicitly framed as a minimum requirement for a future negotiation, rather than a present obligation;
 (iii) a floor, placeholder, or minimum standard established explicitly for the purpose of structuring ongoing or future talks.
 A definite and unconditional obligation may qualify, even if technical or procedural details, including the exact implementation date, timeframe, or sequencing, remain subject to future arrangements, provided that the obligation still establishes a concrete, measurable benchmark against which compliance could be tested. Conditional obligations do not qualify.
 Whether an instrument qualifies will be primarily determined by its officially released text. A qualifying instrument must be signed or formally adopted by both the United States and Iran by the specified date, 11:59 PM ET. If such an instrument is signed or formally adopted by that time, but the complete text has not been released, and genuine material ambiguity remains as to whether it satisfies this market’s requirements, this market may remain open for up to 28 calendar days after the specified date pending release of the text. If the text has still not been released after 28 calendar days, official and definitive announcements from the United States or Iran, and a consensus of credible reporting, will be used to determine whether the instrument qualifies.
 An instrument to which parties other than the United States and Iran are also party will qualify, provided that both the United States and Iran are parties to the instrument and all other requirements are satisfied.
 Once a diplomatic instrument has been signed or formally adopted without signature by both the United States and Iran and confirmed to satisfy the requirements of a qualifying written diplomatic instrument, this market’s condition is met, regardless of whether the instrument later enters into force, is ratified, receives legislative or treaty consent, or is subsequently repudiated, withdrawn from, or not implemented by the United States or Iran.
 The primary resolution sources for this market will be official communications from the governments of the United States and Iran, or their authorized representatives. A consensus of credible reporting from major news agencies of record may also be used.</pre>

</details>

### R27. Will Kimi Antonelli be the 2026 F1 Drivers' Champion? — Kimi Antonelli

- **Polymarket:** [Will Kimi Antonelli be the 2026 F1 Drivers' Champion? — Kimi Antonelli](https://polymarket.com/market/will-kimi-antonelli-be-the-2026-f1-drivers-champion) · closes 2026-12-06
- **Limitless:** [F1 Drivers' Champion — Kimi Antonelli](https://limitless.exchange/markets/f1-drivers-champion-1769015228907) · closes 2027-04-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the listed driver that finishes 1st in the driver standings for the 2026 F1 season.

This market will resolve as soon as the official results of the final scheduled race of the 2026 F1 season are known.

If multiple drivers tie for first place in the drivers standings, this market will resolve according to the tiebreak procedure used by F1 to determine the 2026 F1 Drivers’ champion.

If at any point it becomes impossible for a listed driver to win the 2026 F1 Drivers Championship based on the rules of F1 (e.g., they are mathematically eliminated from contention), the corresponding market will resolve to “No”.

If the F1 season is permanently canceled or has not been completed by March 31, 2027, 11:59 PM ET, this market will resolve to “Other”.

The primary resolution source for this market will be official information from Formula 1.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve according to the listed driver that finishes 1st in the driver standings for the 2026 F1 season.
 This market will resolve as soon as the official results of the final scheduled race of the 2026 F1 season are known.
 If multiple drivers tie for first place in the drivers standings, this market will resolve according to the tiebreak procedure used by F1 to determine the 2026 F1 Drivers’ champion.
 If the F1 season is permanently canceled or has not been completed by March 31, 2027, 11:59 PM ET, this market will resolve to “Other”.
 The primary resolution source for this market will be official information from Formula 1.</pre>

</details>

### R28. Will Anthropic IPO by December 15, 2026? — December 15, 2026

- **Polymarket:** [Will Anthropic IPO by December 15, 2026? — December 15, 2026](https://polymarket.com/market/will-anthropic-ipo-by-december-15-2026) · closes 2027-07-01
- **Limitless:** [Anthropic IPO by __? — December 15, 2026](https://limitless.exchange/markets/anthropic-ipo-by-1789547697089) · closes 2027-07-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to "Yes" if Anthropic shares are listed on a public securities exchange and open for trading by 11:59 PM ET on the listed date. Otherwise, this market will resolve to "No."

If Anthropic is acquired by another company that is already public, this market will immediately resolve to "No."

The primary resolution source for this market is official filings and announcements from Anthropic and the relevant securities exchange on which the shares are listed, including SEC filings (e.g., Form S-1, Form 8-A), exchange listing confirmations, and official press releases from Anthropic; however a consensus of credible reporting may also be used.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to "Yes" if Anthropic shares are listed on a public securities exchange and open for trading by 11:59 PM ET on the listed date. Otherwise, this market will resolve to "No."

 If Anthropic is acquired by another company that is already public, this market will immediately resolve to "No."

 The primary resolution source for this market is official filings and announcements from Anthropic and the relevant securities exchange on which the shares are listed, including SEC filings (e.g., Form S-1, Form 8-A), exchange listing confirmations, and official press releases from Anthropic; however a consensus of credible reporting may also be used.</pre>

</details>

### R29. Next US-Iran senior diplomatic meeting by September 30, 2026? — September 30, 2026

- **Polymarket:** [Next US-Iran senior diplomatic meeting by September 30, 2026? — September 30, 2026](https://polymarket.com/market/us-x-iran-diplomatic-meeting-by-march-31-2027-20260922) · closes 2026-09-30
- **Limitless:** [Next round of US-Iran peace talks by...? — September 30, 2026](https://limitless.exchange/markets/next-round-of-us-iran-peace-talks-by-1787658200726) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>On September 22, U.S. Special Envoy Steve Witkoff and Jared Kushner met Iranian Foreign Minister Abbas Araghchi on the sidelines of the UN General Assembly in New York, with President Trump saying another meeting is scheduled in the near future.(see: https://www.israelhayom.com/2026/09/22/witkoff-kushner-attended-us-iran-meeting-another-expected-soon). 

This market will resolve to “Yes” if there is a direct or indirect senior-level diplomatic meeting between the United States and Iran by the listed date, 11:59 PM ET. Otherwise, this market will resolve to “No”.

A diplomatic meeting occurs when representatives of both listed countries who are acting in an official capacity and are authorized to engage in diplomacy on behalf of their respective governments or governing authorities deliberately meet for the purpose of diplomacy or negotiation. A qualifying meeting need not result in any agreement, joint statement, or further engagement.

A diplomatic meeting is senior-level if each listed entity is represented by a head of state, a head of government, or a vice president; a foreign minister; a minister of cabinet rank; the secretary or head of a national security council; the presiding officer of a national legislature; a special envoy; or another individual designated by the head of state or head of government to conduct diplomatic negotiations on their behalf. Individuals authorized only for technical, implementation, monitoring, staff-level, preparatory, or working-group-level talks will not be considered designated to conduct diplomatic negotiations on behalf of the head of state or head of government. This definition includes, but is not limited to, all of the following individuals: for the United States, Donald Trump, JD Vance, Marco Rubio, Scott Bessent, Steve Witkoff and Jared Kushner; and for Iran, Mojtaba Khamenei, Masoud Pezeshkian, Abbas Araghchi and Mohammad Bagher Ghalibaf. In each case, a qualifying representative must participate in the meeting.

A direct meeting refers to a diplomatic meeting where the representatives of both countries directly interact with each other in person. Meetings conducted through translators qualify, provided direct, face-to-face communication occurs. An indirect meeting refers to a meeting conducted indirectly through designated mediators or facilitators. A qualifying indirect meeting must meet both of the following criteria (i) the designated intermediaries act with the knowledge and authorization of both entities; (ii) representatives of both entities are physically present in the same facility, venue, or city as part of a single organized round of talks convened for the purpose of diplomatic engagement, with the intermediary conveying communications between the representatives or delegations on the same day. “The same day” means the same calendar day local time at the meeting location.

Sessions, proceedings, or convenings of standing international organizations, treaty bodies, or recurring multilateral summits or conferences (e.g., the United Nations General Assembly, G7, and G20 summits) do not qualify, unless a qualifying and deliberate diplomatic meeting between representatives of the listed countries is separately held alongside such a convening.

The following do not qualify as either a direct or indirect diplomatic meeting: chance encounters; standalone exchanges limited to greetings, courtesies, or photo opportunities; meetings conducted remotely, by telephone, or by any other means where the relevant representatives are not physically present at the same facility, venue, or city on the same day; discussions involving persons not authorized to engage in diplomacy or negotiation on behalf of their respective governments.

The resolution sources for this market will be official information from the governments of the United States and Iran and a consensus of credible reporting.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>On June 22, the first round of U.S.-Iran diplomatic talks in Switzerland concluded, with mediators reporting progress toward a roadmap for a final deal and follow-on technical talks expected to continue.(see: https://www.aljazeera.com/news/2026/6/22/us-iran-agree-on-roadmap-towards-final-deal-in-switzerland-talks ). 

 This market will resolve to “Yes” if the next formal senior-level round of peace talks between representatives of the United States and Iran begins by the listed date, 11:59 PM ET. Otherwise, this market will resolve to “No.”

 A qualifying round must be a deliberate in-person diplomatic meeting or negotiating round concerning US-Iran relations, involving senior representatives of both the United States and Iran who are acting in an official capacity and are authorized to conduct or materially direct diplomacy on behalf of their governments.

 Indirect in-person diplomacy through designated mediators, facilitators, or interlocutors will qualify, provided senior representatives of both the United States and Iran are participating in the same formal diplomatic process with the knowledge and authorization of their respective governments. The representatives need not be in the same room at the same time.

 Follow-on technical talks from the June 22 Switzerland round will not qualify by themselves. Technical, staff-level, working-group, implementation, monitoring, preparatory, or deconfliction meetings will not qualify unless they occur as part of a new formally convened senior-level U.S.-Iran peace-talks round.

 Brief greetings, chance encounters, photo opportunities, ceremonial appearances, or talks not deliberately aimed at diplomacy or negotiation will not count.

 The meeting must be in-person (including indirect in-person meetings) and must be publicly acknowledged by either government or reported by a consensus of credible media. Remote meetings, phone calls, or other meetings where the relevant parties are not present will not count.

 The resolution sources for this market will be official information from the governments of the United States and Iran, and a consensus of credible reporting.</pre>

</details>

### R30. US announces end of Iranian blockade by October 31, 2026? — October 31

- **Polymarket:** [US announces end of Iranian blockade by October 31, 2026? — October 31](https://polymarket.com/market/us-announces-end-of-iranian-blockade-by-october-31-2026-20260727171711632-895-372-622-413-171-454-592-696) · closes 2026-11-01
- **Limitless:** [US announces end of Iranian blockade by...? — October 31](https://limitless.exchange/markets/us-announces-end-of-iranian-blockade-by-1787654335165) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>On July 13, 2026, Trump announced the United States would reinstate its naval blockade of Iran, targeting Iranian ships and customers.

This market will resolve to “Yes” if the United States government, or an authorized representative of the United States government, publicly and officially announces the end, termination, lifting, or suspension of the United States’ naval blockade on Iranian ships and ships of Iranian customers, between market creation and the specified date, 11:59 PM ET. Otherwise, this market will resolve to “No”.

An announcement qualifies if it communicates that the United States will generally cease blocking vessel traffic for Iranian ships and customers, including an announcement that the blockade will not take effect at all, even if some restrictions remain (for example, an imposition of fees). An announcement does not qualify if it reflects only a limited or partial change that stops short of a general end or suspension of the blockade, for example, an exemption for a specific vessel, cargo, or port.

A qualifying announcement must be a declarative statement of the United States government’s present termination or suspension of the blockade, previously-unannounced prior termination or suspension of the blockade, or definitive decision to terminate or suspend the blockade.

A qualifying announcement must clearly and unambiguously identify the end or suspension of the blockade. Statements that merely allude to, reference, or describe an end to the blockade, without clearly communicating it, do not qualify. The announcement need not use specific terminology or reference the end of a blockade by name; an announcement of a resumption of prior obligations, the maintenance of a status quo, or a return to a previously agreed baseline qualifies, provided the substantive policy of ending or suspending the blockade is clearly and unambiguously communicated.

A qualifying announcement must be made through official channels, by an individual acting in an official capacity. Statements made incidentally or informally in a context not intended for official communication do not qualify.

The following do not qualify:

Anonymous, unattributed, or leaked statements not confirmed as official;
Statements by persons not authorized to speak for the United States government;
Third-party speculation, analysis, or predictions that the United States government will announce or implement an end to the blockade;
Satirical, fabricated, hacked, or impersonated communications; and
Statements that describe a prospective, contingent, probable, or conditional end to the blockade rather than announcing a present and decided position.

Once a qualifying announcement is made, this market will resolve to “Yes” regardless of whether it is later reversed, or whether the blockade actually ends in practice.

Resolution will be based on official information from the United States government, including the President, the Department of Defense, the Department of State, and United States Central Command (CENTCOM), or the official representatives of the United States government.
</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>On July 13, 2026, Trump announced the United States would reinstate its naval blockade of Iran, targeting Iranian ships and customers.
 This market will resolve to “Yes” if the United States government, or an authorized representative of the United States government, publicly and officially announces the end, termination, lifting, or suspension of the United States’ naval blockade on Iranian ships and ships of Iranian customers, between market creation and the specified date, 11:59 PM ET. Otherwise, this market will resolve to “No”.
 An announcement qualifies if it communicates that the United States will generally cease blocking vessel traffic for Iranian ships and customers, including an announcement that the blockade will not take effect at all, even if some restrictions remain (for example, an imposition of fees). An announcement does not qualify if it reflects only a limited or partial change that stops short of a general end or suspension of the blockade, for example, an exemption for a specific vessel, cargo, or port.
 A qualifying announcement must be a declarative statement of the United States government’s present termination or suspension of the blockade, previously-unannounced prior termination or suspension of the blockade, or definitive decision to terminate or suspend the blockade.
 A qualifying announcement must clearly and unambiguously identify the end or suspension of the blockade. Statements that merely allude to, reference, or describe an end to the blockade, without clearly communicating it, do not qualify. The announcement need not use specific terminology or reference the end of a blockade by name; an announcement of a resumption of prior obligations, the maintenance of a status quo, or a return to a previously agreed baseline qualifies, provided the substantive policy of ending or suspending the blockade is clearly and unambiguously communicated.
 A qualifying announcement must be made through official channels, by an individual acting in an official capacity. Statements made incidentally or informally in a context not intended for official communication do not qualify.
 The following do not qualify:
 Anonymous, unattributed, or leaked statements not confirmed as official;
 Statements by persons not authorized to speak for the United States government;
 Third-party speculation, analysis, or predictions that the United States government will announce or implement an end to the blockade;
 Satirical, fabricated, hacked, or impersonated communications; and
 Statements that describe a prospective, contingent, probable, or conditional end to the blockade rather than announcing a present and decided position.
 Once a qualifying announcement is made, this market will resolve to “Yes” regardless of whether it is later reversed, or whether the blockade actually ends in practice.
 Resolution will be based on official information from the United States government, including the President, the Department of Defense, the Department of State, and United States Central Command (CENTCOM), or the official representatives of the United States government.</pre>

</details>

## Выборка «held-out» (30 пар)

### H1. Will Bitcoin reach $86,000 on September 25? — ↑ 86,000

- **Polymarket:** [Will Bitcoin reach $86,000 on September 25? — ↑ 86,000](https://polymarket.com/market/will-bitcoin-reach-86k-on-september-25-2026) · closes 2026-09-26
- **Limitless:** [What price will Bitcoin hit on September 25? — ↑ 86,000](https://limitless.exchange/markets/what-price-will-bitcoin-hit-on-september-25-2026-1790340607934) · closes 2026-09-26

<details><summary>Rules — Polymarket</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1-minute candle for Bitcoin (BTC/USDT) on the date specified in the title, between 12:00 AM ET and 11:59 PM ET has a final "High" price equal to or greater than the price specified in the title. Otherwise, this market will resolve to "No".

The resolution source for this market is Binance, specifically the BTC/USDT "High" prices available at https://www.binance.com/en/trade/BTC_USDT, with the chart settings on "1m" candles selected on the top bar.

Please note that the outcome of this market depends solely on the price data from the Binance BTC/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1-minute candle for Bitcoin (BTC/USDT) on the date specified in the title, between 12:00 AM ET and 11:59 PM ET has a final "High" price equal to or greater than the price specified in the title. Otherwise, this market will resolve to "No".

 The resolution source for this market is Binance, specifically the BTC/USDT "High" prices available at https://www.binance.com/en/trade/BTC_USDT , with the chart settings on "1m" candles selected on the top bar.

 Please note that the outcome of this market depends solely on the price data from the Binance BTC/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

### H2. Will Ethereum dip to $1,600 in September? — ↓ 1,600

- **Polymarket:** [Will Ethereum dip to $1,600 in September? — ↓ 1,600](https://polymarket.com/market/will-ethereum-dip-to-1600-in-september-2026) · closes 2026-10-01
- **Limitless:** [What price will Ethereum hit in September? — ↓ 1,600](https://limitless.exchange/markets/what-price-will-ethereum-hit-in-september-2026-p) · closes 2026-10-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for ETH/USDT during the month specified in the title (from 00:00 AM ET on the first day to 11:59 PM ET on the last), has a final Low price equal to or lower than the price specified in the title. Otherwise, this market will resolve to "No."

The resolution source for this market is Binance, specifically the ETH/USDT Low prices available at https://www.binance.com/en/trade/ETH_USDT, with the chart settings on "1m" for one-minute candles selected on the top bar.

Please note that the outcome of this market depends solely on the price data from the Binance ETH/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for ETH/USDT during the month specified in the title (from 00:00 AM ET on the first day to 11:59 PM ET on the last), has a final Low price equal to or lower than the price specified in the title. Otherwise, this market will resolve to "No."

 The resolution source for this market is Binance, specifically the ETH/USDT Low prices available at https://www.binance.com/en/trade/ETH_USDT , with the chart settings on "1m" for one-minute candles selected on the top bar.

 Please note that the outcome of this market depends solely on the price data from the Binance ETH/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

### H3. Who will win the next presidential election? — Pete Buttigieg

- **Kalshi:** [Who will win the next presidential election? — Pete Buttigieg](https://kalshi.com/markets/kxpresperson) · closes 2029-11-07
- **Polymarket:** [Will Pete Buttigieg win the 2028 US Presidential Election? — Pete Buttigieg](https://polymarket.com/market/will-pete-buttigieg-win-the-2028-us-presidential-election) · closes 2028-11-07

<details><summary>Rules — Kalshi</summary>

<pre>If Pete Buttigieg is the next person inaugurated as President for the term beginning in 2029, then the market resolves to Yes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>The 2028 US Presidential Election is scheduled to take place on November 7, 2028.

This market will resolve to the person who wins the 2028 US Presidential Election.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race for the same candidate by the inauguration date (January 20, 2029) this market will resolve based on who is inaugurated.</pre>

</details>

### H4. Will Republicans win the Senate race in New Hampshire? — John E. Sununu

- **Kalshi:** [Will Republicans win the Senate race in New Hampshire? — John E. Sununu](https://kalshi.com/markets/senatenh) · closes 2027-11-03
- **Polymarket:** [Will the Republicans win the New Hampshire Senate race in 2026? — John E. Sununu (R)](https://polymarket.com/market/will-the-republicans-win-the-new-hampshire-senate-race-in-2026)

<details><summary>Rules — Kalshi</summary>

<pre>If a representative of the Republican party is sworn in as a Senator of New Hampshire for the term beginning in 2027, then the market resolves to Yes.

This market is eligible for accelerated determination after a consensus of media organizations project the winner. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the winner of the 2026 midterm New Hampshire U.S. Senate election, inclusive of any run-offs.

A candidate shall be considered to represent a party in the event that he or she is the nominee of the party in question. Candidates other than the Democratic or Republican nominee (e.g., Greens, Libertarian, independent) may be added at a later date.

Candidates who run as independents will not be encompassed by the “Democrat” or “Republican” options regardless of any affiliation they may have with the party.

The candidates may be named in the contract for the convenience of traders. In the event that any named candidate is replaced as the nominee of their respective party prior to election day, the name in the contract will be updated and the market will resolve based on the replacement nominee of the party.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race in this state for the same candidate, this market will resolve based on the official certification.</pre>

</details>

### H5. Will Nicolás Maduro de facto hold head of state of Venezuela at the end of 2026? — Nicolás Maduro

- **Kalshi:** [Will Nicolás Maduro de facto hold head of state of Venezuela at the end of 2026? — Nicolás Maduro](https://kalshi.com/markets/kxvenezdefacto) · closes 2027-01-02
- **Polymarket:** [Will Nicolás Maduro be the leader of Venezuela end of 2026? — Nicolás Maduro](https://polymarket.com/market/will-nicols-maduro-be-the-leader-of-venezuela-end-of-2026) · closes 2027-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If Nicolás Maduro de facto holds the position of head of state of Venezuela at the end of 2026, then the market resolves to Yes.

For the purposes of this Contract, "Nicolás Maduro de facto holds head of state of Venezuela" means that, at the end of 2026, Nicolás Maduro is the individual who primarily exercises the governing authority and core powers customarily attached to head of state of Venezuela, regardless of Nicolás Maduro's formal title, constitutional designation, formal appointment, domestic legal status, foreign recognition, or international recognition.

The Source Agency's determination of whether Nicolás Maduro de facto holds head of state of Venezuela shall be based on objective indicators of governing authority over the functions attached to head of state of Venezuela, which may include, without limitation:

Control over the executive ministries, administrative apparatus, bureaucracy, and state institutions associated with head of state of Venezuela
Issuance of binding national directives, decrees, orders, or instructions that are observably obeyed and enforced within the relevant jurisdiction
Control over the official seat of power, capital, headquarters, principal residence, or principal infrastructure associated with head of state of Venezuela
Treatment by the domestic state institutions associated with head of state of Venezuela as the operative holder of head of state of Venezuela
Treatment by foreign governments, multilateral institutions, and credentialed media as the operative holder of head of state of Venezuela

The following alone will NOT qualify as de facto holding head of state of Venezuela:

Holding the formal or constitutional title to head of state of Venezuela without exercising the core powers customarily attached to head of state of Venezuela
Serving in an acting, interim, caretaker, provisional, or temporary capacity that is subordinate to and accountable to a principal who continues to exercise the core powers customarily attached to head of state of Venezuela
Nomination, designation, election, appointment, or confirmation to head of state of Venezuela prior to the effective transfer of governing authority
Status as successor, heir apparent, or designated replacement to head of state of Venezuela prior to assumption of governing authority
Symbolic, ceremonial, or honorary status without exercise of the core powers customarily attached to head of state of Venezuela, except where head of state of Venezuela is itself a primarily ceremonial position and Nicolás Maduro performs the ceremonial functions associated with head of state of Venezuela without operative displacement
Foreign or international recognition as the holder of head of state of Venezuela without exercise of operative governing authority within the relevant jurisdiction
Leadership from exile, in detention, or otherwise removed from the operating seat of head of state of Venezuela, where another individual is observably exercising the core powers customarily attached to head of state of Venezuela without subordination to Nicolás Maduro
Holding a different role with general political, religious, military, or institutional influence over head of state of Venezuela without personally exercising the core powers customarily attached to head of state of Venezuela

If, at the end of 2026, the Source Agency does not identify any individual as exercising primary governing authority over the core powers customarily attached to head of state of Venezuela (including where head of state of Venezuela has been abolished, suspended, declared vacant, or where governing authority is genuinely fragmented among multiple individuals such that no individual primarily exercises the powers customarily attached to head of state of Venezuela), the Payout Criterion shall not be satisfied with respect to any listed person.

If, at the end of 2026, more than one individual claims or is claimed to de facto hold head of state of Venezuela, the Source Agency shall determine the de facto holder by reference to which individual primarily exercises the indicators of governing authority described above; in any such determination, the higher-ranked Source Agencies shall prevail over lower-ranked Source Agencies. If multiple persons are determined to do so equally, all those persons' markets shall resolve to $1/n, rounded down, where n is the number of persons who do so and who have a strike listed.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to the individual who officially holds the position of the head of state of Venezuela on Dec 31, 2026 at 12 PM ET.

For the purposes of this market, "officially holds" refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela. 

If the Venezuelan government does not clearly state who is the head of state, the market will resolve to the individual who is listed as the Head of State by the UN (see: https://www.un.org/dgacm/en/content/protocol/hshgnfa).  

In the event that more than one official head of state is listed by the Venezuelan  government, this market will resolve to the individual who is listed as having primary status. If no distinction is made, the market will resolve to the individual who first assumed the position. 

If no individual holds the position this market will resolve to “No Head of State”. 

The following do NOT constitute "officially holding" the role: nominated, announced, or designated as the head of state of Venezuela but appointment not yet effective; appointed with an effective date after Dec 31, 2026; previously served as the head of state of Venezuela but term has expired, resigned, or been terminated before Dec 31, 2026; serving as the head of state of Venezuela in a consultant, contractor, or unofficial capacity; named as successor or heir apparent to the head of state of Venezuela but not yet appointed; or holding a different role with oversight of the head of state of Venezuela but not the specified position itself.

The primary resolution source will be official information from the UN recognized government of Venezuela. If the Government of Venezuela does not clearly state who is the head of state, information from the UN and a consensus of credible reporting may be used. 

Note: this market is mutually exclusive. 
</pre>

</details>

### H6. Will Ethereum dip to $2,500 September 21-27? — ↓ 2,500

- **Polymarket:** [Will Ethereum dip to $2,500 September 21-27? — ↓ 2,500](https://polymarket.com/market/will-ethereum-dip-to-2500-september-21-27-2026) · closes 2026-09-28
- **Limitless:** [What price will Ethereum hit September 21-27? — ↓ 2,500](https://limitless.exchange/markets/what-price-will-ethereum-hit-september-21-27-2026-1789963561328) · closes 2026-09-28

<details><summary>Rules — Polymarket</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for Ethereum (ETH/USDT) during the date range specified in the title (from 12:00 AM ET on the first date to 11:59 PM ET on the last) has a final "Low" price equal to or lower than the price specified in the title. Otherwise, this market will resolve to "No."

The resolution source for this market is Binance, specifically the ETH/USDT "Low" prices available at https://www.binance.com/en/trade/ETH_USDT, with the chart settings on "1m" candles selected on the top bar.

Please note that the outcome of this market depends solely on the price data from the Binance ETH/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will immediately resolve to "Yes" if any Binance 1 minute candle for Ethereum (ETH/USDT) during the date range specified in the title (from 12:00 AM ET on the first date to 11:59 PM ET on the last) has a final "Low" price equal to or lower than the price specified in the title. Otherwise, this market will resolve to "No."

 The resolution source for this market is Binance, specifically the ETH/USDT "Low" prices available at https://www.binance.com/en/trade/ETH_USDT , with the chart settings on "1m" candles selected on the top bar.

 Please note that the outcome of this market depends solely on the price data from the Binance ETH/USDT trading pair. Prices from other exchanges, different trading pairs, or spot markets will not be considered for the resolution of this market.</pre>

</details>

### H7. Will Delcy Rodríguez de facto hold head of state of Venezuela at the end of 2026? — Delcy Rodríguez

- **Kalshi:** [Will Delcy Rodríguez de facto hold head of state of Venezuela at the end of 2026? — Delcy Rodríguez](https://kalshi.com/markets/kxvenezdefacto) · closes 2027-01-02
- **Limitless:** [Venezuela leader end of 2026? — Delcy Rodríguez](https://limitless.exchange/markets/venezuela-leader-end-of-2026-1787676662914) · closes 2026-12-31

<details><summary>Rules — Kalshi</summary>

<pre>If Delcy Rodríguez de facto holds the position of head of state of Venezuela at the end of 2026, then the market resolves to Yes.

For the purposes of this Contract, "Delcy Rodríguez de facto holds head of state of Venezuela" means that, at the end of 2026, Delcy Rodríguez is the individual who primarily exercises the governing authority and core powers customarily attached to head of state of Venezuela, regardless of Delcy Rodríguez's formal title, constitutional designation, formal appointment, domestic legal status, foreign recognition, or international recognition.

The Source Agency's determination of whether Delcy Rodríguez de facto holds head of state of Venezuela shall be based on objective indicators of governing authority over the functions attached to head of state of Venezuela, which may include, without limitation:

Control over the executive ministries, administrative apparatus, bureaucracy, and state institutions associated with head of state of Venezuela
Issuance of binding national directives, decrees, orders, or instructions that are observably obeyed and enforced within the relevant jurisdiction
Control over the official seat of power, capital, headquarters, principal residence, or principal infrastructure associated with head of state of Venezuela
Treatment by the domestic state institutions associated with head of state of Venezuela as the operative holder of head of state of Venezuela
Treatment by foreign governments, multilateral institutions, and credentialed media as the operative holder of head of state of Venezuela

The following alone will NOT qualify as de facto holding head of state of Venezuela:

Holding the formal or constitutional title to head of state of Venezuela without exercising the core powers customarily attached to head of state of Venezuela
Serving in an acting, interim, caretaker, provisional, or temporary capacity that is subordinate to and accountable to a principal who continues to exercise the core powers customarily attached to head of state of Venezuela
Nomination, designation, election, appointment, or confirmation to head of state of Venezuela prior to the effective transfer of governing authority
Status as successor, heir apparent, or designated replacement to head of state of Venezuela prior to assumption of governing authority
Symbolic, ceremonial, or honorary status without exercise of the core powers customarily attached to head of state of Venezuela, except where head of state of Venezuela is itself a primarily ceremonial position and Delcy Rodríguez performs the ceremonial functions associated with head of state of Venezuela without operative displacement
Foreign or international recognition as the holder of head of state of Venezuela without exercise of operative governing authority within the relevant jurisdiction
Leadership from exile, in detention, or otherwise removed from the operating seat of head of state of Venezuela, where another individual is observably exercising the core powers customarily attached to head of state of Venezuela without subordination to Delcy Rodríguez
Holding a different role with general political, religious, military, or institutional influence over head of state of Venezuela without personally exercising the core powers customarily attached to head of state of Venezuela

If, at the end of 2026, the Source Agency does not identify any individual as exercising primary governing authority over the core powers customarily attached to head of state of Venezuela (including where head of state of Venezuela has been abolished, suspended, declared vacant, or where governing authority is genuinely fragmented among multiple individuals such that no individual primarily exercises the powers customarily attached to head of state of Venezuela), the Payout Criterion shall not be satisfied with respect to any listed person.

If, at the end of 2026, more than one individual claims or is claimed to de facto hold head of state of Venezuela, the Source Agency shall determine the de facto holder by reference to which individual primarily exercises the indicators of governing authority described above; in any such determination, the higher-ranked Source Agencies shall prevail over lower-ranked Source Agencies. If multiple persons are determined to do so equally, all those persons' markets shall resolve to $1/n, rounded down, where n is the number of persons who do so and who have a strike listed.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>Additional context — Updated August 25, 2026 
 Per the rules, “officially holds” refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela. As of this clarification, The UN-recognized government of Venezuela has not formally removed or replaced Nicolás Maduro as President, and official government sources and statements continue to identify him as the President of Venezuela. Temporary legal measures assigning the exercise of presidential powers do not, on their own, constitute a transfer of the presidency. 

 This market will resolve to the individual who officially holds the position of the head of state of Venezuela on Dec 31, 2026 at 12 PM ET.

 For the purposes of this market, "officially holds" refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela.

 If the Venezuelan government does not clearly state who is the head of state, the market will resolve to the individual who is listed as the Head of State by the UN (see: https://www.un.org/dgacm/en/content/protocol/hshgnfa ).

 In the event that more than one official head of state is listed by the Venezuelan government, this market will resolve to the individual who is listed as having primary status. If no distinction is made, the market will resolve to the individual who first assumed the position.

 If no individual holds the position this market will resolve to “No Head of State”.

 The following do NOT constitute "officially holding" the role: nominated, announced, or designated as the head of state of Venezuela but appointment not yet effective; appointed with an effective date after Dec 31, 2026; previously served as the head of state of Venezuela but term has expired, resigned, or been terminated before Dec 31, 2026; serving as the head of state of Venezuela in a consultant, contractor, or unofficial capacity; named as successor or heir apparent to the head of state of Venezuela but not yet appointed; or holding a different role with oversight of the head of state of Venezuela but not the specified position itself.

 The primary resolution source will be official information from the UN recognized government of Venezuela. If the Government of Venezuela does not clearly state who is the head of state, information from the UN and a consensus of credible reporting may be used.</pre>

</details>

### H8. Will Nicolás Maduro be the leader of Venezuela end of 2026? — Nicolás Maduro

- **Polymarket:** [Will Nicolás Maduro be the leader of Venezuela end of 2026? — Nicolás Maduro](https://polymarket.com/market/will-nicols-maduro-be-the-leader-of-venezuela-end-of-2026) · closes 2027-01-01
- **Limitless:** [Venezuela leader end of 2026? — Nicolás Maduro](https://limitless.exchange/markets/venezuela-leader-end-of-2026-1787676662914) · closes 2026-12-31

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to the individual who officially holds the position of the head of state of Venezuela on Dec 31, 2026 at 12 PM ET.

For the purposes of this market, "officially holds" refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela. 

If the Venezuelan government does not clearly state who is the head of state, the market will resolve to the individual who is listed as the Head of State by the UN (see: https://www.un.org/dgacm/en/content/protocol/hshgnfa).  

In the event that more than one official head of state is listed by the Venezuelan  government, this market will resolve to the individual who is listed as having primary status. If no distinction is made, the market will resolve to the individual who first assumed the position. 

If no individual holds the position this market will resolve to “No Head of State”. 

The following do NOT constitute "officially holding" the role: nominated, announced, or designated as the head of state of Venezuela but appointment not yet effective; appointed with an effective date after Dec 31, 2026; previously served as the head of state of Venezuela but term has expired, resigned, or been terminated before Dec 31, 2026; serving as the head of state of Venezuela in a consultant, contractor, or unofficial capacity; named as successor or heir apparent to the head of state of Venezuela but not yet appointed; or holding a different role with oversight of the head of state of Venezuela but not the specified position itself.

The primary resolution source will be official information from the UN recognized government of Venezuela. If the Government of Venezuela does not clearly state who is the head of state, information from the UN and a consensus of credible reporting may be used. 

Note: this market is mutually exclusive. 
</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>Additional context — Updated August 25, 2026 
 Per the rules, “officially holds” refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela. As of this clarification, The UN-recognized government of Venezuela has not formally removed or replaced Nicolás Maduro as President, and official government sources and statements continue to identify him as the President of Venezuela. Temporary legal measures assigning the exercise of presidential powers do not, on their own, constitute a transfer of the presidency. 

 This market will resolve to the individual who officially holds the position of the head of state of Venezuela on Dec 31, 2026 at 12 PM ET.

 For the purposes of this market, "officially holds" refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela.

 If the Venezuelan government does not clearly state who is the head of state, the market will resolve to the individual who is listed as the Head of State by the UN (see: https://www.un.org/dgacm/en/content/protocol/hshgnfa ).

 In the event that more than one official head of state is listed by the Venezuelan government, this market will resolve to the individual who is listed as having primary status. If no distinction is made, the market will resolve to the individual who first assumed the position.

 If no individual holds the position this market will resolve to “No Head of State”.

 The following do NOT constitute "officially holding" the role: nominated, announced, or designated as the head of state of Venezuela but appointment not yet effective; appointed with an effective date after Dec 31, 2026; previously served as the head of state of Venezuela but term has expired, resigned, or been terminated before Dec 31, 2026; serving as the head of state of Venezuela in a consultant, contractor, or unofficial capacity; named as successor or heir apparent to the head of state of Venezuela but not yet appointed; or holding a different role with oversight of the head of state of Venezuela but not the specified position itself.

 The primary resolution source will be official information from the UN recognized government of Venezuela. If the Government of Venezuela does not clearly state who is the head of state, information from the UN and a consensus of credible reporting may be used.</pre>

</details>

### H9. Will Yair Golan become Prime Minister of Israel following the 2026 Israeli legislative election? — Yair Golan

- **Kalshi:** [Will Yair Golan become Prime Minister of Israel following the 2026 Israeli legislative election? — Yair Golan](https://kalshi.com/markets/kxisraelpm) · closes 2027-10-27
- **Polymarket:** [Will Yair Golan be the next Prime Minister of Israel? — Yair Golan](https://polymarket.com/market/will-yair-golan-be-the-next-prime-minister-of-israel) · closes 2026-10-27

<details><summary>Rules — Kalshi</summary>

<pre>If Yair Golan becomes Prime Minister of Israel as a result of government formation following the 2026 Israeli legislative election and meets all constitutional requirements before Oct 27, 2027, then the market resolves to Yes.

The market resolves to the first person who, as a result of government formation following the election, is formally appointed, sworn in, or invested as Prime Minister according to the country's constitutional procedures, commands the confidence of the parliament/legislature, and exercises the full powers of the office (not serving in a caretaker/acting capacity from the previous government).

If no government forms by Oct 27, 2027, the Contract resolves to "No one" if that is an option and No for all other strikes. If new elections are called before government formation, the Contract resolves to "No one" immediately and No for all other strikes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>Legislative elections are schedule to be held in Israel on October 27, 2026. 

This market will resolve to the next individual who is officially appointed and sworn in as Prime Minister of Israel following the 2026 parliamentary election. If an election is called early, this market will immediately resolve to the individual who is officially appointed and sworn in after that election.

To count for resolution, the individual must be formally sworn in. Any interim or caretaker Prime Minister will not count toward the resolution of this market.

If no such Prime Minister is sworn in by December 31, 2027, 11:59 PM ET, this market will resolve to “Other”.

The primary resolution source for this market will be official information from the Government of Israel; however, a consensus of credible reporting may also be used.</pre>

</details>

### H10. Bank of England increases interest rates by 25 bps after November 2026 meeting? — 25 bps increase

- **Polymarket:** [Bank of England increases interest rates by 25 bps after November 2026 meeting? — 25 bps increase](https://polymarket.com/market/bank-of-england-increases-interest-rates-by-25-bps-after-november-2026-meeting-20260730150602310) · closes 2026-11-05
- **Limitless:** [Bank of England decision in November? — 25 bps increase](https://limitless.exchange/markets/bank-of-england-decision-in-november-1789387521621) · closes 2026-11-05

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the change in basis points in the Bank Rate resulting from the November 2026 meeting of the Bank of England’s Monetary Policy Committee, relative to the level it was prior to this meeting.

The resolution source will be official information from the Bank of England, including the statement or release from its November 2026 Monetary Policy Committee meeting, scheduled for November 5, 2026, as listed on the official Bank of England calendar (https://www.bankofengland.co.uk/monetary-policy/upcoming-mpc-dates). This market may resolve as soon as the statement or release of the Bank of England's November 2026 Monetary Policy Committee meeting with relevant data is issued.

If the specified rate is defined by an upper and lower bound, the relevant change will be the change to the upper bound.

If the specified rate is changed to a level not expressed in the displayed options, the change will be rounded according to the following guidelines. Increases or decreases of less than 25 bps will be rounded to 25 bps (e.g. an increase or decrease of 10 bps would be considered to be an increase or decrease of 25 bps). Increases or decreases of greater than 25 bps will be rounded to the nearest 25 bps and will be rounded away from 0 in cases of equidistance (e.g., an increase or decrease of 37.5 bps would be considered to be an increase or decrease of 50 bps). Displayed options of “Increase” or “Decrease” will include policy rate increases or decreases of any size.

If the specified meeting is postponed to a date and time before the start of the next scheduled meeting, this market will resolve based on the outcome of that postponed meeting. If the specified meeting is cancelled, or postponed such that no decision is announced by the start of the next scheduled meeting, this market will resolve to the “No Change” bracket. Emergency changes to the specified rate not resulting from the specified meeting will not be considered.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve according to the change in basis points in the Bank Rate resulting from the November 2026 meeting of the Bank of England’s Monetary Policy Committee, relative to the level it was prior to this meeting.

 The resolution source will be official information from the Bank of England, including the statement or release from its November 2026 Monetary Policy Committee meeting, scheduled for November 5, 2026, as listed on the official Bank of England calendar ( https://www.bankofengland.co.uk/monetary-policy/upcoming-mpc-dates ). This market may resolve as soon as the statement or release of the Bank of England's November 2026 Monetary Policy Committee meeting with relevant data is issued.

 If the specified rate is defined by an upper and lower bound, the relevant change will be the change to the upper bound.

 If the specified rate is changed to a level not expressed in the displayed options, the change will be rounded according to the following guidelines. Increases or decreases of less than 25 bps will be rounded to 25 bps (e.g. an increase or decrease of 10 bps would be considered to be an increase or decrease of 25 bps). Increases or decreases of greater than 25 bps will be rounded to the nearest 25 bps and will be rounded away from 0 in cases of equidistance (e.g., an increase or decrease of 37.5 bps would be considered to be an increase or decrease of 50 bps). Displayed options of “Increase” or “Decrease” will include policy rate increases or decreases of any size.

 If the specified meeting is postponed to a date and time before the start of the next scheduled meeting, this market will resolve based on the outcome of that postponed meeting. If the specified meeting is cancelled, or postponed such that no decision is announced by the start of the next scheduled meeting, this market will resolve to the “No Change” bracket. Emergency changes to the specified rate not resulting from the specified meeting will not be considered.</pre>

</details>

### H11. Will the US confirm that aliens exist before 2027? — December 31

- **Polymarket:** [Will the US confirm that aliens exist before 2027? — December 31](https://polymarket.com/market/will-the-us-confirm-that-aliens-exist-before-2027-789-924-249) · closes 2027-01-01
- **Limitless:** [Will the US confirm that aliens exist by...? — December 31](https://limitless.exchange/markets/will-the-us-confirm-that-aliens-exist-by-1787671443088) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to "Yes" if the President of the United States, any member of the Cabinet of the United States, any member of the Joint Chiefs of Staff, or any US federal agency definitively states that extraterrestrial life or technology exists by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to "No".

The primary resolution source for this market will be official information from the government of the United States, however a consensus of credible reporting will also be used.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to "Yes" if the President of the United States, any member of the Cabinet of the United States, any member of the Joint Chiefs of Staff, or any US federal agency definitively states that extraterrestrial life or technology exists by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to "No".

 The primary resolution source for this market will be official information from the government of the United States, however a consensus of credible reporting will also be used.</pre>

</details>

### H12. Who will win the next presidential election? — Alexandria Ocasio-Cortez

- **Kalshi:** [Who will win the next presidential election? — Alexandria Ocasio-Cortez](https://kalshi.com/markets/kxpresperson) · closes 2029-11-07
- **Polymarket:** [Will Alexandria Ocasio-Cortez win the 2028 US Presidential Election? — Alexandria Ocasio-Cortez](https://polymarket.com/market/will-alexandria-ocasio-cortez-win-the-2028-us-presidential-election) · closes 2029-01-21

<details><summary>Rules — Kalshi</summary>

<pre>If Alexandria Ocasio-Cortez is the next person inaugurated as President for the term beginning in 2029, then the market resolves to Yes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>The 2028 US Presidential Election is scheduled to take place on November 7, 2028.

This market will resolve to the person who wins the 2028 US Presidential Election.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race for the same candidate by the inauguration date (January 20, 2029) this market will resolve based on who is inaugurated.</pre>

</details>

### H13. Will Democratics win the Senate race in Ohio? — Sherrod Brown

- **Kalshi:** [Will Democratics win the Senate race in Ohio? — Sherrod Brown](https://kalshi.com/markets/senateohs) · closes 2027-11-03
- **Polymarket:** [Will the Democrats win the Ohio Senate race in 2026? — Sherrod Brown (D)](https://polymarket.com/market/will-the-democrats-win-the-ohio-senate-race-in-2026)

<details><summary>Rules — Kalshi</summary>

<pre>If a representative of the Democratic party is sworn in as a Senator of Ohio for the term beginning in 2027, then the market resolves to Yes.

This market is eligible for accelerated determination after a consensus of media organizations project the winner. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the winner of the 2026 Ohio U.S. Senate special election currently scheduled for November 3, inclusive of any run-offs.

A candidate shall be considered to represent a party in the event that he or she is the nominee of the party in question. Candidates other than the Democratic or Republican nominee (e.g., Greens, Libertarian, independent) may be added at a later date.

Candidates who run as independents will not be encompassed by the “Democrat” or “Republican” options regardless of any affiliation they may have with the party.

The candidates may be named in the contract for the convenience of traders. In the event that any named candidate is replaced as the nominee of their respective party prior to election day, the name in the contract will be updated and the market will resolve based on the replacement nominee of the party.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race in this state for the same candidate, this market will resolve based on the official certification.</pre>

</details>

### H14. Will María Corina Machado de facto hold head of state of Venezuela at the end of 2026? — María Corina Machado

- **Kalshi:** [Will María Corina Machado de facto hold head of state of Venezuela at the end of 2026? — María Corina Machado](https://kalshi.com/markets/kxvenezdefacto) · closes 2027-01-02
- **Polymarket:** [Will María Corina Machado be the leader of Venezuela end of 2026? — María Corina Machado](https://polymarket.com/market/will-mara-corina-machado-be-the-leader-of-venezuela-end-of-2026) · closes 2027-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If María Corina Machado de facto holds the position of head of state of Venezuela at the end of 2026, then the market resolves to Yes.

For the purposes of this Contract, "María Corina Machado de facto holds head of state of Venezuela" means that, at the end of 2026, María Corina Machado is the individual who primarily exercises the governing authority and core powers customarily attached to head of state of Venezuela, regardless of María Corina Machado's formal title, constitutional designation, formal appointment, domestic legal status, foreign recognition, or international recognition.

The Source Agency's determination of whether María Corina Machado de facto holds head of state of Venezuela shall be based on objective indicators of governing authority over the functions attached to head of state of Venezuela, which may include, without limitation:

Control over the executive ministries, administrative apparatus, bureaucracy, and state institutions associated with head of state of Venezuela
Issuance of binding national directives, decrees, orders, or instructions that are observably obeyed and enforced within the relevant jurisdiction
Control over the official seat of power, capital, headquarters, principal residence, or principal infrastructure associated with head of state of Venezuela
Treatment by the domestic state institutions associated with head of state of Venezuela as the operative holder of head of state of Venezuela
Treatment by foreign governments, multilateral institutions, and credentialed media as the operative holder of head of state of Venezuela

The following alone will NOT qualify as de facto holding head of state of Venezuela:

Holding the formal or constitutional title to head of state of Venezuela without exercising the core powers customarily attached to head of state of Venezuela
Serving in an acting, interim, caretaker, provisional, or temporary capacity that is subordinate to and accountable to a principal who continues to exercise the core powers customarily attached to head of state of Venezuela
Nomination, designation, election, appointment, or confirmation to head of state of Venezuela prior to the effective transfer of governing authority
Status as successor, heir apparent, or designated replacement to head of state of Venezuela prior to assumption of governing authority
Symbolic, ceremonial, or honorary status without exercise of the core powers customarily attached to head of state of Venezuela, except where head of state of Venezuela is itself a primarily ceremonial position and María Corina Machado performs the ceremonial functions associated with head of state of Venezuela without operative displacement
Foreign or international recognition as the holder of head of state of Venezuela without exercise of operative governing authority within the relevant jurisdiction
Leadership from exile, in detention, or otherwise removed from the operating seat of head of state of Venezuela, where another individual is observably exercising the core powers customarily attached to head of state of Venezuela without subordination to María Corina Machado
Holding a different role with general political, religious, military, or institutional influence over head of state of Venezuela without personally exercising the core powers customarily attached to head of state of Venezuela

If, at the end of 2026, the Source Agency does not identify any individual as exercising primary governing authority over the core powers customarily attached to head of state of Venezuela (including where head of state of Venezuela has been abolished, suspended, declared vacant, or where governing authority is genuinely fragmented among multiple individuals such that no individual primarily exercises the powers customarily attached to head of state of Venezuela), the Payout Criterion shall not be satisfied with respect to any listed person.

If, at the end of 2026, more than one individual claims or is claimed to de facto hold head of state of Venezuela, the Source Agency shall determine the de facto holder by reference to which individual primarily exercises the indicators of governing authority described above; in any such determination, the higher-ranked Source Agencies shall prevail over lower-ranked Source Agencies. If multiple persons are determined to do so equally, all those persons' markets shall resolve to $1/n, rounded down, where n is the number of persons who do so and who have a strike listed.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to the individual who officially holds the position of the head of state of Venezuela on Dec 31, 2026 at 12 PM ET.

For the purposes of this market, "officially holds" refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela. 

If the Venezuelan government does not clearly state who is the head of state, the market will resolve to the individual who is listed as the Head of State by the UN (see: https://www.un.org/dgacm/en/content/protocol/hshgnfa).  

In the event that more than one official head of state is listed by the Venezuelan  government, this market will resolve to the individual who is listed as having primary status. If no distinction is made, the market will resolve to the individual who first assumed the position. 

If no individual holds the position this market will resolve to “No Head of State”. 

The following do NOT constitute "officially holding" the role: nominated, announced, or designated as the head of state of Venezuela but appointment not yet effective; appointed with an effective date after Dec 31, 2026; previously served as the head of state of Venezuela but term has expired, resigned, or been terminated before Dec 31, 2026; serving as the head of state of Venezuela in a consultant, contractor, or unofficial capacity; named as successor or heir apparent to the head of state of Venezuela but not yet appointed; or holding a different role with oversight of the head of state of Venezuela but not the specified position itself.

The primary resolution source will be official information from the UN recognized government of Venezuela. If the Government of Venezuela does not clearly state who is the head of state, information from the UN and a consensus of credible reporting may be used. 

Note: this market is mutually exclusive. 
</pre>

</details>

### H15. Will María Corina Machado de facto hold head of state of Venezuela at the end of 2026? — María Corina Machado

- **Kalshi:** [Will María Corina Machado de facto hold head of state of Venezuela at the end of 2026? — María Corina Machado](https://kalshi.com/markets/kxvenezdefacto) · closes 2027-01-02
- **Limitless:** [Venezuela leader end of 2026? — María Corina Machado](https://limitless.exchange/markets/venezuela-leader-end-of-2026-1787676662914) · closes 2026-12-31

<details><summary>Rules — Kalshi</summary>

<pre>If María Corina Machado de facto holds the position of head of state of Venezuela at the end of 2026, then the market resolves to Yes.

For the purposes of this Contract, "María Corina Machado de facto holds head of state of Venezuela" means that, at the end of 2026, María Corina Machado is the individual who primarily exercises the governing authority and core powers customarily attached to head of state of Venezuela, regardless of María Corina Machado's formal title, constitutional designation, formal appointment, domestic legal status, foreign recognition, or international recognition.

The Source Agency's determination of whether María Corina Machado de facto holds head of state of Venezuela shall be based on objective indicators of governing authority over the functions attached to head of state of Venezuela, which may include, without limitation:

Control over the executive ministries, administrative apparatus, bureaucracy, and state institutions associated with head of state of Venezuela
Issuance of binding national directives, decrees, orders, or instructions that are observably obeyed and enforced within the relevant jurisdiction
Control over the official seat of power, capital, headquarters, principal residence, or principal infrastructure associated with head of state of Venezuela
Treatment by the domestic state institutions associated with head of state of Venezuela as the operative holder of head of state of Venezuela
Treatment by foreign governments, multilateral institutions, and credentialed media as the operative holder of head of state of Venezuela

The following alone will NOT qualify as de facto holding head of state of Venezuela:

Holding the formal or constitutional title to head of state of Venezuela without exercising the core powers customarily attached to head of state of Venezuela
Serving in an acting, interim, caretaker, provisional, or temporary capacity that is subordinate to and accountable to a principal who continues to exercise the core powers customarily attached to head of state of Venezuela
Nomination, designation, election, appointment, or confirmation to head of state of Venezuela prior to the effective transfer of governing authority
Status as successor, heir apparent, or designated replacement to head of state of Venezuela prior to assumption of governing authority
Symbolic, ceremonial, or honorary status without exercise of the core powers customarily attached to head of state of Venezuela, except where head of state of Venezuela is itself a primarily ceremonial position and María Corina Machado performs the ceremonial functions associated with head of state of Venezuela without operative displacement
Foreign or international recognition as the holder of head of state of Venezuela without exercise of operative governing authority within the relevant jurisdiction
Leadership from exile, in detention, or otherwise removed from the operating seat of head of state of Venezuela, where another individual is observably exercising the core powers customarily attached to head of state of Venezuela without subordination to María Corina Machado
Holding a different role with general political, religious, military, or institutional influence over head of state of Venezuela without personally exercising the core powers customarily attached to head of state of Venezuela

If, at the end of 2026, the Source Agency does not identify any individual as exercising primary governing authority over the core powers customarily attached to head of state of Venezuela (including where head of state of Venezuela has been abolished, suspended, declared vacant, or where governing authority is genuinely fragmented among multiple individuals such that no individual primarily exercises the powers customarily attached to head of state of Venezuela), the Payout Criterion shall not be satisfied with respect to any listed person.

If, at the end of 2026, more than one individual claims or is claimed to de facto hold head of state of Venezuela, the Source Agency shall determine the de facto holder by reference to which individual primarily exercises the indicators of governing authority described above; in any such determination, the higher-ranked Source Agencies shall prevail over lower-ranked Source Agencies. If multiple persons are determined to do so equally, all those persons' markets shall resolve to $1/n, rounded down, where n is the number of persons who do so and who have a strike listed.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>Additional context — Updated August 25, 2026 
 Per the rules, “officially holds” refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela. As of this clarification, The UN-recognized government of Venezuela has not formally removed or replaced Nicolás Maduro as President, and official government sources and statements continue to identify him as the President of Venezuela. Temporary legal measures assigning the exercise of presidential powers do not, on their own, constitute a transfer of the presidency. 

 This market will resolve to the individual who officially holds the position of the head of state of Venezuela on Dec 31, 2026 at 12 PM ET.

 For the purposes of this market, "officially holds" refers to the individual that was formally appointed, confirmed (if confirmation is required), and sworn in as the head of state of Venezuela or otherwise confirmed by official government information as being the head of state of Venezuela.

 If the Venezuelan government does not clearly state who is the head of state, the market will resolve to the individual who is listed as the Head of State by the UN (see: https://www.un.org/dgacm/en/content/protocol/hshgnfa ).

 In the event that more than one official head of state is listed by the Venezuelan government, this market will resolve to the individual who is listed as having primary status. If no distinction is made, the market will resolve to the individual who first assumed the position.

 If no individual holds the position this market will resolve to “No Head of State”.

 The following do NOT constitute "officially holding" the role: nominated, announced, or designated as the head of state of Venezuela but appointment not yet effective; appointed with an effective date after Dec 31, 2026; previously served as the head of state of Venezuela but term has expired, resigned, or been terminated before Dec 31, 2026; serving as the head of state of Venezuela in a consultant, contractor, or unofficial capacity; named as successor or heir apparent to the head of state of Venezuela but not yet appointed; or holding a different role with oversight of the head of state of Venezuela but not the specified position itself.

 The primary resolution source will be official information from the UN recognized government of Venezuela. If the Government of Venezuela does not clearly state who is the head of state, information from the UN and a consensus of credible reporting may be used.</pre>

</details>

### H16. Will Lewis Hamilton be the 2026 F1 Drivers' Champion? — Lewis Hamilton

- **Polymarket:** [Will Lewis Hamilton be the 2026 F1 Drivers' Champion? — Lewis Hamilton](https://polymarket.com/market/will-lewis-hamilton-be-the-2026-f1-drivers-champion) · closes 2026-12-06
- **Limitless:** [F1 Drivers' Champion — Lewis Hamilton](https://limitless.exchange/markets/f1-drivers-champion-1769015228907) · closes 2027-04-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the listed driver that finishes 1st in the driver standings for the 2026 F1 season.

This market will resolve as soon as the official results of the final scheduled race of the 2026 F1 season are known.

If multiple drivers tie for first place in the drivers standings, this market will resolve according to the tiebreak procedure used by F1 to determine the 2026 F1 Drivers’ champion.

If at any point it becomes impossible for a listed driver to win the 2026 F1 Drivers Championship based on the rules of F1 (e.g., they are mathematically eliminated from contention), the corresponding market will resolve to “No”.

If the F1 season is permanently canceled or has not been completed by March 31, 2027, 11:59 PM ET, this market will resolve to “Other”.

The primary resolution source for this market will be official information from Formula 1.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve according to the listed driver that finishes 1st in the driver standings for the 2026 F1 season.
 This market will resolve as soon as the official results of the final scheduled race of the 2026 F1 season are known.
 If multiple drivers tie for first place in the drivers standings, this market will resolve according to the tiebreak procedure used by F1 to determine the 2026 F1 Drivers’ champion.
 If the F1 season is permanently canceled or has not been completed by March 31, 2027, 11:59 PM ET, this market will resolve to “Other”.
 The primary resolution source for this market will be official information from Formula 1.</pre>

</details>

### H17. Another Fed rate hike in 2026?

- **Polymarket:** [Another Fed rate hike in 2026?](https://polymarket.com/market/another-fed-rate-hike-in-2026) · closes 2026-12-09
- **Limitless:** [Another Fed rate hike in 2026?](https://limitless.exchange/markets/another-fed-rate-hike-in-2026-1789636928078) · closes 2026-12-09

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to “Yes” if the upper bound of the target federal funds rate is increased at any point between September 17, 2026 and the completion of the Fed's December 2026 meeting, currently scheduled for December 8 to 9, 2026, inclusive of any rate hike announced as a result of the December meeting. Otherwise, this market will resolve to “No”.

Any change to the target federal funds rate announced at the conclusion of the September 15 to 16, 2026 FOMC meeting will not count toward this market. Emergency rate hikes announced on or after September 17, 2026 will qualify.

This market may not resolve to "No" until the Fed has released its rate change decision following its December meeting.

The primary resolution source for this market will be the official website of the Federal Reserve (https://www.federalreserve.gov/monetarypolicy/openmarket.htm), however a consensus of credible reporting may also be used.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to “Yes” if the upper bound of the target federal funds rate is increased at any point between September 17, 2026 and the completion of the Fed's December 2026 meeting, currently scheduled for December 8 to 9, 2026, inclusive of any rate hike announced as a result of the December meeting. Otherwise, this market will resolve to “No”.

 Any change to the target federal funds rate announced at the conclusion of the September 15 to 16, 2026 FOMC meeting will not count toward this market. Emergency rate hikes announced on or after September 17, 2026 will qualify.

 This market may not resolve to "No" until the Fed has released its rate change decision following its December meeting.

 The primary resolution source for this market will be the official website of the Federal Reserve ( https://www.federalreserve.gov/monetarypolicy/openmarket.htm ), however a consensus of credible reporting may also be used.</pre>

</details>

### H18. Will Republicans win the Senate race in Minnesota? — Michele Tafoya

- **Kalshi:** [Will Republicans win the Senate race in Minnesota? — Michele Tafoya](https://kalshi.com/markets/senatemn) · closes 2027-11-03
- **Polymarket:** [Will the Republicans win the Minnesota Senate race in 2026? — Michele Tafoya (R)](https://polymarket.com/market/will-the-republicans-win-the-minnesota-senate-race-in-2026)

<details><summary>Rules — Kalshi</summary>

<pre>If a representative of the Republican party is sworn in as a Senator of Minnesota for the term beginning in 2027, then the market resolves to Yes.

This market is eligible for accelerated determination after a consensus of media organizations project the winner. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the winner of the 2026 midterm Minnesota U.S. Senate election, inclusive of any run-offs.

A candidate shall be considered to represent a party in the event that he or she is the nominee of the party in question. Candidates other than the Democratic or Republican nominee (e.g., Greens, Libertarian, independent) may be added at a later date.

Candidates who run as independents will not be encompassed by the “Democrat” or “Republican” options regardless of any affiliation they may have with the party.

The candidates may be named in the contract for the convenience of traders. In the event that any named candidate is replaced as the nominee of their respective party prior to election day, the name in the contract will be updated and the market will resolve based on the replacement nominee of the party.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race in this state for the same candidate, this market will resolve based on the official certification.</pre>

</details>

### H19. Will Naftali Bennett be the next Prime Minister of Israel? — Naftali Bennett

- **Kalshi:** [Will Naftali Bennett be the next Prime Minister of Israel? — Naftali Bennett](https://kalshi.com/markets/kxnextisraelpm) · closes 2045-01-01
- **Limitless:** [Who will be the next Prime Minister of Israel after next election? — Naftali Bennett](https://limitless.exchange/markets/who-will-be-the-next-prime-minister-of-israel-after-next-election-1769099103917) · closes 2028-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If the first new person to hold Prime Minister of Israel after Issuance is Naftali Bennett, then the market resolves to Yes.

The market resolves based on who actually assumes the office of Prime Minister, not who is elected or nominated. Acting or interim appointments count as holding the position if they formally assume the office. The person must be different from whoever held the position at market issuance - if the same person continues in office through the expiration date, all markets resolve to No. Resolution is based on official announcements from the country's legislature or government, with The New York Times as a secondary source for confirmation.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>Legislative elections are schedule to be held in Israel on October 27, 2026.
 This market will resolve to the next individual who is officially appointed and sworn in as Prime Minister of Israel following the 2026 parliamentary election. If an election is called early, this market will immediately resolve to the individual who is officially appointed and sworn in after that election.
 To count for resolution, the individual must be formally sworn in. Any interim or caretaker Prime Minister will not count toward the resolution of this market.
 If no such Prime Minister is sworn in by December 31, 2027, 11:59 PM ET, this market will resolve to “Other”.
 The primary resolution source for this market will be official information from the Government of Israel; however, a consensus of credible reporting may also be used.</pre>

</details>

### H20. Will Elmano de Freitas win the 2026 Ceará gubernatorial election? — Elmano de Freitas

- **Kalshi:** [Will Elmano de Freitas win the 2026 Ceará gubernatorial election? — Elmano de Freitas](https://kalshi.com/markets/kxcearagov) · closes 2027-10-04
- **Polymarket:** [Will Elmano de Freitas win the 2026 Ceará gubernatorial election? — Elmano de Freitas](https://polymarket.com/market/will-elmano-de-freitas-win-the-2026-cear-gubernatorial-election) · closes 2027-07-01

<details><summary>Rules — Kalshi</summary>

<pre>If Elmano de Freitas wins the 2026 Ceará gubernatorial election, then the market resolves to Yes.

This market is eligible for accelerated resolution by a consensus of media calls. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>The Ceará gubernatorial election is scheduled to take place in Brazil on October 4, 2026, with a runoff on October 25, 2026, if no candidate receives a majority of the valid votes in the first round.

This market will resolve according to the candidate who wins this election.

Temporary, interim, or placeholder governors appointed by any means before the specified election will not be considered.

If the result of this election isn't known by June 30, 2027, 11:59 PM ET, the market will resolve to "Other".

This market will resolve based on the result of the election, as indicated by a consensus of credible reporting. If there is ambiguity, this market will resolve based solely on the official results as reported by the Brazilian government, specifically the Superior Electoral Court (Tribunal Superior Eleitoral, TSE) (e.g., www.tse.jus.br/eleicoes/resultados-eleicoes).</pre>

</details>

### H21. Iran charges Hormuz fees by September 30? — September 30

- **Polymarket:** [Iran charges Hormuz fees by September 30? — September 30](https://polymarket.com/market/iran-charges-hormuz-fees-by-september-30) · closes 2026-10-01
- **Limitless:** [Iran charges Hormuz fees by...? — September 30](https://limitless.exchange/markets/iran-charges-hormuz-fees-by-1787660046607) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>This market resolves to “Yes” if the Iranian government officially announces and begins collecting fees, tolls, charges, tariffs, or similar payments from commercial vessels which are mandatory for passage through or access to the Strait of Hormuz between market creation and the specified date, 11:59 PM ET. Otherwise, this market resolves to “No.”

A qualifying fee must be an announced policy which applies generally to all commercial vessels, or a defined subcategory of commercial vessels (e.g., vessels flagged to the US and its allies). Isolated demanded charges will not qualify.

A fee is mandatory if, in practice, affected commercial vessels cannot transit or access the Strait of Hormuz without paying it, regardless of whether Iran characterizes the payment as voluntary or a fee for services. Fees described as tolls, maritime fees, service charges, environmental fees, security fees, insurance charges, etc. will qualify provided they are recognized as mandatory for passage through or access to the Strait of Hormuz by a consensus of credible reporting (e.g., a mandatory insurance fee charged by the Iranian Persian Gulf Strait Authority would qualify).

Both of the following are required to occur prior to the specified date, 11:59 PM ET to satisfy this market’s resolution criteria:
1) An official announcement from the Iranian government that such a fee is being, or will be, implemented.
2) A consensus of credible reporting that collection of the fee has begun.

Fees charged by Oman, the United Arab Emirates, shipping insurers, private companies, or other non-Iranian entities do not qualify unless charged jointly with Iran, or if Iran directly receives the fee or controls the charging entity. Normal port fees, customs duties, sanctions-related costs, or shipping surcharges do not alone qualify. 

The resolution sources will be official announcements from the government of Iran and consensus of credible reporting.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market resolves to “Yes” if the Iranian government officially announces and begins collecting fees, tolls, charges, tariffs, or similar payments from commercial vessels which are mandatory for passage through or access to the Strait of Hormuz between market creation and the specified date, 11:59 PM ET. Otherwise, this market resolves to “No.”

 A qualifying fee must be an announced policy which applies generally to all commercial vessels, or a defined subcategory of commercial vessels (e.g., vessels flagged to the US and its allies). Isolated demanded charges will not qualify.

 A fee is mandatory if, in practice, affected commercial vessels cannot transit or access the Strait of Hormuz without paying it, regardless of whether Iran characterizes the payment as voluntary or a fee for services. Fees described as tolls, maritime fees, service charges, environmental fees, security fees, insurance charges, etc. will qualify provided they are recognized as mandatory for passage through or access to the Strait of Hormuz by a consensus of credible reporting (e.g., a mandatory insurance fee charged by the Iranian Persian Gulf Strait Authority would qualify).

 Both of the following are required to occur prior to the specified date, 11:59 PM ET to satisfy this market’s resolution criteria:
 1) An official announcement from the Iranian government that such a fee is being, or will be, implemented.
 2) A consensus of credible reporting that collection of the fee has begun.

 Fees charged by Oman, the United Arab Emirates, shipping insurers, private companies, or other non-Iranian entities do not qualify unless charged jointly with Iran, or if Iran directly receives the fee or controls the charging entity. Normal port fees, customs duties, sanctions-related costs, or shipping surcharges do not alone qualify. 

 The resolution sources will be official announcements from the government of Iran and consensus of credible reporting.</pre>

</details>

### H22. Will Gadi Eizenkot become Prime Minister of Israel following the 2026 Israeli legislative election? — Gadi Eizenkot

- **Kalshi:** [Will Gadi Eizenkot become Prime Minister of Israel following the 2026 Israeli legislative election? — Gadi Eizenkot](https://kalshi.com/markets/kxisraelpm) · closes 2027-10-27
- **Limitless:** [Who will be the next Prime Minister of Israel after next election? — Gadi Eizenkot](https://limitless.exchange/markets/who-will-be-the-next-prime-minister-of-israel-after-next-election-1769099103917) · closes 2028-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If Gadi Eizenkot becomes Prime Minister of Israel as a result of government formation following the 2026 Israeli legislative election and meets all constitutional requirements before Oct 27, 2027, then the market resolves to Yes.

The market resolves to the first person who, as a result of government formation following the election, is formally appointed, sworn in, or invested as Prime Minister according to the country's constitutional procedures, commands the confidence of the parliament/legislature, and exercises the full powers of the office (not serving in a caretaker/acting capacity from the previous government).

If no government forms by Oct 27, 2027, the Contract resolves to "No one" if that is an option and No for all other strikes. If new elections are called before government formation, the Contract resolves to "No one" immediately and No for all other strikes.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>Legislative elections are schedule to be held in Israel on October 27, 2026.
 This market will resolve to the next individual who is officially appointed and sworn in as Prime Minister of Israel following the 2026 parliamentary election. If an election is called early, this market will immediately resolve to the individual who is officially appointed and sworn in after that election.
 To count for resolution, the individual must be formally sworn in. Any interim or caretaker Prime Minister will not count toward the resolution of this market.
 If no such Prime Minister is sworn in by December 31, 2027, 11:59 PM ET, this market will resolve to “Other”.
 The primary resolution source for this market will be official information from the Government of Israel; however, a consensus of credible reporting may also be used.</pre>

</details>

### H23. Strait of Hormuz traffic returns to normal by December 31?

- **Polymarket:** [Strait of Hormuz traffic returns to normal by December 31?](https://polymarket.com/market/strait-of-hormuz-traffic-returns-to-normal-by-december-31) · closes 2027-01-01
- **Limitless:** [Strait of Hormuz traffic returns to normal by December 31?](https://limitless.exchange/markets/strait-of-hormuz-traffic-returns-to-normal-by-december-31-1787655886769) · closes 2026-12-31

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to “Yes” if IMF Portwatch publishes a 7-day moving average of transit calls (“Arrivals of Ships”) for the Strait of Hormuz equal to or above 60 for any date between market creation and December 31, 2026. Otherwise, this market will resolve to “No”.

Daily transit calls include container, dry bulk, roll-on/roll-off, general cargo, and tanker ships. Ships not reported by IMF Portwatch will not be considered.

This market will resolve as soon as IMF Portwatch publishes a 7-day moving average of transit calls equal to or above the specified level, or once data has been published for the final date in the specified period and no such value has been published. If no data has been published for the final date of the specified period within 14 calendar days (ET) after the end of that period, this market will resolve based on data published up to that point.

Revisions to previously published data points made within this market’s timeframe will be considered. However, they will not disqualify a previously published data point from qualifying. Revisions to previously published data points after data is published for December 31, 2026, however, will not be considered.

In case of obvious data integrity issues (i.e., erroneous data), the market may remain open until the end of the third calendar day (ET) after the date on which such data is first released to allow for corrections. Data integrity issues refer only to clerical or other similar errors in the underlying data, and do not include cases where IMF Portwatch differs from alternative sources.

The resolution source for this market will be IMF Portwatch, specifically the transit calls data published for the Strait of Hormuz at https://portwatch.imf.org/pages/cb5856222a5b4105adc6ee7e880a1730, both in the chart and through downloadable files.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to “Yes” if IMF Portwatch publishes a 7-day moving average of transit calls (“Arrivals of Ships”) for the Strait of Hormuz equal to or above 60 for any date between market creation and December 31, 2026. Otherwise, this market will resolve to “No”.

 Daily transit calls include container, dry bulk, roll-on/roll-off, general cargo, and tanker ships. Ships not reported by IMF Portwatch will not be considered.

 This market will resolve as soon as IMF Portwatch publishes a 7-day moving average of transit calls equal to or above the specified level, or once data has been published for the final date in the specified period and no such value has been published. If no data has been published for the final date of the specified period within 14 calendar days (ET) after the end of that period, this market will resolve based on data published up to that point.

 Revisions to previously published data points made within this market’s timeframe will be considered. However, they will not disqualify a previously published data point from qualifying. Revisions to previously published data points after data is published for December 31, 2026, however, will not be considered.

 In case of obvious data integrity issues (i.e., erroneous data), the market may remain open until the end of the third calendar day (ET) after the date on which such data is first released to allow for corrections. Data integrity issues refer only to clerical or other similar errors in the underlying data, and do not include cases where IMF Portwatch differs from alternative sources.

 The resolution source for this market will be IMF Portwatch, specifically the transit calls data published for the Strait of Hormuz at https://portwatch.imf.org/pages/cb5856222a5b4105adc6ee7e880a1730 , both in the chart and through downloadable files.</pre>

</details>

### H24. Will Republicans win the Senate race in Texas? — Ken Paxton

- **Kalshi:** [Will Republicans win the Senate race in Texas? — Ken Paxton](https://kalshi.com/markets/senatetx) · closes 2027-11-03
- **Polymarket:** [Will the Republicans win the Texas Senate race in 2026? — Ken Paxton (R)](https://polymarket.com/market/will-the-republicans-win-the-texas-senate-race-in-2026)

<details><summary>Rules — Kalshi</summary>

<pre>If a representative of the Republican party is sworn in as a Senator of Texas for the term beginning in 2027, then the market resolves to Yes.

This market is eligible for accelerated determination after a consensus of media organizations project the winner. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the winner of the 2026 midterm Texas U.S. Senate election, inclusive of any run-offs.

A candidate shall be considered to represent a party in the event that he or she is the nominee of the party in question. Candidates other than the Democratic or Republican nominee (e.g., Greens, Libertarian, independent) may be added at a later date.

Candidates who run as independents will not be encompassed by the “Democrat” or “Republican” options regardless of any affiliation they may have with the party.

The candidates may be named in the contract for the convenience of traders. In the event that any named candidate is replaced as the nominee of their respective party prior to election day, the name in the contract will be updated and the market will resolve based on the replacement nominee of the party.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race in this state for the same candidate, this market will resolve based on the official certification.</pre>

</details>

### H25. Will Putin and Zelenskyy meet next in Russia? — Russia

- **Kalshi:** [Will Putin and Zelenskyy meet next in Russia? — Russia](https://kalshi.com/markets/kxputinzelenskyylocation) · closes 2028-12-31
- **Polymarket:** [Will Zelenskyy and Putin meet next in Russia before 2027? — Russia](https://polymarket.com/market/will-zelenskyy-and-putin-meet-next-in-russia) · closes 2027-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If the next Putin and Zelenskyy meeting happens in Russia before Dec 31, 2028, then the market resolves to Yes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the location of the next meeting between Volodymyr Zelenskyy and Vladimir Putin by December 31, 2026, 11:59 PM ET. If no meeting takes place by December 31 ET, this market will resolve to "No meeting before 2027".

A meeting is defined as any encounter where Zelenskyy and Putin are both present and interact with each other in person.

For the purpose of this market, a meeting held on Ukrainian territory under the de facto control of Russia (e.g., Crimea) will be considered part of Russia.

The primary resolution source for this market will be a consensus of credible reporting.</pre>

</details>

### H26. Will Republicans win the Senate race in Michigan? — Mike Rogers

- **Kalshi:** [Will Republicans win the Senate race in Michigan? — Mike Rogers](https://kalshi.com/markets/senatemi) · closes 2027-11-03
- **Polymarket:** [Will the Republicans win the Michigan Senate race in 2026? — Mike Rogers (R)](https://polymarket.com/market/will-the-republicans-win-the-michigan-senate-race-in-2026)

<details><summary>Rules — Kalshi</summary>

<pre>If a representative of the Republican party is sworn in as a Senator of Michigan for the term beginning in 2027, then the market resolves to Yes.

This market is eligible for accelerated determination after a consensus of media organizations project the winner. See full rules for details.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve according to the winner of the 2026 midterm Michigan U.S. Senate election, inclusive of any run-offs.

A candidate shall be considered to represent a party in the event that he or she is the nominee of the party in question. Candidates other than the Democratic or Republican nominee (e.g., Greens, Libertarian, independent) may be added at a later date.

Candidates who run as independents will not be encompassed by the “Democrat” or “Republican” options regardless of any affiliation they may have with the party.

The candidates may be named in the contract for the convenience of traders. In the event that any named candidate is replaced as the nominee of their respective party prior to election day, the name in the contract will be updated and the market will resolve based on the replacement nominee of the party.

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race in this state for the same candidate, this market will resolve based on the official certification.</pre>

</details>

### H27. US x China tariff agreement by December 31? — December 31

- **Polymarket:** [US x China tariff agreement by December 31? — December 31](https://polymarket.com/market/us-x-china-tariff-agreement-by-december-31) · closes 2027-01-01
- **Limitless:** [US x China tariff agreement by December 31?](https://limitless.exchange/markets/us-x-china-tariff-agreement-by-december-31-1787675335206) · closes 2027-01-01

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to "Yes" if an official agreement over tariffs, defined as a publicly announced mutual agreement, is reached between the United States and China between market creation and the listed date 2026, 11:59 PM ET. Otherwise, this market will resolve to “No”.

If such an agreement is officially reached before the resolution date, this market will resolve to "Yes", regardless of if/when the agreement goes into effect.

Informal and unilateral announcements that do not constitute a finalized agreement will not count.

The publicly announced lowering of tariffs by both China and the U.S. will qualify as a mutual agreement over trade and/or tariffs if confirmed as part of a mutual agreement by an overwhelming consensus of credible reporting, even if a formal agreement isn’t mutually announced.

Agreements that include the United States and China as parties, even if they also involve other countries, will qualify for resolution.

The primary resolution source for this market will be an official announcement by the United States and the People's Republic of China, however an overwhelming consensus of credible reporting confirming an agreement has been reached will also qualify.</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>This market will resolve to "Yes" if an official agreement over tariffs, defined as a publicly announced mutual agreement, is reached between the United States and China between market creation and December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to “No”.

 If such an agreement is officially reached before the resolution date, this market will resolve to "Yes", regardless of if/when the agreement goes into effect.

 Informal and unilateral announcements that do not constitute a finalized agreement will not count.

 The publicly announced lowering of tariffs by both China and the U.S. will qualify as a mutual agreement over trade and/or tariffs if confirmed as part of a mutual agreement by an overwhelming consensus of credible reporting, even if a formal agreement isn’t mutually announced.

 Agreements that include the United States and China as parties, even if they also involve other countries, will qualify for resolution.

 The primary resolution source for this market will be an official announcement by the United States and the People's Republic of China, however an overwhelming consensus of credible reporting confirming an agreement has been reached will also qualify.</pre>

</details>

### H28. Will Éric Zemmour win the 2027 French presidential election? — Éric Zemmour

- **Kalshi:** [Will Éric Zemmour win the 2027 French presidential election? — Éric Zemmour](https://kalshi.com/markets/kxfrenchpres) · closes 2028-05-30
- **Polymarket:** [Will Éric Zemmour win the 2027 French presidential election? — Éric Zemmour](https://polymarket.com/market/will-ric-zemmour-win-the-2027-french-presidential-election) · closes 2027-04-30

<details><summary>Rules — Kalshi</summary>

<pre>If Éric Zemmour wins the next French presidential election, then the market resolves to Yes.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>The next French presidential election is currently expected to be held around April 2027.  This market pertains to the outcome of the next French presidential election, regardless of whether it follows the scheduled end of the current term or is held earlier. 

The President of France is elected via a two-round system; a candidate must secure over 50% of the vote to win outright in the first round. If no candidate achieves this, the top two contenders advance to a runoff.

This market will resolve according to the candidate who wins this election.

This market includes any potential second round. If, for any reason, the results of the election are not known by December 31, 2027, 11:59 PM ET, this market will resolve to "Other".

This market will resolve based on the result of the election as indicated by a consensus of credible reporting. If there is ambiguity, this market will resolve based solely on the official results as reported by the French Government, specifically the Ministry of the Interior (https://www.interieur.gouv.fr/).</pre>

</details>

### H29. Will Harris Dickinson be the next James Bond? — Harris Dickinson

- **Kalshi:** [Will Harris Dickinson be the next James Bond? — Harris Dickinson](https://kalshi.com/markets/kxbond) · closes 2030-01-01
- **Polymarket:** [Harris Dickinson announced as next James Bond? — Harris Dickinson](https://polymarket.com/market/harris-dickinson-announced-as-next-james-bond) · closes 2027-01-01

<details><summary>Rules — Kalshi</summary>

<pre>If Harris Dickinson is cast as the next James Bond before Jan 1, 2030, then the market resolves to Yes.

This is for the next film in the James Bond series, which goes back to Dr. No (1962); spin-offs and unauthorized productions are not included.</pre>

</details>

<details><summary>Rules — Polymarket</summary>

<pre>This market will resolve to “Yes” if the listed actor is officially announced as the next James Bond actor by December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to “No”.

This market will resolve based on the first official announcement of who will be the next James Bond, regardless of any changes made thereafter.

If no actor is announced as the next Bond within the timeframe, this market will resolve to "No Bond chosen".

The primary resolution source for this market will be official information from Amazon MGM Studios. However, a consensus of credible reporting may also be used.</pre>

</details>

### H30. Bengals vs. Steelers

- **Polymarket:** [Bengals vs. Steelers](https://polymarket.com/market/nfl-cin-pit-2026-09-27) · closes 2026-09-27
- **Limitless:** [Bengals vs. Steelers](https://limitless.exchange/markets/bengals-vs-steelers-1790010337293) · closes 2026-09-28

<details><summary>Rules — Polymarket</summary>

<pre>In the upcoming NFL game, scheduled for September 27 at 1:00PM ET:
If Bengals wins, the market will resolve to "Bengals".
If Steelers wins, the market will resolve to "Steelers".
If the game is postponed, this market will remain open until the game has been completed.
If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.

Resolution source: https://www.nfl.com/scores</pre>

</details>

<details><summary>Rules — Limitless</summary>

<pre>In the upcoming NFL game, scheduled for September 27 at 1:00PM ET:
 If Bengals wins, the market will resolve to "Bengals".
 If Steelers wins, the market will resolve to "Steelers".
 If the game is postponed, this market will remain open until the game has been completed.
 If the game is canceled entirely or ends in a tie, with no make-up game, this market will resolve 50-50.</pre>

</details>

## Ответы

| Pair | Your label | Note |
|---|---|---|
| R1 | | |
| R2 | | |
| R3 | | |
| R4 | | |
| R5 | | |
| R6 | | |
| R7 | | |
| R8 | | |
| R9 | | |
| R10 | | |
| R11 | | |
| R12 | | |
| R13 | | |
| R14 | | |
| R15 | | |
| R16 | | |
| R17 | | |
| R18 | | |
| R19 | | |
| R20 | | |
| R21 | | |
| R22 | | |
| R23 | | |
| R24 | | |
| R25 | | |
| R26 | | |
| R27 | | |
| R28 | | |
| R29 | | |
| R30 | | |
| H1 | | |
| H2 | | |
| H3 | | |
| H4 | | |
| H5 | | |
| H6 | | |
| H7 | | |
| H8 | | |
| H9 | | |
| H10 | | |
| H11 | | |
| H12 | | |
| H13 | | |
| H14 | | |
| H15 | | |
| H16 | | |
| H17 | | |
| H18 | | |
| H19 | | |
| H20 | | |
| H21 | | |
| H22 | | |
| H23 | | |
| H24 | | |
| H25 | | |
| H26 | | |
| H27 | | |
| H28 | | |
| H29 | | |
| H30 | | |
