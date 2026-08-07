"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";

import {
  DEFAULT_MOOD,
  MOOD_EXPLICIT_KEY,
  MOOD_PALETTE,
  MOOD_STORAGE_KEY,
  moodForPath,
  otherMood,
  type Mood,
} from "@/config/mood";

/**
 * The mood is stored on the `data-mood` attribute of <html> (set before paint
 * by the no-flash script in _document). We treat that attribute as an external
 * store and read it via useSyncExternalStore — no setState-in-effect, and no
 * hydration mismatch (the server snapshot is the default mood).
 */
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot(): Mood {
  return (document.documentElement.getAttribute("data-mood") as Mood | null) ?? DEFAULT_MOOD;
}

function getServerSnapshot(): Mood {
  return DEFAULT_MOOD;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Write the mood to the DOM (data-mood + chrome color) and notify subscribers. */
function applyMoodToDom(mood: Mood) {
  document.documentElement.setAttribute("data-mood", mood);
  const { themeColor } = MOOD_PALETTE[mood];
  setMeta("theme-color", themeColor);
  setMeta("msapplication-TileColor", themeColor);
  emit();
}

function readExplicit(): boolean {
  try {
    return localStorage.getItem(MOOD_EXPLICIT_KEY) === "1";
  } catch {
    return false;
  }
}

interface MoodContextValue {
  mood: Mood;
  /** Set the mood. `explicit` marks a deliberate choice that persists across routes. */
  setMood: (mood: Mood, opts?: { explicit?: boolean }) => void;
  /** Flip mood and mark it explicit (the dial). */
  toggle: () => void;
}

const MoodContext = createContext<MoodContextValue | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const mood = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMood = useCallback((next: Mood, opts?: { explicit?: boolean }) => {
    applyMoodToDom(next);
    try {
      localStorage.setItem(MOOD_STORAGE_KEY, next);
      if (opts?.explicit) localStorage.setItem(MOOD_EXPLICIT_KEY, "1");
    } catch {
      /* storage unavailable — mood still applies for this session */
    }
  }, []);

  const toggle = useCallback(
    () => setMood(otherMood(getSnapshot()), { explicit: true }),
    [setMood],
  );

  // Align the browser chrome color to the mood the no-flash script chose.
  useEffect(() => {
    applyMoodToDom(getSnapshot());
  }, []);

  // On client navigation, follow the route-native mood — unless the visitor
  // made an explicit choice (then their pick sticks everywhere).
  useEffect(() => {
    const onRouteChange = (url: string) => {
      if (readExplicit()) return;
      const path = url.split("?")[0].split("#")[0];
      setMood(moodForPath(path));
    };
    router.events.on("routeChangeComplete", onRouteChange);
    return () => router.events.off("routeChangeComplete", onRouteChange);
  }, [router.events, setMood]);

  return (
    <MoodContext.Provider value={{ mood, setMood, toggle }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood(): MoodContextValue {
  const ctx = useContext(MoodContext);
  if (!ctx) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return ctx;
}
