import { useState } from "react";

export default function CategoryForm({ onCreated, onCancel }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6B8F71");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter a category name.");
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
        setError(data.message || "Could not create category.");
        return;
      }

      setName("");
      setColor("#6B8F71");

      if (onCreated) {
        onCreated(data.category);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-white p-6"
    >
      <h2 className="text-xl font-semibold">Create category</h2>

      <div className="mt-6">
        <label htmlFor="category-name" className="block text-sm font-medium">
          Name
        </label>

        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Category name"
          className="mt-2 w-full rounded-lg border border-secondary-100 px-4 py-2 outline-none focus:border-primary-500"
        />
      </div>

      <div className="mt-6">
        <label htmlFor="category-color" className="block text-sm font-medium">
          Color
        </label>

        <div className="mt-2 flex items-center gap-4">
          <input
            id="category-color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-10 w-16 cursor-pointer rounded"
          />

          <span className="text-sm text-secondary-700">{color}</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mr-3 rounded-lg border border-foreground px-5 py-2 font-medium"
        >
          Cancel
        </button>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-lg bg-primary-500 px-5 py-2 font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create category"}
      </button>
    </form>
  );
}
