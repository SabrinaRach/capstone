// The chosen color theme is stored in a cookie on this device. "system"
// (no cookie) follows the operating system / browser setting; "light" and
// "dark" are applied via data-theme on <html>, see styles/globals.css.
export const THEMES = ["system", "light", "dark"];

const THEME_COOKIE = "theme";
const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const THEME_CHANGE_EVENT = "theme-change";

export function themeFromCookieHeader(cookieHeader) {
  const match = cookieHeader?.match(/(?:^|; )theme=(light|dark)(?:;|$)/);

  return match ? match[1] : "system";
}

export function subscribeToThemeChanges(callback) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

export function getThemeSnapshot() {
  return themeFromCookieHeader(document.cookie);
}

export function getServerThemeSnapshot() {
  return "system";
}

export function setTheme(theme) {
  if (theme === "light" || theme === "dark") {
    document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
    document.documentElement.dataset.theme = theme;
  } else {
    document.cookie = `${THEME_COOKIE}=; path=/; max-age=0; samesite=lax`;
    delete document.documentElement.dataset.theme;
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

// Runs before the page is painted, so pages rendered without the request
// cookie (e.g. statically optimized pages) don't flash in the wrong theme.
export const THEME_INIT_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);if(m)document.documentElement.setAttribute("data-theme",m[1]);}catch(e){}})();`;
