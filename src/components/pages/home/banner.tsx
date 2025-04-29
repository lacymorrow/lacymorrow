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
  // Removed state and handler function (index, setIndex, handleChange)

  return (
    // Replaced outer fragment and multiple divs with a single container div
    <div
      style={poppins.style}
      className="relative flex my-12 w-[80vw] max-w-[1200px] min-h-[30vh] lg:h-[calc(100vh-10rem)] items-center justify-center overflow-hidden rounded-3xl p-4 md:h-[calc(100vh-15rem)]"
    >
      {/* Using an img tag for the animated PNG to allow for object-cover and positioning */}
      <img
        // Replace 'photogradient-1.png' with the actual animated PNG filename when provided
        src="/assets/images/gradients/photogradient-1.png"
        alt="Animated gradient background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Centered text container */}
      <div className="z-10 relative text-center">
        <h1 className="text-xl font-medium text-white drop-shadow-md md:text-2xl">
          Lacy is a web developer
        </h1>
      </div>
    </div>
  );
};

export default Banner;
