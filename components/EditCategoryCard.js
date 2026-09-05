import { useState } from "react";

export default function EditCategoryCard({ category, onUpdated, onDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  async function handleEdit(event) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter a category name.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/categories/${category._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not update category.");
        return;
      }
      setIsEditing(false);

      if (onUpdated) {
        onUpdated(data.category);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit(event) {
    event.preventDefault();
    event.stopPropagation();

    setIsEditing(false);
    setName(category.name);
    setError("");
  }

  function handleStartDelete(event) {
    event.preventDefault();
    event.stopPropagation();

    setError("");
    setIsConfirmingDelete(true);
  }

  function handleCancelDelete(event) {
    event.preventDefault();
    event.stopPropagation();

    setError("");
    setIsConfirmingDelete(false);
  }

  async function handleDelete(event) {
    event.preventDefault();
    event.stopPropagation();

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/categories/${category._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not delete category.");
        return;
      }

      if (onDeleted) {
        onDeleted(category._id);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleEdit}>
        <label
          htmlFor={`category-name-${category._id}`}
          className="block text-sm font-medium"
        >
          Name
        </label>

        <input
          id={`category-name-${category._id}`}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-lg border border-secondary-100 bg-background px-3 py-2 outline-none focus:border-primary-500"
          autoFocus
        />

        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-primary-500 px-3 py-2 text-sm font-medium text-background hover:bg-primary-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={isSaving}
            className="rounded-lg border border-secondary-100 bg-background px-3 py-2 text-sm font-medium hover:bg-secondary-100"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  if (isConfirmingDelete) {
    return (
      <div>
        <p className="text-sm font-medium">
          Delete &quot;{category.name}&quot;?
        </p>

        <p className="mt-2 text-sm text-secondary-700">
          Entries in this category will be moved to &quot;Other / Not
          assigned&quot;.
        </p>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg border border-secondary-100 bg-primary-500 px-3 py-2 text-sm font-medium text-background hover:bg-primary-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          <button
            type="button"
            onClick={handleCancelDelete}
            disabled={isDeleting}
            className="rounded-lg border border-secondary-100 bg-accent-500 px-3 py-2 text-sm font-medium text-background hover:bg-accent-700 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="mb-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            setError("");
            setIsEditing(true);
          }}
          className="rounded-lg border border-secondary-100 bg-background p-2 text-primary-700 hover:bg-secondary-100"
          aria-label={`Edit ${category.name} category`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="var(--border)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pencil-icon lucide-pencil"
          >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleStartDelete}
          className="rounded-lg border border-secondary-100 bg-background p-2 text-accent-500 hover:bg-accent-100"
          aria-label={`Delete ${category.name} category`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="var(--border)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash2-icon lucide-trash-2"
          >
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </>
  );
}
