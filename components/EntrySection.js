export default function EntrySection({ title, children }) {
  return (
    <section className="border-t border-secondary-100 pt-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="mt-3 text-secondary-700">{children}</div>
    </section>
  );
}