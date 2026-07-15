"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BusinessCard {
  id: string;
  company: string;
  role: string;
  era: string;
  front: string;
  back?: string;
  darkCard?: boolean;
}

const cards: BusinessCard[] = [
  {
    id: "build-and-serve",
    company: "Build and Serve",
    role: "Founder",
    era: "2020s",
    front: "/static/business-cards/build-and-serve.jpg",
    darkCard: true,
  },
  {
    id: "invitae",
    company: "Invitae",
    role: "Web Development",
    era: "2015–2019",
    front: "/static/business-cards/invitae-front.jpg",
    back: "/static/business-cards/invitae-back.jpg",
  },
  {
    id: "computer-consultant",
    company: "Freelance",
    role: "Computer Consultant",
    era: "Early 2010s",
    front: "/static/business-cards/computer-consultant.jpg",
  },
  {
    id: "web-developer",
    company: "Freelance",
    role: "Web Developer",
    era: "~2013",
    front: "/static/business-cards/web-developer.jpg",
  },
];

function FlipCard({ card }: { card: BusinessCard }) {
  const [flipped, setFlipped] = useState(false);
  const canFlip = !!card.back;

  return (
    <div className="group flex flex-col gap-3">
      <div
        className={cn(
          "relative w-full",
          canFlip && "cursor-pointer",
        )}
        style={{ perspective: "1200px" }}
        onClick={() => canFlip && setFlipped((f) => !f)}
        role={canFlip ? "button" : undefined}
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

        {canFlip && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            {flipped ? "flip front" : "flip over"}
          </div>
        )}
      </div>

      <div className="px-1">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-sm">{card.company}</span>
          <span className="text-xs text-gray-400">{card.era}</span>
        </div>
        <div className="text-xs text-gray-500">{card.role}</div>
      </div>
    </div>
  );
}

export function BusinessCards() {
  return (
    <div className="mt-8 grid gap-10 sm:grid-cols-2">
      {cards.map((card) => (
        <FlipCard key={card.id} card={card} />
      ))}
    </div>
  );
}
