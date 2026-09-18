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
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

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
          className="rounded-lg bg-background p-2 text-primary-700 hover:bg-secondary-100"
          aria-label={`Edit ${entry.title}`}
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pencil"
          >
            {" "}
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />{" "}
            <path d="m15 5 4 4" />{" "}
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteConfirmation(true)}
          className="rounded-lg bg-background p-2 text-accent-500 hover:bg-accent-100"
          aria-label={`Delete ${entry.title}`}
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-2"
          >
            {" "}
            <path d="M10 11v6" /> <path d="M14 11v6" />{" "}
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />{" "}
            <path d="M3 6h18" />{" "}
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />{" "}
          </svg>
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

export async function getServerSideProps({ params, req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  await dbConnect();

  await import("../../db/models/Category.js");

  const entry = await Entry.findOne({
    _id: params.id,
    owner: userId,
  })
    .populate("category")
    .lean();

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
