import LegalDocument from "@/components/LegalDocument";
import { useI18n } from "@/lib/i18n/I18nContext";
import { PRIVACY_POLICY } from "@/lib/privacyPolicy";

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <LegalDocument
      title={t("legal.privacyPolicy")}
      content={PRIVACY_POLICY}
      showTableOfContents
    />
  );
}
