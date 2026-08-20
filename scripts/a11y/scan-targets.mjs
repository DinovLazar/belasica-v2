/**
 * Target-size sweep (Phase a11y-remediation) — SC 2.5.8 Target Size (Minimum), AA (WCAG 2.2).
 *
 * A target under 24×24 CSS px is only a failure if it ALSO fails the spacing
 * exception, so measuring the box is not enough: the check has to draw the
 * 24px-diameter circle the criterion describes and test it against every other
 * target's circle. Inline links inside a sentence are exempt (the "inline"
 * exception) and are reported separately rather than counted as failures.
 *
 * Usage: node scripts/a11y/scan-targets.mjs [--viewport=mobile] < paths.txt
 */
import { readFileSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = process.env.A11Y_BASE ?? "http://localhost:3000";
const OUT = process.argv[2];
const vp = (process.argv.find((a) => a.startsWith("--viewport=")) ?? "--viewport=desktop").split("=")[1];
const VIEWPORT = vp === "mobile"
  ? { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
  : { width: 1280, height: 800, deviceScaleFactor: 1 };

const paths = readFileSync(0, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);

const PAGE_FN = () => {
  const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
  const els = [...document.querySelectorAll(SEL)].filter((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  const boxes = els.map((el) => {
    const r = el.getBoundingClientRect();
    return { el, x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, cx: r.left + scrollX + r.width / 2, cy: r.top + scrollY + r.height / 2 };
  });
  const label = (el) =>
    (el.getAttribute("aria-label") || el.textContent?.trim().replace(/\s+/g, " ") || el.getAttribute("title") || "").slice(0, 40);
  // "Inline" exception: the target sits in a run of text inside its block parent.
  const isInline = (el) => {
    if (getComputedStyle(el).display !== "inline") return false;
    const p = el.parentElement;
    if (!p) return false;
    const own = (p.textContent || "").replace(el.textContent || "", "").trim();
    return own.length > 0;
  };

  const out = [];
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    if (b.w >= 24 && b.h >= 24) continue;
    // Spacing exception: no other target's 24px circle may intersect this one's.
    let minGap = Infinity;
    let nearest = null;
    for (let j = 0; j < boxes.length; j++) {
      if (i === j) continue;
      const o = boxes[j];
      // distance between the two targets' centres
      const d = Math.hypot(b.cx - o.cx, b.cy - o.cy);
      if (d < minGap) { minGap = d; nearest = label(o.el); }
    }
    // Circles of radius 12 centred on each target: they clear if centres are ≥24 apart.
    const spacingPasses = minGap >= 24;
    out.push({
      tag: b.el.tagName,
      label: label(b.el),
      cls: (typeof b.el.className === "string" ? b.el.className : "").slice(0, 60),
      w: Math.round(b.w * 10) / 10,
      h: Math.round(b.h * 10) / 10,
      nearestCentreDistance: Math.round(minGap * 10) / 10,
      nearest,
      spacingExceptionPasses: spacingPasses,
      inlineException: isInline(b.el),
      fails: !spacingPasses && !isInline(b.el),
    });
  }
  return out;
};

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const all = [];
for (const path of paths) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000);
  await page.setViewport(VIEWPORT);
  try {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1200));
    const r = await page.evaluate(PAGE_FN);
    all.push({ path, undersized: r });
  } catch (e) { all.push({ path, error: String(e).slice(0, 160) }); }
  await page.close();
}
await browser.close();
if (OUT) writeFileSync(OUT, JSON.stringify(all, null, 2));

console.log(`\n=== target size ${vp} (SC 2.5.8, 24×24) ===`);
const seen = new Map();
for (const p of all) for (const u of p.undersized ?? []) {
  const k = `${u.tag}|${u.cls}|${u.w}x${u.h}|${u.fails}`;
  if (!seen.has(k)) seen.set(k, { ...u, pages: new Set(), examples: [] });
  seen.get(k).pages.add(p.path);
  if (seen.get(k).examples.length < 2) seen.get(k).examples.push(u.label);
}
const fails = [...seen.values()].filter((u) => u.fails);
const exempt = [...seen.values()].filter((u) => !u.fails);
console.log(`FAILS (undersized AND spacing exception not met AND not inline): ${fails.length} distinct`);
for (const u of fails) console.log(`  ${u.tag} ${u.w}×${u.h}  nearest-centre ${u.nearestCentreDistance}px  "${u.examples.join('" / "')}"\n      class: ${u.cls}\n      pages: ${u.pages.size} e.g. ${[...u.pages].slice(0, 3).join(", ")}`);
console.log(`\nEXEMPT (undersized but rescued by spacing/inline): ${exempt.length} distinct`);
for (const u of exempt.slice(0, 20)) console.log(`  ${u.tag} ${u.w}×${u.h} gap=${u.nearestCentreDistance} inline=${u.inlineException} "${u.examples[0]}" [${u.cls.slice(0,44)}]`);
