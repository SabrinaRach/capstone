import Link from "next/link";
import EditCategoryCard from "./EditCategoryCard.js";
import { useI18n } from "@/lib/i18n/I18nContext";
import { getCategoryDisplayName } from "@/lib/i18n/categoryName";
import { CATEGORY_SURFACE, categoryColorVars } from "@/lib/categoryColors";

export default function CategoryCard({ category, onUpdated, onDeleted }) {
  const { t } = useI18n();

  return (
    <div
      className={`rounded-xl border p-6 transition hover:-translate-y-1 ${CATEGORY_SURFACE}`}
      style={{
        ...categoryColorVars(category),
        borderColor: category.color,
      }}
    >
      <Link href={`/categories/${category.slug}`} className="block">
        <h2 className="text-xl font-semibold wrap-anywhere">
          {getCategoryDisplayName(category, t)}
        </h2>
      </Link>
      {!category.isSystem && (
        <div className="mt-5">
          <EditCategoryCard category={category} onUpdated={onUpdated} onDeleted={onDeleted} />
        </div>
      )}
    </div>
  );
}
