// Measures WCAG contrast on every page/state from pages.mjs, in light and dark
// mode and with the theme forced against the system setting:
// - text against its actual (composited) background: 4.5:1, large text 3:1
//   (WCAG 1.4.3)
// - borders of form fields against their surroundings: 3:1 (WCAG 1.4.11)
//
// axe-core also checks text contrast, but skips text on semi-transparent or
// layered backgrounds; this script composites them.
//
//   node .claude/skills/accessibility/scripts/contrast-audit.mjs [pageName ...]
import {
  BASE_URL,
  closePage,
  ensureBrowser,
  loadSession,
  openPage,
  writeReport,
} from "./lib.mjs";
import { getPages } from "./pages.mjs";

const MODES = [
  { name: "light", scheme: "light", viewports: [[375, 812], [1440, 900]] },
  { name: "dark", scheme: "dark", viewports: [[375, 812], [1440, 900]] },
  { name: "forced-dark", scheme: "light", theme: "dark", viewports: [[375, 812]] },
  { name: "forced-light", scheme: "dark", theme: "light", viewports: [[1440, 900]] },
];

const session = loadSession();
const onlyPages = process.argv.slice(2);
const pages = getPages(session).filter(
  (page) => onlyPages.length === 0 || onlyPages.includes(page.name),
);

function measureContrast() {
  const parse = (color) => {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const [r, g, b, a = 1] = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r, g, b, a };
  };
  const luminance = ({ r, g, b }) => {
    const channel = (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const blend = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const ratio = (a, b) => {
    const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  // Composites all background colors from the element up to the first opaque
  // one (or the body).
  const backgroundOf = (element) => {
    const layers = [];
    for (let el = element; el && el.nodeType === 1; el = el.parentElement) {
      const color = parse(getComputedStyle(el).backgroundColor);
      if (color && color.a > 0) layers.push(color);
      if (color && color.a === 1) break;
    }
    let base = parse(getComputedStyle(document.body).backgroundColor) || {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    };
    for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
    return base;
  };
  const isVisible = (el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return (
      style.visibility !== "hidden" &&
      style.display !== "none" &&
      Number(style.opacity) > 0 &&
      rect.width > 0 &&
      rect.height > 0
    );
  };
  const describe = (el) =>
    `${el.tagName.toLowerCase()} "${(el.innerText || el.placeholder || el.id || "").trim().slice(0, 40)}"`;
  const rgb = (c) => `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;

  const issues = [];

  for (const el of document.querySelectorAll("body *")) {
    if (!isVisible(el) || el.closest("svg, canvas, [aria-hidden=true], .sr-only")) continue;

    const ownText = [...el.childNodes].some(
      (node) => node.nodeType === 3 && node.textContent.trim(),
    );
    if (!ownText) continue;

    const style = getComputedStyle(el);
    const foreground = parse(style.color);
    if (!foreground) continue;

    const background = backgroundOf(el);
    const contrast = ratio(blend(foreground, background), background);
    const size = parseFloat(style.fontSize);
    const isLarge = size >= 24 || (Number(style.fontWeight) >= 700 && size >= 18.66);
    const required = isLarge ? 3 : 4.5;

    if (contrast < required) {
      issues.push(
        `text ${contrast.toFixed(2)} < ${required}: ${describe(el)} (${style.color} on ${rgb(background)})`,
      );
    }
  }

  for (const el of document.querySelectorAll("input:not([type=hidden]):not([type=color]), select, textarea")) {
    if (!isVisible(el) || el.classList.contains("sr-only")) continue;

    const style = getComputedStyle(el);
    const border = parse(style.borderTopColor);
    if (!border || parseFloat(style.borderTopWidth) === 0) continue;

    const outside = backgroundOf(el.parentElement);
    const contrast = ratio(blend(border, outside), outside);

    if (contrast < 3) {
      issues.push(
        `field border ${contrast.toFixed(2)} < 3: ${describe(el)} (${style.borderTopColor} on ${rgb(outside)})`,
      );
    }
  }

  return [...new Set(issues)];
}

let browser = await ensureBrowser();
const results = [];

for (const mode of MODES) {
  for (const pageConfig of pages) {
    for (const [width, height] of mode.viewports) {
      browser = await ensureBrowser(browser);
      const page = await openPage(browser, {
        width,
        height,
        scheme: mode.scheme,
        theme: mode.theme,
        session: pageConfig.auth ? session : null,
      });

      try {
        await page.goto(BASE_URL + pageConfig.path, {
          waitUntil: "networkidle2",
          timeout: 90000,
        });

        if (pageConfig.action) {
          await pageConfig.action(page);
        }

        const issues = await page.evaluate(measureContrast);
        results.push({ mode: mode.name, page: pageConfig.name, width, issues });
      } catch (error) {
        results.push({ mode: mode.name, page: pageConfig.name, width, error: error.message });
      }

      await closePage(page);
    }
  }
}

await browser.close();

const reportFile = writeReport("contrast-results.json", results);
let failing = 0;

for (const mode of MODES) {
  const modeResults = results.filter((result) => result.mode === mode.name);
  const byIssue = new Map();

  for (const result of modeResults) {
    if (result.error) console.log(`ERROR ${mode.name} ${result.page} ${result.width}px: ${result.error}`);
    for (const issue of result.issues || []) {
      if (!byIssue.has(issue)) byIssue.set(issue, new Set());
      byIssue.get(issue).add(result.page);
    }
  }

  failing += byIssue.size;
  console.log(`\n=== ${mode.name}: ${byIssue.size} issue(s) in ${modeResults.length} checks`);
  for (const [issue, where] of byIssue) {
    console.log(`  - ${issue} → ${[...where].slice(0, 4).join(", ")}`);
  }
}

console.log(`\nFull report: ${reportFile}`);
process.exitCode = failing > 0 ? 1 : 0;
