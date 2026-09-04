import Link from "next/link";
import EditCategoryCard from "./EditCategoryCard.js";

export default function CategoryCard({ category }) {
  return (
    <div
      className="rounded-xl border p-6 transition hover:-translate-y-1"
      style={{
        borderColor: category.color,
        backgroundColor: category.backgroundColor,
      }}
    >
      <Link href={`/categories/${category.slug}`} className="block">
        <h2 className="text-xl font-semibold">{category.name}</h2>
      </Link>
      {!category.isSystem && (
        <div className="mt-5">
          <EditCategoryCard category={category} />
        </div>
      )}
    </div>
  );
}
