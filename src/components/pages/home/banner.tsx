"use client";

import { cn } from "@/lib/utils";
import "@/styles/home.css";
import { UpdateIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Banner = () => {
  const [index, setIndex] = useState(2);
  const handleChange = () => {
    setIndex(index + 1);
    if (index === 3) {
      setIndex(0);
    }
  };

  return (
    <>
      <div className="card-holder w-full p-2 text-center text-xl antialiased md:mx-auto md:w-2/3 md:py-8">
        <div className={cn("card", `bg-${index}`)} style={{ padding: "0" }}>
          <div className="p-2 md:p-8">
            <Link
              href="/about"
              className="animated header-img tada mx-auto my-4 inline-block"
            >
              <span className="sr-only">Enter lacymorrow.com</span>
              <Image
                src="https://s.gravatar.com/avatar/736b40590816c014f11aefb0072ce82c?s=300"
                width="150"
                height="150"
                alt="Lacy Morrow's Gravatar image"
              />
            </Link>

            <div className="content pt-2 md:pt-6">
              <p>
                <span className="text-3xl font-extrabold leading-relaxed duration-500 md:text-7xl ">
                  Lacy Morrow
                </span>
              </p>
            </div>
          </div>
          <p className="hover:text-splash mb-8 text-xl font-bold tracking-normal transition-colors 	">
            <Link href="/about">Enter Site</Link>
          </p>
        </div>
      </div>
      <div className="content mb-12 p-2 font-bold md:py-8">
        <p className="text-center text-4xl">
          🪄 &nbsp;Maker of{" "}
          <Link className="color-transition" href="/play">
            software
          </Link>
          ,{" "}
          <Link className="color-transition" href="/work/drones">
            drones
          </Link>
          , and{" "}
          <Link className="color-transition" href="/work/companies/twilio">
            IoT devices
          </Link>
        </p>

        <div className="mx-auto mt-8 flex w-1/2 items-center justify-evenly gap-2 text-5xl md:text-8xl">
          <Link href="/work" className="slide-in animated hinge">
            Work
          </Link>
          <button type="button" onClick={handleChange} className="random">
            <span className="sr-only">Change Background</span>
            <UpdateIcon />
          </button>
          <Link href="/play" className="slide-in animated hinge">
            Play
          </Link>
        </div>
      </div>
    </>
  );
};

export default Banner;
