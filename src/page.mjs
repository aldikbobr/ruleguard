// Puts the data into the demo page template (shared by scripts/build-demo.mjs and the hosted api/page.mjs).
// A replacer function, so "$&" or "$'" in rule texts isn't treated as a replacement pattern.
export const fill = (template, data) => template.replace("/*__DATA__*/null", () => JSON.stringify(data).replace(/</g, "\\u003c"));

// A short signature of the set of pairs, so an open page can tell when the set changed.
// The page computes the same (demo/template.html, pairsSig) — keep the two in step.
export function pairsSig(pairs) {
  const s = pairs.map(p => `${p.a.venue}:${p.a.id}|${p.b.venue}:${p.b.id}`).sort().join("\n");
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return `${pairs.length}-${h.toString(16)}`;
}
