import CategoryCard from "../../components/CategoryCard";
import dbConnect from "../../db/connect.js";
import Category from "../../db/models/Category.js";
import CategoryForm from "../../components/CategoryForm.js";

export default function CategoriesPage({ categories }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>

        <p className="mt-2 text-secondary-700">
          Find and access your content by category.
        </p>
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
      <div className="mt-8">
        <CategoryForm
          onCreated={() => {
            window.location.reload();
          }}
        />
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  await dbConnect();

  const categories = await Category.find()
    .sort({ isSystem: -1, name: 1 })
    .lean();

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
