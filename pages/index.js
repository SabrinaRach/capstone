import AnimationVortex from "@/components/AnimationVortex";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background dark:bg-foreground sm:items-start">
      

      <div className="w-full max-w-[600px] px-4 sm:px-6">
        <AnimationVortex />
      </div>
    </main>
  );
}
