export default function EntrySteps({ steps }) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-secondary-100 pt-6">
      <h2 className="text-xl font-semibold">Steps</h2>

      <ol className="mt-3 space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
              {index + 1}
            </span>

            <p className="pt-1 text-secondary-700">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}