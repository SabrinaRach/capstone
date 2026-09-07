import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function EntryForm({
  categories,
  onCreateCategory,
  selectedCategoryId,
  onCategoryChange,
  initialData,
  isEditing = false,
  entryId,
  onSaved,
}) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category:
      initialData?.category?._id ||
      initialData?.category ||
      selectedCategoryId ||
      categories.find((category) => category.slug === "other")?._id ||
      "",
    items: initialData?.items?.join("\n") || "",
    steps: initialData?.steps?.join("\n") || "",
    notes: initialData?.notes || "",
    source: initialData?.source || "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(
    initialData?.images || [],
  );

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "category" && value === "create-new") {
      onCreateCategory();
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (name === "category" && onCategoryChange) {
      onCategoryChange(value);
    }
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
      let newImageUrls = [];

      if (selectedFiles.length > 0) {
        const imageFormData = new FormData();

        selectedFiles.forEach((file) => {
          imageFormData.append("file", file);
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "Image upload failed.");
        }

        newImageUrls = uploadData.images.map((image) => image.url);
      }

      const imageUrls = isEditing
        ? [...existingImages, ...newImageUrls]
        : newImageUrls;

      const response = await fetch(
        isEditing ? `/api/entries/${entryId}` : "/api/entries",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            category: selectedCategoryId || formData.category,
            items: formData.items
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
            steps: formData.steps
              .split("\n")
              .map((step) => step.trim())
              .filter(Boolean),
            images: imageUrls,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save entry.");
      }

      if (isEditing && onSaved) {
        onSaved(data.entry);
        return;
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
          className="rounded-lg border border-accent-500 bg-foreground p-4 text-accent-500"
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
        <label htmlFor="category" className="block text-sm font-medium">
          Category
        </label>

        <select
          id="category"
          name="category"
          value={selectedCategoryId || formData.category}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-foreground bg-background px-4 py-2"
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
          <option value="create-new">Create new category</option>
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
        <label htmlFor="images" className="block text-sm font-medium">
          Images
        </label>

        {isEditing && existingImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Existing images</p>

            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {existingImages.map((imageUrl, index) => (
                <div
                  key={imageUrl}
                  className="relative overflow-hidden rounded-lg border border-foreground"
                >
                  <Image
                    src={imageUrl}
                    alt={`${formData.title || "Entry"} - Image ${index + 1}`}
                    className="h-32 w-full object-cover"
                    width={200}
                    height={200}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setExistingImages((currentImages) =>
                        currentImages.filter((image) => image !== imageUrl),
                      );
                    }}
                    className="absolute right-2 top-2 rounded-full bg-accent-500 px-3 py-1 text-sm font-medium text-background"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-secondary-700">
          {isEditing
            ? "Keep the existing images or delete them. You can also add new images."
            : "You can select up to 5 images."}
        </p>

        <input
          id="images"
          name="images"
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            const maxFileSize = 5 * 1024 * 1024;

            const totalImages = existingImages.length + files.length;

            if (totalImages > 5) {
              setError("You can have a maximum of 5 images.");
              event.target.value = "";
              setSelectedFiles([]);
              return;
            }

            const oversizedFile = files.find((file) => file.size > maxFileSize);

            if (oversizedFile) {
              setError(`${oversizedFile.name} must not exceed 5 MB.`);
              event.target.value = "";
              setSelectedFiles([]);
              return;
            }

            setError("");
            setSelectedFiles(files);
          }}
          className="mt-2 w-full"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border border-foreground bg-primary-500 px-6 py-2 font-medium text-background hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Save Entry"}
        </button>
      </div>
    </form>
  );
}
