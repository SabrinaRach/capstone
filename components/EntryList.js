export default function EntryList({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-secondary-100 pt-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      <ul className="mt-3 list-disc space-y-2 pl-5 text-secondary-700">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}