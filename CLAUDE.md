# RuleGuard

Проект для хакатона Colosseum Crypto World's Fair (дедлайн 12.10.2026, сдавать 11.10). Полный план, архитектура и задачи по дням — в `RULEGUARD_PROJECT.md`. Читать его перед любой работой.

- Общаться с пользователем на русском.
- Стек по плану: Python 3.11+, httpx, pydantic, SQLite, FastAPI, Claude API; Solana — DFlow + Anchor. Но Python на машине не установлен, поэтому проверка идеи сделана на Node.js (`scripts/poc.mjs`, запуск: `node scripts/poc.mjs`). Выбор языка для основной версии пока не сделан.
- Результаты шага 1: `research/FINDINGS.md`.
- Демо (4 площадки): `node scripts/build-demo.mjs` загружает данные и собирает `demo/index.html`; `--from-cache` только пересобирает страницу; `node scripts/serve.mjs` → http://localhost:4173. Код: площадки в `src/venues/`, сопоставление `src/match.mjs`, сравнение правил `src/compare.mjs`, ручные вердикты `src/verdicts.mjs`, шаблон `demo/template.html`.
- Сырой спред нестабилен в тонких стаканах — не использовать его как цифру для питча; в демо сравниваются средние цены с фильтром ликвидности.
- Ключи только в `.env` (в `.gitignore`), никогда в коде и чате.
- В паспорте рынка каждое поле подкрепляется точной цитатой из правил; нет цитаты — `unknown`. При сомнении — `uncertain`, не `equivalent`.
- После каждого этапа дописывать строку в раздел «Журнал» в `RULEGUARD_PROJECT.md`.
