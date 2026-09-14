import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-primary-500/30 bg-white/80 p-6 text-center shadow-lg backdrop-blur-md">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary-100/30 bg-primary-500/10 text-primary-100 shadow-[0_0_25px_rgba(96,165,250,0.25)]">
            {" "}
            ✓{" "}
          </div>
          <h2 className="text-xl font-semibold text-background">
            {" "}
            Welcome back{" "}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {" "}
            You have successfully logged in.{" "}
          </p>{" "}
        </div>

        <div className="mb-6 border-t border-white/10 pt-5">
          {" "}
          <p className="text-xs uppercase tracking-wider text-slate-500">
            {" "}
            Logged in as{" "}
          </p>{" "}
          <p className="mt-1 truncate text-sm text-slate-200">
            {" "}
            {session.user.email}{" "}
          </p>{" "}
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full rounded-xl border border-primary-500/50 bg-primary-500/10 px-4 py-3 text-sm font-medium text-primary-100 transition hover:bg-primary-500/20 hover:shadow--md active:scale-[0.98]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-slate-950/70 p-8 text-center shadow-[0_0_50px_rgba(59,130,246,0.2)] backdrop-blur-xl">
      {" "}
      <div className="mb-6">
        {" "}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary-100/30 bg-primary-500/10 text-2xl text-primary-100 shadow-[0_0_25px_rgba(96,165,250,0.25)]">
          {" "}
          ◉{" "}
        </div>{" "}
        <h2 className="text-xl font-semibold text-foreground"> Welcome </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {" "}
          Log in to manage your content.{" "}
        </p>{" "}
      </div>
      <button
        type="button"
        onClick={() => signIn()}
        className="w-full rounded-xl border border-primary-500/50 bg-primary-500/10 px-4 py-3 text-sm font-medium text-primary-100 transition hover:bg-primary-500/20 hover:shadow-md active:scale-[0.98]"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
