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

function Block({ block }) {
  if (block.contact) {
    return <ContactDetails />;
  }

  if (block.list) {
    return (
      <ul className="mt-3 list-disc space-y-2 pl-5 text-secondary-700">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p className="mt-3 leading-relaxed text-secondary-700">{block}</p>;
}

export default function LegalDocument({ title, content }) {
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

      {sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-lg font-semibold">{section.heading}</h2>

          {section.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </section>
      ))}
    </main>
  );
}
