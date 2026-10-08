// Categories store a strong color and a light background color (the color
// mixed with white). The light background doesn't work on a dark page, so in
// dark mode the background and text colors are derived from the category
// color instead. The values are passed as CSS variables and switched with
// light-dark(), like the theme colors in styles/globals.css.
export function categoryColorVars(category) {
  return {
    "--category-color": category?.color || "var(--secondary-500)",
    "--category-bg": category?.backgroundColor || "var(--secondary-100)",
  };
}

// Surface tinted with the category color (cards, badges).
export const CATEGORY_SURFACE =
  "bg-[light-dark(var(--category-bg),color-mix(in_srgb,var(--category-color)_22%,var(--background)))]";

// Text in the category color, darkened in light mode and lightened in dark
// mode so it stays readable on CATEGORY_SURFACE.
export const CATEGORY_TEXT =
  "text-[light-dark(color-mix(in_srgb,var(--category-color)_60%,black),color-mix(in_srgb,var(--category-color)_45%,white))]";
