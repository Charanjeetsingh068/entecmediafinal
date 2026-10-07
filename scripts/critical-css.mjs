// Post-build step (runs after `next build`, see package.json "postbuild"):
// for every exported page, the CSS rules that page actually uses are inlined into its <head>, and the
// full stylesheet is loaded without blocking the first paint. Phones then paint the page without
// waiting for ~370 KB of CSS to download first (the biggest drag on the mobile PageSpeed score).
import Beasties from "beasties";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(import.meta.dirname, "../out");

const beasties = new Beasties({
  path: outDir,
  publicPath: "/",
  // Full stylesheet: loaded with media="print" then switched to "all" once downloaded (non-blocking)
  preload: "media",
  noscriptFallback: true,
  inlineFonts: false,
  preloadFonts: false,
  pruneSource: false,
  mergeStylesheets: true,
  compress: true,
  keyframes: "critical",
  logLevel: "warn",
});

const pages = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "_next" || e.name === "api" || e.name === "blog-cms" || e.name === "images") continue;
      walk(p);
    } else if (e.name.endsWith(".html") && !e.name.startsWith("__")) pages.push(p);
  }
};
walk(outDir);

let before = 0, after = 0;
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const result = await beasties.process(html);
  fs.writeFileSync(file, result);
  before += html.length;
  after += result.length;
}
console.log(`critical-css: ${pages.length} pages processed (${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB HTML)`);
