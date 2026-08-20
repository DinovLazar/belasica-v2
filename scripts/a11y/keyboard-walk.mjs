/**
 * Keyboard walkthrough (Phase a11y-remediation) — SC 2.1.1, 2.4.3, 2.4.7, 2.4.11.
 *
 * Tabs from the top of the document to the end, and at every stop records what
 * received focus, whether a focus ring is actually painted, and — by hit-testing
 * the focused rectangle rather than comparing numbers — whether the sticky
 * header or the sticky jump rail is covering it. SC 2.4.11 is about what the
 * user can SEE, so the check has to be a hit test.
 *
 * Usage: node scripts/a11y/keyboard-walk.mjs <path> [width] [--shift]
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.A11Y_BASE ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";
const width = Number(process.argv[3] ?? 1280);
const reverse = process.argv.includes("--shift");
const MAX = Number(process.env.MAX_STOPS ?? 60);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(120000);
await page.setViewport({ width, height: 800 });
await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
await new Promise((r) => setTimeout(r, 1500));

// Reproduces the pre-remediation state for SC 2.4.11 on a fixed build: the fix
// is the scroller's `scroll-padding-top` and nothing else, so putting it back
// to `auto` measures exactly what a keyboard user met before it existed.
if (process.env.A11Y_NO_SCROLL_PADDING === "1") {
  await page.addStyleTag({ content: "html{scroll-padding-top:auto !important}" });
}

if (reverse) {
  // Start from the end of the document so Shift+Tab walks backwards through it.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 400));
}

const describe = () =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { end: true };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const name =
      el.getAttribute("aria-label") ||
      el.textContent?.trim().replace(/\s+/g, " ").slice(0, 44) ||
      el.getAttribute("alt") ||
      "";
    // SC 2.4.11 asks whether the component is ENTIRELY hidden by author
    // content, so the test is a hit test over the part of it that is inside the
    // viewport at all. Sampling the whole box would count the off-screen part
    // of a 3672px-tall scroll region as "covered", which is not what the
    // criterion means — an element taller than the viewport is never entirely
    // hidden by a 125px bar.
    const vx0 = Math.max(0, r.left), vx1 = Math.min(innerWidth, r.right);
    const vy0 = Math.max(0, r.top), vy1 = Math.min(innerHeight, r.bottom);
    const visibleInViewport = vx1 > vx0 && vy1 > vy0;
    let covered = 0;
    let probesRun = 0;
    let coveredBy = null;
    if (visibleInViewport) {
      for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
          const x = vx0 + ((vx1 - vx0) * i) / 4;
          const y = vy0 + ((vy1 - vy0) * j) / 4;
          probesRun++;
          const top = document.elementFromPoint(x, y);
          if (top && top !== el && !el.contains(top) && !top.contains(el)) {
            covered++;
            const sticky = top.closest("header,nav,[class*=sticky]");
            coveredBy = coveredBy ?? (sticky ? `${sticky.tagName}.${(sticky.className || "").slice(0, 28)}` : `${top.tagName}.${(top.className || "").slice(0, 28)}`);
          }
        }
      }
    }
    return {
      tag: el.tagName,
      name,
      cls: (typeof el.className === "string" ? el.className : "").slice(0, 44),
      rect: { t: Math.round(r.top), l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
      outlineWidth: cs.outlineWidth,
      outlineStyle: cs.outlineStyle,
      outlineColor: cs.outlineColor,
      inViewport: r.top >= 0 && r.bottom <= innerHeight,
      visibleInViewport,
      covered,
      probesRun,
      entirelyHidden: !visibleInViewport || (probesRun > 0 && covered === probesRun),
      coveredBy,
      tabindex: el.getAttribute("tabindex"),
    };
  });

console.log(`\n=== ${path} @ ${width}px ${reverse ? "(Shift+Tab, from end)" : "(Tab, from top)"} ===`);
const problems = [];
for (let i = 0; i < MAX; i++) {
  if (reverse) {
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");
  } else {
    await page.keyboard.press("Tab");
  }
  await new Promise((r) => setTimeout(r, 90));
  const d = await describe();
  if (d.end) { console.log(`  ${i + 1}. <body> — end of tab order`); break; }
  const noRing = d.outlineStyle === "none" || parseFloat(d.outlineWidth) === 0;
  const flags = [];
  if (noRing) flags.push("NO-FOCUS-RING");
  if (d.entirelyHidden) flags.push(`FAIL 2.4.11 — entirely hidden${d.coveredBy ? ` by ${d.coveredBy}` : " (scrolled out of view)"}`);
  else if (d.covered > 0) flags.push(`partly covered (${d.covered}/${d.probesRun}) by ${d.coveredBy}`);
  if (d.tabindex && Number(d.tabindex) > 0) flags.push(`tabindex=${d.tabindex}`);
  const line = `  ${String(i + 1).padStart(2)}. ${d.tag} "${d.name}" [t=${d.rect.t} h=${d.rect.h}] ring=${d.outlineWidth}/${d.outlineStyle} ${flags.length ? "⚠ " + flags.join(", ") : ""}`;
  console.log(line);
  if (d.entirelyHidden || noRing || (d.tabindex && Number(d.tabindex) > 0)) problems.push(line.trim());
}
console.log(`\n  SC 2.4.11 / 2.4.7 / 2.4.3 failures: ${problems.length}`);
await browser.close();
