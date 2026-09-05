import { useState } from "react";
import CategoryCard from "../../components/CategoryCard";
import dbConnect from "../../db/connect.js";
import Category from "../../db/models/Category.js";
import CategoryForm from "../../components/CategoryForm.js";
import NewEntryButton from "../../components/NewEntryButton.js";

export default function CategoriesPage({ categories }) {
  const [categoryList, setCategoryList] = useState(categories);

  function handleCreated(category) {
    setCategoryList((currentCategories) => [...currentCategories, category]);
  }

  function handleUpdated(updatedCategory) {
    setCategoryList((currentCategories) =>
      currentCategories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category,
      ),
    );
  }

  function handleDeleted(categoryId) {
    setCategoryList((currentCategories) =>
      currentCategories.filter((category) => category._id !== categoryId),
    );
  }

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

      {categoryList.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border-300 p-10 text-center">
          <h2 className="text-lg font-semibold">No categories available</h2>

          <p className="mt-2 text-sm text-secondary-700">
            There are currently no categories to display.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryList.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
      <div className="mt-8">
        <CategoryForm onCreated={handleCreated} />
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
