import { useEffect, useState } from "react";
import { BrickMarquee } from "@/components/blocks/brick-marquee";
import { FleetHero } from "@/components/pages/home/aurora/hero";
import CurrentlyWorking from "@/components/pages/home/currently_working";
import { MorrowField } from "@/components/pages/home/morrow-field";
import PastProjects from "@/components/pages/home/past_projects";

const GROVE_ENV_ENABLED =
  process.env.NEXT_PUBLIC_FEATURE_GROVE_ENABLED === "true";

const OVERRIDE_STORAGE_KEY = "lac_grove_override";

// Preview override: allows toggling the Grove flag on any deploy without
// changing Vercel env vars. Query param takes precedence and is remembered
// in localStorage for the browser.
//   ?grove=1     → force on
//   ?grove=0     → force off
//   ?grove=reset → clear the override
const readOverride = (): boolean | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("grove");
    if (raw === "reset") {
      window.localStorage.removeItem(OVERRIDE_STORAGE_KEY);
      return null;
    }
    if (raw === "1") {
      window.localStorage.setItem(OVERRIDE_STORAGE_KEY, "1");
      return true;
    }
    if (raw === "0") {
      window.localStorage.setItem(OVERRIDE_STORAGE_KEY, "0");
      return false;
    }
    const stored = window.localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
    return null;
  } catch {
    return null;
  }
};

export const HomeContent = () => {
  const [enabled, setEnabled] = useState(GROVE_ENV_ENABLED);

  useEffect(() => {
    const override = readOverride();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(override ?? GROVE_ENV_ENABLED);
  }, []);

  if (enabled) return <MorrowField />;
  return (
    <>
      <FleetHero />
      <CurrentlyWorking />
      <PastProjects />
      <BrickMarquee />
    </>
  );
};
