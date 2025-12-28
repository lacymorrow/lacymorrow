"use client";

import { useEffect, useRef, useState } from "react";

export function LacyBlock() {
  const [isNearby, setIsNearby] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const barRef = useRef<HTMLLabelElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for magnetic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (checkboxRef.current?.checked) return;

      const threshold = 80; // Distance threshold to detect mouse

      if (barRef.current) {
        const rect = barRef.current.getBoundingClientRect();
        const cornerX = rect.right - 10;
        const cornerY = window.innerHeight;

        // Calculate distance from mouse to detection point
        const distance = Math.sqrt(
          Math.pow(e.clientX - cornerX, 2) + Math.pow(e.clientY - cornerY, 2)
        );

        // Set nearby state based on distance threshold
        setIsNearby(distance < threshold);
      }
    };

    // Add mousemove event listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Handle checkbox state change
  useEffect(() => {
    const handleChange = () => {
      if (checkboxRef.current) {
        setIsExpanded(checkboxRef.current.checked);
      }
    };

    if (checkboxRef.current) {
      checkboxRef.current.addEventListener("change", handleChange);
    }

    return () => {
      if (checkboxRef.current) {
        checkboxRef.current.removeEventListener("change", handleChange);
      }
    };
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        checkboxRef.current?.checked &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        checkboxRef.current.checked = false;
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        /* Base styles */
        .dev-tools-container {
          position: fixed;
          bottom: 0;
          right: 0;
          z-index: 50;
          width: 100%;
          overflow: hidden;
        }

        /* Common element styles */
        .bg-dark {
          background-color: #1f2937;
        }

        .dark .bg-dark {
          background-color: #374151;
        }

        /* Combined bar and square as a single element with smooth transitions */
        .bar {
          position: fixed;
          bottom: 0;
          right: 0;
          height: 16px;
          width: 16px; /* Square width when collapsed */
          cursor: pointer;
          transform-origin: bottom right;
          /* Smooth transition for width change */
          transition: width 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* When nearby, grow in width instead of translating */
        .bar.nearby {
          width: 20px; /* Grow by 4px instead of translating */
        }

        /* When expanded, show full bar with square */
        .bar.expanded {
          width: 316px; /* 300px bar + 16px square */
        }

        /* Marquee styles */
        .marquee-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 16px; /* Leave space for square */
          height: 16px;
          overflow: hidden;
          display: flex;
          align-items: center;
          opacity: 0;
          transition: opacity 400ms ease;
        }

        .marquee-container.visible {
          opacity: 1;
        }

        .marquee {
          white-space: nowrap;
          display: flex;
          align-items: center;
          height: 100%;
          padding-top: 2px;
          padding-bottom: 2px;
          padding-left: 22px;
          color: white;
          font-size: 10px;
          line-height: 1;
          font-weight: 500;
          font-family:
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        }

        .marquee span {
          margin-left: 10px;
          margin-right: 10px;
          display: inline-block;
          transform: scale(1);
          transition: transform 300ms ease;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .marquee span:hover {
          transform: scale(1.2);
          color: #f0f0f0;
        }

        /* Animation for marquee */
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>

      <div ref={containerRef} className="dev-tools-container">
        {/* Hidden checkbox for state */}
        <input
          ref={checkboxRef}
          type="checkbox"
          id="bar-toggle"
          className="sr-only peer"
          aria-label="Toggle animation"
        />

        {/* Single element for both bar and square */}
        <label
          ref={barRef}
          htmlFor="bar-toggle"
          className={`bar bg-dark ${isNearby ? "nearby" : ""} ${isExpanded ? "expanded" : ""}`}
        >
          {/* Marquee container */}
          <div className={`marquee-container ${isExpanded ? "visible" : ""}`}>
            {/* Marquee of websites */}
            <div className="marquee animate-marquee">
              <span>vercel.com</span>
              <span>nextjs.org</span>
              <span>react.dev</span>
              <span>tailwindcss.com</span>
              <span>github.com</span>
              <span>v0.dev</span>
              <span>shadcn.com</span>
              <span>typescript.org</span>
              <span>vercel.com</span>
              <span>nextjs.org</span>
              <span>react.dev</span>
              <span>tailwindcss.com</span>
            </div>
          </div>
        </label>
      </div>
    </>
  );
}
