// Tracks whether the user has navigated within the app since the page was
// loaded, i.e. whether going back in the browser history stays inside the
// app. Resets on a full page load.
let hasInAppHistory = false;

export function markInAppNavigation() {
  hasInAppHistory = true;
}

export function canGoBackInApp() {
  return hasInAppHistory;
}
