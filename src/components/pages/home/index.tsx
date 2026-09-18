import { useEffect, useState } from "react";
import { MorrowField } from "@/components/pages/home/morrow-field";
import { WorkshopHome } from "@/components/pages/home/workshop";

const OVERRIDE_STORAGE_KEY = "lac_grove_override";

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
  return <WorkshopHome />;
};
