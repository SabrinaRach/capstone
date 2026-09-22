import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useSession } from "next-auth/react";
import { dictionaries, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./dictionaries.js";

const I18nContext = createContext(null);

const LOCALE_COOKIE = "locale";
const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const COOKIE_CHANGE_EVENT = "locale-cookie-change";

function readLocaleCookie() {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(/(?:^|; )locale=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : null;

  return SUPPORTED_LOCALES.includes(value) ? value : null;
}

function writeLocaleCookie(locale) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  window.dispatchEvent(new Event(COOKIE_CHANGE_EVENT));
}

function subscribeToCookieChanges(callback) {
  window.addEventListener(COOKIE_CHANGE_EVENT, callback);
  return () => window.removeEventListener(COOKIE_CHANGE_EVENT, callback);
}

function getCookieSnapshot() {
  return readLocaleCookie() ?? DEFAULT_LOCALE;
}

function getServerSnapshot() {
  return DEFAULT_LOCALE;
}

function resolveValue(dictionary, key) {
  return key
    .split(".")
    .reduce(
      (value, segment) =>
        value && typeof value === "object" ? value[segment] : undefined,
      dictionary,
    );
}

function interpolate(text, vars) {
  if (!vars) {
    return text;
  }

  return Object.keys(vars).reduce(
    (result, varName) =>
      result.replaceAll(`{${varName}}`, String(vars[varName])),
    text,
  );
}

export function I18nProvider({ children }) {
  const { data: session, update: updateSession } = useSession();

  // Bridges to the cookie (a store outside React) without an effect+setState
  // round trip; falls back to the default locale during SSR/hydration.
  const cookieLocale = useSyncExternalStore(
    subscribeToCookieChanges,
    getCookieSnapshot,
    getServerSnapshot,
  );

  // The session, once loaded, is the source of truth for a logged-in user's
  // remembered preference; the cookie only covers the pre-login/pre-load gap.
  const sessionLocale =
    session?.user?.locale && SUPPORTED_LOCALES.includes(session.user.locale)
      ? session.user.locale
      : null;

  const locale = sessionLocale ?? cookieLocale;

  // next/document's getInitialProps only receives `req` (and therefore the
  // cookie) on pages with server-side data fetching; statically optimized
  // pages (e.g. the home, 404, and auth error pages) always SSR with the
  // default locale. Syncing the attribute here keeps it correct everywhere
  // once the client has mounted, without touching React state.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    async (nextLocale) => {
      if (!SUPPORTED_LOCALES.includes(nextLocale) || nextLocale === locale) {
        return;
      }

      writeLocaleCookie(nextLocale);

      if (session?.user) {
        try {
          await fetch("/api/user/locale", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale: nextLocale }),
          });
          await updateSession({ locale: nextLocale });
        } catch (error) {
          console.error("Failed to persist locale preference:", error);
        }
      }
    },
    [locale, session?.user, updateSession],
  );

  const t = useCallback(
    (key, vars) => {
      const dictionary = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
      const value =
        resolveValue(dictionary, key) ??
        resolveValue(dictionaries[DEFAULT_LOCALE], key);

      if (typeof value !== "string") {
        return key;
      }

      return interpolate(value, vars);
    },
    [locale],
  );

  const tCount = useCallback(
    (count, key, vars) =>
      t(`${key}.${count === 1 ? "one" : "other"}`, { count, ...vars }),
    [t],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, tCount }),
    [locale, setLocale, t, tCount],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
}
