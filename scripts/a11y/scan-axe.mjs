/**
 * Full-site axe-core sweep (Phase a11y-remediation).
 *
 * Injects the project's own axe-core build into a headless Chrome and runs it
 * over every URL passed on stdin, at both a desktop and a phone viewport.
 * One browser, many pages — the CLI relaunches Chrome per URL, which is
 * ~20 minutes for 323 routes.
 *
 * Usage: node scripts/a11y/scan-axe.mjs <outfile.json> [--viewport=desktop|mobile] < paths.txt
 */
import { readFileSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const AXE_SOURCE = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const BASE = process.env.A11Y_BASE ?? "http://localhost:3000";
const OUT = process.argv[2];
const viewportArg = (process.argv.find((a) => a.startsWith("--viewport=")) ?? "--viewport=desktop").split("=")[1];
const VIEWPORTS = {
  desktop: { width: 1280, height: 800, isMobile: false, deviceScaleFactor: 1 },
  mobile: { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};
const viewport = VIEWPORTS[viewportArg];

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const paths = readFileSync(0, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-prefers-reduced-motion=false"],
});

const results = [];
let done = 0;

for (const path of paths) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  let entry = { path, viewport: viewportArg, violations: [], incomplete: [], error: null };
  try {
    const resp = await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    entry.status = resp?.status() ?? null;
    // The reveal-on-scroll enhancement starts elements at opacity 0; scroll the
    // page so nothing is audited in a transient hidden state.
    await page.evaluate(async () => {
      await new Promise((r) => {
        let y = 0;
        const step = () => {
          y += window.innerHeight;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(step, 30);
          else { window.scrollTo(0, 0); setTimeout(r, 250); }
        };
        step();
      });
    });
    await page.evaluate(AXE_SOURCE);
    const r = await page.evaluate(async (tags) => {
      const res = await window.axe.run(document, { runOnly: { type: "tag", values: tags }, resultTypes: ["violations", "incomplete"] });
      const slim = (arr) => arr.map((v) => ({
        id: v.id, impact: v.impact, help: v.help, tags: v.tags,
        nodes: v.nodes.slice(0, 6).map((n) => ({ target: n.target, html: n.html?.slice(0, 300), failureSummary: n.failureSummary })),
        nodeCount: v.nodes.length,
      }));
      return { violations: slim(res.violations), incomplete: slim(res.incomplete) };
    }, TAGS);
    entry.violations = r.violations;
    entry.incomplete = r.incomplete;
  } catch (e) {
    entry.error = String(e).slice(0, 300);
  }
  await page.close();
  results.push(entry);
  done++;
  if (done % 25 === 0 || done === paths.length) console.error(`  ${done}/${paths.length}`);
}

await browser.close();
writeFileSync(OUT, JSON.stringify(results, null, 2));

const totals = {};
for (const r of results) for (const v of r.violations) totals[v.id] = (totals[v.id] ?? 0) + 1;
console.log(`\n=== axe ${viewportArg}: ${paths.length} URLs ===`);
console.log(`pages with violations: ${results.filter((r) => r.violations.length).length}`);
console.log(`pages errored: ${results.filter((r) => r.error).length}`);
console.log("violations by rule (pages affected):");
for (const [id, n] of Object.entries(totals).sort((a, b) => b[1] - a[1])) console.log(`  ${id}: ${n}`);
