import { useState } from "react";
import AnimationVortex from "@/components/AnimationVortex";
import Login from "@components/Login";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background dark:bg-foreground sm:items-start">
      <div className="w-full max-w-[600px] px-4 sm:px-6">
        <AnimationVortex onAnimationComplete={() => setShowLogin(true)} />
        {showLogin && <Login />}
      </div>
    </main>
  );
}
