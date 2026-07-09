import Silk from "@/components/ui/react-bits/silk";
import { Poppins } from "next/font/google";

// Removed unused imports: cn, UpdateIcon, Image, Link, useState
// Removed unused CSS import: "@/styles/home.css";

// Retained React import if needed for future interactivity, otherwise it could be removed if strictly static.
// import { useState } from "react";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});
const Banner = () => {
  return (
    <>
      <a
        href="/play"
        style={poppins.style}
        className="relative my-12 flex max-h-96 min-h-40 w-[80vw] max-w-[1200px] items-center justify-center overflow-hidden rounded-3xl p-4 md:h-[calc(100vh-15rem)] lg:h-[calc(100vh-10rem)]"
      >
        {/* Using an img tag for the animated PNG to allow for object-cover and positioning */}
        <div className="absolute inset-0 size-full object-cover">
          <Silk
            speed={3}
            scale={1}
            colors={["#7B7481", "#9B59B6", "#E74C3C"]}
            colorMix={1.2}
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>

        {/* Centered text container */}
        <div className="relative z-10 text-center">
          <h1 className="text-xl font-medium text-white drop-shadow-md md:text-2xl">
            I build AI agents that control computers.
          </h1>
        </div>
      </a>
      <div className="max-w-[calc(100vw-4rem)] break-words text-xl md:max-w-none">
        See my{" "}
        <a
          href="/work"
          className="underline transition-colors hover:text-blue-500"
        >
          work
        </a>{" "}
        and{" "}
        <a
          href="/play"
          className="underline transition-colors hover:text-blue-500"
        >
          projects
        </a>
        , or{" "}
        <a
          href="/contact"
          className="underline transition-colors hover:text-blue-500"
        >
          reach out
        </a>
        .
      </div>
    </>
  );
};

export default Banner;
