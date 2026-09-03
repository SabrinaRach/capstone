import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="block rounded-xl border border-foreground-200 p-6 transition hover:border-border hover:shadow-sm"
    >
      <h2 className="text-xl font-semibold">{category.name}</h2>
    </Link>
  );
}
