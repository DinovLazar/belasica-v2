/**
 * Visual-regression check (Phase a11y-remediation).
 *
 * Accessibility fixes are not allowed to move the design, and „it looks the
 * same" is not a measurement. This shoots a fixed set of pages at FIXED
 * ABSOLUTE SCROLL OFFSETS — not `scrollIntoView`, which is itself affected by
 * `scroll-padding-top` and would compare two different parts of the document —
 * and, in `--diff` mode, counts the pixels that actually changed and writes a
 * map with every changed pixel painted red.
 *
 * Usage:
 *   node scripts/a11y/visual-diff.mjs shoot <outDir>
 *   node scripts/a11y/visual-diff.mjs diff <beforeDir> <afterDir>
 */
import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const BASE = process.env.A11Y_BASE ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

/** [path, name, viewport width, absolute scrollY] */
const SHOTS = [
  ["/", "home", 1280, 0],
  ["/arhiva", "arhiva", 1280, 900],
  ["/arhiva/1992-93", "season", 1280, 3200],
  ["/arhiva/1992-93", "season-mobile", 375, 4200],
  ["/legendi", "legendi", 1280, 0],
  ["/kontakt", "kontakt", 1280, 400],
  ["/statistika", "statistika", 1280, 1400],
];

const mode = process.argv[2];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

if (mode === "shoot") {
  const dir = process.argv[3];
  for (const [path, name, width, y] of SHOTS) {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);
    await page.setViewport({ width, height: 900 });
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1800));
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `${dir}/${name}.png` });
    await page.close();
  }
  console.log("shots ->", dir);
} else if (mode === "diff") {
  const [beforeDir, afterDir] = process.argv.slice(3);
  const page = await browser.newPage();
  await page.goto("about:blank");
  for (const [, name] of SHOTS) {
    const a = `${beforeDir}/${name}.png`, b = `${afterDir}/${name}.png`;
    if (!existsSync(a) || !existsSync(b)) { console.log(name.padEnd(16), "missing"); continue; }
    const r = await page.evaluate(
      async (a, b) => {
        const load = async (s) => {
          const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode();
          const c = document.createElement("canvas"); c.width = i.width; c.height = i.height;
          const g = c.getContext("2d"); g.drawImage(i, 0, 0);
          return { data: g.getImageData(0, 0, c.width, c.height), canvas: c, ctx: g };
        };
        const A = await load(a), B = await load(b);
        if (A.data.width !== B.data.width || A.data.height !== B.data.height) return { size: "DIFFERENT" };
        let diff = 0;
        const out = B.ctx.createImageData(A.data.width, A.data.height);
        for (let i = 0; i < A.data.data.length; i += 4) {
          const changed =
            Math.abs(A.data.data[i] - B.data.data[i]) > 8 ||
            Math.abs(A.data.data[i + 1] - B.data.data[i + 1]) > 8 ||
            Math.abs(A.data.data[i + 2] - B.data.data[i + 2]) > 8;
          if (changed) diff++;
          out.data[i] = changed ? 255 : B.data.data[i];
          out.data[i + 1] = changed ? 0 : B.data.data[i + 1];
          out.data[i + 2] = changed ? 0 : B.data.data[i + 2];
          out.data[i + 3] = 255;
        }
        B.ctx.putImageData(out, 0, 0);
        return { pixels: A.data.width * A.data.height, differing: diff,
          pct: +((diff / (A.data.width * A.data.height)) * 100).toFixed(3),
          png: diff ? B.canvas.toDataURL("image/png") : null };
      },
      readFileSync(a).toString("base64"),
      readFileSync(b).toString("base64"),
    );
    if (r.png) { writeFileSync(`${afterDir}/${name}-diff.png`, Buffer.from(r.png.split(",")[1], "base64")); delete r.png; }
    console.log(name.padEnd(16), JSON.stringify(r));
  }
} else {
  console.error("usage: visual-diff.mjs shoot <outDir> | diff <beforeDir> <afterDir>");
  process.exitCode = 1;
}
await browser.close();
