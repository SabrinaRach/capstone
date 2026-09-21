import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);

  async function handleGithubLogin() {
    await signIn("github", {
      callbackUrl: "/entries",
    });
  }

  async function handleEmailLogin(event) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setIsSendingLink(true);

    await signIn("email", {
      email: email.trim(),
      callbackUrl: "/entries",
    });
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-secondary-100/60 bg-background/90 p-8 text-center shadow-[0_0_50px_rgba(2,132,199,0.2)] backdrop-blur-xl">
      {" "}
      <div className="mb-6">
        {" "}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary-500/40 bg-primary-500/10 text-2xl text-primary-700 shadow-[0_0_25px_rgba(2,132,199,0.25)]">
          {" "}
          ◉{" "}
        </div>{" "}
        <h2 className="text-xl font-semibold text-foreground"> Welcome </h2>
        <p className="mt-2 text-sm leading-relaxed text-secondary-500">
          {" "}
          Log in to manage your content.{" "}
        </p>{" "}
      </div>
      <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
        <label htmlFor="login-email" className="sr-only">
          Email address
        </label>

        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-xl border border-secondary-100 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-secondary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />

        <button
          type="submit"
          disabled={isSendingLink}
          className="w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-background transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSendingLink ? "Sending link..." : "Continue with email"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-secondary-500">
        <span className="h-px flex-1 bg-secondary-100" aria-hidden="true" />
        or
        <span className="h-px flex-1 bg-secondary-100" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={handleGithubLogin}
        className="w-full rounded-xl border border-primary-500/70 bg-primary-500/15 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-500/25 hover:shadow-md active:scale-[0.98]"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
