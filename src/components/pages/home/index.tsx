import { useEffect, useState } from "react";
import { Home } from "@/components/pages/home/home";
import { MorrowField } from "@/components/pages/home/morrow-field";

const OVERRIDE_STORAGE_KEY = "lac_grove_override";

// Morrow Field (the 3D world) is strictly opt-in — the classic home is
// always the default, regardless of env vars. Query param opts in and is
// remembered in localStorage for the browser.
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
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const override = readOverride();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(override ?? false);
  }, []);

  if (enabled) return <MorrowField />;
  return <Home />;
};
