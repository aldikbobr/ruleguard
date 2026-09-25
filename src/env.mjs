// Загружает ключи из .env в process.env (без сторонних пакетов). Существующие переменные не перезаписывает.
// Значения ключей никуда не выводятся — наружу отдаём только «подключён / нет».
import fs from "node:fs";
import path from "node:path";

export function loadEnv(root) {
  const file = path.join(root, ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!m || line.trim().startsWith("#")) continue;
    const value = m[2].replace(/^(['"])(.*)\1$/, "$2");
    if (value && process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

// Какие возможности открывают ключи: только булевы флаги, без значений
export function keyStatus() {
  return {
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    dflow: Boolean(process.env.DFLOW_API_KEY)
  };
}
