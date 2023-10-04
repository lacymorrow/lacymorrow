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
      <div className="card-holder w-lg mx-auto w-2/3 max-w-3xl p-8 text-center text-xl antialiased">
        <div className={`card bg-${index}`}>
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

          <div className="content p-6 text-4xl font-bold leading-relaxed">
            <p>
              <span className="text-7xl font-extrabold transition-colors duration-500">
                Lacy Morrow
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="content mb-12 p-2 font-bold">
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

        <div className="mx-auto mt-8 flex w-1/2 items-center justify-evenly text-8xl">
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
