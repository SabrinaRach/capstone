// Keeps the "Other / Not assigned" system category anchored at the end of
// the list, no matter how many more categories (system or user-created)
// come before it. Relies on Array#sort being stable, so the relative order
// of every other category — set by the DB query — is left untouched.
export function sortOtherLast(categories) {
  return [...categories].sort((a, b) => {
    if (a.slug === "other") {
      return 1;
    }

    if (b.slug === "other") {
      return -1;
    }

    return 0;
  });
}
