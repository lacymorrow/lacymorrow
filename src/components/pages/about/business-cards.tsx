"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BusinessCard {
  id: string;
  company: string;
  role: string;
  era: string;
  front: string;
  back?: string;
  note?: string;
  darkCard?: boolean;
}

const cards: BusinessCard[] = [
  {
    id: "build-and-serve",
    company: "Build and Serve",
    role: "Founder",
    era: "2020s",
    front: "/static/business-cards/build-and-serve.jpg",
    back: "/static/business-cards/build-and-serve-back.jpg",
    darkCard: true,
  },
  {
    id: "invitae-connected",
    company: "Invitae",
    role: "Web Development",
    era: "2015–2019",
    front: "/static/business-cards/invitae-front.jpg",
    back: "/static/business-cards/invitae-back-connected.jpg",
    note: "Back №1 — “we are all connected”",
  },
  {
    id: "invitae-humanity",
    company: "Invitae",
    role: "Web Development",
    era: "2015–2019",
    front: "/static/business-cards/invitae-front.jpg",
    back: "/static/business-cards/invitae-back-humanity.jpg",
    note: "Back №2 — “genetics unites humanity”",
  },
  {
    id: "invitae-path",
    company: "Invitae",
    role: "Web Development",
    era: "2015–2019",
    front: "/static/business-cards/invitae-front.jpg",
    back: "/static/business-cards/invitae-back-path.jpg",
    note: "Back №3 — “a new path on our genetic journey”",
  },
  {
    id: "freelance",
    company: "Freelance",
    role: "Web Developer / Computer Consultant",
    era: "Early 2010s",
    front: "/static/business-cards/web-developer.jpg",
    back: "/static/business-cards/computer-consultant.jpg",
    note: "One card, two titles — Web Developer up front, Computer Consultant on the flip side",
  },
];

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return canHover;
}

function FlipCard({ card, canHover }: { card: BusinessCard; canHover: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const canFlip = !!card.back;

  return (
    <div className="group flex flex-col gap-3">
      <div
        className={cn(
          "relative w-full",
          canFlip && !canHover && "cursor-pointer",
        )}
        style={{ perspective: "1200px" }}
        onMouseEnter={() => canFlip && canHover && setFlipped(true)}
        onMouseLeave={() => canFlip && canHover && setFlipped(false)}
        onClick={() => canFlip && !canHover && setFlipped((f) => !f)}
        role={canFlip && !canHover ? "button" : undefined}
        aria-label={canFlip ? `Flip ${card.company} card` : undefined}
      >
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            aspectRatio: "3.5 / 2",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-black/10"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={card.front}
              alt={`${card.company} — ${card.role}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Back */}
          {card.back && (
            <div
              className="absolute inset-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-black/10"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <Image
                src={card.back}
                alt={`${card.company} card back`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>

        {canFlip && !canHover && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {flipped ? "tap for front" : "tap to flip"}
          </div>
        )}
      </div>

      <div className="px-1">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-sm">{card.company}</span>
          <span className="text-xs text-gray-400">{card.era}</span>
        </div>
        <div className="text-xs text-gray-500">{card.role}</div>
        {card.note && (
          <div className="mt-0.5 text-xs italic text-gray-400">{card.note}</div>
        )}
      </div>
    </div>
  );
}

export function BusinessCards() {
  const canHover = useCanHover();

  return (
    <div className="mt-8 grid gap-10 sm:grid-cols-2">
      {cards.map((card) => (
        <FlipCard key={card.id} card={card} canHover={canHover} />
      ))}
    </div>
  );
}
