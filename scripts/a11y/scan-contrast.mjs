/**
 * Rendered-DOM contrast sweep (Phase a11y-remediation) — SC 1.4.3 and 1.4.11.
 *
 * axe reports contrast per node but skips any element whose ancestor paints a
 * background IMAGE (D-3.05a-8 already records that hole for the hatched
 * placeholder chip). This walks the real DOM instead: for every text node it
 * composites the foreground colour over the resolved ancestor background,
 * applies the large-text threshold from the *computed* font size and weight,
 * and lists what it could not resolve rather than silently passing it.
 *
 * Usage: node scripts/a11y/scan-contrast.mjs <outfile.json> [--viewport=mobile] < paths.txt
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
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const sel = (el) => {
    const bits = [];
    let n = el;
    for (let i = 0; n && i < 4; i++, n = n.parentElement) {
      let s = n.tagName.toLowerCase();
      if (n.id) { s += "#" + n.id; bits.unshift(s); break; }
      const cls = (n.getAttribute("class") || "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
      if (cls) s += "." + cls;
      bits.unshift(s);
    }
    return bits.join(" > ");
  };

  const results = [];
  const unresolved = [];
  const all = [];
  const seen = new Set();

  const els = document.querySelectorAll("body *");
  for (const el of els) {
    // Only elements that themselves render text.
    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(" ")
      .trim();
    if (!ownText) continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    // Tailwind's sr-only: clipped to 1px, exempt from contrast (not rendered).
    if (rect.width <= 1 && rect.height <= 1) continue;

    const fg0 = parse(cs.color);
    if (!fg0) continue;

    // Resolve background by walking up, compositing alpha as we go.
    let bg = null;
    let imageAncestor = null;
    let n = el;
    const stack = [];
    while (n) {
      const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== "none" && !imageAncestor) imageAncestor = sel(n);
      const c = parse(s.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
      n = n.parentElement;
    }
    if (!stack.length || stack[stack.length - 1].a !== 1) stack.push({ r: 255, g: 255, b: 255, a: 1 });
    bg = stack.reduceRight((acc, c) => (acc ? over(c, acc) : c));

    const fg = fg0.a < 1 ? over(fg0, bg) : fg0;
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const r = ratio(fg, bg);

    const rec = {
      selector: sel(el),
      text: ownText.slice(0, 60),
      color: cs.color,
      bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      fontSize: size,
      fontWeight: weight,
      large,
      required: need,
      ratio: Math.round(r * 100) / 100,
      pass: r >= need,
      bgImageAncestor: imageAncestor,
    };
    const key = `${rec.color}|${rec.bg}|${rec.fontSize}|${rec.fontWeight}|${rec.selector}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (imageAncestor) unresolved.push(rec);
    else if (!rec.pass) results.push(rec);
    if (window.__A11Y_ALL_PAIRS) all.push(rec);
  }
  return { fails: results, unresolved, all };
};

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const out = [];
let i = 0;
for (const path of paths) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  try {
    if (process.env.A11Y_ALL_PAIRS === "1") {
      await page.evaluateOnNewDocument(() => { window.__A11Y_ALL_PAIRS = true; });
    }
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(async () => {
      await new Promise((r) => {
        let y = 0;
        const step = () => { y += innerHeight; scrollTo(0, y); if (y < document.body.scrollHeight) setTimeout(step, 25); else { scrollTo(0, 0); setTimeout(r, 200); } };
        step();
      });
    });
    const r = await page.evaluate(PAGE_FN);
    out.push({ path, ...r });
  } catch (e) {
    out.push({ path, error: String(e).slice(0, 200) });
  }
  await page.close();
  if (++i % 25 === 0 || i === paths.length) console.error(`  ${i}/${paths.length}`);
}
await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 2));

const allFails = out.flatMap((p) => (p.fails || []).map((f) => ({ ...f, path: p.path })));
const grouped = {};
for (const f of allFails) {
  const k = `${f.color} on ${f.bg} @ ${f.fontSize}px/${f.fontWeight}`;
  (grouped[k] ??= { ...f, pages: new Set() }).pages.add(f.path);
}
console.log(`\n=== contrast ${vp}: ${paths.length} URLs, ${allFails.length} failing nodes ===`);
for (const [k, v] of Object.entries(grouped).sort((a, b) => a[1].ratio - b[1].ratio)) {
  console.log(`  ${v.ratio}:1 (need ${v.required}) — ${k}\n      e.g. ${v.selector}\n      text: "${v.text}"\n      pages: ${v.pages.size}, e.g. ${[...v.pages].slice(0, 3).join(", ")}`);
}
if (process.env.A11Y_ALL_PAIRS === "1") {
  // Every distinct colour pair the site actually renders, for the report's
  // contrast table — not only the ones that fail.
  const pairs = new Map();
  for (const p of out)
    for (const r of p.all || []) {
      const k = `${r.color}|${r.bg}|${r.large}`;
      if (!pairs.has(k)) pairs.set(k, { ...r, pages: new Set(), samples: [] });
      const e = pairs.get(k);
      e.pages.add(p.path);
      if (e.samples.length < 2 && r.text) e.samples.push(r.text);
      e.minSize = Math.min(e.minSize ?? r.fontSize, r.fontSize);
    }
  console.log(`\n=== every rendered text/background pair (${pairs.size} distinct) ===`);
  for (const v of [...pairs.values()].sort((a, b) => a.ratio - b.ratio))
    console.log(
      `${String(v.ratio).padStart(6)}:1 need ${v.required}  ${v.pass ? "PASS" : "FAIL"}  ${v.color} on ${v.bg}  ${v.minSize}px/${v.fontWeight}  "${v.samples[0] ?? ""}"  [${v.pages.size} pages]`,
    );
}

const unres = out.flatMap((p) => (p.unresolved || []).map((f) => ({ ...f, path: p.path })));
const unresFail = unres.filter((u) => !u.pass);
console.log(`\n--- over a background-image (axe skips these): ${unres.length} nodes, ${unresFail.length} below threshold vs the resolved colour ---`);
const seenU = new Set();
for (const u of unresFail) {
  const k = `${u.selector}|${u.color}`;
  if (seenU.has(k)) continue; seenU.add(k);
  console.log(`  ${u.ratio}:1 (need ${u.required}) ${u.selector} — "${u.text}" [img ancestor: ${u.bgImageAncestor}] ${u.path}`);
}
