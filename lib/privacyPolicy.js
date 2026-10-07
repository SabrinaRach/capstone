// Privacy policy, based on the free generator by Dr. Thomas Schwenke
// (datenschutz-generator.de) and adapted to what the app actually does. The
// generator's license requires keeping the link at the end.
//
// Blocks: a string is a paragraph, { subheading } a sub heading, { list } a
// bullet list whose items are strings or { label, text }, { contact: true }
// the contact details from lib/legal.js and { link } a single link.

const GENERATOR_LINK = {
  href: "https://datenschutz-generator.de/",
  de: "Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke",
  en: "Created with the free Datenschutz-Generator.de by Dr. Thomas Schwenke",
};

const de = [
  {
    id: "praeambel",
    heading: "Präambel",
    blocks: [
      'Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als "Daten" bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten im Rahmen dieser Web-App (nachfolgend bezeichnet als "Onlineangebot").',
      "Die verwendeten Begriffe sind nicht geschlechtsspezifisch.",
    ],
  },
  {
    id: "verantwortlicher",
    heading: "Verantwortlicher",
    blocks: [{ contact: true }],
  },
  {
    id: "uebersicht",
    heading: "Übersicht der Verarbeitungen",
    blocks: [
      "Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.",
      { subheading: "Arten der verarbeiteten Daten" },
      {
        list: [
          "Bestandsdaten.",
          "Kontaktdaten.",
          "Inhaltsdaten.",
          "Nutzungsdaten.",
          "Meta-, Kommunikations- und Verfahrensdaten.",
          "Protokolldaten.",
        ],
      },
      { subheading: "Kategorien betroffener Personen" },
      { list: ["Nutzer."] },
      { subheading: "Zwecke der Verarbeitung" },
      {
        list: [
          "Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten.",
          "Sicherheitsmaßnahmen.",
          "Anmeldeverfahren.",
          "Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.",
          "Informationstechnische Infrastruktur.",
        ],
      },
    ],
  },
  {
    id: "rechtsgrundlagen",
    heading: "Maßgebliche Rechtsgrundlagen",
    blocks: [
      "Maßgebliche Rechtsgrundlagen nach der DSGVO: Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten können. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung mit.",
      {
        list: [
          {
            label: "Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO)",
            text: "Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.",
          },
          {
            label: "Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)",
            text: "Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten notwendig, vorausgesetzt, dass die Interessen, Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten verlangen, nicht überwiegen.",
          },
        ],
      },
      "Nationale Datenschutzregelungen in Deutschland: Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere das Bundesdatenschutzgesetz (BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung sowie automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling. Ferner können Landesdatenschutzgesetze der einzelnen Bundesländer zur Anwendung gelangen. Für das Speichern von Informationen auf Ihrem Endgerät (z. B. Cookies) gilt zudem das Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG).",
    ],
  },
  {
    id: "sicherheit",
    heading: "Sicherheitsmaßnahmen",
    blocks: [
      "Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.",
      "Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.",
      {
        list: [
          {
            label: "Sicherung von Online-Verbindungen durch TLS-/SSL-Verschlüsselungstechnologie (HTTPS)",
            text: "Um die Daten der Nutzer, die über unsere Online-Dienste übertragen werden, vor unerlaubten Zugriffen zu schützen, setzen wir auf die TLS-/SSL-Verschlüsselungstechnologie. Diese Technologien verschlüsseln die Informationen, die zwischen der Website oder App und dem Browser des Nutzers (oder zwischen zwei Servern) übertragen werden, wodurch die Daten vor unbefugtem Zugriff geschützt sind. Wenn eine Website durch ein SSL-/TLS-Zertifikat gesichert ist, wird dies durch die Anzeige von HTTPS in der URL signalisiert.",
          },
          {
            label: "Pseudonymisierung von E-Mail-Adressen",
            text: "E-Mail-Adressen speichern wir nicht im Klartext, sondern ausschließlich als nicht umkehrbaren Hash-Wert (HMAC-SHA256 mit geheimem Schlüssel). Damit können wir Sie bei der Anmeldung wiedererkennen, ohne Ihre E-Mail-Adresse in unserer Datenbank vorzuhalten. Aus dem gespeicherten Wert lässt sich die E-Mail-Adresse nicht wiederherstellen.",
          },
          {
            label: "Datenminimierung",
            text: "Wir speichern nur Daten, die für die Funktionen des Onlineangebots erforderlich sind. Daten, die uns bei der Anmeldung mit GitHub zusätzlich übermittelt werden (Name, Profilbild, Zugangstoken), verwerfen wir sofort. Aus hochgeladenen Bildern entfernen wir eingebettete Zusatzinformationen (z. B. Aufnahmeort, Kameradaten) und den ursprünglichen Dateinamen. E-Mail-Adressen werden aus technischen Fehlerprotokollen automatisch entfernt.",
          },
        ],
      },
    ],
  },
  {
    id: "speicherung-und-loeschung",
    heading: "Allgemeine Informationen zur Datenspeicherung und Löschung",
    blocks: [
      "Wir löschen personenbezogene Daten, die wir verarbeiten, gemäß den gesetzlichen Bestimmungen, sobald keine weiteren rechtlichen Grundlagen für die Verarbeitung bestehen. Dies betrifft Fälle, in denen der ursprüngliche Verarbeitungszweck entfällt oder die Daten nicht mehr benötigt werden. Ausnahmen von dieser Regelung bestehen, wenn gesetzliche Pflichten oder besondere Interessen eine längere Aufbewahrung oder Archivierung der Daten erfordern.",
      "Da wir keine kostenpflichtigen Leistungen anbieten, bestehen für die in diesem Onlineangebot verarbeiteten Daten keine handels- oder steuerrechtlichen Aufbewahrungspflichten. Es gelten die folgenden Fristen:",
      {
        list: [
          {
            label: "Nutzerkonto und Inhalte",
            text: "solange das Nutzerkonto besteht. Löschen Sie Ihr Konto, werden alle zugehörigen Daten einschließlich hochgeladener Bilder sofort gelöscht. Einzelne Einträge und Bilder werden gelöscht, sobald Sie sie selbst löschen.",
          },
          {
            label: "Anmeldelinks",
            text: "sind 24 Stunden gültig, werden mit der Anmeldung verbraucht und nach Ablauf automatisch gelöscht.",
          },
          {
            label: "Server-Logfiles",
            text: "werden für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert.",
          },
        ],
      },
      "Unsere Datenschutzhinweise enthalten zusätzliche Informationen zur Aufbewahrung und Löschung von Daten, die speziell für bestimmte Verarbeitungsprozesse gelten.",
    ],
  },
  {
    id: "rechte",
    heading: "Rechte der betroffenen Personen",
    blocks: [
      "Rechte der betroffenen Personen aus der DSGVO: Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:",
      {
        list: [
          {
            label: "Widerspruchsrecht",
            text: "Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling.",
          },
          {
            label: "Auskunftsrecht",
            text: "Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen Vorgaben.",
          },
          {
            label: "Recht auf Berichtigung",
            text: "Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.",
          },
          {
            label: "Recht auf Löschung und Einschränkung der Verarbeitung",
            text: "Sie haben nach Maßgabe der gesetzlichen Vorgaben das Recht, zu verlangen, dass Sie betreffende Daten unverzüglich gelöscht werden, bzw. alternativ nach Maßgabe der gesetzlichen Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.",
          },
          {
            label: "Recht auf Datenübertragbarkeit",
            text: "Sie haben das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.",
          },
          {
            label: "Beschwerde bei Aufsichtsbehörde",
            text: "Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs haben Sie das Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt. Die Beschwerde kann insbesondere bei einer Aufsichtsbehörde in dem Mitgliedstaat Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes eingelegt werden.",
          },
        ],
      },
      "Viele dieser Rechte können Sie direkt in unserem Onlineangebot ausüben: Unter „Mein Konto“ können Sie alle zu Ihrem Konto gespeicherten Daten als Datei herunterladen (Auskunft, Datenübertragbarkeit) und Ihr Konto mit allen Daten löschen (Löschung). Ihre Einträge können Sie jederzeit bearbeiten (Berichtigung). Für alle weiteren Anliegen genügt eine E-Mail an die oben genannte Adresse.",
    ],
  },
  {
    id: "hosting",
    heading: "Bereitstellung des Onlineangebots und Webhosting",
    blocks: [
      "Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung stellen zu können. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder das Endgerät der Nutzer zu übermitteln.",
      {
        list: [
          {
            label: "Verarbeitete Datenarten",
            text: "Nutzungsdaten (z. B. aufgerufene Seiten, verwendete Gerätetypen, Betriebssysteme und Browser); Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern); Protokolldaten (z. B. Logfiles betreffend Logins oder den Abruf von Daten oder Zugriffszeiten).",
          },
          {
            label: "Betroffene Personen",
            text: "Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).",
          },
          {
            label: "Zwecke der Verarbeitung und berechtigte Interessen",
            text: "Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit; Informationstechnische Infrastruktur (Betrieb und Bereitstellung von Informationssystemen und technischen Geräten); Sicherheitsmaßnahmen.",
          },
          {
            label: "Aufbewahrung und Löschung",
            text: 'Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung".',
          },
          {
            label: "Rechtsgrundlagen",
            text: "Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).",
          },
        ],
      },
      { subheading: "Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten" },
      {
        list: [
          {
            label: "Bereitstellung Onlineangebot auf gemietetem Speicherplatz",
            text: 'Für die Bereitstellung unseres Onlineangebotes nutzen wir Speicherplatz, Rechenkapazität und Software, die wir von einem entsprechenden Serveranbieter (auch "Webhoster" genannt) mieten oder anderweitig beziehen; Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).',
          },
          {
            label: "Erhebung von Zugriffsdaten und Logfiles",
            text: 'Der Zugriff auf unser Onlineangebot wird in Form von sogenannten "Server-Logfiles" protokolliert. Zu den Serverlogfiles können die Adresse und der Name der abgerufenen Webseiten und Dateien, Datum und Uhrzeit des Abrufs, übertragene Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall IP-Adressen und der anfragende Provider gehören. Die Serverlogfiles können zum einen zu Sicherheitszwecken eingesetzt werden, z. B. um eine Überlastung der Server zu vermeiden (insbesondere im Fall von missbräuchlichen Angriffen, sogenannten DDoS-Attacken), und zum anderen, um die Auslastung der Server und ihre Stabilität sicherzustellen; Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). Löschung von Daten: Logfile-Informationen werden für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert. Daten, deren weitere Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung des jeweiligen Vorfalls von der Löschung ausgenommen.',
          },
          {
            label: "Content-Delivery-Network",
            text: 'Wir setzen ein "Content-Delivery-Network" (CDN) ein. Ein CDN ist ein Dienst, mit dessen Hilfe Inhalte eines Onlineangebotes, insbesondere große Mediendateien, wie Grafiken oder Programm-Skripte, mit Hilfe regional verteilter und über das Internet verbundener Server schneller und sicherer ausgeliefert werden können; Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).',
          },
          {
            label: "Vercel",
            text: "Hosting des Onlineangebots, Content-Delivery-Network und Speicher für hochgeladene Bilder (Vercel Blob). Die Server-Funktionen und der Bildspeicher befinden sich in Frankfurt am Main. Dienstanbieter: Vercel Inc., USA; Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO), Vertragserfüllung (Art. 6 Abs. 1 S. 1 lit. b) DSGVO); Website: https://vercel.com; Datenschutzerklärung: https://vercel.com/legal/privacy-policy; Auftragsverarbeitungsvertrag: https://vercel.com/legal/dpa; Grundlage Drittlandtransfers: EU-US Data Privacy Framework (DPF).",
          },
          {
            label: "MongoDB Atlas",
            text: "Datenbank, in der Nutzerkonten, Einträge, Kategorien und Einstellungen gespeichert werden. Die Datenbank wird auf Servern von Amazon Web Services in Frankfurt am Main betrieben. Dienstanbieter: MongoDB, Inc., USA; Rechtsgrundlagen: Vertragserfüllung (Art. 6 Abs. 1 S. 1 lit. b) DSGVO); Website: https://www.mongodb.com/atlas; Datenschutzerklärung: https://www.mongodb.com/legal/privacy/privacy-policy; Auftragsverarbeitungsvertrag: https://www.mongodb.com/legal/data-processing-agreement; Grundlage Drittlandtransfers: EU-US Data Privacy Framework (DPF).",
          },
        ],
      },
    ],
  },
  {
    id: "cookies",
    heading: "Einsatz von Cookies",
    blocks: [
      'Unter dem Begriff „Cookies" werden Funktionen, die Informationen auf Endgeräten der Nutzer speichern und aus ihnen auslesen, verstanden. Cookies können ferner in Bezug auf unterschiedliche Anliegen Einsatz finden, etwa zu Zwecken der Funktionsfähigkeit, der Sicherheit und des Komforts von Onlineangeboten sowie der Erstellung von Analysen der Besucherströme.',
      "Wir setzen ausschließlich Cookies ein, die unbedingt erforderlich sind, um die von Ihnen ausdrücklich gewünschten Funktionen bereitzustellen (§ 25 Abs. 2 Nr. 2 TDDDG). Hierfür ist keine Einwilligung erforderlich. Cookies zu Analyse-, Marketing- oder Trackingzwecken setzen wir nicht ein.",
      {
        list: [
          {
            label: "Anmelde-Cookies (next-auth.*)",
            text: "halten Sie angemeldet, schützen Formulare vor Missbrauch (CSRF-Schutz) und sichern die Anmeldung mit GitHub ab. Sie werden beim Abmelden bzw. nach Ablauf der Sitzung (höchstens 30 Tage) gelöscht.",
          },
          {
            label: "Sprach-Cookie (locale)",
            text: "speichert die von Ihnen gewählte Sprache für ein Jahr.",
          },
        ],
      },
      "Für kurze Hinweise (z. B. „Erfolgreich abgemeldet“) nutzt das Onlineangebot zusätzlich den Sitzungsspeicher Ihres Browsers (Session Storage), der beim Schließen des Tabs gelöscht wird.",
      "Allgemeine Hinweise zum Widerspruch (Opt-out): Nutzer können Cookies über die Privatsphäre-Einstellungen ihres Browsers löschen oder blockieren. Ohne Anmelde-Cookies ist eine Anmeldung jedoch nicht möglich.",
      {
        list: [
          {
            label: "Verarbeitete Datenarten",
            text: "Meta-, Kommunikations- und Verfahrensdaten (z. B. Identifikationsnummern, Zeitangaben).",
          },
          {
            label: "Betroffene Personen",
            text: "Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).",
          },
          {
            label: "Rechtsgrundlagen",
            text: "§ 25 Abs. 2 Nr. 2 TDDDG; Vertragserfüllung (Art. 6 Abs. 1 S. 1 lit. b) DSGVO); Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).",
          },
        ],
      },
    ],
  },
  {
    id: "nutzerkonto",
    heading: "Registrierung, Anmeldung und Nutzerkonto",
    blocks: [
      "Nutzer können ein Nutzerkonto anlegen, indem sie sich erstmals mit ihrer E-Mail-Adresse (per Anmeldelink) oder mit ihrem GitHub-Konto anmelden. Ein Nutzername oder Passwort wird nicht vergeben. Die Daten werden zu Zwecken der Bereitstellung des Nutzerkontos auf Grundlage vertraglicher Pflichterfüllung verarbeitet.",
      "Ihre E-Mail-Adresse speichern wir nicht im Klartext, sondern ausschließlich als nicht umkehrbaren Hash-Wert (siehe „Sicherheitsmaßnahmen“). Wir selbst speichern keine IP-Adressen; Zugriffe werden lediglich in den Server-Logfiles unseres Hosting-Anbieters protokolliert (siehe „Bereitstellung des Onlineangebots und Webhosting“).",
      {
        list: [
          {
            label: "Verarbeitete Datenarten",
            text: "Bestandsdaten (Nutzer-ID, pseudonymisierte E-Mail-Adresse, bei Anmeldung mit GitHub die GitHub-Konto-ID); Kontaktdaten (E-Mail-Adresse, ausschließlich zum Versand des Anmeldelinks); Inhaltsdaten (von Nutzern angelegte Einträge, Kategorien und Bilder); Nutzungsdaten (z. B. gewählte Sprache); Protokolldaten (z. B. Logfiles betreffend Logins).",
          },
          {
            label: "Betroffene Personen",
            text: "Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).",
          },
          {
            label: "Zwecke der Verarbeitung und berechtigte Interessen",
            text: "Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten; Sicherheitsmaßnahmen; Anmeldeverfahren; Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.",
          },
          {
            label: "Aufbewahrung und Löschung",
            text: 'Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung". Löschung nach Kündigung.',
          },
          {
            label: "Rechtsgrundlagen",
            text: "Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO); Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).",
          },
        ],
      },
      { subheading: "Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten" },
      {
        list: [
          {
            label: "Registrierung mit Pseudonymen",
            text: "Eine Angabe des Klarnamens ist nicht erforderlich; Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).",
          },
          {
            label: "Profile der Nutzer sind nicht öffentlich",
            text: "Die Profile und Einträge der Nutzer sind öffentlich nicht sichtbar und nicht zugänglich.",
          },
          {
            label: "Anmeldung per E-Mail-Link",
            text: "Bei der Anmeldung per E-Mail senden wir einen Anmeldelink an die angegebene E-Mail-Adresse, der 24 Stunden gültig ist und nur einmal verwendet werden kann. Der Versand erfolgt über den E-Mail-Dienst Gmail. Dienstanbieter: Google Ireland Limited, Irland, Mutterunternehmen: Google LLC, USA; Rechtsgrundlagen: Vertragserfüllung (Art. 6 Abs. 1 S. 1 lit. b) DSGVO); Datenschutzerklärung: https://policies.google.com/privacy; Grundlage Drittlandtransfers: EU-US Data Privacy Framework (DPF).",
          },
          {
            label: "Löschung von Daten nach Kündigung",
            text: "Nutzer können ihr Nutzerkonto jederzeit unter „Mein Konto“ löschen. Dabei werden alle Daten im Hinblick auf das Nutzerkonto, einschließlich Einträgen, Kategorien, Einstellungen und hochgeladenen Bildern, sofort gelöscht; Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).",
          },
          {
            label: "Keine Aufbewahrungspflicht für Daten",
            text: "Es obliegt den Nutzern, ihre Daten vor der Löschung des Nutzerkontos zu sichern (z. B. über den Datenexport unter „Mein Konto“). Wir sind berechtigt, sämtliche während der Vertragsdauer gespeicherte Daten des Nutzers unwiederbringlich zu löschen; Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).",
          },
        ],
      },
    ],
  },
  {
    id: "single-sign-on",
    heading: "Single-Sign-On-Anmeldung",
    blocks: [
      'Als "Single-Sign-On" oder "Single-Sign-On-Anmeldung bzw. -Authentifizierung" werden Verfahren bezeichnet, die es Nutzern erlauben, sich mit Hilfe eines Nutzerkontos bei einem Anbieter von Single-Sign-On-Verfahren auch bei unserem Onlineangebot anzumelden. Voraussetzung der Single-Sign-On-Authentifizierung ist, dass die Nutzer bei dem jeweiligen Single-Sign-On-Anbieter registriert sind und die erforderlichen Zugangsdaten in dem dafür vorgesehenen Onlineformular eingeben, bzw. schon bei dem Single-Sign-On-Anbieter angemeldet sind und die Single-Sign-On-Anmeldung via Schaltfläche bestätigen.',
      "Die Authentifizierung erfolgt direkt bei dem jeweiligen Single-Sign-On-Anbieter. Im Rahmen einer solchen Authentifizierung erhalten wir eine Nutzer-ID mit der Information, dass der Nutzer unter dieser Nutzer-ID beim jeweiligen Single-Sign-On-Anbieter eingeloggt ist. Ob uns zusätzliche Daten übermittelt werden, hängt allein von dem genutzten Single-Sign-On-Verfahren ab, von den gewählten Datenfreigaben im Rahmen der Authentifizierung und zudem davon, welche Daten Nutzer in den Privatsphäre- oder sonstigen Einstellungen des Nutzerkontos beim Single-Sign-On-Anbieter freigegeben haben. Das im Rahmen des Single-Sign-On-Verfahrens eingegebene Passwort bei dem Single-Sign-On-Anbieter ist für uns weder einsehbar, noch wird es von uns gespeichert.",
      "Die Single-Sign-On-Anmeldung setzen wir im Rahmen der Vertragserfüllung und auf Grundlage der berechtigten Interessen unsererseits und der Interessen der Nutzer an einem effektiven und sicheren Anmeldesystem ein.",
      "Sollten Nutzer sich einmal entscheiden, die Verknüpfung ihres Nutzerkontos beim Single-Sign-On-Anbieter nicht mehr für das Single-Sign-On-Verfahren nutzen zu wollen, müssen sie diese Verbindung innerhalb ihres Nutzerkontos beim Single-Sign-On-Anbieter aufheben. Möchten Nutzer deren Daten bei uns löschen, können sie ihr Nutzerkonto unter „Mein Konto“ löschen.",
      {
        list: [
          {
            label: "Verarbeitete Datenarten",
            text: "Bestandsdaten (z. B. Nutzer-ID beim Single-Sign-On-Anbieter, pseudonymisierte E-Mail-Adresse); Meta-, Kommunikations- und Verfahrensdaten (z. B. Zeitangaben, Identifikationsnummern).",
          },
          {
            label: "Betroffene Personen",
            text: "Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).",
          },
          {
            label: "Zwecke der Verarbeitung und berechtigte Interessen",
            text: "Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten; Sicherheitsmaßnahmen; Anmeldeverfahren; Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.",
          },
          {
            label: "Aufbewahrung und Löschung",
            text: 'Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung". Löschung nach Kündigung.',
          },
          {
            label: "Rechtsgrundlagen",
            text: "Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO); Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).",
          },
        ],
      },
      { subheading: "Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten" },
      {
        list: [
          {
            label: "GitHub",
            text: "Anmeldung mit dem GitHub-Konto. GitHub übermittelt uns Ihre GitHub-Konto-ID, Ihren Namen, Ihre E-Mail-Adresse und die Adresse Ihres Profilbilds. Davon speichern wir nur Ihre Konto-ID und den Hash-Wert Ihrer E-Mail-Adresse; Name, Profilbild und die von GitHub ausgestellten Zugangsdaten verwerfen wir. Für eine E-Mail-Adresse kann jeweils nur eine Anmeldemethode (E-Mail oder GitHub) genutzt werden. Dienstanbieter: GitHub, Inc., USA; Rechtsgrundlagen: Vertragserfüllung (Art. 6 Abs. 1 S. 1 lit. b) DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO); Website: https://github.com; Datenschutzerklärung: https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement; Grundlage Drittlandtransfers: EU-US Data Privacy Framework (DPF).",
          },
        ],
      },
    ],
  },
  {
    id: "inhalte-und-bilder",
    heading: "Einträge, Kategorien und hochgeladene Bilder",
    blocks: [
      "Nutzer können in unserem Onlineangebot Einträge (z. B. mit Titel, Beschreibung, Elementen, Schritten, Notizen, Quelle und Bewertung) und eigene Kategorien anlegen sowie Bilder hochladen. Diese Inhalte verarbeiten wir ausschließlich, um sie den Nutzern zur Verfügung zu stellen. Sie sind nur für den jeweiligen Nutzer sichtbar.",
      "Beim Hochladen entfernen wir automatisch alle in einem Bild gespeicherten Zusatzinformationen (z. B. Aufnahmeort, Kameradaten) sowie den ursprünglichen Dateinamen. Bilder sind über ihre Adresse technisch öffentlich abrufbar; die Adresse enthält eine zufällige Zeichenfolge, ist nicht erratbar und wird von unserem Onlineangebot nur dem jeweiligen Nutzer angezeigt. Bitte laden Sie keine Bilder hoch, auf denen andere Personen ohne deren Einverständnis erkennbar sind.",
      {
        list: [
          {
            label: "Verarbeitete Datenarten",
            text: "Inhaltsdaten (z. B. Texte, Bilder sowie Zeitpunkt der Erstellung).",
          },
          {
            label: "Betroffene Personen",
            text: "Nutzer; ggf. Dritte Personen, die auf hochgeladenen Bildern erkennbar sind.",
          },
          {
            label: "Zwecke der Verarbeitung",
            text: "Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten.",
          },
          {
            label: "Aufbewahrung und Löschung",
            text: "Bis zur Löschung durch den Nutzer bzw. bis zur Löschung des Nutzerkontos.",
          },
          {
            label: "Rechtsgrundlagen",
            text: "Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).",
          },
        ],
      },
    ],
  },
  {
    id: "ki-import",
    heading: "Import von Inhalten mit künstlicher Intelligenz",
    blocks: [
      "Nutzer können die Felder eines Eintrags automatisch aus einer Website oder einem Social-Media-Beitrag (Instagram, Pinterest, Facebook, TikTok, X) befüllen lassen. Dazu ruft unser Server die angegebene Adresse ab. Dabei werden keine Daten über Sie an die abgerufene Seite übermittelt; die Anfrage stammt von unserem Server.",
      "Die angegebene Adresse und der abgerufene Inhalt werden anschließend an einen KI-Dienst übermittelt, der die Inhalte den Feldern des Eintrags zuordnet. Der Import ist freiwillig; Einträge können jederzeit auch ohne diese Funktion angelegt werden.",
      {
        list: [
          {
            label: "Verarbeitete Datenarten",
            text: "Inhaltsdaten (die angegebene Adresse und der dort abgerufene Inhalt).",
          },
          {
            label: "Betroffene Personen",
            text: "Nutzer; ggf. Dritte Personen, deren Daten im abgerufenen Inhalt enthalten sind (z. B. Autoren eines Beitrags).",
          },
          {
            label: "Zwecke der Verarbeitung",
            text: "Erbringung vertraglicher Leistungen; Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.",
          },
          {
            label: "Rechtsgrundlagen",
            text: "Vertragserfüllung (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).",
          },
          {
            label: "Anthropic",
            text: "KI-Dienst zur Zuordnung der Inhalte. Anthropic verwendet die Daten nach seinen kommerziellen Bedingungen nicht zum Training seiner Modelle. Dienstanbieter: Anthropic PBC, USA; Website: https://www.anthropic.com; Datenschutzerklärung: https://www.anthropic.com/legal/privacy; Grundlage Drittlandtransfers: Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c) DSGVO) als Bestandteil des Auftragsverarbeitungsvertrags.",
          },
        ],
      },
    ],
  },
  {
    id: "drittlaender",
    heading: "Übermittlung von Daten in Drittländer",
    blocks: [
      "Einige der von uns eingesetzten Dienstleister haben ihren Sitz in den USA (Vercel, MongoDB, GitHub, Google, Anthropic). Die Speicherung Ihrer Konto- und Inhaltsdaten erfolgt in Frankfurt am Main; ein Zugriff aus den USA ist bei diesen Anbietern jedoch nicht auszuschließen.",
      "Eine Übermittlung erfolgt nur, wenn die Voraussetzungen der Art. 44 ff. DSGVO erfüllt sind. Für die USA hat die EU-Kommission einen Angemessenheitsbeschluss für Unternehmen erlassen, die nach dem EU-US Data Privacy Framework (DPF) zertifiziert sind (Art. 45 DSGVO). Soweit ein Anbieter nicht zertifiziert ist, stützen wir die Übermittlung auf die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c) DSGVO). Die jeweilige Grundlage ist bei den einzelnen Diensten angegeben.",
    ],
  },
  {
    id: "aenderungen",
    heading: "Änderung und Aktualisierung",
    blocks: [
      "Wir bitten Sie, sich regelmäßig über den Inhalt unserer Datenschutzerklärung zu informieren. Wir passen die Datenschutzerklärung an, sobald die Änderungen der von uns durchgeführten Datenverarbeitungen dies erforderlich machen. Wir informieren Sie, sobald durch die Änderungen eine Mitwirkungshandlung Ihrerseits (z. B. Einwilligung) oder eine sonstige individuelle Benachrichtigung erforderlich wird.",
      "Sofern wir in dieser Datenschutzerklärung Adressen und Kontaktinformationen von Unternehmen und Organisationen angeben, bitten wir zu beachten, dass die Adressen sich über die Zeit ändern können und bitten die Angaben vor Kontaktaufnahme zu prüfen.",
    ],
  },
  {
    id: "begriffe",
    heading: "Begriffsdefinitionen",
    blocks: [
      "In diesem Abschnitt erhalten Sie eine Übersicht über die in dieser Datenschutzerklärung verwendeten Begrifflichkeiten. Soweit die Begrifflichkeiten gesetzlich definiert sind, gelten deren gesetzliche Definitionen. Die nachfolgenden Erläuterungen sollen dagegen vor allem dem Verständnis dienen.",
      {
        list: [
          {
            label: "Bestandsdaten",
            text: "Bestandsdaten umfassen wesentliche Informationen, die für die Identifikation und Verwaltung von Vertragspartnern, Benutzerkonten, Profilen und ähnlichen Zuordnungen notwendig sind. Diese Daten können u. a. persönliche und demografische Angaben wie Namen, Kontaktinformationen (Adressen, Telefonnummern, E-Mail-Adressen), Geburtsdaten und spezifische Identifikatoren (Benutzer-IDs) beinhalten. Bestandsdaten bilden die Grundlage für jegliche formelle Interaktion zwischen Personen und Diensten, Einrichtungen oder Systemen, indem sie eine eindeutige Zuordnung und Kommunikation ermöglichen.",
          },
          {
            label: "Inhaltsdaten",
            text: "Inhaltsdaten umfassen Informationen, die im Zuge der Erstellung, Bearbeitung und Veröffentlichung von Inhalten aller Art generiert werden. Diese Kategorie von Daten kann Texte, Bilder, Videos, Audiodateien und andere multimediale Inhalte einschließen, die auf verschiedenen Plattformen und Medien veröffentlicht werden. Inhaltsdaten sind nicht nur auf den eigentlichen Inhalt beschränkt, sondern beinhalten auch Metadaten, die Informationen über den Inhalt selbst liefern, wie Tags, Beschreibungen, Autoreninformationen und Veröffentlichungsdaten.",
          },
          {
            label: "Kontaktdaten",
            text: "Kontaktdaten sind essentielle Informationen, die die Kommunikation mit Personen oder Organisationen ermöglichen. Sie umfassen u. a. Telefonnummern, postalische Adressen und E-Mail-Adressen, sowie Kommunikationsmittel wie soziale Medien-Handles und Instant-Messaging-Identifikatoren.",
          },
          {
            label: "Meta-, Kommunikations- und Verfahrensdaten",
            text: "Meta-, Kommunikations- und Verfahrensdaten sind Kategorien, die Informationen über die Art und Weise enthalten, wie Daten verarbeitet, übermittelt und verwaltet werden. Meta-Daten, auch bekannt als Daten über Daten, umfassen Informationen, die den Kontext, die Herkunft und die Struktur anderer Daten beschreiben. Sie können Angaben zur Dateigröße, dem Erstellungsdatum, dem Autor eines Dokuments und den Änderungshistorien beinhalten. Kommunikationsdaten erfassen den Austausch von Informationen zwischen Nutzern über verschiedene Kanäle, wie E-Mail-Verkehr, Anrufprotokolle, Nachrichten in sozialen Netzwerken und Chat-Verläufe, inklusive der beteiligten Personen, Zeitstempel und Übertragungswege. Verfahrensdaten beschreiben die Prozesse und Abläufe innerhalb von Systemen oder Organisationen, einschließlich Workflow-Dokumentationen, Protokolle von Transaktionen und Aktivitäten, sowie Audit-Logs, die zur Nachverfolgung und Überprüfung von Vorgängen verwendet werden.",
          },
          {
            label: "Nutzungsdaten",
            text: "Nutzungsdaten beziehen sich auf Informationen, die erfassen, wie Nutzer mit digitalen Produkten, Dienstleistungen oder Plattformen interagieren. Diese Daten umfassen eine breite Palette von Informationen, die aufzeigen, wie Nutzer Anwendungen nutzen, welche Funktionen sie bevorzugen, wie lange sie auf bestimmten Seiten verweilen und über welche Pfade sie durch eine Anwendung navigieren. Nutzungsdaten können auch die Häufigkeit der Nutzung, Zeitstempel von Aktivitäten, IP-Adressen, Geräteinformationen und Standortdaten einschließen.",
          },
          {
            label: "Personenbezogene Daten",
            text: '"Personenbezogene Daten" sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden "betroffene Person") beziehen; als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung (z. B. Cookie) oder zu einem oder mehreren besonderen Merkmalen identifiziert werden kann, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind.',
          },
          {
            label: "Protokolldaten",
            text: "Protokolldaten sind Informationen über Ereignisse oder Aktivitäten, die in einem System oder Netzwerk protokolliert wurden. Diese Daten enthalten typischerweise Informationen wie Zeitstempel, IP-Adressen, Benutzeraktionen, Fehlermeldungen und andere Details über die Nutzung oder den Betrieb eines Systems. Protokolldaten werden oft zur Analyse von Systemproblemen, zur Sicherheitsüberwachung oder zur Erstellung von Leistungsberichten verwendet.",
          },
          {
            label: "Pseudonymisierung",
            text: 'Die Verarbeitung personenbezogener Daten in einer Weise, dass die Daten ohne Hinzuziehung zusätzlicher Informationen (hier: eines geheimen Schlüssels) nicht mehr einer spezifisch betroffenen Person zugeordnet werden können (Art. 4 Nr. 5 DSGVO). Pseudonymisierte Daten bleiben personenbezogene Daten.',
          },
          {
            label: "Verantwortlicher",
            text: 'Als "Verantwortlicher" wird die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet, bezeichnet.',
          },
          {
            label: "Verarbeitung",
            text: '"Verarbeitung" ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten. Der Begriff reicht weit und umfasst praktisch jeden Umgang mit Daten, sei es das Erheben, das Auswerten, das Speichern, das Übermitteln oder das Löschen.',
          },
        ],
      },
      { link: { href: GENERATOR_LINK.href, text: GENERATOR_LINK.de } },
    ],
  },
];

