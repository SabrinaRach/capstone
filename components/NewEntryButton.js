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
        New Entry
      </button>

      {isOpen && <EntryModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
