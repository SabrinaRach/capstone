// Shared helpers for the accessibility audit scripts.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";

export const BASE_URL = process.env.A11Y_BASE_URL || "http://localhost:3000";
export const OUT_DIR =
  process.env.A11Y_OUT_DIR || path.join(os.tmpdir(), "a11y-audit");
export const SESSION_FILE = path.join(OUT_DIR, "session.json");

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

export function findChrome() {
  const found = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));

  if (!found) {
    throw new Error(
      "No Chrome/Edge found. Set CHROME_PATH to the browser executable.",
    );
  }

  return found;
}

export function launchBrowser() {
  return puppeteer.launch({ executablePath: findChrome(), headless: true });
}

export function loadSession() {
  if (!fs.existsSync(SESSION_FILE)) {
    throw new Error(
      `No test session found at ${SESSION_FILE}. Run seed-test-user.mjs first.`,
    );
  }

  return JSON.parse(fs.readFileSync(SESSION_FILE, "utf8"));
}

export function writeReport(name, data) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

// Opens a page in a fresh browser context (no shared cookies) with the given
// viewport and media features. `session` adds the test user's login cookie.
export async function openPage(
  browser,
  {
    width = 1440,
    height = 900,
    scheme = "light",
    motion = "no-preference",
    session = null,
    theme = null,
  } = {},
) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  await page.setViewport({
    width,
    height,
    isMobile: width < 768,
    hasTouch: width < 1024,
  });
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: scheme },
    { name: "prefers-reduced-motion", value: motion },
  ]);

  const host = new URL(BASE_URL).hostname;

  if (session) {
    await page.setCookie({
      name: "next-auth.session-token",
      value: session.token,
      domain: host,
      path: "/",
      httpOnly: true,
    });
  }

  if (theme) {
    await page.setCookie({ name: "theme", value: theme, domain: host, path: "/" });
  }

  await page.setCookie({ name: "locale", value: "de", domain: host, path: "/" });

  return page;
}

export async function closePage(page) {
  try {
    await page.browserContext().close();
  } catch {
    // The browser may already be gone; a fresh one is started on demand.
  }
}

// Long runs occasionally lose the connection to headless Chrome. Returns a
// connected browser, starting a new one if needed.
export async function ensureBrowser(browser) {
  if (browser?.connected) {
    return browser;
  }

  await browser?.close().catch(() => {});
  return launchBrowser();
}
