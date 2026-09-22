import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import EntryForm from "./EntryForm.js";
import CategoryForm from "./CategoryForm.js";
import { useI18n } from "@/lib/i18n/I18nContext";
import { sortOtherLast } from "@/lib/categoryOrder.js";

export default function EntryModal({
  onClose,
  initialData,
  isEditing = false,
  entryId,
  onSaved,
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialData?.category?._id || initialData?.category || "",
  );
  const categoryFormRef = useRef(null);

  useEffect(() => {
    async function loadCategories() {
      setCategoriesError("");

      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.code ? t(`apiErrors.${data.code}`) : t("entryModal.loadCategoriesError"));
        }

        setCategories(data);
      } catch (error) {
        setCategoriesError(t("entryModal.loadCategoriesErrorRetry"));
      }
    }

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 id="entry-modal-title" className="text-2xl font-bold">
            {isEditing ? t("entryModal.editTitle") : t("entryModal.createTitle")}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-secondary-500 hover:text-secondary-700"
            aria-label={t("entryModal.closeAria")}
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          {categoriesError && categories.length === 0 && (
            <div
              role="alert"
              className="rounded-xl border border-accent-500/40 bg-background px-4 py-3 text-sm text-accent-500"
            >
              {categoriesError}
            </div>
          )}

          {categories.length > 0 && (
            <EntryForm
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              initialData={initialData}
              isEditing={isEditing}
              entryId={initialData?._id}
              onSaved={(entry) => {
                if (onSaved) {
                  onSaved(entry);
                }

                onClose();
                router.push(`/entries/${entry._id}`);
              }}
              onCreateCategory={() => {
                setShowCategoryForm(true);
                setTimeout(() => {
                  categoryFormRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 0);
              }}
              onCategoryChange={setSelectedCategoryId}
            />
          )}
          {showCategoryForm && (
            <div ref={categoryFormRef} className="mt-6">
              <CategoryForm
                onCreated={(newCategory) => {
                  setCategories((currentCategories) =>
                    sortOtherLast([...currentCategories, newCategory]),
                  );
                  setSelectedCategoryId(newCategory._id);
                  setShowCategoryForm(false);
                }}
                onCancel={() => setShowCategoryForm(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
