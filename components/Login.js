import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (session) {
      setShowToast(true);

      const timer = setTimeout(() => {
        router.push("/entries");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [session, router]);

  if (session) {
    return (
      <>
        {showToast && (
          <div className="fixed right-6 top-6 z-50 rounded-xl border border-primary-500/40 bg-slate-950/90 px-5 py-3 text-sm font-medium text-primary-100 shadow-lg backdrop-blur-md">
            ✓ Successfully logged in
          </div>
        )}
      </>
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
