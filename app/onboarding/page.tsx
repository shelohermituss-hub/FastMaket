import OnboardingCarousel from "@/components/onboarding/OnboardingCarousel";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function OnboardingPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-white dark:bg-gray-950">
      <ThemeToggle />
      <OnboardingCarousel />
    </main>
  );
}
