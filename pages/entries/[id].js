import { useRouter } from "next/router";
import { useState, useRef } from "react";
import Image from "next/image";
import BackLink from "../../components/BackLink.js";
import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";
import EntrySection from "../../components/EntrySection.js";
import EntryList from "../../components/EntryList.js";
import EntrySteps from "../../components/EntrySteps.js";
import EntryModal from "../../components/EntryModal.js";

export default function EntryPage({ entry }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageSliderRef = useRef(null);

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  if (!entry) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <BackLink href="/entries" text="All Entries" />

        <h1 className="text-2xl font-bold">Entry not found</h1>

        <p className="mt-2">The requested entry does not exist.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <BackLink href="/entries" text="All Entries" />

      <h1 className="text-3xl font-bold">{entry.title}</h1>

      <p className="mt-2 text-secondary-700">
        Category: {entry.category?.name || "Not assigned"}
      </p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setShowEditModal(true)}
          className="rounded-full border border-foreground px-5 py-2 font-medium hover:bg-secondary-100"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteConfirmation(true)}
          className="rounded-full border border-accent-500 px-5 py-2 font-medium text-accent-500 hover:bg-accent-500 hover:text-foreground"
        >
          Delete
        </button>
      </div>

      {showDeleteConfirmation && (
        <div className="mt-4 rounded-xl border border-accent-500 bg-accent-500/10 p-5">
          <p className="mt-2 text-sm text-secondary-700">
            Are you sure you want to delete this entry?
          </p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirmation(false)}
              disabled={isDeleting}
              className="rounded-full border border-secondary-500 bg-secondary-100 px-5 py-2 font-medium text-secondary-700 hover:bg-secondary-500 hover:text-background"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true);

                const response = await fetch(`/api/entries/${entry._id}`, {
                  method: "DELETE",
                });

                if (response.ok) {
                  router.push("/entries");
                  return;
                }

                setIsDeleting(false);
              }}
              className="rounded-full bg-accent-500 px-5 py-2 font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {entry.description && (
          <EntrySection title="Description">
            <p className="whitespace-pre-line">{entry.description}</p>
          </EntrySection>
        )}

        <EntryList title="Items" items={entry.items} />

        <EntrySteps steps={entry.steps} />

        {entry.notes && (
          <EntrySection title="Notes">
            <p className="whitespace-pre-line">{entry.notes}</p>
          </EntrySection>
        )}

        {entry.images?.length > 0 && (
          <div className="mt-6">
            <div className="relative">
              {/* Image slider */}
              <div
                ref={imageSliderRef}
                onScroll={(event) => {
                  const container = event.currentTarget;
                  const firstSlide = container.firstElementChild;

                  if (!firstSlide) {
                    return;
                  }

                  const slideWidth = firstSlide.offsetWidth;
                  const gap = 16;

                  const index = Math.round(
                    container.scrollLeft / (slideWidth + gap),
                  );

                  setCurrentImageIndex(
                    Math.min(index, entry.images.length - 1),
                  );
                }}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
              >
                {entry.images.map((imageUrl, index) => (
                  <div
                    key={imageUrl}
                    className="w-full min-w-full shrink-0 snap-center"
                  >
                    <Image
                      width={600}
                      height={600}
                      loading="eager"
                      src={imageUrl}
                      alt={`${entry.title} - Image ${index + 1}`}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Previous button */}
              {entry.images.length > 1 && (
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => {
                    const previousIndex =
                      currentImageIndex === 0
                        ? entry.images.length - 1
                        : currentImageIndex - 1;

                    const slider = imageSliderRef.current;
                    const slide = slider?.children[previousIndex];

                    if (slider && slide) {
                      slider.scrollTo({
                        left: slide.offsetLeft,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-foreground bg-background/90 text-2xl font-medium shadow-md transition hover:bg-background"
                >
                  ←
                </button>
              )}

              {/* Next button */}
              {entry.images.length > 1 && (
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => {
                    const nextIndex =
                      currentImageIndex === entry.images.length - 1
                        ? 0
                        : currentImageIndex + 1;

                    const slider = imageSliderRef.current;
                    const slide = slider?.children[nextIndex];

                    if (slider && slide) {
                      slider.scrollTo({
                        left: slide.offsetLeft,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-foreground bg-background/90 text-2xl font-medium shadow-md transition hover:bg-background"
                >
                  →
                </button>
              )}
            </div>

            {/* Pagination dots */}
            {entry.images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {entry.images.map((imageUrl, index) => (
                  <button
                    key={imageUrl}
                    type="button"
                    aria-label={`Go to image ${index + 1}`}
                    onClick={() => {
                      const slider = imageSliderRef.current;
                      const slide = slider?.children[index];

                      if (slider && slide) {
                        slider.scrollTo({
                          left: slide.offsetLeft,
                          behavior: "smooth",
                        });

                        setCurrentImageIndex(index);
                      }
                    }}
                    className={`h-3 w-3 rounded-full border-2 border-foreground transition ${
                      currentImageIndex === index
                        ? "bg-foreground"
                        : "bg-background"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {entry.source && (
          <EntrySection title="Source">
            <a
              href={entry.source}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all underline hover:no-underline text-primary-500"
            >
              {entry.source}
            </a>
          </EntrySection>
        )}
      </div>

      {showEditModal && (
        <EntryModal
          onClose={() => setShowEditModal(false)}
          initialData={entry}
          isEditing={true}
          onSaved={(updatedEntry) => {
            setShowEditModal(false);
            router.reload();
          }}
        />
      )}
    </main>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();

  await import("../../db/models/Category.js");

  const entry = await Entry.findById(params.id).populate("category").lean();

  if (!entry) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      entry: entry ? JSON.parse(JSON.stringify(entry)) : null,
    },
  };
}
