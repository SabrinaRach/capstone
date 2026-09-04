import { useState } from "react";
import { useRouter } from "next/router";

const categories = [
  {
    value: "recipes",
    label: "Recipes",
  },
  {
    value: "how-to-instructions",
    label: "How-to / Instructions",
  },
  {
    value: "guides",
    label: "Guides",
  },
  {
    value: "other",
    label: "Other / Not assigned",
  },
];

export default function EntryForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "other",
    items: "",
    steps: "",
    notes: "",
    source: "",
    rating: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!formData.items.trim()) {
      setError("Items are required.");
      return;
    }

    if (!formData.steps.trim()) {
      setError("Steps are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: formData.items
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          steps: formData.steps
            .split("\n")
            .map((step) => step.trim())
            .filter(Boolean),
          rating: formData.rating ? Number(formData.rating) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create entry.");
      }

      router.push(`/entries/${data._id}`);
    } catch (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-accent-500 bg-white p-4 text-accent-500"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title *
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium">
          Image URL
        </label>

        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          Category
        </label>

        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="items" className="block text-sm font-medium">
          Items *
        </label>

        <p className="mt-1 text-sm text-secondary-700">
          Enter one item per line.
        </p>

        <textarea
          id="items"
          name="items"
          value={formData.items}
          onChange={handleChange}
          required
          rows={5}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="steps" className="block text-sm font-medium">
          Steps *
        </label>

        <p className="mt-1 text-sm text-secondary-700">
          Enter one step per line.
        </p>

        <textarea
          id="steps"
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          required
          rows={6}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="source" className="block text-sm font-medium">
          Source
        </label>

        <input
          id="source"
          name="source"
          type="text"
          value={formData.source}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium">
          Rating
        </label>

        <input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="5"
          step="1"
          value={formData.rating}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border border-foreground bg-primary-500 px-6 py-2 font-medium text-background hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </form>
  );
}
