// GET / on the hosted demo (vercel.json rewrites "/" here): the page with the latest pairs from the live-data branch,
// or the snapshot built at deploy time when that data can't be fetched
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { liveData } from "../src/live.mjs";
import { fill } from "../src/page.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export default async function handler(req, res) {
  const data = await liveData();
  const html = data
    ? fill(fs.readFileSync(path.join(ROOT, "demo", "template.html"), "utf8"), data)
    : fs.readFileSync(path.join(ROOT, "demo", "index.html"), "utf8");
  res.statusCode = 200;
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(html);
}
