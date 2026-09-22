import Link from "next/link";
import BackLink from "../../components/BackLink.js";
import dbConnect from "../../db/connect.js";
import Category from "../../db/models/Category.js";
import Entry from "../../db/models/Entry.js";
import StarRating from "../../components/StarRating.js";
import { authOptions } from "../api/auth/[...nextauth]";
import { getSessionSafe } from "../../lib/apiError.js";
import { useI18n } from "@/lib/i18n/I18nContext";
import { getCategoryDisplayName } from "@/lib/i18n/categoryName";

export default function CategoryPage({ category, entries }) {
  const { t, tCount } = useI18n();

  if (!category) {
    return (
      <main className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:pt-10">
        <BackLink href="/categories" text={t("categoryDetail.backLink")} />

        <h1 className="text-2xl font-bold">
          {t("categoryDetail.notFoundTitle")}
        </h1>

        <p className="mt-2">{t("categoryDetail.notFoundDescription")}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:pt-10">
      <BackLink href="/categories" text={t("categoryDetail.backLink")} />

      <div className="flex items-center gap-3">
        <span
          className="h-4 w-4 shrink-0 rounded-full"
          style={{ backgroundColor: category.color }}
          aria-hidden="true"
        />

        <h1 className="text-3xl font-bold">
          {getCategoryDisplayName(category, t)}
        </h1>
      </div>

      <span
        className="mt-3 inline-block rounded-full border px-3 py-1 text-sm font-medium text-secondary-700"
        style={{
          backgroundColor: category.backgroundColor,
          borderColor: category.color,
        }}
      >
        {tCount(entries.length, "counts.entry")}
      </span>

      {entries.length === 0 ? (
        <div
          className="mt-8 rounded-xl border border-dashed p-10 text-center"
          style={{ borderColor: category.color }}
        >
          <p className="text-secondary-700">
            {t("categoryDetail.emptyEntries")}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry._id}
              href={`/entries/${entry._id}`}
              className="group rounded-xl border border-l-4 border-secondary-100 bg-background p-5 transition hover:-translate-y-0.5 hover:border-secondary-500/40"
              style={{ borderLeftColor: category.color }}
            >
              <h2 className="text-lg font-semibold transition group-hover:text-primary-500">
                {entry.title}
              </h2>

              {entry.rating > 0 && (
                <div className="mt-2">
                  <StarRating rating={entry.rating} readOnly size={16} />
                </div>
              )}

              <div className="mt-4 flex gap-4 text-xs text-secondary-500">
                {" "}
                {entry.items?.length > 0 && (
                  <span> {tCount(entry.items.length, "counts.item")} </span>
                )}{" "}
                {entry.steps?.length > 0 && (
                  <span> {tCount(entry.steps.length, "counts.step")} </span>
                )}{" "}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export async function getServerSideProps({ params, req, res }) {
  const session = await getSessionSafe(req, res, authOptions);

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

  const category = await Category.findOne({
    slug: params.category,
    $or: [{ owner: userId }, { isSystem: true }],
  }).lean();

  if (!category) {
    return {
      props: {
        category: null,
        entries: [],
      },
    };
  }

  const entries = await Entry.find({
    category: category._id,
    owner: userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      entries: JSON.parse(JSON.stringify(entries)),
    },
  };
}
