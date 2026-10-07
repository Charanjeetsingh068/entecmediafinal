// Post-build step: Next.js 16's static export writes route-segment prefetch files in folders
// (e.g. contact/__next.contact/__PAGE__.txt) but the client router requests them with dots
// (contact/__next.contact.__PAGE__.txt), so every link prefetch 404'd (a console error in PageSpeed,
// and slower page-to-page navigation). This copies each such file to the dotted name as well.
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(import.meta.dirname, "../out");
let copied = 0;

const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("__next.")) flatten(p, dir, e.name);
    else if (e.name !== "_next") walk(p);
  }
};

// Copies every file under <parent>/__next.x/a/b.txt to <parent>/__next.x.a.b.txt
const flatten = (segDir, parent, prefix) => {
  for (const e of fs.readdirSync(segDir, { withFileTypes: true })) {
    const p = path.join(segDir, e.name);
    if (e.isDirectory()) flatten(p, parent, `${prefix}.${e.name}`);
    else {
      const target = path.join(parent, `${prefix}.${e.name}`);
      if (!fs.existsSync(target)) {
        fs.copyFileSync(p, target);
        copied++;
      }
    }
  }
};

walk(outDir);
console.log(`fix-rsc-segments: ${copied} prefetch files added`);
