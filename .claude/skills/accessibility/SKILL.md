---
name: accessibility
description: Audits and improves accessibility (a11y, Barrierefreiheit) of this Next.js + Tailwind app against WCAG 2.2 AA — keyboard navigation, visible focus, accessible names (aria-label/labelledby/describedby), semantic HTML and landmarks, dialogs, menus, forms and error messages, alt texts, color contrast in light and dark mode, live regions for status messages, and prefers-reduced-motion for the landing page animation. Bundles runnable audit scripts (axe-core, keyboard/focus/dialog/reduced-motion checks, WCAG contrast). Use this whenever the user mentions accessibility, a11y, Barrierefreiheit, WCAG, screen readers, keyboard or focus problems, ARIA, contrast or reduced motion — and also whenever you create or change a page, component, dialog, form, menu, icon button or animation in this app, even if accessibility isn't mentioned, so new UI stays accessible.
---

# Accessibility

Target: **WCAG 2.2 level AA** for every page and component, in light and dark mode, on mobile and desktop. The goal behind it: everyone can use all features — with a keyboard only, with a screen reader, with zoom, with reduced motion, without relying on color.

Two ways to use this skill:

- **Building or changing UI** → work through the checklist below while you write the code, then run the audit scripts for the pages you touched.
- **Auditing / fixing the whole app** → follow the full audit workflow, then fix with the patterns in `references/patterns.md`.

## Checklist for every UI change

Each point maps to an acceptance criterion; the reason is noted so you can judge edge cases.

1. **Semantic HTML first.** `<button>` for actions, `<a href>` for navigation, `<main>`, `<nav>`, `<header>`, headings in order (exactly one `<h1>` per page). Native elements bring keyboard support and screen reader semantics for free; ARIA only fills gaps.
2. **Every page has a `<title>`** (via `next/head`, translated). Screen readers announce it and Next's route announcer reads it on navigation.
3. **Keyboard:** everything clickable is reachable with Tab and operable with Enter/Space; no `div onClick` without `role`, `tabIndex` and key handling. Tab order follows the visual order (on desktop the header navigation comes before the page content). A skip link ("Zum Inhalt springen") is the first Tab stop.
4. **Visible focus:** never remove the outline without replacing it. Use `focus-visible:` ring utilities (see patterns). `outline-none` on inputs needs a `focus-visible:ring-*` replacement — a 1px border color change alone is too weak.
5. **Accessible names:** icon-only buttons get `aria-label` (translated); if a button shows text, its accessible name must *contain* that text (WCAG 2.5.3 — e.g. "DE – Sprache wechseln", not just "Sprache wechseln"). Decorative SVGs get `aria-hidden="true"`.
6. **Images:** meaningful images get a descriptive `alt` (translated, include context like entry title and image number); decorative ones `alt=""`.
7. **Forms:** every field has a `<label htmlFor>`; required fields have `required`; errors are shown in text, announced (`role="alert"`) and linked to the field (`aria-invalid="true"` + `aria-describedby` pointing to the message).
8. **Dialogs:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`; focus moves into the dialog on open, Tab stays inside, Escape closes, focus returns to the trigger.
9. **Menus / dropdowns / custom widgets:** follow the matching WAI-ARIA pattern (menu button, radiogroup, carousel) including arrow keys and `aria-expanded`; Escape closes and returns focus.
10. **Status changes are announced:** toasts, "copied", "saving…", search result counts, loading states → a polite live region (`role="status"`). Errors → `role="alert"`.
11. **Color is never the only signal:** active navigation, errors, required fields, ratings also have text, an icon, an underline or another shape.
12. **Contrast:** text ≥ 4.5:1 (large text ≥ 3:1); field borders, focus rings and meaningful icons ≥ 3:1 — in both themes. Colors come from the variables in `styles/globals.css` (`light-dark()`), so fix contrast there, not per component.
13. **Motion:** respect `prefers-reduced-motion`. The landing page animation must be static (or removed) and the login must appear immediately, so reduced motion never blocks access to the app.
14. **All visible and aria texts are translated** (`locales/de.json` and `locales/en.json`); aria texts are content too.

## Full audit workflow

The scripts drive a real headless Chrome against the running dev server and log in as a seeded test user. They are slow on purpose (many pages × states × themes × viewports); run single pages while iterating (`axe-audit.mjs entry login`).

1. **Prerequisites.** The dev server runs (`npm run dev`) and `.env.local` points `MONGODB_URI` at the **dev database** (`capstone_dev`). The seed script refuses any other database — never point it at production. Install the script dependencies once:
   ```bash
   npm install --prefix .claude/skills/accessibility/scripts
   ```
   Chrome or Edge must be installed (or set `CHROME_PATH`).
2. **Seed a test user** with entries, a custom category and images:
   ```bash
   node --env-file=.env.local .claude/skills/accessibility/scripts/seed-test-user.mjs
   ```
3. **Run the audits** (each writes a JSON report to the temp folder `a11y-audit/` and exits non-zero if it found problems):
   ```bash
   node .claude/skills/accessibility/scripts/axe-audit.mjs       # WCAG rules via axe-core
   node .claude/skills/accessibility/scripts/contrast-audit.mjs  # text + field border contrast, 4 theme modes
   node .claude/skills/accessibility/scripts/keyboard-audit.mjs  # Tab order, focus, dialogs, menus, reduced motion, forms, live regions
   ```
4. **Check what scripts can't judge**, and say in the report that you did (or that the user should):
   - Walk the main flows with a screen reader (NVDA on Windows, VoiceOver on macOS): login → entries → search → open entry → edit → delete; create entry incl. validation errors and AI import; categories; account export/delete; language and theme switch. Listen for: sensible names, roles and states, announcements after actions, reading order.
   - Are alt texts *meaningful*, not just present? Is information conveyed by color alone anywhere?
   - Zoom to 200 % and check nothing is cut off (layout at 320 px is covered by the responsive checks).
5. **Clean up** the test data:
   ```bash
   node --env-file=.env.local .claude/skills/accessibility/scripts/cleanup-test-user.mjs
   ```

Keep `scripts/pages.mjs` up to date: when the app gets a new page, dialog, menu or state, add it there so all three audits cover it.

## Fixing

Read `references/patterns.md` before fixing — it has ready-to-adapt code for this codebase (focus ring utility, skip link, page titles, dialog focus management, menu button with arrow keys, image carousel, read-only rating, form errors, live region/toasts, reduced-motion landing animation, field border contrast).

Fix the cause in shared places (a component, `globals.css`, `_app.js`) rather than patching each usage. After fixing, rerun the audits for the affected pages and compare with the earlier report.

## Report format

When reporting results to the user, group by acceptance criterion and severity:

```
## Ergebnis
<one-line verdict: which criteria are met, how many issues>

| # | Problem | Wo | Kriterium | Schwere |
|---|---|---|---|---|

## Was die Werkzeuge nicht prüfen können
<screen reader walkthrough, alt text quality, color-only information — done or open>

## Vorschlag
<what to fix, in which order; decisions the user has to make>
```

Write the report in the user's language (this project: German).
