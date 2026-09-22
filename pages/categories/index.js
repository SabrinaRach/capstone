import { useState } from "react";
import { useSession } from "next-auth/react";
import CategoryCard from "../../components/CategoryCard";
import dbConnect from "../../db/connect.js";
import Category from "../../db/models/Category.js";
import CategoryForm from "../../components/CategoryForm.js";
import { authOptions } from "../api/auth/[...nextauth]";
import { getSessionSafe } from "../../lib/apiError.js";
import { useI18n } from "@/lib/i18n/I18nContext";
import { sortOtherLast } from "../../lib/categoryOrder.js";

export default function CategoriesPage({ categories }) {
  const { status } = useSession();
  const { t } = useI18n();
  const [categoryList, setCategoryList] = useState(categories);

  if (status !== "authenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-2xl border border-secondary-100/80 bg-background/80 p-8 text-center shadow-xl backdrop-blur-md">
          <h2 className="mt-2 text-sm text-accent-500">
            {t("categoriesPage.accessDenied")}
          </h2>
        </div>
      </main>
    );
  }

  function handleCreated(category) {
    setCategoryList((currentCategories) =>
      sortOtherLast([...currentCategories, category]),
    );
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
        <h1 className="text-3xl font-bold">{t("categoriesPage.title")}</h1>

        <p className="mt-2 text-secondary-700">
          {t("categoriesPage.subtitle")}
        </p>
      </div>

      {categoryList.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border-300 p-10 text-center">
          <h2 className="text-lg font-semibold">
            {t("categoriesPage.emptyTitle")}
          </h2>

          <p className="mt-2 text-sm text-secondary-700">
            {t("categoriesPage.emptyDescription")}
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

export async function getServerSideProps(context) {
  const session = await getSessionSafe(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  await dbConnect();

  const categories = await Category.find({
    $or: [{ owner: userId }, { isSystem: true }],
  })
    .sort({ isSystem: -1, name: 1 })
    .lean();

  return {
    props: {
      categories: JSON.parse(JSON.stringify(sortOtherLast(categories))),
    },
  };
}
