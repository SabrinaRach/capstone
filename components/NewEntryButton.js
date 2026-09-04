import { useState } from "react";
import EntryModal from "./EntryModal.js";

export default function NewEntryButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-primary-500 bg-background px-4 py-2 font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--primary-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-plus-icon lucide-plus text-background group-hover:text-accent-500"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>

      {isOpen && <EntryModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
