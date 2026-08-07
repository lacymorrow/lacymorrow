"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { MOOD_THEME } from "@/config/mood";
import { useMood } from "@/context/mood-provider";

/**
 * Couples the mood axis to next-themes (aurora→dark, daybreak→light).
 *
 * Must be rendered *inside* a page body — next-themes' ThemeProvider lives
 * inside the Nextra layout, which is a child of `_app.mdx`, so `useTheme()`
 * is only valid below it. Render one `<MoodSync />` in each bespoke face.
 */
export function MoodSync() {
  const { mood } = useMood();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(MOOD_THEME[mood]);
  }, [mood, setTheme]);

  return null;
}
