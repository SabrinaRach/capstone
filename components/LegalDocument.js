import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import BackLink from "@/components/BackLink";
import { useI18n } from "@/lib/i18n/I18nContext";
import { LEGAL_CONTACT, LEGAL_LAST_UPDATED } from "@/lib/legal";
import { canGoBackInApp } from "@/lib/navigationHistory";

function ContactDetails() {
  return (
    <address className="mt-3 not-italic leading-relaxed text-secondary-700">
      {LEGAL_CONTACT.name}
      <br />
      {LEGAL_CONTACT.street}
      <br />
      {LEGAL_CONTACT.postalCodeAndCity}
      <br />
      {LEGAL_CONTACT.country}
      <br />
      <a
        href={`mailto:${LEGAL_CONTACT.email}`}
        className="text-primary-700 underline hover:text-primary-500"
      >
        {LEGAL_CONTACT.email}
      </a>
    </address>
  );
}

const URL_PATTERN = /(https?:\/\/[^\s;,)]+)/g;

// Renders plain text with web addresses turned into links.
function TextWithLinks({ text }) {
  return text.split(URL_PATTERN).map((part, index) =>
    index % 2 === 1 ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-primary-700 underline hover:text-primary-500"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function ListItem({ item }) {
  if (typeof item === "string") {
    return <TextWithLinks text={item} />;
  }

  return (
    <>
      <strong className="font-semibold text-foreground">{item.label}:</strong>{" "}
      <TextWithLinks text={item.text} />
    </>
  );
}

function Block({ block }) {
  if (block.contact) {
    return <ContactDetails />;
  }

  if (block.subheading) {
    return <h3 className="mt-5 font-semibold">{block.subheading}</h3>;
  }

  if (block.link) {
    return (
      <p className="mt-6 text-sm">
        <a
          href={block.link.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-primary-700 underline hover:text-primary-500"
        >
          {block.link.text}
        </a>
      </p>
    );
  }

  if (block.list) {
    return (
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-secondary-700">
        {block.list.map((item, index) => (
          <li key={index}>
            <ListItem item={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-3 leading-relaxed text-secondary-700">
      <TextWithLinks text={block} />
    </p>
  );
}

function TableOfContents({ sections, label }) {
  return (
    <nav aria-label={label} className="mt-8">
      <h2 className="text-lg font-semibold">{label}</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-secondary-700">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="underline hover:text-primary-700"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function LegalDocument({
  title,
  content,
  showTableOfContents = false,
}) {
  const { locale, t } = useI18n();
  const { status } = useSession();
  const router = useRouter();
  const sections = content[locale] || content.de;

  // Goes back to the previous page within the app. When the page was opened
  // directly (e.g. via a link from outside), the href is used instead.
  function handleBack(event) {
    if (canGoBackInApp()) {
      event.preventDefault();
      router.back();
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-10 pt-20 sm:pt-10">
      <BackLink
        href={status === "authenticated" ? "/entries" : "/"}
        text={t("legal.back")}
        onClick={handleBack}
      />

      <h1 className="text-3xl font-bold">{title}</h1>

      <p className="mt-2 text-sm text-secondary-500">
        {t("legal.lastUpdated", {
          date: new Date(LEGAL_LAST_UPDATED).toLocaleDateString(locale, {
            dateStyle: "long",
          }),
        })}
      </p>

      {showTableOfContents && (
        <TableOfContents
          sections={sections}
          label={t("legal.tableOfContents")}
        />
      )}

      {sections.map((section) => (
        <section
          key={section.id || section.heading}
          id={section.id}
          className="mt-8 scroll-mt-20"
        >
          <h2 className="text-lg font-semibold">{section.heading}</h2>

          {section.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </section>
      ))}
    </main>
  );
}
