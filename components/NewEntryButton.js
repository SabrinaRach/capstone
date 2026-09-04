import { useState } from "react";
import EntryModal from "./EntryModal.js";

export default function NewEntryButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-primary-500 px-4 py-2 font-medium text-background hover:bg-primary-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent-500)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-plus-icon lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>

      {isOpen && <EntryModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
