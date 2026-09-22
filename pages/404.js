import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-secondary-100/80 bg-background/80 p-8 text-center shadow-xl backdrop-blur-md">
        <h1 className="text-2xl font-bold">Page not found</h1>

        <p className="mt-2 text-sm text-secondary-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <Link
          href="/entries"
          className="mt-6 inline-block rounded-full bg-primary-500 px-5 py-2.5 text-sm font-medium text-background transition hover:bg-primary-700"
        >
          Back to your entries
        </Link>
      </div>
    </main>
  );
}
