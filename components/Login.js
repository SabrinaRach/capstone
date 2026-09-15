import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  async function handleLogin() {
    const result = await signIn(undefined, {
      callbackUrl: "/entries",
    });
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-background/90 p-8 text-center shadow-[0_0_50px_rgba(59,130,246,0.2)] backdrop-blur-xl">
      {" "}
      <div className="mb-6">
        {" "}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary-500/40 bg-primary-500/10 text-2xl text-primary-700 shadow-[0_0_25px_rgba(96,165,250,0.25)]">
          {" "}
          ◉{" "}
        </div>{" "}
        <h2 className="text-xl font-semibold text-slate-900"> Welcome </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {" "}
          Log in to manage your content.{" "}
        </p>{" "}
      </div>
      <button
        type="button"
        onClick={handleLogin}
        className="w-full rounded-xl border border-primary-500/70 bg-primary-500/15 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-500/25 hover:shadow-md active:scale-[0.98]"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
