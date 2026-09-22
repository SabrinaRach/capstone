// System categories are seeded with a stable, language-independent slug, so
// their display name can be looked up in the dictionary. User-created
// categories are free text and can't be auto-translated, so they always show
// the name as typed. If a system category's slug has no translation (e.g. a
// newly seeded one), fall back to the stored name rather than showing a raw
// key.
export function getCategoryDisplayName(category, t) {
  if (!category) {
    return "";
  }

  if (category.isSystem) {
    const key = `categories.${category.slug}`;
    const translated = t(key);

    return translated === key ? category.name : translated;
  }

  return category.name;
}
