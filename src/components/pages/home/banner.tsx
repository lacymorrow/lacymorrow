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
        className="relative flex my-12 w-[80vw] max-w-[1200px] min-h-40 lg:h-[calc(100vh-10rem)] max-h-96 items-center justify-center overflow-hidden rounded-3xl p-4 md:h-[calc(100vh-15rem)]"
      >
        {/* Using an img tag for the animated PNG to allow for object-cover and positioning */}
        <div className="absolute inset-0 h-full w-full object-cover">
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
        <div className="z-10 relative text-center">
          <h1 className="text-xl font-medium text-white drop-shadow-md md:text-2xl">
            Lacy is a web developer.
          </h1>
        </div>
      </a>
      <div className="text-xl">
        See my{" "}
        <a
          href="/work"
          className="underline hover:text-blue-500 transition-colors"
        >
          work
        </a>{" "}
        and{" "}
        <a
          href="/play"
          className="underline hover:text-blue-500 transition-colors"
        >
          projects
        </a>
        , or{" "}
        <a
          href="/contact"
          className="underline hover:text-blue-500 transition-colors"
        >
          reach out
        </a>
        .
      </div>
    </>
  );
};

export default Banner;
