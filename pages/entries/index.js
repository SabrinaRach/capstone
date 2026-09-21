import Link from "next/link";
import { useState } from "react";
import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";
import SearchBar from "../../components/SearchBar.js";
import StarRating from "../../components/StarRating.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

function getCategoryStyles(category) {
  switch (category?.slug) {
    case "recipes":
      return {
        background: "bg-[var(--category-recipes-bg)]",
        text: "text-[var(--category-recipes)]",
      };

    case "howto":
      return {
        background: "bg-[var(--category-howto-bg)]",
        text: "text-[var(--category-howto)]",
      };

    case "guides":
      return {
        background: "bg-[var(--category-guides-bg)]",
        text: "text-[var(--category-guides)]",
      };

    case "other":
    default:
      return {
        background: "bg-[var(--category-other-bg)]",
        text: "text-[var(--category-other)]",
      };
  }
}

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
        <h1 className="text-3xl font-bold">Your Entries</h1>

        <p className="mt-2 text-secondary-500">
          Browse and search your saved entries.
        </p>

        <div className="mt-6">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-secondary-100 p-10 text-center">
          <h2 className="text-lg font-semibold">
            {searchTerm ? "No entries found" : "No entries yet"}
          </h2>

          <p className="mt-2 text-sm text-secondary-500">
            {searchTerm
              ? "No entries match your search."
              : "There are currently no entries to display."}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => {
            const categoryStyles = getCategoryStyles(entry.category);

            return (
              <Link
                key={entry._id}
                href={`/entries/${entry._id}`}
                className="group rounded-xl border border-secondary-100 bg-background p-5 transition hover:-translate-y-0.5 hover:border-secondary-500/40"
              >
                <h2 className="text-lg font-semibold transition group-hover:text-primary-500">
                  {entry.title}
                </h2>

                {entry.category?.name && (
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles.background} ${categoryStyles.text}`}
                  >
                    {" "}
                    {entry.category.name}{" "}
                  </span>
                )}

                {entry.rating > 0 && (
                  <div className="mt-2">
                    <StarRating rating={entry.rating} readOnly size={16} />
                  </div>
                )}

                <div className="mt-4 flex gap-4 text-xs text-secondary-500">
                  {" "}
                  {entry.items?.length > 0 && (
                    <span>
                      {" "}
                      {entry.items.length}{" "}
                      {entry.items.length === 1 ? "item" : "items"}{" "}
                    </span>
                  )}{" "}
                  {entry.steps?.length > 0 && (
                    <span>
                      {" "}
                      {entry.steps.length}{" "}
                      {entry.steps.length === 1 ? "step" : "steps"}{" "}
                    </span>
                  )}{" "}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  await dbConnect();

  await import("../../db/models/Category.js");

  const entries = await Entry.find({ owner: userId })
    .populate("category")
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      entries: JSON.parse(JSON.stringify(entries)),
    },
  };
}
