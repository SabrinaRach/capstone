import { Html, Head, Main, NextScript } from "next/document";
import { THEME_INIT_SCRIPT, themeFromCookieHeader } from "../lib/theme.js";

function localeFromCookieHeader(cookieHeader) {
  const match = cookieHeader?.match(/(?:^|; )locale=([^;]+)/);

  return match?.[1] === "en" ? "en" : "de";
}

export default function Document({ locale, theme }) {
  return (
    <Html
      lang={locale}
      data-theme={theme === "system" ? undefined : theme}
    >
      <Head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx) => {
  const initialProps = await ctx.defaultGetInitialProps(ctx);

  return {
    ...initialProps,
    locale: localeFromCookieHeader(ctx.req?.headers?.cookie),
    theme: themeFromCookieHeader(ctx.req?.headers?.cookie),
  };
};
