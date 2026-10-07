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
  inlineFonts: false, // fonts are handled by addFontFaces() below
  preloadFonts: false,
  pruneSource: false,
  mergeStylesheets: true,
  compress: true,
  keyframes: "critical",
  logLevel: "warn",
});

// High-priority preloads (the hero image, the main font) go straight after the viewport tag, before the
// inlined CSS, so the browser starts downloading them with the very first bytes of the page
const hoistPreloads = (html) => {
  const anchor = html.match(/<meta name="viewport"[^>]*>/);
  if (!anchor) return html;
  const links = html.match(/<link rel="preload"[^>]*(?:fetchpriority="high"|as="font")[^>]*>/g) ?? [];
  if (!links.length) return html;
  for (const l of links) html = html.replace(l, "");
  return html.replace(anchor[0], anchor[0] + links.join(""));
};

// Beasties can't see which fonts are used (they're set through CSS variables), so it leaves every
// @font-face out of the inlined CSS. Without them text paints in a plain system font until the full
// stylesheet arrives, then jumps to Inter (a visible flash and a layout shift). Put them back.
const fontFaceCache = new Map();
const addFontFaces = (html) => {
  const hrefs = [...html.matchAll(/<link rel="stylesheet" href="([^"]+\.css)"/g)].map((m) => m[1]);
  let faces = "";
  for (const href of new Set(hrefs)) {
    if (!fontFaceCache.has(href)) {
      const css = fs.readFileSync(path.join(outDir, href), "utf8");
      // url(../media/x.woff2) is relative to the stylesheet: make it absolute for use inside the page
      const base = new URL(href, "https://x.invalid/");
      const rules = (css.match(/@font-face\{[^}]*\}/g) ?? []).map((rule) =>
        rule.replace(/url\((["']?)([^)"']+)\1\)/g, (m, q, u) => `url(${new URL(u, base).pathname})`),
      );
      fontFaceCache.set(href, rules.join(""));
    }
    faces += fontFaceCache.get(href);
  }
  return faces ? html.replace("<style>", `<style>${faces}`) : html;
};

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
  let result = await beasties.process(html);
  result = addFontFaces(hoistPreloads(result));
  fs.writeFileSync(file, result);
  before += html.length;
  after += result.length;
}
// Hashed build files never change: let browsers and the CDN keep them for a year
fs.writeFileSync(
  path.join(outDir, "_next/static/.htaccess"),
  `<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`,
);
console.log(`critical-css: ${pages.length} pages processed (${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB HTML)`);
