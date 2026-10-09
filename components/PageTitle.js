import Head from "next/head";

export const APP_NAME = "OrgaNice";

// Sets the document title, which screen readers announce when a page opens.
export default function PageTitle({ title }) {
  return (
    <Head>
      <title>{title ? `${title} – ${APP_NAME}` : APP_NAME}</title>
    </Head>
  );
}
