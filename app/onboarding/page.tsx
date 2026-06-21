import OnboardingCarousel from "@/components/onboarding/OnboardingCarousel";

export default function OnboardingPage() {
  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        maxWidth: 430,
        margin: "0 auto",
        background: "white",
      }}
    >
      <OnboardingCarousel />
    </main>
  );
}
