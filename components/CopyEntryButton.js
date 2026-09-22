import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

function buildEntryText(entry, t) {
  const lines = [entry.title];

  if (entry.description) {
    lines.push("", t("copyEntryButton.descriptionLabel"), entry.description);
  }

  if (entry.items?.length > 0) {
    lines.push(
      "",
      t("copyEntryButton.itemsLabel"),
      ...entry.items.map((item) => `- ${item}`),
    );
  }

  if (entry.steps?.length > 0) {
    lines.push(
      "",
      t("copyEntryButton.stepsLabel"),
      ...entry.steps.map((step, index) => `${index + 1}. ${step}`),
    );
  }

  if (entry.notes) {
    lines.push("", t("copyEntryButton.notesLabel"), entry.notes);
  }

  if (entry.source) {
    lines.push("", t("copyEntryButton.sourceLabel"), entry.source);
  }

  return lines.join("\n");
}

export default function CopyEntryButton({ entry }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildEntryText(entry, t);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy entry", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg bg-background p-2 text-primary-700 hover:bg-secondary-100"
      aria-label={
        copied
          ? t("copyEntryButton.copiedAria")
          : t("copyEntryButton.copyAria", { title: entry.title })
      }
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-check"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-copy"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
}
