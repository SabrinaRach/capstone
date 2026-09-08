import AnimationVortex from "@/components/AnimationVortex";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-background dark:bg-foreground sm:items-start">
      <AnimationVortex />
    </main>
  );
}
