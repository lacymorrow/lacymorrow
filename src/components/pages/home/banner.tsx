import { cn } from "@/lib/utils";
import "@/styles/home.css";
import { UpdateIcon } from "@radix-ui/react-icons";
import Image from "next/image";
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
            <a
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
            </a>

            <div className="content pt-2 font-bold leading-relaxed md:pt-6">
              <p>
                <span className="text-3xl font-extrabold transition-colors duration-500 md:text-7xl">
                  Lacy Morrow
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="content mb-12 p-2 font-bold md:py-8">
        <p className="text-center text-4xl">
          🪄 &nbsp;Maker of{" "}
          <a className="color-transition" href="/play">
            software
          </a>
          ,{" "}
          <a className="color-transition" href="/work/drones">
            drones
          </a>
          , and{" "}
          <a className="color-transition" href="/work/companies/twilio">
            IoT devices
          </a>
        </p>

        <div className="mx-auto mt-8 flex w-1/2 items-center justify-evenly gap-2 text-5xl md:text-8xl">
          <a href="/work" className="slide-in animated hinge">
            Work
          </a>
          <button type="button" onClick={handleChange} className="random">
            <span className="sr-only">Change Background</span>
            <UpdateIcon />
          </button>
          <a href="/play" className="slide-in animated hinge">
            Play
          </a>
        </div>
      </div>
    </>
  );
};

export default Banner;
