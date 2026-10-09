import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { getAuthErrorMessageKey } from "@/lib/authErrors";
import LegalLinks from "./LegalLinks";

const EMAIL_PATTERN = /^[^s@]+@[^s@]+.[^s@]+$/;

// focusOnMount: move focus into the form when it replaces the landing
// animation the user just activated.
export default function Login({ focusOnMount = false }) {
  const { t } = useI18n();
  const router = useRouter();
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showAuthError, setShowAuthError] = useState(true);

  // NextAuth redirects sign-in errors (e.g. an email address already used
  // with another sign-in method) to this page with an `error` parameter.
  const authError =
    showAuthError && typeof router.query.error === "string"
      ? t(getAuthErrorMessageKey(router.query.error))
      : "";
  const errorMessage = loginError || authError;

  useEffect(() => {
    if (focusOnMount) {
      emailRef.current?.focus();
    }
  }, [focusOnMount]);

  async function handleGithubLogin() {
    setLoginError("");
    setShowAuthError(false);

    try {
      await signIn("github", {
        callbackUrl: "/entries",
      });
    } catch (error) {
      setLoginError(t("login.signInError"));
    }
  }

  async function handleEmailLogin(event) {
    event.preventDefault();

    const emailValidationError = !email.trim()
      ? t("login.emailRequired")
      : !EMAIL_PATTERN.test(email.trim())
        ? t("login.emailInvalid")
        : "";

    setEmailError(emailValidationError);

    if (emailValidationError) {
      emailRef.current?.focus();
      return;
    }

    setLoginError("");
    setShowAuthError(false);
    setIsSendingLink(true);

    try {
      await signIn("email", {
        email: email.trim(),
        callbackUrl: "/entries",
      });
    } catch (error) {
      setLoginError(t("login.sendLinkError"));
    } finally {
      setIsSendingLink(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-secondary-100/60 bg-background/90 p-8 text-center shadow-[0_0_50px_rgba(2,132,199,0.2)] backdrop-blur-xl">
      {" "}
      <div className="mb-6">
        {" "}
        <div
          aria-hidden="true"
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary-500/40 bg-primary-500/10 text-2xl text-primary-700 shadow-[0_0_25px_rgba(2,132,199,0.25)]">
          {" "}
          ◉{" "}
        </div>{" "}
        <h2 className="text-xl font-semibold text-foreground">
          {" "}
          {t("login.welcome")}{" "}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-secondary-500">
          {" "}
          {t("login.subtitle")}{" "}
        </p>{" "}
      </div>
      {errorMessage && (
        <p className="mb-4 text-sm text-accent-500" role="alert">
          {errorMessage}
        </p>
      )}
      <form
        onSubmit={handleEmailLogin}
        noValidate
        className="space-y-3 text-left"
      >
        <label htmlFor="login-email" className="sr-only">
          {t("login.emailLabel")}
        </label>

        <input
          ref={emailRef}
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("login.emailPlaceholder")}
          required
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
          className="w-full rounded-xl border border-field-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-secondary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />

        {emailError && (
          <p id="login-email-error" role="alert" className="text-sm text-accent-500">
            {emailError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSendingLink}
          className="w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-background transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSendingLink ? t("login.sendingLink") : t("login.continueWithEmail")}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-secondary-500">
        <span className="h-px flex-1 bg-secondary-100" aria-hidden="true" />
        {t("common.or")}
        <span className="h-px flex-1 bg-secondary-100" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={handleGithubLogin}
        className="w-full rounded-xl border border-primary-500/70 bg-primary-500/15 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-500/25 hover:shadow-md active:scale-[0.98]"
      >
        {t("login.signInWithGithub")}
      </button>
      <p className="mt-5 text-xs leading-relaxed text-secondary-500">
        {t("login.privacyNotice")}
      </p>
      <LegalLinks className="mt-2" />
    </div>
  );
}
