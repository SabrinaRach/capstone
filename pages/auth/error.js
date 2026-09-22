import Link from "next/link";
import { useRouter } from "next/router";

const ERROR_MESSAGES = {
  Verification:
    "That sign-in link has expired or was already used. Please request a new one.",
  AccessDenied: "Access was denied. Please try signing in again.",
  Configuration: "Sign-in is currently unavailable. Please try again later.",
  Default: "Something went wrong while signing you in. Please try again.",
};

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const message =
    (typeof error === "string" && ERROR_MESSAGES[error]) ||
    ERROR_MESSAGES.Default;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-secondary-100/80 bg-background/80 p-8 text-center shadow-xl backdrop-blur-md">
        <h1 className="text-2xl font-bold">Sign-in problem</h1>

        <p className="mt-2 text-sm text-secondary-500">{message}</p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-primary-500 px-5 py-2.5 text-sm font-medium text-background transition hover:bg-primary-700"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}