const en = [
  {
    id: "preamble",
    heading: "Preamble",
    blocks: [
      'With the following privacy policy, we would like to inform you which types of your personal data (hereinafter also referred to as "data") we process, for which purposes and to what extent. The privacy policy applies to all processing of personal data carried out by us in connection with this web app (hereinafter referred to as "online offering").',
      "The terms used are not gender-specific.",
    ],
  },
  {
    id: "controller",
    heading: "Controller",
    blocks: [{ contact: true }],
  },
  {
    id: "overview",
    heading: "Overview of processing",
    blocks: [
      "The following overview summarises the types of data processed and the purposes of their processing and refers to the data subjects.",
      { subheading: "Types of data processed" },
      {
        list: [
          "Inventory data.",
          "Contact data.",
          "Content data.",
          "Usage data.",
          "Meta, communication and process data.",
          "Log data.",
        ],
      },
      { subheading: "Categories of data subjects" },
      { list: ["Users."] },
      { subheading: "Purposes of processing" },
      {
        list: [
          "Provision of contractual services and fulfilment of contractual obligations.",
          "Security measures.",
          "Sign-in procedures.",
          "Provision of our online offering and usability.",
          "Information technology infrastructure.",
        ],
      },
    ],
  },
  {
    id: "legal-bases",
    heading: "Relevant legal bases",
    blocks: [
      "Relevant legal bases according to the GDPR: Below is an overview of the legal bases of the GDPR on which we process personal data. Please note that, in addition to the provisions of the GDPR, national data protection regulations may apply in your or our country of residence or domicile. If more specific legal bases apply in individual cases, we will inform you of these in this privacy policy.",
      {
        list: [
          {
            label: "Performance of a contract and pre-contractual requests (Art. 6(1)(b) GDPR)",
            text: "Processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract.",
          },
          {
            label: "Legitimate interests (Art. 6(1)(f) GDPR)",
            text: "Processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data.",
          },
        ],
      },
      "National data protection regulations in Germany: In addition to the GDPR, national data protection regulations apply in Germany, in particular the Federal Data Protection Act (BDSG). The BDSG contains special provisions on the right of access, the right to erasure, the right to object, the processing of special categories of personal data, processing for other purposes and transfers, as well as automated individual decision-making including profiling. State data protection laws may also apply. The storage of information on your device (e.g. cookies) is additionally governed by the Telecommunications Digital Services Data Protection Act (TDDDG).",
    ],
  },
  {
    id: "security",
    heading: "Security measures",
    blocks: [
      "In accordance with the legal requirements and taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the varying likelihood and severity of the risk to the rights and freedoms of natural persons, we take appropriate technical and organisational measures to ensure a level of protection appropriate to the risk.",
      "These measures include, in particular, safeguarding the confidentiality, integrity and availability of data by controlling physical and electronic access to the data as well as access to, input, transfer, availability and separation of the data. We have also established procedures that ensure the exercise of data subject rights, the erasure of data and responses to data breaches. Furthermore, we take the protection of personal data into account when developing or selecting hardware, software and procedures, in line with the principles of data protection by design and by default.",
      {
        list: [
          {
            label: "Securing online connections with TLS/SSL encryption (HTTPS)",
            text: "To protect the data of users transmitted via our online services from unauthorised access, we use TLS/SSL encryption. These technologies encrypt the information transmitted between the website or app and the user's browser (or between two servers), protecting the data from unauthorised access. When a website is secured by an SSL/TLS certificate, this is indicated by HTTPS in the URL.",
          },
          {
            label: "Pseudonymisation of email addresses",
            text: "We do not store email addresses in plain text but only as a non-reversible hash (HMAC-SHA256 with a secret key). This allows us to recognise you when you sign in without keeping your email address in our database. The email address cannot be recovered from the stored value.",
          },
          {
            label: "Data minimisation",
            text: "We only store data that is required for the features of the online offering. Additional data we receive when you sign in with GitHub (name, profile picture, access tokens) is discarded immediately. We remove embedded additional information (e.g. location, camera details) and the original filename from uploaded images. Email addresses are automatically removed from technical error logs.",
          },
        ],
      },
    ],
  },
  {
    id: "retention",
    heading: "General information on data retention and deletion",
    blocks: [
      "We delete the personal data we process in accordance with the legal provisions as soon as there is no longer a legal basis for the processing. This applies to cases in which the original purpose of processing no longer applies or the data is no longer needed. Exceptions to this rule exist where legal obligations or special interests require longer retention or archiving.",
      "As we do not offer any paid services, there are no retention obligations under commercial or tax law for the data processed in this online offering. The following periods apply:",
      {
        list: [
          {
            label: "User account and content",
            text: "for as long as the user account exists. If you delete your account, all associated data including uploaded images is deleted immediately. Individual entries and images are deleted as soon as you delete them yourself.",
          },
          {
            label: "Sign-in links",
            text: "are valid for 24 hours, are used up when signing in and are deleted automatically after they expire.",
          },
          {
            label: "Server log files",
            text: "are stored for a maximum of 30 days and then deleted or anonymised.",
          },
        ],
      },
      "Our privacy notices contain additional information on the retention and deletion of data that applies specifically to certain processing operations.",
    ],
  },
  {
    id: "rights",
    heading: "Rights of data subjects",
    blocks: [
      "Rights of data subjects under the GDPR: As a data subject, you have various rights under the GDPR, which arise in particular from Art. 15 to 21 GDPR:",
      {
        list: [
          {
            label: "Right to object",
            text: "You have the right to object at any time, on grounds relating to your particular situation, to the processing of personal data concerning you which is based on Art. 6(1)(e) or (f) GDPR; this also applies to profiling based on these provisions.",
          },
          {
            label: "Right of access",
            text: "You have the right to obtain confirmation as to whether data concerning you is being processed and to access this data as well as further information and a copy of the data in accordance with the legal requirements.",
          },
          {
            label: "Right to rectification",
            text: "In accordance with the legal requirements, you have the right to request the completion of data concerning you or the rectification of inaccurate data concerning you.",
          },
          {
            label: "Right to erasure and restriction of processing",
            text: "In accordance with the legal requirements, you have the right to request that data concerning you be erased without delay or, alternatively, to request the restriction of the processing of the data.",
          },
          {
            label: "Right to data portability",
            text: "You have the right to receive data concerning you that you have provided to us in a structured, commonly used and machine-readable format in accordance with the legal requirements, or to request its transmission to another controller.",
          },
          {
            label: "Right to lodge a complaint with a supervisory authority",
            text: "Without prejudice to any other administrative or judicial remedy, you have the right to lodge a complaint with a data protection supervisory authority if you consider that the processing of your personal data infringes the GDPR. The complaint can be lodged in particular with a supervisory authority in the member state of your habitual residence, your place of work or the place of the alleged infringement.",
          },
        ],
      },
      'You can exercise many of these rights directly in our online offering: under "My account" you can download all data stored for your account as a file (access, data portability) and delete your account with all its data (erasure). You can edit your entries at any time (rectification). For anything else, simply send an email to the address above.',
    ],
  },
  {
    id: "hosting",
    heading: "Provision of the online offering and web hosting",
    blocks: [
      "We process users' data in order to provide our online services to them. For this purpose, we process the user's IP address, which is necessary to transmit the content and features of our online services to the user's browser or device.",
      {
        list: [
          {
            label: "Types of data processed",
            text: "Usage data (e.g. pages accessed, device types, operating systems and browsers used); meta, communication and process data (e.g. IP addresses, time information, identification numbers); log data (e.g. log files relating to sign-ins, data access or access times).",
          },
          {
            label: "Data subjects",
            text: "Users (e.g. website visitors, users of online services).",
          },
          {
            label: "Purposes of processing and legitimate interests",
            text: "Provision of our online offering and usability; information technology infrastructure (operation and provision of information systems and technical devices); security measures.",
          },
          {
            label: "Retention and deletion",
            text: 'Deletion in accordance with the information in the section "General information on data retention and deletion".',
          },
          {
            label: "Legal bases",
            text: "Legitimate interests (Art. 6(1)(f) GDPR).",
          },
        ],
      },
      { subheading: "Further information on processing operations, procedures and services" },
      {
        list: [
          {
            label: "Provision of the online offering on rented storage space",
            text: 'To provide our online offering, we use storage space, computing capacity and software that we rent or otherwise obtain from a corresponding server provider (also called "web host"); legal bases: legitimate interests (Art. 6(1)(f) GDPR).',
          },
          {
            label: "Collection of access data and log files",
            text: 'Access to our online offering is logged in the form of so-called "server log files". Server log files may include the address and name of the web pages and files accessed, date and time of access, data volumes transferred, notification of successful access, browser type and version, the user\'s operating system, referrer URL (the previously visited page) and, as a rule, IP addresses and the requesting provider. Server log files can be used for security purposes, e.g. to prevent server overload (especially in the case of abusive attacks, so-called DDoS attacks), and to ensure server load and stability; legal bases: legitimate interests (Art. 6(1)(f) GDPR). Deletion of data: log file information is stored for a maximum of 30 days and then deleted or anonymised. Data whose further retention is required for evidence purposes is excluded from deletion until the respective incident has been finally clarified.',
          },
          {
            label: "Content delivery network",
            text: 'We use a "content delivery network" (CDN). A CDN is a service that helps deliver content of an online offering, especially large media files such as graphics or program scripts, faster and more securely using regionally distributed servers connected via the internet; legal bases: legitimate interests (Art. 6(1)(f) GDPR).',
          },
          {
            label: "Vercel",
            text: "Hosting of the online offering, content delivery network and storage for uploaded images (Vercel Blob). The server functions and the image storage are located in Frankfurt am Main, Germany. Service provider: Vercel Inc., USA; legal bases: legitimate interests (Art. 6(1)(f) GDPR), performance of a contract (Art. 6(1)(b) GDPR); website: https://vercel.com; privacy policy: https://vercel.com/legal/privacy-policy; data processing agreement: https://vercel.com/legal/dpa; basis for third-country transfers: EU-US Data Privacy Framework (DPF).",
          },
          {
            label: "MongoDB Atlas",
            text: "Database in which user accounts, entries, categories and settings are stored. The database runs on Amazon Web Services servers in Frankfurt am Main, Germany. Service provider: MongoDB, Inc., USA; legal bases: performance of a contract (Art. 6(1)(b) GDPR); website: https://www.mongodb.com/atlas; privacy policy: https://www.mongodb.com/legal/privacy/privacy-policy; data processing agreement: https://www.mongodb.com/legal/data-processing-agreement; basis for third-country transfers: EU-US Data Privacy Framework (DPF).",
          },
        ],
      },
    ],
  },
  {
    id: "cookies",
    heading: "Use of cookies",
    blocks: [
      'The term "cookies" refers to functions that store information on users\' devices and read it from them. Cookies can be used for various purposes, such as the functionality, security and convenience of online offerings and the analysis of visitor flows.',
      "We only use cookies that are strictly necessary to provide the features you have explicitly requested (Section 25(2) no. 2 TDDDG). No consent is required for this. We do not use cookies for analytics, marketing or tracking purposes.",
      {
        list: [
          {
            label: "Sign-in cookies (next-auth.*)",
            text: "keep you signed in, protect forms against misuse (CSRF protection) and secure the sign-in with GitHub. They are deleted when you sign out or when the session expires (at most 30 days).",
          },
          {
            label: "Language cookie (locale)",
            text: "stores your selected language for one year.",
          },
        ],
      },
      'For short notices (e.g. "Successfully logged out"), the online offering also uses your browser\'s session storage, which is cleared when you close the tab.',
      "General information on objection (opt-out): Users can delete or block cookies via their browser's privacy settings. However, signing in is not possible without sign-in cookies.",
      {
        list: [
          {
            label: "Types of data processed",
            text: "Meta, communication and process data (e.g. identification numbers, time information).",
          },
          {
            label: "Data subjects",
            text: "Users (e.g. website visitors, users of online services).",
          },
          {
            label: "Legal bases",
            text: "Section 25(2) no. 2 TDDDG; performance of a contract (Art. 6(1)(b) GDPR); legitimate interests (Art. 6(1)(f) GDPR).",
          },
        ],
      },
    ],
  },
  {
    id: "user-account",
    heading: "Registration, sign-in and user account",
    blocks: [
      "Users can create a user account by signing in for the first time with their email address (via a sign-in link) or with their GitHub account. No username or password is assigned. The data is processed for the purpose of providing the user account on the basis of the fulfilment of contractual obligations.",
      'We do not store your email address in plain text but only as a non-reversible hash (see "Security measures"). We do not store IP addresses ourselves; access is only logged in the server log files of our hosting provider (see "Provision of the online offering and web hosting").',
      {
        list: [
          {
            label: "Types of data processed",
            text: "Inventory data (user ID, pseudonymised email address, GitHub account ID when signing in with GitHub); contact data (email address, solely for sending the sign-in link); content data (entries, categories and images created by users); usage data (e.g. selected language); log data (e.g. log files relating to sign-ins).",
          },
          {
            label: "Data subjects",
            text: "Users (e.g. website visitors, users of online services).",
          },
          {
            label: "Purposes of processing and legitimate interests",
            text: "Provision of contractual services and fulfilment of contractual obligations; security measures; sign-in procedures; provision of our online offering and usability.",
          },
          {
            label: "Retention and deletion",
            text: 'Deletion in accordance with the information in the section "General information on data retention and deletion". Deletion after termination.',
          },
          {
            label: "Legal bases",
            text: "Performance of a contract and pre-contractual requests (Art. 6(1)(b) GDPR); legitimate interests (Art. 6(1)(f) GDPR).",
          },
        ],
      },
      { subheading: "Further information on processing operations, procedures and services" },
      {
        list: [
          {
            label: "Registration with pseudonyms",
            text: "Providing a real name is not required; legal bases: performance of a contract and pre-contractual requests (Art. 6(1)(b) GDPR).",
          },
          {
            label: "User profiles are not public",
            text: "Users' profiles and entries are not publicly visible or accessible.",
          },
          {
            label: "Sign-in via email link",
            text: "When signing in by email, we send a sign-in link to the email address provided, which is valid for 24 hours and can only be used once. It is sent via the Gmail email service. Service provider: Google Ireland Limited, Ireland, parent company: Google LLC, USA; legal bases: performance of a contract (Art. 6(1)(b) GDPR); privacy policy: https://policies.google.com/privacy; basis for third-country transfers: EU-US Data Privacy Framework (DPF).",
          },
          {
            label: "Deletion of data after termination",
            text: 'Users can delete their user account at any time under "My account". All data relating to the user account, including entries, categories, settings and uploaded images, is deleted immediately; legal bases: performance of a contract and pre-contractual requests (Art. 6(1)(b) GDPR).',
          },
          {
            label: "No obligation to retain data",
            text: 'It is the responsibility of users to back up their data before deleting their user account (e.g. via the data export under "My account"). We are entitled to irretrievably delete all user data stored during the term of the contract; legal bases: performance of a contract and pre-contractual requests (Art. 6(1)(b) GDPR).',
          },
        ],
      },
    ],
  },
  {
    id: "single-sign-on",
    heading: "Single sign-on",
    blocks: [
      '"Single sign-on" refers to procedures that allow users to sign in to our online offering using a user account with a single sign-on provider. A prerequisite for single sign-on authentication is that users are registered with the respective single sign-on provider and enter the required credentials in the online form provided for this purpose, or are already signed in with the single sign-on provider and confirm the single sign-on via a button.',
      "Authentication takes place directly with the respective single sign-on provider. As part of such authentication, we receive a user ID with the information that the user is signed in with the respective single sign-on provider under this user ID. Whether additional data is transmitted to us depends solely on the single sign-on procedure used, on the data releases chosen during authentication and on which data users have released in the privacy or other settings of their account with the single sign-on provider. The password entered with the single sign-on provider is neither visible to us nor stored by us.",
      "We use single sign-on as part of the performance of the contract and on the basis of our legitimate interests and the interests of users in an effective and secure sign-in system.",
      'If users decide that they no longer want to use the link of their account with the single sign-on provider for single sign-on, they must remove this connection within their account with the single sign-on provider. If users want to delete their data with us, they can delete their user account under "My account".',
      {
        list: [
          {
            label: "Types of data processed",
            text: "Inventory data (e.g. user ID with the single sign-on provider, pseudonymised email address); meta, communication and process data (e.g. time information, identification numbers).",
          },
          {
            label: "Data subjects",
            text: "Users (e.g. website visitors, users of online services).",
          },
          {
            label: "Purposes of processing and legitimate interests",
            text: "Provision of contractual services and fulfilment of contractual obligations; security measures; sign-in procedures; provision of our online offering and usability.",
          },
          {
            label: "Retention and deletion",
            text: 'Deletion in accordance with the information in the section "General information on data retention and deletion". Deletion after termination.',
          },
          {
            label: "Legal bases",
            text: "Performance of a contract and pre-contractual requests (Art. 6(1)(b) GDPR); legitimate interests (Art. 6(1)(f) GDPR).",
          },
        ],
      },
      { subheading: "Further information on processing operations, procedures and services" },
      {
        list: [
          {
            label: "GitHub",
            text: "Sign-in with your GitHub account. GitHub sends us your GitHub account ID, your name, your email address and the address of your profile picture. Of these, we only store your account ID and the hash of your email address; we discard your name, profile picture and the credentials issued by GitHub. Only one sign-in method (email or GitHub) can be used per email address. Service provider: GitHub, Inc., USA; legal bases: performance of a contract (Art. 6(1)(b) GDPR), legitimate interests (Art. 6(1)(f) GDPR); website: https://github.com; privacy policy: https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement; basis for third-country transfers: EU-US Data Privacy Framework (DPF).",
          },
        ],
      },
    ],
  },
  {
    id: "content-and-images",
    heading: "Entries, categories and uploaded images",
    blocks: [
      "Users can create entries (e.g. with title, description, items, steps, notes, source and rating) and their own categories in our online offering and upload images. We process this content solely to provide it to users. It is only visible to the respective user.",
      "When images are uploaded, we automatically remove all additional information stored in them (e.g. location, camera details) as well as the original filename. Images can technically be accessed publicly via their address; the address contains a random string, cannot be guessed and is only shown to the respective user by our online offering. Please do not upload images in which other people can be recognised without their consent.",
      {
        list: [
          {
            label: "Types of data processed",
            text: "Content data (e.g. texts, images and time of creation).",
          },
          {
            label: "Data subjects",
            text: "Users; where applicable, third parties recognisable in uploaded images.",
          },
          {
            label: "Purposes of processing",
            text: "Provision of contractual services and fulfilment of contractual obligations.",
          },
          {
            label: "Retention and deletion",
            text: "Until deleted by the user or until the user account is deleted.",
          },
          {
            label: "Legal bases",
            text: "Performance of a contract and pre-contractual requests (Art. 6(1)(b) GDPR).",
          },
        ],
      },
    ],
  },
  {
    id: "ai-import",
    heading: "Importing content with artificial intelligence",
    blocks: [
      "Users can have the fields of an entry filled in automatically from a website or a social media post (Instagram, Pinterest, Facebook, TikTok, X). For this purpose, our server retrieves the address entered. No data about you is sent to the retrieved page; the request comes from our server.",
      "The address entered and the retrieved content are then sent to an AI service that maps the content to the fields of the entry. Using the import is optional; entries can always be created without this feature.",
      {
        list: [
          {
            label: "Types of data processed",
            text: "Content data (the address entered and the content retrieved from it).",
          },
          {
            label: "Data subjects",
            text: "Users; where applicable, third parties whose data is contained in the retrieved content (e.g. authors of a post).",
          },
          {
            label: "Purposes of processing",
            text: "Provision of contractual services; provision of our online offering and usability.",
          },
          {
            label: "Legal bases",
            text: "Performance of a contract (Art. 6(1)(b) GDPR).",
          },
          {
            label: "Anthropic",
            text: "AI service for mapping the content. Under its commercial terms, Anthropic does not use the data to train its models. Service provider: Anthropic PBC, USA; website: https://www.anthropic.com; privacy policy: https://www.anthropic.com/legal/privacy; basis for third-country transfers: standard contractual clauses of the EU Commission (Art. 46(2)(c) GDPR) as part of the data processing agreement.",
          },
        ],
      },
    ],
  },
  {
    id: "third-countries",
    heading: "Transfer of data to third countries",
    blocks: [
      "Some of the service providers we use are based in the USA (Vercel, MongoDB, GitHub, Google, Anthropic). Your account and content data is stored in Frankfurt am Main, Germany; however, access from the USA cannot be ruled out with these providers.",
      "Data is only transferred if the requirements of Art. 44 et seq. GDPR are met. For the USA, the EU Commission has adopted an adequacy decision for companies certified under the EU-US Data Privacy Framework (DPF) (Art. 45 GDPR). Where a provider is not certified, we base the transfer on the EU Commission's standard contractual clauses (Art. 46(2)(c) GDPR). The respective basis is stated for each service.",
    ],
  },
  {
    id: "changes",
    heading: "Changes and updates",
    blocks: [
      "We ask you to inform yourself regularly about the content of our privacy policy. We will adapt the privacy policy as soon as changes to the data processing we carry out make this necessary. We will inform you as soon as the changes require an action on your part (e.g. consent) or other individual notification.",
      "Where we provide addresses and contact information of companies and organisations in this privacy policy, please note that addresses may change over time and please check the information before contacting them.",
    ],
  },
  {
    id: "definitions",
    heading: "Definitions",
    blocks: [
      "This section provides an overview of the terms used in this privacy policy. Where terms are defined by law, their legal definitions apply. The following explanations are primarily intended to aid understanding.",
      {
        list: [
          {
            label: "Inventory data",
            text: "Inventory data comprises essential information required to identify and manage contractual partners, user accounts, profiles and similar assignments. This data may include personal and demographic information such as names, contact information (addresses, telephone numbers, email addresses), dates of birth and specific identifiers (user IDs).",
          },
          {
            label: "Content data",
            text: "Content data comprises information generated in the course of creating, editing and publishing content of all kinds, such as texts, images, videos and audio files, including metadata such as tags, descriptions, author information and publication dates.",
          },
          {
            label: "Contact data",
            text: "Contact data is information that enables communication with people or organisations, such as telephone numbers, postal addresses and email addresses, as well as social media handles and instant messaging identifiers.",
          },
          {
            label: "Meta, communication and process data",
            text: "Meta, communication and process data contain information about how data is processed, transmitted and managed. Metadata describes the context, origin and structure of other data. Communication data records the exchange of information between users via various channels, including the people involved, timestamps and transmission routes. Process data describes processes and workflows within systems or organisations, including logs of transactions and activities and audit logs.",
          },
          {
            label: "Usage data",
            text: "Usage data refers to information that records how users interact with digital products, services or platforms, such as the features used, pages visited, frequency of use, timestamps of activities, IP addresses and device information.",
          },
          {
            label: "Personal data",
            text: '"Personal data" means any information relating to an identified or identifiable natural person ("data subject"); an identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier (e.g. cookie) or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person.',
          },
          {
            label: "Log data",
            text: "Log data is information about events or activities logged in a system or network, typically including timestamps, IP addresses, user actions, error messages and other details about the use or operation of a system.",
          },
          {
            label: "Pseudonymisation",
            text: "The processing of personal data in such a manner that the data can no longer be attributed to a specific data subject without the use of additional information (here: a secret key) (Art. 4(5) GDPR). Pseudonymised data remains personal data.",
          },
          {
            label: "Controller",
            text: 'The "controller" is the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data.',
          },
          {
            label: "Processing",
            text: '"Processing" means any operation or set of operations performed on personal data, whether or not by automated means, such as collection, analysis, storage, transmission or erasure.',
          },
        ],
      },
      { link: { href: GENERATOR_LINK.href, text: GENERATOR_LINK.en } },
    ],
  },
];

export const PRIVACY_POLICY = { de, en };
