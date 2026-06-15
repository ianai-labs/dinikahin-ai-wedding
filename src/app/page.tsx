import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TestimonialCarousel } from "@/components/landing/TestimonialCarousel";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <HowItWorks />
      <TestimonialCarousel />
      <CTASection />
    </>
  );
}
