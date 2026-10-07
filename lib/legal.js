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

// Each section consists of blocks: a string is a paragraph, { list } a bullet
// list and { contact: true } the contact details above.
export const PRIVACY_POLICY = {
  de: [
    {
      heading: "1. Verantwortliche Stelle",
      blocks: [
        "Verantwortlich für die Verarbeitung personenbezogener Daten in dieser App im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:",
        { contact: true },
      ],
    },
    {
      heading: "2. Überblick",
      blocks: [
        "Wir verarbeiten nur die Daten, die für die Nutzung der App erforderlich sind. Es gibt kein Tracking, keine Analyse-Tools, keine Werbung und keine Weitergabe von Daten zu Werbezwecken.",
        "Alle Nutzerdaten werden in der EU (Frankfurt am Main) gespeichert und verarbeitet. Ausgenommen sind nur die Dienste, die in Abschnitt 5 und 7 genannt sind.",
      ],
    },
    {
      heading: "3. Welche Daten wir verarbeiten",
      blocks: [
        {
          list: [
            "Kontodaten: deine E-Mail-Adresse, die wir nicht im Klartext speichern, sondern nur als nicht umkehrbaren Hash-Wert (HMAC-SHA256, pseudonymisiert). Bei der Anmeldung mit GitHub zusätzlich deine GitHub-Konto-ID.",
            "Inhalte, die du selbst anlegst: Einträge (Titel, Beschreibung, Elemente, Schritte, Notizen, Quelle, Bewertung), eigene Kategorien und hochgeladene Bilder.",
            "Einstellungen: deine gewählte Sprache.",
            "Technische Daten: Beim Aufruf der App verarbeitet unser Hosting-Anbieter technisch notwendige Daten wie IP-Adresse, Zeitpunkt, aufgerufene Adresse und Browser-Informationen, um die App auszuliefern und vor Missbrauch zu schützen.",
          ],
        },
      ],
    },
    {
      heading: "4. Zwecke und Rechtsgrundlagen",
      blocks: [
        {
          list: [
            "Bereitstellung deines Kontos und der Funktionen der App (Anmeldung, Speichern deiner Inhalte und Einstellungen): Art. 6 Abs. 1 lit. b DSGVO (Vertrag über die Nutzung der App).",
            "Sicherer und stabiler Betrieb der App (technische Daten): Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist die Auslieferung und Absicherung der App.",
            "Speichern von Informationen in deinem Browser (Cookies): § 25 Abs. 2 Nr. 2 TDDDG, da diese für die von dir gewünschten Funktionen unbedingt erforderlich sind.",
          ],
        },
      ],
    },
    {
      heading: "5. Anmeldung",
      blocks: [
        "Anmeldung per E-Mail: Du erhältst einen Anmeldelink an deine E-Mail-Adresse, der 24 Stunden gültig ist. Der Versand erfolgt über den E-Mail-Dienst Gmail der Google Ireland Limited (Irland). Dabei kann eine Übermittlung an die Google LLC in den USA nicht ausgeschlossen werden; Google ist nach dem EU-US Data Privacy Framework zertifiziert (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO).",
        "Anmeldung mit GitHub: Wenn du dich mit GitHub anmeldest, wirst du zu GitHub weitergeleitet. GitHub übermittelt uns anschließend deine Konto-ID, deinen Namen, deine E-Mail-Adresse und die Adresse deines Profilbilds. Davon speichern wir nur deine Konto-ID und den Hash-Wert deiner E-Mail-Adresse; Name, Profilbild und die Zugangsdaten von GitHub verwerfen wir. Anbieter ist die GitHub, Inc. (USA). GitHub ist nach dem EU-US Data Privacy Framework zertifiziert.",
      ],
    },
    {
      heading: "6. Hosting und Speicherung",
      blocks: [
        "Die App wird bei der Vercel Inc. (USA) betrieben. Die Server-Funktionen der App und der Speicher für hochgeladene Bilder (Vercel Blob) befinden sich in Frankfurt am Main.",
        "Die Datenbank wird über MongoDB Atlas der MongoDB, Inc. (USA) auf Servern von Amazon Web Services in Frankfurt am Main betrieben.",
        "Beide Anbieter verarbeiten die Daten in unserem Auftrag (Art. 28 DSGVO). Da es sich um Unternehmen mit Sitz in den USA handelt, ist ein Zugriff aus den USA nicht auszuschließen. Beide Anbieter sind nach dem EU-US Data Privacy Framework zertifiziert.",
      ],
    },
    {
      heading: "7. Import mit KI",
      blocks: [
        "Wenn du die Funktion „Mit KI importieren“ nutzt, ruft unser Server die angegebene Website bzw. den Social-Media-Beitrag ab. Dabei werden keine Daten über dich an die abgerufene Seite übermittelt, die Anfrage stammt von unserem Server.",
        "Die angegebene Adresse und der abgerufene Inhalt werden anschließend an die Anthropic PBC (USA) übermittelt, um die Inhalte den Feldern deines Eintrags zuzuordnen. Die Übermittlung in die USA erfolgt auf Grundlage der Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO). Anthropic verwendet die Daten nach seinen kommerziellen Bedingungen nicht zum Training seiner Modelle.",
        "Der Import ist freiwillig. Du kannst Einträge jederzeit auch ohne diese Funktion anlegen.",
      ],
    },
    {
      heading: "8. Hochgeladene Bilder",
      blocks: [
        "Beim Hochladen entfernen wir automatisch alle in einem Bild gespeicherten Zusatzinformationen (z. B. Aufnahmeort, Kameradaten) sowie den ursprünglichen Dateinamen.",
        "Bilder sind über ihre Adresse technisch öffentlich abrufbar. Die Adresse enthält eine zufällige Zeichenfolge und ist nicht erratbar; sie wird von der App nur dir angezeigt. Lade bitte keine Bilder hoch, auf denen andere Personen erkennbar sind, sofern sie nicht eingewilligt haben.",
      ],
    },
    {
      heading: "9. Cookies und Speicher im Browser",
      blocks: [
        "Wir verwenden ausschließlich technisch notwendige Cookies, deshalb fragen wir nicht nach einer Einwilligung:",
        {
          list: [
            "Anmelde-Cookies (next-auth.*): halten dich angemeldet und schützen Formulare vor Missbrauch. Sie werden beim Abmelden bzw. nach Ablauf der Sitzung (höchstens 30 Tage) gelöscht.",
            "Sprach-Cookie (locale): speichert deine gewählte Sprache für ein Jahr.",
          ],
        },
        "Für kurze Hinweise (z. B. „Erfolgreich abgemeldet“) nutzt die App zusätzlich den Sitzungsspeicher deines Browsers, der beim Schließen des Tabs gelöscht wird.",
      ],
    },
    {
      heading: "10. Speicherdauer",
      blocks: [
        "Wir speichern deine Konto- und Inhaltsdaten, solange dein Konto besteht. Wenn du dein Konto löschst, werden alle zugehörigen Daten inklusive deiner Bilder sofort gelöscht. Einzelne Einträge und Bilder werden gelöscht, sobald du sie selbst löschst.",
        "Technische Daten beim Hosting-Anbieter werden nur kurzfristig gespeichert und anschließend automatisch gelöscht.",
      ],
    },
    {
      heading: "11. Deine Rechte",
      blocks: [
        "Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21).",
        "Viele dieser Rechte kannst du direkt in der App ausüben: Unter „Mein Konto“ kannst du alle deine Daten herunterladen und dein Konto vollständig löschen. Einträge kannst du jederzeit bearbeiten. Für alle anderen Anliegen genügt eine E-Mail an die oben genannte Adresse.",
        "Außerdem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), insbesondere in dem Bundesland bzw. Mitgliedstaat deines Wohnorts.",
      ],
    },
    {
      heading: "12. Sonstiges",
      blocks: [
        "Die Bereitstellung deiner E-Mail-Adresse bzw. deines GitHub-Kontos ist für die Nutzung der App erforderlich; ohne sie ist keine Anmeldung möglich. Eine automatisierte Entscheidungsfindung im Sinne von Art. 22 DSGVO findet nicht statt.",
      ],
    },
  ],
  en: [
    {
      heading: "1. Controller",
      blocks: [
        "The controller responsible for processing personal data in this app within the meaning of the General Data Protection Regulation (GDPR) is:",
        { contact: true },
      ],
    },
    {
      heading: "2. Overview",
      blocks: [
        "We only process the data required to use the app. There is no tracking, no analytics, no advertising and no sharing of data for advertising purposes.",
        "All user data is stored and processed in the EU (Frankfurt am Main). The only exceptions are the services listed in sections 5 and 7.",
      ],
    },
    {
      heading: "3. Data we process",
      blocks: [
        {
          list: [
            "Account data: your email address, which we do not store in plain text but only as a non-reversible hash (HMAC-SHA256, pseudonymised). When signing in with GitHub, also your GitHub account ID.",
            "Content you create: entries (title, description, items, steps, notes, source, rating), your own categories and uploaded images.",
            "Settings: your selected language.",
            "Technical data: when you use the app, our hosting provider processes technically necessary data such as your IP address, time of access, requested address and browser information in order to deliver the app and protect it against misuse.",
          ],
        },
      ],
    },
    {
      heading: "4. Purposes and legal bases",
      blocks: [
        {
          list: [
            "Providing your account and the app's features (sign-in, storing your content and settings): Art. 6(1)(b) GDPR (contract for the use of the app).",
            "Secure and stable operation of the app (technical data): Art. 6(1)(f) GDPR. Our legitimate interest is delivering and securing the app.",
            "Storing information in your browser (cookies): Section 25(2) no. 2 TDDDG, as they are strictly necessary for the features you request.",
          ],
        },
      ],
    },
    {
      heading: "5. Sign-in",
      blocks: [
        "Sign-in by email: you receive a sign-in link at your email address that is valid for 24 hours. It is sent via the Gmail email service of Google Ireland Limited (Ireland). A transfer to Google LLC in the USA cannot be ruled out; Google is certified under the EU-US Data Privacy Framework (adequacy decision of the EU Commission, Art. 45 GDPR).",
        "Sign-in with GitHub: when you sign in with GitHub, you are redirected to GitHub. GitHub then sends us your account ID, your name, your email address and the address of your profile picture. Of these, we only store your account ID and the hash of your email address; we discard your name, profile picture and the credentials issued by GitHub. The provider is GitHub, Inc. (USA). GitHub is certified under the EU-US Data Privacy Framework.",
      ],
    },
    {
      heading: "6. Hosting and storage",
      blocks: [
        "The app is operated by Vercel Inc. (USA). The app's server functions and the storage for uploaded images (Vercel Blob) are located in Frankfurt am Main.",
        "The database is operated via MongoDB Atlas by MongoDB, Inc. (USA) on Amazon Web Services servers in Frankfurt am Main.",
        "Both providers process the data on our behalf (Art. 28 GDPR). As they are companies based in the USA, access from the USA cannot be ruled out. Both providers are certified under the EU-US Data Privacy Framework.",
      ],
    },
    {
      heading: "7. AI import",
      blocks: [
        "When you use the \"Import with AI\" feature, our server retrieves the website or social media post you entered. No data about you is sent to the retrieved page; the request comes from our server.",
        "The address you entered and the retrieved content are then sent to Anthropic PBC (USA) in order to map the content to the fields of your entry. The transfer to the USA is based on the EU Commission's standard contractual clauses (Art. 46(2)(c) GDPR). Under its commercial terms, Anthropic does not use this data to train its models.",
        "Using the import is optional. You can always create entries without it.",
      ],
    },
    {
      heading: "8. Uploaded images",
      blocks: [
        "When you upload an image, we automatically remove all additional information stored in it (e.g. location, camera details) as well as the original filename.",
        "Images can technically be accessed publicly via their address. The address contains a random string and cannot be guessed; the app only shows it to you. Please do not upload images in which other people can be recognised unless they have agreed.",
      ],
    },
    {
      heading: "9. Cookies and browser storage",
      blocks: [
        "We only use technically necessary cookies, which is why we do not ask for consent:",
        {
          list: [
            "Sign-in cookies (next-auth.*): keep you signed in and protect forms against misuse. They are deleted when you sign out or when the session expires (at most 30 days).",
            "Language cookie (locale): stores your selected language for one year.",
          ],
        },
        "For short notices (e.g. \"Successfully logged out\"), the app also uses your browser's session storage, which is cleared when you close the tab.",
      ],
    },
    {
      heading: "10. Retention period",
      blocks: [
        "We store your account and content data for as long as your account exists. If you delete your account, all associated data including your images is deleted immediately. Individual entries and images are deleted as soon as you delete them yourself.",
        "Technical data at the hosting provider is only stored for a short time and then deleted automatically.",
      ],
    },
    {
      heading: "11. Your rights",
      blocks: [
        "You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object to processing based on Art. 6(1)(f) GDPR (Art. 21).",
        "You can exercise many of these rights directly in the app: under \"My account\" you can download all your data and delete your account completely. You can edit your entries at any time. For anything else, simply send an email to the address above.",
        "You also have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), in particular in the state or member state of your residence.",
      ],
    },
    {
      heading: "12. Other information",
      blocks: [
        "Providing your email address or GitHub account is required to use the app; without it, you cannot sign in. There is no automated decision-making within the meaning of Art. 22 GDPR.",
      ],
    },
  ],
};

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
