import { useState } from "react";
import AnimationVortex from "@/components/AnimationVortex";
import Login from "@/components/Login";
import PageTitle, { APP_NAME } from "@/components/PageTitle";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function Home() {
  const { t } = useI18n();
  // null until the animation is done; then whether the login form should
  // take over the focus (not when it's shown right away for reduced motion).
  const [login, setLogin] = useState(null);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background sm:items-start">
      <PageTitle title={t("login.pageTitle")} />
      {/* The visible content starts with the animation; screen readers get
          the app name as the page heading. */}
      <h1 className="sr-only">{APP_NAME}</h1>

      <div className="w-full max-w-[600px] px-4 sm:px-6">
        <AnimationVortex
          onAnimationComplete={({ reducedMotion }) =>
            setLogin({ focus: !reducedMotion })
          }
        />
        {login && (
          <div className="fixed inset-x-0 bottom-8 z-10 flex justify-center px-4">
            <Login focusOnMount={login.focus} />
          </div>
        )}
      </div>
    </main>
  );
}
