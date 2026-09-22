import { Html, Head, Main, NextScript } from "next/document";

function localeFromCookieHeader(cookieHeader) {
  const match = cookieHeader?.match(/(?:^|; )locale=([^;]+)/);

  return match?.[1] === "en" ? "en" : "de";
}

export default function Document({ locale }) {
  return (
    <Html lang={locale}>
      <Head />
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
  };
};
