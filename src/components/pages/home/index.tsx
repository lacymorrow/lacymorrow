import { BrickMarquee } from "@/components/blocks/brick-marquee";
import { FleetHero } from "@/components/pages/home/aurora/hero";
import CurrentlyWorking from "@/components/pages/home/currently_working";
import { MorrowField } from "@/components/pages/home/morrow-field";
import PastProjects from "@/components/pages/home/past_projects";

const GROVE_ENABLED = process.env.NEXT_PUBLIC_FEATURE_GROVE_ENABLED === "true";

export const HomeContent = () => {
  if (GROVE_ENABLED) return <MorrowField />;
  return (
    <>
      <FleetHero />
      <CurrentlyWorking />
      <PastProjects />
      <BrickMarquee />
    </>
  );
};
