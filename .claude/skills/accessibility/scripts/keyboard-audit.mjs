// Keyboard and interaction checks that axe-core can't do:
// - Tab order and a visible focus indicator on every focusable element
// - dialogs: focus moves in, Tab stays inside, Escape closes, focus returns
// - menus: arrow keys reach the options, Escape closes and returns focus
// - landing page: animation operable by keyboard, focus moves to the login
// - prefers-reduced-motion: animation stops, login stays reachable
// - form validation: errors announced and linked to the fields
// - live regions present for status messages
//
//   node .claude/skills/accessibility/scripts/keyboard-audit.mjs
import {
  BASE_URL,
  closePage,
  ensureBrowser,
  loadSession,
  openPage,
  sleep,
  writeReport,
} from "./lib.mjs";
import { getPages, openLogin } from "./pages.mjs";

const session = loadSession();
const pages = getPages(session);
const browser = await ensureBrowser();
const findings = [];
const report = (area, ok, message) => {
  findings.push({ area, ok, message });
  console.log(`${ok ? "✓" : "✗"} [${area}] ${message}`);
};

// Describes the focused element. A focus indicator counts as visible if the
// element has an outline or a box-shadow (Tailwind rings) while focused.
const focusInfo = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body || el.tagName === "NEXTJS-PORTAL") return null;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      name: (el.getAttribute("aria-label") || el.innerText || el.placeholder || el.id || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 40),
      visible:
        (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) ||
        (style.boxShadow && style.boxShadow !== "none"),
      inDialog: Boolean(el.closest("[role=dialog]")),
      inHeader: Boolean(el.closest("header")),
      inMain: Boolean(el.closest("main")),
      top: Math.round(rect.top + window.scrollY),
    };
  });

async function collectTabOrder(page, max = 60) {
  const order = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    await sleep(30);
    const info = await focusInfo(page);
    if (!info) continue;
    if (order.length > 0 && order[0].name === info.name && order[0].tag === info.tag) break;
    order.push(info);
  }
  return order;
}

// 1) Tab order and visible focus on every page without an extra state.
for (const pageConfig of pages.filter((p) => !p.action)) {
  for (const width of [375, 1440]) {
    const page = await openPage(browser, {
      width,
      session: pageConfig.auth ? session : null,
    });
    await page.goto(BASE_URL + pageConfig.path, { waitUntil: "networkidle2", timeout: 90000 });
    const order = await collectTabOrder(page);
    const label = `${pageConfig.name} @${width}`;

    const invisible = order.filter((el) => !el.visible);
    report(
      "focus-visible",
      invisible.length === 0,
      `${label}: ${invisible.length === 0 ? "all" : `${invisible.length} of ${order.length}`} focusable elements ${invisible.length === 0 ? "show" : "WITHOUT"} a focus indicator${invisible.length ? ": " + invisible.map((el) => `${el.tag} "${el.name}"`).join(", ") : ""}`,
    );

    const firstMain = order.findIndex((el) => el.inMain);
    const headerAfterMain = order.findIndex((el, i) => el.inHeader && i > firstMain && firstMain !== -1);
    if (width === 1440 && pageConfig.auth) {
      report(
        "focus-order",
        headerAfterMain === -1,
        `${label}: ${headerAfterMain === -1 ? "header navigation comes before the page content" : "header navigation is only reached AFTER the page content"}`,
      );
    }

    const firstIsSkipLink = order[0]?.tag === "a" && /inhalt|content/i.test(order[0].name);
    report("skip-link", firstIsSkipLink, `${label}: ${firstIsSkipLink ? "first Tab stop is a skip link" : `no skip link (first Tab stop: ${order[0]?.tag} "${order[0]?.name}")`}`);

    await closePage(page);
  }
}

// 2) Dialogs.
for (const pageConfig of pages.filter((p) => p.name.endsWith("-dialog"))) {
  const page = await openPage(browser, { session });
  await page.goto(BASE_URL + pageConfig.path, { waitUntil: "networkidle2", timeout: 90000 });
  await pageConfig.action(page);
  const label = pageConfig.name;

  const attributes = await page.evaluate(() => {
    const dialog = document.querySelector("[role=dialog]");
    if (!dialog) return null;
    const labelledBy = dialog.getAttribute("aria-labelledby");
    return {
      modal: dialog.getAttribute("aria-modal") === "true",
      named: Boolean(dialog.getAttribute("aria-label") || (labelledBy && document.getElementById(labelledBy)?.innerText.trim())),
    };
  });
  report("dialog", Boolean(attributes?.modal && attributes?.named), `${label}: role=dialog ${attributes ? `aria-modal=${attributes.modal}, accessible name=${attributes.named}` : "NOT FOUND"}`);

  const first = await focusInfo(page);
  report("dialog", Boolean(first?.inDialog), `${label}: focus ${first?.inDialog ? "moves into the dialog" : "stays OUTSIDE the dialog"} when it opens`);

  let escaped = 0;
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    await sleep(20);
    const info = await focusInfo(page);
    if (info && !info.inDialog) escaped++;
  }
  report("dialog", escaped === 0, `${label}: Tab ${escaped === 0 ? "stays inside the dialog" : `leaves the dialog (${escaped} of 40 presses)`}`);

  await page.keyboard.press("Escape");
  await sleep(400);
  const stillOpen = Boolean(await page.$("[role=dialog]"));
  report("dialog", !stillOpen, `${label}: Escape ${stillOpen ? "does NOT close" : "closes"} the dialog`);

  if (!stillOpen) {
    const after = await focusInfo(page);
    report("dialog", Boolean(after), `${label}: focus after closing ${after ? `returns to ${after.tag} "${after.name}"` : "is LOST (body)"}`);
  }

  await closePage(page);
}

