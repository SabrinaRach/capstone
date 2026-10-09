import { useId, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function CategoryForm({ onCreated, onCancel }) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6B8F71");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // The form can be on the page twice (categories page and entry dialog),
  // so ids must be unique.
  const fieldId = useId();
  const nameRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(t("categoryForm.nameRequired"));
      nameRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          color,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.code ? t(`apiErrors.${data.code}`) : t("categoryForm.createError"),
        );
        return;
      }

      setName("");
      setColor("#6B8F71");

      if (onCreated) {
        onCreated(data.category);
      }
    } catch (error) {
      setError(t("common.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-border bg-background p-6"
    >
      <h2 className="text-xl font-semibold">{t("categoryForm.title")}</h2>

      <div className="mt-6">
        <label htmlFor={`${fieldId}-name`} className="block text-sm font-semibold">
          {t("categoryForm.nameLabel")}
        </label>

        <input
          ref={nameRef}
          id={`${fieldId}-name`}
          type="text"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t("categoryForm.namePlaceholder")}
          className="mt-2 w-full rounded-lg border border-field-border px-4 py-2 outline-none focus:border-primary-500"
        />
      </div>

      <div className="mt-6">
        <label htmlFor={`${fieldId}-color`} className="block text-sm font-semibold">
          {t("categoryForm.colorLabel")}
        </label>

        <div className="mt-2 flex items-center gap-4">
          <input
            id={`${fieldId}-color`}
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-10 w-16 cursor-pointer rounded-xl"
          />

          <span className="text-sm text-secondary-700">{color}</span>
        </div>
      </div>

      {error && (
        <p id={`${fieldId}-error`} className="mt-4 text-sm text-accent-500" role="alert">
          {error}
        </p>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mr-3 rounded-lg border border-foreground px-5 py-2 font-medium"
        >
          {t("common.cancel")}
        </button>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-lg bg-primary-500 px-5 py-2 font-medium text-background transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t("categoryForm.creating") : t("categoryForm.create")}
      </button>
    </form>
  );
}
