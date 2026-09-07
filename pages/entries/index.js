import Link from "next/link";
import { useState } from "react";
import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";
import NewEntryButton from "../../components/NewEntryButton.js";
import SearchBar from "../../components/SearchBar.js";

export default function EntriesPage({ entries }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = entries.filter((entry) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return true;
    }

    const searchableText = [
      entry.title,
      entry.description,
      ...(entry.items || []),
      ...(entry.steps || []),
      entry.notes,
      entry.source,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search);
  });
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">All Entries</h1>

        <p className="mt-2 text-secondary-700">
          Find and access all your entries in one place.
        </p>

        <NewEntryButton />

        <div className="mt-6">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <h2 className="text-lg font-semibold">
            {searchTerm ? "No entries found" : "No entries yet"}
          </h2>

          <p className="mt-2 text-sm text-secondary-700">
            {searchTerm
              ? "No entries match your search."
              : "There are currently no entries to display."}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <Link
              key={entry._id}
              href={`/entries/${entry._id}`}
              className="rounded-xl border border-border bg-background p-6 transition hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold">{entry.title}</h2>

              <p className="mt-2 text-sm text-secondary-700">
                {entry.category?.name || "Not assigned"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export async function getServerSideProps() {
  await dbConnect();

  await import("../../db/models/Category.js");

  const entries = await Entry.find()
    .populate("category")
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      entries: JSON.parse(JSON.stringify(entries)),
    },
  };
}
