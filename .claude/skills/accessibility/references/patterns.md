# Accessibility patterns for this app

Code patterns for the recurring accessibility problems in this codebase (Next.js pages router, Tailwind CSS v4, `motion`, i18n via `useI18n()` with `locales/de.json` + `locales/en.json`). Adapt names to the component at hand; every user-facing or aria text goes through `t(...)`.

## Contents

1. Visible focus
2. Skip link and landmarks
3. Page titles
4. Dialogs
5. Menu buttons (language, theme)
6. Image carousel
7. Read-only rating
8. Form errors
9. Status messages and live regions
10. Reduced motion (landing animation)
11. Non-text contrast (field borders, icons)
12. Not color alone
13. Visible text in accessible names

---

## 1. Visible focus

One global rule in `styles/globals.css` gives every focusable element the same visible ring, including elements that use `outline-none`. It lives outside `@layer` so it wins over Tailwind utilities, and uses `:focus-visible` so mouse clicks on buttons don't show it.

```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

`--primary-500` has ≥ 3:1 contrast against the background in both themes, which WCAG 2.4.11/1.4.11 require for focus indicators. Don't add per-component focus styles unless a component needs a different shape.

## 2. Skip link and landmarks

The first Tab stop on every page jumps over the navigation. In `pages/_app.js`, before everything else:

```jsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:shadow-lg"
>
  {t("a11y.skipToContent")}
</a>
…
<div id="main-content" tabIndex={-1}>
  <Component {...pageProps} />
</div>
```

All content belongs to a landmark: pages render `<main>`, navigation is `<nav aria-label>`, the top bar with language/theme/account/logout is a `<header>` (or `<nav aria-label>` for the controls). Put the desktop header navigation **before** the page content in the DOM, so Tab order matches the visual order.

## 3. Page titles

Every page sets a translated title:

```jsx
import Head from "next/head";

<Head>
  <title>{`${t("entriesPage.title")} – OrgaNice`}</title>
</Head>
```

A small `PageTitle` component (`components/PageTitle.js`) taking `title` keeps the suffix consistent.

## 4. Dialogs

`EntryModal` is a `div role="dialog" aria-modal="true" aria-labelledby`. It also needs focus management — put it into a reusable hook, e.g. `lib/useDialog.js`:

```js
import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Moves focus into the dialog, keeps Tab inside, closes on Escape and
// returns focus to the element that opened it.
export function useDialog(onClose) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const focusables = () => [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent);

    (focusables()[0] || dialog).focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    dialog.addEventListener("keydown", handleKeyDown);
    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  return dialogRef;
}
```

Use: `const dialogRef = useDialog(onClose);` and `<div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="…" tabIndex={-1}>`. Inline confirmations ("Endgültig löschen?") are not modal; move focus to the confirm text or first button when they appear and back to the trigger on cancel.

## 5. Menu buttons (language, theme)

A list of choices behind a button follows the WAI-ARIA menu button pattern with `menuitemradio` (the current choice is checked):

- Trigger: `aria-haspopup="menu"`, `aria-expanded={isOpen}`, `aria-controls={menuId}`.
- List: `role="menu"`, items `role="menuitemradio"` with `aria-checked`; roving `tabIndex` (only the focused item is `0`).
- Opening with Enter/Space/ArrowDown focuses the checked item; ArrowUp/ArrowDown/Home/End move focus; Enter/Space selects; Escape closes and focuses the trigger; Tab closes.

Wrap this in one component (e.g. `components/MenuButton.js`) used by `LanguageSwitcher` and `ThemeSwitcher`, instead of implementing the keys twice.

## 6. Image carousel

The image slider on the entry page is a horizontally scrolling container. Make it a labelled, keyboard-scrollable region and label the slides:

```jsx
<section aria-roledescription={t("entryDetail.carousel")} aria-label={t("entryDetail.imagesLabel", { title })}>
  <div ref={imageSliderRef} tabIndex={0} aria-label={…} className="… focus-visible:…">
    {images.map((url, index) => (
      <div role="group" aria-roledescription={t("entryDetail.slide")} aria-label={t("entryDetail.slideLabel", { index: index + 1, total: images.length })}>
        <Image alt={…} … />
      </div>
    ))}
  </div>
  {/* dots: aria-current="true" on the active one */}
