import { useRouter } from "next/router";
import { useState } from "react";
import BackLink from "../../components/BackLink.js";
import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";
import EntrySection from "../../components/EntrySection.js";
import EntryList from "../../components/EntryList.js";
import EntrySteps from "../../components/EntrySteps.js";
import EntryModal from "../../components/EntryModal.js";

export default function EntryPage({ entry }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);

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

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setShowEditModal(true)}
          className="rounded-full border border-foreground px-5 py-2 font-medium hover:bg-secondary-100"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={async () => {
            const confirmed = window.confirm(
              "Are you sure you want to permanently delete this entry?",
            );

            if (!confirmed) {
              return;
            }

            const response = await fetch(`/api/entries/${entry._id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              router.push("/entries");
            }
          }}
          className="rounded-full border border-accent-500 px-5 py-2 font-medium text-accent-500 hover:bg-accent-500 hover:text-foreground"
        >
          Delete
        </button>
      </div>

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

      {showEditModal && (
        <EntryModal
          onClose={() => setShowEditModal(false)}
          initialData={entry}
          isEditing={true}
          onSaved={(updatedEntry) => {
            setShowEditModal(false);
            router.reload();
          }}
        />
      )}
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
