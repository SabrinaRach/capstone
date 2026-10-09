import { useRef, useState } from "react";
import Image from "next/image";
import StarRating from "./StarRating.js";
import { useI18n } from "@/lib/i18n/I18nContext";
import { getCategoryDisplayName } from "@/lib/i18n/categoryName";

// Joins the ids of the elements that describe a field (help text, error).
function describedBy(...ids) {
  return ids.filter(Boolean).join(" ") || undefined;
}

function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-sm text-accent-500">
      {message}
    </p>
  );
}

export default function EntryForm({
  categories,
  onCreateCategory,
  selectedCategoryId,
  onCategoryChange,
  initialData,
  isEditing = false,
  entryId,
  onSaved,
}) {
  const { t, tCount } = useI18n();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category:
      initialData?.category?._id ||
      initialData?.category ||
      selectedCategoryId ||
      categories.find((category) => category.slug === "other")?._id ||
      "",
    items: initialData?.items?.join("\n") || "",
    steps: initialData?.steps?.join("\n") || "",
    notes: initialData?.notes || "",
    source: initialData?.source || "",
    rating: initialData?.rating || 0,
  });

  const [error, setError] = useState("");
  // Validation errors per field, shown below the field and linked to it via
  // aria-describedby.
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(
    initialData?.images || [],
  );
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  // Announced to screen readers: import started / fields filled in.
  const [importStatus, setImportStatus] = useState("");
  const [showImportConfirmation, setShowImportConfirmation] = useState(false);
  const importButtonRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "category" && value === "create-new") {
      onCreateCategory();
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
    }

    if (name === "category" && onCategoryChange) {
      onCategoryChange(value);
    }
  }

  async function handleImport() {
    if (!importUrl.trim()) {
      setError(t("entryForm.importUrlRequired"));
      return;
    }

    const hasExistingData =
      formData.title.trim() ||
      formData.description.trim() ||
      formData.items.trim() ||
      formData.steps.trim() ||
      formData.notes.trim() ||
      formData.source.trim();

    if (hasExistingData && !showImportConfirmation) {
      setShowImportConfirmation(true);
      return;
    }

    // The confirmation disappears; keep the focus on the import button.
    if (showImportConfirmation) {
      importButtonRef.current?.focus();
    }
    setShowImportConfirmation(false);

    setError("");
    setIsImporting(true);
    setImportStatus(t("entryForm.importing"));
    document.body.style.cursor = "wait";

    try {
      const response = await fetch("/api/entries/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: importUrl.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.code
            ? t(`apiErrors.${result.code}`, result.params)
            : t("entryForm.importFailed"),
        );
        setImportStatus("");
        return;
      }

      setFormData((currentData) => ({
        ...currentData,
        title: result.data.title || "",
        description: result.data.description || "",
        category: result.data.category || currentData.category,
        items: (result.data.items || []).join("\n"),
        steps: (result.data.steps || []).join("\n"),
        notes: result.data.notes || "",
        source: importUrl.trim(),
      }));
      setImportStatus(t("entryForm.importSuccess"));
    } catch (error) {
      setError(t("common.genericError"));
      setImportStatus("");
    } finally {
      setIsImporting(false);
      document.body.style.cursor = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const errors = {
      title: formData.title.trim() ? "" : t("entryForm.titleRequired"),
      items: formData.items.trim() ? "" : t("entryForm.itemsRequired"),
      steps: formData.steps.trim() ? "" : t("entryForm.stepsRequired"),
    };

    setFieldErrors(errors);

    const firstInvalidField = Object.keys(errors).find((field) => errors[field]);

    if (firstInvalidField) {
      setError(t("entryForm.checkFields"));
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      let newImageUrls = [];

      if (selectedFiles.length > 0) {
        const imageFormData = new FormData();

        selectedFiles.forEach((file) => {
          imageFormData.append("file", file);
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          setError(
            uploadData.code
              ? t(`apiErrors.${uploadData.code}`, uploadData.params)
              : t("entryForm.imageUploadFailed"),
          );
          setIsSubmitting(false);
          return;
        }

        newImageUrls = uploadData.images.map((image) => image.url);
      }

      const imageUrls = isEditing
        ? [...existingImages, ...newImageUrls]
        : newImageUrls;

      const response = await fetch(
        isEditing ? `/api/entries/${entryId}` : "/api/entries",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            category: selectedCategoryId || formData.category,
            items: formData.items
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
            steps: formData.steps
              .split("\n")
              .map((step) => step.trim())
              .filter(Boolean),
            images: imageUrls,
            rating: formData.rating || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.code ? t(`apiErrors.${data.code}`) : t("entryForm.saveFailed"),
        );
        setIsSubmitting(false);
        return;
      }

      if (onSaved) {
        onSaved(data.entry || data);
        return;
      }
      setIsSubmitting(false);
    } catch (error) {
      setError(t("common.genericError"));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-accent-500/40 bg-background px-4 py-3 text-sm text-accent-500"
        >
          {error}
        </div>
      )}

      <div className="rounded-xl border border-secondary-100 bg-background p-5">
        <label htmlFor="importUrl" className="block text-sm font-medium">
          {t("entryForm.importTitle")}
        </label>

        <p className="mt-1 text-sm text-secondary-500">
          {t("entryForm.importDescription")}
        </p>

        <p role="status" className="sr-only">
          {importStatus}
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            id="importUrl"
            type="url"
            value={importUrl}
            onChange={(event) => setImportUrl(event.target.value)}
            placeholder={t("entryForm.importPlaceholder")}
            className="w-full rounded-lg border border-field-border bg-background px-4 py-2.5 text-sm outline-none transition placeholder:text-secondary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />

          <button
            ref={importButtonRef}
            type="button"
            onClick={handleImport}
            disabled={isImporting}
            className="shrink-0 whitespace-nowrap rounded-full border border-secondary-100 px-5 py-2.5 text-sm font-medium transition hover:bg-secondary-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting ? t("entryForm.importing") : t("entryForm.importWithAi")}
          </button>
        </div>

        {showImportConfirmation && (
          <div
            role="group"
            aria-labelledby="import-overwrite-confirm"
            className="mt-4 rounded-lg border border-accent-500/40 bg-background p-4"
          >
            <p
              id="import-overwrite-confirm"
              className="text-sm font-medium text-accent-500"
            >
              {t("entryForm.importOverwriteConfirm")}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleImport}
                disabled={isImporting}
                className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-background transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isImporting ? t("entryForm.importing") : t("common.continue")}
              </button>

              <button
                type="button"
                // Focus lands on the safe choice when the question appears.
                autoFocus
                onClick={() => {
                  setShowImportConfirmation(false);
                  importButtonRef.current?.focus();
                }}
                disabled={isImporting}
                className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-background transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          {t("entryForm.titleLabel")}
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={describedBy(fieldErrors.title && "title-error")}
          className="mt-2 w-full rounded-lg border border-field-border bg-background px-4 py-2.5 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />

        <FieldError id="title-error" message={fieldErrors.title} />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          {t("entryForm.descriptionLabel")}
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-2 w-full resize-y rounded-lg border border-field-border bg-background px-4 py-2.5 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          {t("entryForm.categoryLabel")}
        </label>

        <select
          id="category"
          name="category"
          value={selectedCategoryId || formData.category}
          onChange={handleChange}
          className="mt-2 w-full resize-y rounded-lg border border-field-border bg-background px-4 py-2.5 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {getCategoryDisplayName(category, t)}
            </option>
          ))}
          <option value="create-new">{t("entryForm.createCategory")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="items" className="block text-sm font-medium">
          {t("entryForm.itemsLabel")}
        </label>

        <p id="items-help" className="mt-1 text-sm text-secondary-500">
          {t("entryForm.itemsHelp")}
        </p>

        <textarea
          id="items"
          name="items"
          value={formData.items}
          onChange={handleChange}
          required
          aria-invalid={Boolean(fieldErrors.items)}
          aria-describedby={describedBy(
            "items-help",
            fieldErrors.items && "items-error",
          )}
          rows={5}
          className="mt-2 w-full resize-y rounded-lg border border-field-border bg-background px-4 py-2.5 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />

        <FieldError id="items-error" message={fieldErrors.items} />
      </div>

      <div>
        <label htmlFor="steps" className="block text-sm font-medium">
          {t("entryForm.stepsLabel")}
        </label>

        <p id="steps-help" className="mt-1 text-sm text-secondary-700">
          {t("entryForm.stepsHelp")}
        </p>

        <textarea
          id="steps"
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          required
          aria-invalid={Boolean(fieldErrors.steps)}
          aria-describedby={describedBy(
            "steps-help",
            fieldErrors.steps && "steps-error",
          )}
          rows={6}
          className="mt-2 w-full resize-y rounded-lg border border-field-border bg-background px-4 py-2.5 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />

        <FieldError id="steps-error" message={fieldErrors.steps} />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          {t("entryForm.notesLabel")}
        </label>

        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="mt-2 w-full resize-y rounded-lg border border-field-border bg-background px-4 py-2.5 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <p id="rating-label" className="block text-sm font-medium">
          {t("entryForm.ratingLabel")}
        </p>

        <div className="mt-2">
          <StarRating
            labelledBy="rating-label"
            rating={formData.rating}
            onChange={(value) =>
              setFormData((currentData) => ({
                ...currentData,
                rating: value,
              }))
            }
          />
        </div>
      </div>

      <div>
        <label htmlFor="source" className="block text-sm font-medium">
          {t("entryForm.sourceLabel")}
        </label>

        <input
          id="source"
          name="source"
          type="text"
          value={formData.source}
          onChange={handleChange}
          className="mt-2 w-full resize-y rounded-lg border border-field-border bg-background px-4 py-2.5 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium">
          {t("entryForm.imagesLabel")}
        </label>

        {isEditing && existingImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">
              {t("entryForm.existingImages")}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {existingImages.map((imageUrl, index) => (
                <div
                  key={imageUrl}
                  className="relative overflow-hidden rounded-xl border border-secondary-100 bg-background"
                >
                  <Image
                    src={imageUrl}
                    alt={t("entryForm.imageAlt", {
                      title: formData.title || t("entryForm.imageAltFallbackTitle"),
                      index: index + 1,
                    })}
                    className="h-32 w-full object-cover"
                    width={200}
                    height={200}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setExistingImages((currentImages) =>
                        currentImages.filter((image) => image !== imageUrl),
                      );
                    }}
                    className="absolute right-2 top-2 rounded-lg bg-background/90 px-3 py-1 text-xs font-medium text-accent-500 backdrop-blur-sm transition hover:bg-background"
                  >
                    {t("entryForm.deleteImage")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-3 text-sm text-secondary-500">
          {isEditing
            ? t("entryForm.imagesHelpEdit")
            : t("entryForm.imagesHelpNew")}
        </p>

        <input
          id="images"
          name="images"
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={(event) => {
            const newFiles = Array.from(event.target.files || []);
            const maxFileSize = 5 * 1024 * 1024;

            if (newFiles.length === 0) {
              return;
            }
            const oversizedFile = newFiles.find(
              (file) => file.size > maxFileSize,
            );

            if (oversizedFile) {
              setError(
                t("entryForm.imageTooLarge", { filename: oversizedFile.name }),
              );
              event.target.value = "";
              return;
            }

            setSelectedFiles((currentFiles) => {
              const combinedFiles = [...currentFiles, ...newFiles];

              const totalImages = existingImages.length + combinedFiles.length;

              if (totalImages > 5) {
                setError(t("entryForm.maxImages"));
                return currentFiles;
              }

              setError("");
              return combinedFiles;
            });

            event.target.value = "";
          }}
          className="sr-only"
        />

        <label
          htmlFor="images"
          className="mt-3 inline-block cursor-pointer rounded-lg border border-secondary-100 px-5 py-2.5 text-sm font-medium transition hover:bg-secondary-100"
        >
          {t("entryForm.chooseImages")}
        </label>

        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">
              {tCount(selectedFiles.length, "counts.image")}
            </p>

            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center justify-between rounded-lg border-secondary-100 bg-background px-3 py-2 text-sm"
              >
                <span className="truncate">{file.name}</span>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles((currentFiles) =>
                      currentFiles.filter(
                        (_, fileIndex) => fileIndex !== index,
                      ),
                    );
                  }}
                  className="ml-3 shrink-0 font-medium text-accent-500 transition hover:underline"
                >
                  {t("entryForm.removeImage")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-secondary-100 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-medium text-background transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? t("entryForm.saving")
            : isEditing
              ? t("entryForm.saveChanges")
              : t("entryForm.saveEntry")}
        </button>
      </div>
    </form>
  );
}