</section>
```

## 7. Read-only rating

A visual star rating that isn't interactive is one image with a text alternative; the stars inside are decorative:

```jsx
<div role="img" aria-label={t("starRating.ratingValueAria", { rating })} className="flex …">
  {/* <svg aria-hidden="true"> stars */}
</div>
```

Empty stars need ≥ 3:1 contrast against the background (use `text-secondary-500`, not `text-secondary-100`), otherwise "3 of 5" is invisible.

## 8. Form errors

Native `required` gives a browser bubble, which screen readers announce in Chrome but which can't be styled or translated consistently. For app-level validation:

```jsx
<input
  id="title"
  required
  aria-invalid={Boolean(errors.title)}
  aria-describedby={errors.title ? "title-error" : undefined}
/>
{errors.title && (
  <p id="title-error" className="mt-1 text-sm text-accent-500">
    {errors.title}
  </p>
)}
```

Keep the summary message at the top with `role="alert"` and move focus to the first invalid field on submit. Errors use text (and optionally an icon), never only a red border.

## 9. Status messages and live regions

Dynamic changes that aren't errors are announced politely:

- Toasts in `_app.js` ("Erfolgreich abgemeldet", "Konto gelöscht"): render the toast container permanently with `role="status"` and change only its content — a live region must exist before its content changes, or screen readers miss it.
- "Kopiert" feedback (CopyEntryButton), "Wird importiert…", "Wird gelöscht…": a `role="status"` element (can be `sr-only`) next to the button.
- Search: an `sr-only` `role="status"` with the result count ("3 Einträge gefunden") on the entries page.

## 10. Reduced motion (landing animation)

The landing page must not animate and must not delay the login when the user prefers reduced motion. `motion` exports `useReducedMotion()`:

```js
import { useReducedMotion } from "motion/react";

const prefersReducedMotion = useReducedMotion();
```

In `AnimationVortex`:
- Draw the canvas **once** in its sorted end state instead of starting the `requestAnimationFrame` loop.
- No `whileHover`/`whileTap`/`animate` scaling.
- Call `onAnimationComplete()` right away (or render the login without the vortex gate), so the login form is visible immediately.

Also set `<MotionConfig reducedMotion="user">` in `_app.js` so every `motion` component respects the setting. After the login form appears, move focus to the email field (or the login heading) — the animation it replaced is no longer interactive.

## 11. Non-text contrast (field borders, icons)

Field borders, focus rings and meaningful icons need ≥ 3:1 against the surrounding background (WCAG 1.4.11). `--secondary-100` is a decorative divider color (≈ 1.4:1) — fine for card borders that aren't needed to identify a control, too light for input borders. Use a dedicated variable in `styles/globals.css`:

```css
--field-border: light-dark(#7b8796, #6b7a90);
```

and `border-field-border` on inputs, selects and textareas (register it in `@theme inline` as `--color-field-border`). Check the result with `contrast-audit.mjs`.

## 12. Not color alone

- Active navigation item: `aria-current="page"` **and** a visible non-color cue (underline, bar, bold).
- Errors: text message, optionally an icon.
- Required fields: "*" plus `required`, explained once ("* Pflichtfeld").
- Category: the colored border is decoration; the category name is always shown as text.

## 13. Visible text in accessible names

If a button shows text, its `aria-label` must contain that text (WCAG 2.5.3, axe `label-content-name-mismatch`). The language button shows "DE", so its name must include it: `aria-label={t("languageSwitcher.labelWithCurrent", { locale: "DE" })}` → "DE – Sprache wechseln". Simpler alternative: no `aria-label`, visible text plus `<span className="sr-only">` with the explanation.
