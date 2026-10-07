import LegalDocument from "@/components/LegalDocument";
import { useI18n } from "@/lib/i18n/I18nContext";
import { IMPRINT } from "@/lib/legal";

export default function ImprintPage() {
  const { t } = useI18n();

  return <LegalDocument title={t("legal.imprint")} content={IMPRINT} />;
}
