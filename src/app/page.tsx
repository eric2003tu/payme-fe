"use client";
import Hero from "@/features/home/Hero";
import KpiGrid from "@/features/home/KpiGrid";
import HowItWorks from "@/features/home/HowItWorks";
import MobileAppPreview from "@/features/home/MobileAppPreview";
import Guides from "@/features/home/Guides";
import FeaturesSection from "@/features/home/FeaturesSection";
import Testimonials from "@/features/home/Testimonials";
import FinalCta from "@/features/home/FinalCta";

export default function Home() {
  return (
    <section className="min-h-[100dvh] overflow-hidden">
      <div className="relative isolate">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-20"
          style={{
            background:
              "radial-gradient(600px circle at 20% 20%, var(--brand-pink), transparent), radial-gradient(700px circle at 80% 30%, var(--brand-blue), transparent)",
          }}
        />

        <Hero />
        <KpiGrid />
        <HowItWorks />
        <MobileAppPreview />
        <Guides />
        <FeaturesSection />
        <Testimonials />
        <FinalCta />
      </div>
    </section>
  );
}