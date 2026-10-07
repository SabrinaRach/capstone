// Contact details of the person responsible for the app. Used by the privacy
// policy and the imprint. TODO: replace the placeholders before publishing.
export const LEGAL_CONTACT = {
  name: "[Vor- und Nachname]",
  street: "[Straße und Hausnummer]",
  postalCodeAndCity: "[PLZ Ort]",
  country: "Deutschland",
  email: "[kontakt@beispiel.de]",
};

export const LEGAL_LAST_UPDATED = "2026-10-07";

// Each section consists of blocks, see lib/privacyPolicy.js for the format.
export const IMPRINT = {
  de: [
    {
      heading: "Angaben gemäß § 5 DDG",
      blocks: [{ contact: true }],
    },
    {
      heading: "Verbraucherstreitbeilegung",
      blocks: [
        "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      ],
    },
  ],
  en: [
    {
      heading: "Information according to Section 5 DDG (German Digital Services Act)",
      blocks: [{ contact: true }],
    },
    {
      heading: "Consumer dispute resolution",
      blocks: [
        "We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.",
      ],
    },
  ],
};
