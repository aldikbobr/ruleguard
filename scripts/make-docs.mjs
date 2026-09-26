#!/usr/bin/env node
// Generates docs/label-review.md (blind human re-check sheet for the 60 labeled pairs) and docs/telegram-posts.md
// (one post per event, from the in-depth reviews only) from the project data, which it only reads.
// Usage: node scripts/make-docs.mjs
// Careful: rerunning overwrites docs/label-review.md, including a reviewer's answers table. Copy the answers out first.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = process.argv[2] || path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, "research", f), "utf8"));
const { VERDICTS } = await import(pathToFileURL(path.join(ROOT, "src", "verdicts.mjs")));
const { lookup, loadCache } = await import(pathToFileURL(path.join(ROOT, "src", "ai", "review.mjs")));

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const venueName = v => ({ kalshi: "Kalshi", polymarket: "Polymarket", limitless: "Limitless", manifold: "Manifold" })[v] || v;
const title = m => (m.outcome ? `${m.title} — ${m.outcome}` : m.title);

// ---------- 1. Blind label review sheet ----------
const sets = [
  { name: "random", sample: read("random-sample.json"), prefix: "R" },
  { name: "held-out", sample: read("holdout-sample.json"), prefix: "H" }
];
let md = `# Перепроверка разметки: 60 пар (вслепую)

Зачем: все цифры точности сейчас с оговоркой «разметку делал ИИ, человек не перепроверял». Если человек разметит эти 60 пар сам, цифры станут «проверено человеком», и это сильно добавляет доверия у судей. Задача № 12 в \`ПЛАН_ДО_ПОДАЧИ.md\`.

**Как заполнять** (прямо на GitHub: открыть файл → ✏️ Edit → Commit changes):
1. Для каждой пары откройте обе ссылки или разверните «Rules» и прочитайте правила расчёта.
2. В таблице в конце файла впишите в колонку «Your label» одно из трёх:
   - **equivalent**: правила совпадают по сути;
   - **caveats**: совпадают, кроме редких крайних случаев или времени расчёта;
   - **different**: есть правдоподобный сценарий, при котором рынки рассчитаются по-разному.
3. В «Note» коротко напишите, чем отличаются правила (по-русски или по-английски).

Метки ИИ и прошлую разметку здесь **специально не показываем**, чтобы не влиять на ваше решение. Сравнение и пересчёт точности сделает чат «RuleGuard».

Правила — снимок от 25.09.2026. Если на сайте площадки текст уже другой, размечайте по тексту из «Rules» ниже.

`;
const rows = [];
for (const set of sets) {
  md += `\n## Выборка «${set.name}» (${set.sample.pairs.length} пар)\n`;
  for (const p of set.sample.pairs) {
    const id = `${set.prefix}${p.n}`;
    rows.push(id);
    md += `\n### ${id}. ${esc(title(p.a))}\n\n`;
    for (const m of [p.a, p.b]) {
      md += `- **${venueName(m.venue)}:** [${esc(title(m))}](${m.url})${m.close ? ` · closes ${m.close.slice(0, 10)}` : ""}\n`;
    }
    for (const m of [p.a, p.b]) {
      md += `\n<details><summary>Rules — ${venueName(m.venue)}</summary>\n\n<pre>${esc(m.rules)}</pre>\n\n</details>\n`;
    }
  }
}
md += `\n## Ответы\n\n| Pair | Your label | Note |\n|---|---|---|\n${rows.map(r => `| ${r} | | |`).join("\n")}\n`;
fs.writeFileSync(path.join(ROOT, "docs", "label-review.md"), md);

// ---------- 2. Telegram posts from real "different" pairs ----------
const data = read("pairs-all.json");
const { verdictOf } = lookup(loadCache(path.join(ROOT, "research", "ai-cache.json")));
const candidates = [];
for (const p of data.pairs) {
  const review = VERDICTS[`${p.a.id}|${p.b.id}`];
  const ai = verdictOf(p);
  // in-depth reviews only: AI scenarios are not checked by a person, and a wrong post costs more than a missing one;
  // skip summaries that refer to another pair ("Same as …"), so every post reads on its own
  if (review?.verdict === "different" && !/^same\b/i.test(review.summary || "")) candidates.push({ p, why: review.summary || review.short, scenario: review.scenario, src: "review" });
}
// real-money pairs only, reviews first, then by how different the prices look
const real = candidates.filter(c => c.p.a.venue !== "manifold" && c.p.b.venue !== "manifold");
const mid = m => (m.yes != null && m.no != null ? (m.yes + (1 - m.no)) / 2 : null);
const gap = c => { const a = mid(c.p.a), b = mid(c.p.b); return a != null && b != null ? Math.abs(a - b) : 0; };
real.sort((x, y) => (x.src === y.src ? gap(y) - gap(x) : x.src === "review" ? -1 : 1));
const seen = new Set();
const picks = [];
for (const c of real) {
  const topic = c.p.a.url; // event-level URL on the first venue: one post per event
  if (seen.has(topic)) continue;
  seen.add(topic);
  picks.push(c);
  if (picks.length === 10) break;
}
let tg = `# ${picks.length} постов для Telegram-канала (реальные пары)

Для задачи № 5 (проверка спроса): по одному посту в день. Все пары настоящие, из снимка 25.09.2026, вердикт «different», по одной паре на событие. Взяты только подробные разборы (\`src/verdicts.mjs\`, их писал ИИ-ассистент): непроверенные сценарии ИИ-разбора сюда не попали, один из них при проверке оказался ошибочным. Для следующих постов берите пары с 🔍 из демо. **Перед публикацией** откройте обе ссылки и проверьте, что правила и цены не изменились: цены здесь не указаны специально, они быстро устаревают.

Формат: английский (аудитория площадок международная). Подпись в конце каждого поста обязательна.

`;
picks.forEach((c, i) => {
  const { p } = c;
  tg += `---\n\n## Post ${i + 1}\n\n`;
  tg += `⚠️ **Same title, different contract: ${title(p.a)}**\n\n`;
  tg += `${venueName(p.a.venue)} vs ${venueName(p.b.venue)}\n\n`;
  tg += `**Why they differ:** ${c.why}\n\n`;
  if (c.scenario) tg += `**How they can split:** ${c.scenario}\n\n`;
  tg += `Rules: ${p.a.url} · ${p.b.url}\n\n`;
  tg += `_RuleGuard checks the rules before you trade. Information, not financial advice._\n\n`;
});
fs.writeFileSync(path.join(ROOT, "docs", "telegram-posts.md"), tg);
console.log(`label-review: ${rows.length} pairs · telegram posts: ${picks.length} (${picks.filter(c => c.src === "review").length} from in-depth reviews)`);
