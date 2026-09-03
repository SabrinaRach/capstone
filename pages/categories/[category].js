import { useRouter } from "next/router";
import Link from "next/link";
import { categories } from "../../data/categories";

export default function CategoryPage() {
  const router = useRouter();
  const { category: categorySlug } = router.query;

  const category = categories.find((item) => item.slug.toLowerCase()  === categorySlug.toLowerCase());

  if (!category) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/categories"
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          aria-label="Back to categories"
        >
          ← Categories
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>

        <p className="mt-2 text-gray-600">
          The requested category does not exist.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/categories"
        className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        aria-label="Back to categories"
      >
        ← Categories
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>

      <p className="mt-2 text-gray-600">{category.description}</p>

      <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-10 text-center">
        <p className="text-gray-600">No entries in this category yet.</p>
      </div>
    </main>
  );
}
