import { useRouter } from "next/router";
import BackLink from "../../components/BackLink.js";
import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";

export default function EntryPage({ entry }) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  if (!entry) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <BackLink href="/entries" text="All Entries" />

        <h1 className="text-2xl font-bold">Entry not found</h1>

        <p className="mt-2">The requested entry does not exist.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <BackLink href="/entries" text="All Entries" />

      <h1 className="text-3xl font-bold">{entry.title}</h1>

      <p className="mt-2 text-secondary-700">Category: {entry.category}</p>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();

  const entry = await Entry.findById(params.id).lean();

  return {
    props: {
      entry: entry ? JSON.parse(JSON.stringify(entry)) : null,
    },
  };
}
