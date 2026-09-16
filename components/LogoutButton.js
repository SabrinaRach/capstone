import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LogoutButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return null;
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    sessionStorage.setItem("loggedOut", "true");
    router.push("/");
  }

  return (
    <>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Log out"
        title="Log out"
        className="fixed right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/40 bg-background/80 text-primary-500 shadow-lg backdrop-blur-md transition hover:bg-primary-500/10 hover:shadow-[0_0_20px_rgba(2,132,199,0.2)] active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-6-3 3m0 0 3 3m-3-3h9"
          />
        </svg>
      </button>
    </>
  );
}
