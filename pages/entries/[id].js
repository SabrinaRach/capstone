import { useRouter } from "next/router";
import BackLink from "../../components/BackLink.js";
import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";
import EntrySection from "../../components/EntrySection.js";
import EntryList from "../../components/EntryList.js";
import EntrySteps from "../../components/EntrySteps.js";

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

      <p className="mt-2 text-secondary-700">
        Category: {entry.category?.name || "Not assigned"}
      </p>

      <div className="mt-8 space-y-8">
        {entry.description && (
          <EntrySection title="Description">
            <p className="whitespace-pre-line">{entry.description}</p>
          </EntrySection>
        )}

        <EntryList title="Items" items={entry.items} />

        <EntrySteps steps={entry.steps} />

        {entry.notes && (
          <EntrySection title="Notes">
            <p className="whitespace-pre-line">{entry.notes}</p>
          </EntrySection>
        )}

        {entry.source && (
          <EntrySection title="Source">
            <p className="whitespace-pre-line">{entry.source}</p>
          </EntrySection>
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();

  await import("../../db/models/Category.js");

  const entry = await Entry.findById(params.id).populate("category").lean();

  if (!entry) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      entry: entry ? JSON.parse(JSON.stringify(entry)) : null,
    },
  };
}
