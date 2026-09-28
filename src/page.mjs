// Puts the data into the demo page template (shared by scripts/build-demo.mjs and the hosted api/page.mjs).
// A replacer function, so "$&" or "$'" in rule texts isn't treated as a replacement pattern.
export const fill = (template, data) => template.replace("/*__DATA__*/null", () => JSON.stringify(data).replace(/</g, "\\u003c"));
