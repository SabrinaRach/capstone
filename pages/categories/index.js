import CategoryCard from "../../components/CategoryCard";
import { categories } from "../../data/categories";
import NewEntryButton from "../../components/NewEntryButton.js";

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>

        <p className="mt-2 text-secondary-700">
          Find and access your content by category.
        </p>
      </div>

      <div className="mt-6">
        <NewEntryButton />
      </div>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border-300 p-10 text-center">
          <h2 className="text-lg font-semibold">No categories available</h2>

          <p className="mt-2 text-sm text-secondary-700">
            There are currently no categories to display.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      )}
    </main>
  );
}