// 3) Menus (language, theme).
for (const pageConfig of pages.filter((p) => p.name.endsWith("-menu"))) {
  const page = await openPage(browser, { session });
  await page.goto(BASE_URL + pageConfig.path, { waitUntil: "networkidle2", timeout: 90000 });
  await pageConfig.action(page);
  await page.keyboard.press("ArrowDown");
  await sleep(150);
  const inMenu = await page.evaluate(() => Boolean(document.activeElement?.closest("[role=menu], [role=listbox]")));
  report("menu", inMenu, `${pageConfig.name}: ArrowDown ${inMenu ? "moves focus to the options" : "does NOT move focus to the options"}`);

  await page.keyboard.press("Escape");
  await sleep(150);
  const state = await page.evaluate(() => ({
    open: Boolean(document.querySelector("[role=menu], [role=listbox]")),
    onTrigger: Boolean(document.activeElement?.getAttribute("aria-haspopup")),
  }));
  report("menu", !state.open && state.onTrigger, `${pageConfig.name}: Escape ${state.open ? "does NOT close the menu" : "closes the menu"}, focus ${state.onTrigger ? "returns to the menu button" : "is NOT on the menu button"}`);
  await closePage(page);
}

// 4) Landing page: animation by keyboard, focus moves to the login.
{
  const page = await openPage(browser, {});
  await page.goto(BASE_URL + "/", { waitUntil: "networkidle2", timeout: 90000 });
  const order = await collectTabOrder(page, 10);
  const vortex = order.find((el) => /vortex/i.test(el.name));
  report("landing", Boolean(vortex), `landing: animation ${vortex ? "is reachable with Tab" : "is NOT reachable with Tab"}`);
  await page.focus('[aria-label="Vortex öffnen"]');
  await page.keyboard.press("Enter");
  const shown = await page.waitForSelector("#login-email", { timeout: 20000 }).then(() => true).catch(() => false);
  await sleep(500);
  const after = await page.evaluate(() => document.activeElement?.closest("form, [role=region], section")?.contains(document.getElementById("login-email")) || document.activeElement?.id === "login-email");
  report("landing", shown, `landing: Enter on the animation ${shown ? "shows" : "does NOT show"} the login form`);
  report("landing", after, `landing: focus ${after ? "moves to the login form" : "stays on the (now hidden) animation"}`);
  await closePage(page);
}

// 5) prefers-reduced-motion.
{
  const page = await openPage(browser, { motion: "reduce" });
  await page.goto(BASE_URL + "/", { waitUntil: "networkidle2", timeout: 90000 });
  const moving = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return resolve(false);
        const before = canvas.toDataURL();
        setTimeout(() => resolve(canvas.toDataURL() !== before), 600);
      }),
  );
  report("reduced-motion", !moving, `landing with reduced motion: animation ${moving ? "KEEPS MOVING" : "is static"}`);
  const start = Date.now();
  let reachable = await page.$("#login-email").then(Boolean);
  if (!reachable) {
    await openLogin(page).catch(() => {});
    reachable = await page.$("#login-email").then(Boolean);
  }
  const duration = Date.now() - start;
  report("reduced-motion", reachable && duration < 1500, `landing with reduced motion: login ${reachable ? `reachable after ${duration} ms` : "NOT reachable"}`);
  await closePage(page);
}

// 6) Form validation.
{
  const validation = pages.find((p) => p.name === "new-entry-validation");
  if (validation) {
    const page = await openPage(browser, { session });
    await page.goto(BASE_URL + validation.path, { waitUntil: "networkidle2", timeout: 90000 });
    await validation.action(page);
    const state = await page.evaluate(() => {
      const dialog = document.querySelector("[role=dialog]") || document;
      const fields = [...dialog.querySelectorAll("input, select, textarea")].filter((el) => el.required || el.getAttribute("aria-required") === "true");
      return {
        required: fields.length,
        invalid: fields.filter((el) => el.getAttribute("aria-invalid") === "true").length,
        describedErrors: fields.filter((el) => {
          const ids = (el.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
          return ids.some((id) => document.getElementById(id)?.innerText.trim());
        }).length,
        nativeInvalid: fields.filter((el) => !el.checkValidity()).length,
        announced: [...dialog.querySelectorAll("[role=alert], [aria-live]")].some((el) => el.innerText.trim()),
      };
    });
    report("forms", state.announced || state.nativeInvalid > 0, `new entry form: error ${state.announced ? "is announced (role=alert/aria-live)" : state.nativeInvalid > 0 ? "shown via native browser validation only" : "is NOT announced"}`);
    report("forms", state.invalid > 0 || state.nativeInvalid > 0, `new entry form: ${state.invalid} of ${state.required} required fields marked aria-invalid`);
    report("forms", state.describedErrors > 0 || state.nativeInvalid > 0, `new entry form: ${state.describedErrors} field(s) linked to their error message via aria-describedby`);
    await closePage(page);
  }
}

// 7) Live regions for status messages (besides Next.js' route announcer).
{
  const page = await openPage(browser, { session });
  await page.goto(BASE_URL + "/entries", { waitUntil: "networkidle2", timeout: 90000 });
  const regions = await page.evaluate(() => [...document.querySelectorAll("[aria-live], [role=status], [role=alert]")].filter((el) => el.id !== "__next-route-announcer__").length);
  report("live-regions", regions > 0, `entries: ${regions} live region(s) for status messages (toasts, search results, saved/copied feedback)`);
  await closePage(page);
}

await browser.close();
const reportFile = writeReport("keyboard-results.json", findings);
const failed = findings.filter((f) => !f.ok).length;
console.log(`\n${failed} of ${findings.length} checks failed. Full report: ${reportFile}`);
process.exitCode = failed > 0 ? 1 : 0;
