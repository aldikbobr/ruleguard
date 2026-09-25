// Loads keys from .env into process.env (no third-party packages). Existing variables are not overwritten.
// Key values are never exposed — only "connected / not connected" leaves this module.
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

// Which features the keys unlock: boolean flags only, never the values
export function keyStatus() {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    dflow: Boolean(process.env.DFLOW_API_KEY)
  };
}
