import Link from "next/link";
import BackLink from "../../components/BackLink.js";
import dbConnect from "../../db/connect.js";
import Category from "../../db/models/Category.js";
import Entry from "../../db/models/Entry.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

export default function CategoryPage({ category, entries }) {
  if (!category) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <BackLink href="/categories" text="Categories" />

        <h1 className="text-2xl font-bold">Category not found</h1>

        <p className="mt-2">The requested category does not exist.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <BackLink href="/categories" text="Categories" />

      <h1 className="text-3xl font-bold">{category.name}</h1>

      {entries.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-secondary-700">No entries in this category yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry._id}
              href={`/entries/${entry._id}`}
              className="group rounded-xl border border-secondary-100 bg-background p-5 transition hover:-translate-y-0.5 hover:border-secondary-500/40"
            >
              <h2 className="text-lg font-semibold transition group-hover:text-primary-500">
                {entry.title}
              </h2>

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
          ))}
        </div>
      )}
    </main>
  );
}

export async function getServerSideProps({ params, req, res }) {
  const session = await getServerSession(req, res, authOptions);

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

  const category = await Category.findOne({
    slug: params.category,
    $or: [{ owner: userId }, { isSystem: true }],
  }).lean();

  if (!category) {
    return {
      props: {
        category: null,
        entries: [],
      },
    };
  }

  const entries = await Entry.find({
    category: category._id,
    owner: userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      entries: JSON.parse(JSON.stringify(entries)),
    },
  };
}
