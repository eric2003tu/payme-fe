import Hero from "@/features/about/Hero";
import MissionVision from "@/features/about/MissionVision";
import CoreValues from "@/features/about/CoreValues";
import JourneyTimeline from "@/features/about/JourneyTimeline";
import LeadershipTeam from "@/features/about/LeadershipTeam";
import StatsStrip from "@/features/about/StatsStrip";
import CtaBanner from "@/features/about/CtaBanner";

export default function AboutPage() {
  return (
    <section className="min-h-[100dvh] bg-gradient-to-b from-white to-slate-50">
      <Hero />
      <MissionVision />
      <CoreValues />
      <JourneyTimeline />
      <LeadershipTeam />
      <StatsStrip />
      <CtaBanner />
    </section>
  );
}