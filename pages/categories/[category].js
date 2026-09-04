import BackLink from "../../components/BackLink.js";
import Category from "../../db/models/Category.js";
import Entry from "../../db/models/Entry.js";

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

      <div className="mt-8">
        {entries.length === 0 ? (

      <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
        <p className="text-secondary-700">No entries in this category yet.</p>
      </div>
        ) : (
          <div className="grid gap-6">
            {entries.map((entry) => (
              <article
                key={entry._id}
                className="rounded-xl border border-border bg-white p-6"
              >
                <h2 className="text-xl font-semibold">{entry.title}</h2>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();

  const category = await Category.findOne({
    slug: params.category,
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