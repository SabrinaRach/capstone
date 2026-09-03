import { useRouter } from "next/router";
import BackLink from "../../components/BackLink.js";
import { categories } from "../../data/categories";

export default function CategoryPage() {
  const router = useRouter();
  const { category: categorySlug } = router.query;

  const category = categories.find((item) => item.slug === categorySlug);

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

      <p className="mt-2">{category.description}</p>

      <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
        <p className="text-secondary-700">No entries in this category yet.</p>
      </div>
    </main>
  );
}
