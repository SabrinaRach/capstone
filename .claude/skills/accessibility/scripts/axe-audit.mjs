// Runs axe-core (WCAG 2.2 A/AA + best practices) on every page/state from
// pages.mjs in light and dark mode, on mobile and desktop.
//
//   node .claude/skills/accessibility/scripts/axe-audit.mjs [pageName ...]
import fs from "node:fs";
import { createRequire } from "node:module";
import {
  BASE_URL,
  closePage,
  ensureBrowser,
  loadSession,
  openPage,
  writeReport,
} from "./lib.mjs";
import { getPages } from "./pages.mjs";

const require = createRequire(import.meta.url);
const AXE_SOURCE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
const VIEWPORTS = [
  [375, 812],
  [1440, 900],
];
const SCHEMES = ["light", "dark"];
const IMPACT_ORDER = ["critical", "serious", "moderate", "minor"];

const session = loadSession();
const onlyPages = process.argv.slice(2);
const pages = getPages(session).filter(
  (page) => onlyPages.length === 0 || onlyPages.includes(page.name),
);

let browser = await ensureBrowser();
const results = [];

for (const scheme of SCHEMES) {
  for (const pageConfig of pages) {
    for (const [width, height] of VIEWPORTS) {
      browser = await ensureBrowser(browser);
      const page = await openPage(browser, {
        width,
        height,
        scheme,
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

        await page.evaluate(AXE_SOURCE);
        const violations = await page.evaluate(async (tags) => {
          const result = await window.axe.run(document, {
            runOnly: { type: "tag", values: tags },
            resultTypes: ["violations"],
          });

          return result.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            help: violation.help,
            helpUrl: violation.helpUrl,
            nodes: violation.nodes.map((node) => ({
              target: node.target.join(" "),
              summary: node.failureSummary,
            })),
          }));
        }, TAGS);

        results.push({ page: pageConfig.name, scheme, width, violations });
      } catch (error) {
        results.push({ page: pageConfig.name, scheme, width, error: error.message });
      }

      await closePage(page);
    }
  }
}

await browser.close();

const reportFile = writeReport("axe-results.json", results);

// Summary: one block per rule with the pages it occurs on.
const byRule = new Map();

for (const result of results) {
  if (result.error) {
    console.log(`ERROR ${result.page} (${result.scheme}, ${result.width}px): ${result.error}`);
    continue;
  }

  for (const violation of result.violations) {
    if (!byRule.has(violation.id)) {
      byRule.set(violation.id, { ...violation, pages: new Set(), examples: new Set() });
    }

    const rule = byRule.get(violation.id);
    rule.pages.add(result.page);
    violation.nodes
      .slice(0, 2)
      .forEach((node) => rule.examples.size < 4 && rule.examples.add(node.target));
  }
}

const rules = [...byRule.values()].sort(
  (a, b) => IMPACT_ORDER.indexOf(a.impact) - IMPACT_ORDER.indexOf(b.impact),
);

for (const rule of rules) {
  console.log(`\n[${rule.impact}] ${rule.id}: ${rule.help}`);
  console.log(`  ${rule.helpUrl}`);
  console.log(`  Pages: ${[...rule.pages].join(", ")}`);
  for (const example of rule.examples) console.log(`   • ${example}`);
}

console.log(
  `\n${rules.length} rule(s) violated across ${results.length} page/state/scheme/viewport combinations.`,
);
console.log(`Full report: ${reportFile}`);
process.exitCode = rules.length > 0 ? 1 : 0;
