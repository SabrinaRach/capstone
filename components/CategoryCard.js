import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="block rounded-xl border border-gray-200 p-6 transition hover:border-gray-400 hover:shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
    </Link>
  );
}
