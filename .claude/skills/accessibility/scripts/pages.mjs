// The pages and UI states every audit script checks. When you add a page,
// dialog, menu or other state to the app, add it here so it gets audited too.
// Texts are matched in German because the scripts set the locale cookie to
// "de".
import { sleep } from "./lib.mjs";

// Clicks the first visible element matching `selector` whose text or
// aria-label matches `pattern`.
export function clickByText(selector, pattern) {
  return async (page) => {
    const clicked = await page.evaluate(
      (sel, source) => {
        const element = [...document.querySelectorAll(sel)].find(
          (el) =>
            el.offsetParent &&
            new RegExp(source, "i").test(
              `${el.innerText || ""} ${el.getAttribute("aria-label") || ""}`,
            ),
        );

        // Focus first, like a real click or keypress does, so checks that
        // focus returns to the trigger (dialogs, menus) are meaningful.
        element?.focus();
        element?.click();
        return Boolean(element);
      },
      selector,
      pattern,
    );

    await sleep(600);
    return clicked;
  };
}

// The landing page shows the login form only after the animation has been
// activated.
export async function openLogin(page) {
  await page.click('[aria-label="Vortex öffnen"]');
  await page.waitForSelector("#login-email", { timeout: 20000 });
  await sleep(1200);
}

const openNewEntry = clickByText(
  "header button, nav button",
  "Neuer Eintrag|Neuen Eintrag",
);

export function getPages(session) {
  const [entryId] = session.entryIds;

  return [
    { name: "landing", path: "/", auth: false },
    { name: "login", path: "/", auth: false, action: openLogin },
    { name: "entries", path: "/entries", auth: true },
    { name: "entry", path: `/entries/${entryId}`, auth: true },
    {
      name: "entry-delete-confirm",
      path: `/entries/${entryId}`,
      auth: true,
      action: clickByText("button", "löschen"),
    },
    {
      name: "entry-edit-dialog",
      path: `/entries/${entryId}`,
      auth: true,
      action: clickByText("button", "bearbeiten"),
    },
    { name: "new-entry-dialog", path: "/entries", auth: true, action: openNewEntry },
    {
      name: "new-entry-validation",
      path: "/entries",
      auth: true,
      action: async (page) => {
        await openNewEntry(page);
        await clickByText("[role=dialog] button[type=submit]", ".")(page);
      },
    },
    { name: "categories", path: "/categories", auth: true },
    {
      name: "category-edit",
      path: "/categories",
      auth: true,
      action: clickByText("button", "bearbeiten"),
    },
    { name: "category", path: `/categories/${session.systemSlug}`, auth: true },
    { name: "account", path: "/account", auth: true },
    {
      name: "account-delete-confirm",
      path: "/account",
      auth: true,
      action: clickByText("button", "^Konto löschen$"),
    },
    {
      name: "language-menu",
      path: "/entries",
      auth: true,
      action: clickByText("header button", "Sprache"),
    },
    {
      name: "theme-menu",
      path: "/entries",
      auth: true,
      action: clickByText("header button", "Farbschema"),
    },
    { name: "privacy", path: "/privacy", auth: false },
    { name: "imprint", path: "/imprint", auth: false },
    { name: "auth-error", path: "/auth/error?error=Verification", auth: false },
    { name: "not-found", path: "/gibt-es-nicht", auth: true },
  ];
}
