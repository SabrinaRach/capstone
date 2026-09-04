export default function EntryModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-entry-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 id="create-entry-title" className="text-2xl font-bold">
            Create Entry
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-secondary-500 hover:text-secondary-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <p className="text-secondary-700">Entry form will be added here.</p>
        </div>
      </div>
    </div>
  );
}
