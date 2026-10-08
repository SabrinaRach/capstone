// Categories store a strong color and a light background color (the color
// mixed with white). The light background doesn't work on a dark page, so in
// dark mode the background and text colors are derived from the category
// color instead. The values are passed as CSS variables so the classes below
// can switch between them with the `dark:` variant.
export function categoryColorVars(category) {
  return {
    "--category-color": category?.color || "var(--secondary-500)",
    "--category-bg": category?.backgroundColor || "var(--secondary-100)",
  };
}

// Surface tinted with the category color (cards, badges).
export const CATEGORY_SURFACE =
  "bg-[var(--category-bg)] dark:bg-[color-mix(in_srgb,var(--category-color)_22%,var(--background))]";

// Text in the category color, lightened in dark mode for contrast.
export const CATEGORY_TEXT =
  "text-[var(--category-color)] dark:text-[color-mix(in_srgb,var(--category-color)_45%,white)]";
