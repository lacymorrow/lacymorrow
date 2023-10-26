/* eslint-disable @next/next/no-img-element */

import Masonry from "react-masonry-component";
// import { Masonry } from "masonic";

const items = [
  {
    name: "American Comfort Solutions",
    src: "/static/clients/th-american.jpg",
  },
  {
    name: "College Career Advisors",
    src: "/static/clients/th-cca.jpg",
  },
  {
    name: "Charlie's Vision",
    src: "/static/clients/th-charliesvision.jpg",
  },
  {
    name: "Cosmic Cart",
    src: "/static/clients/th-cosmiccart.jpg",
  },
  {
    name: "Effective",
    src: "/static/clients/th-effective.jpg",
  },
  {
    name: "Hinson",
    src: "/static/clients/th-hinson.jpg",
  },
  {
    name: "IAC",
    src: "/static/clients/th-iac.jpg",
  },
  {
    name: "Innovation",
    src: "/static/clients/th-innovation.jpg",
  },
  {
    name: "Invision",
    src: "/static/clients/th-invision.jpg",
  },
  {
    name: "Kim Brattain",
    src: "/static/clients/th-kimbrattain.jpg",
  },
  {
    name: "Mission Film",
    src: "/static/clients/th-missionfilm.jpg",
  },
];

interface MasonryCardProps {
  index: number;
  data: {
    name: string;
    src: string;
  };
  width: number;
}

const MasonryCard = ({
  index,
  data: { src, name },
  width,
}: MasonryCardProps) => <img src={src} alt={name} />;

const Freelance = () => {
  return (
    <div className="my-8">
      {/* <Masonry items={items} render={MasonryCard} /> */}
      {/* @ts-ignore */}
      <Masonry enableResizableChildren={true}>
        <div>
          <img
            src="/static/clients/th-american.jpg"
            alt="American Comfort Solutions"
          />
        </div>
        <div>
          <img src="/static/clients/th-cca.jpg" alt="College Career Advisors" />
        </div>
        <div>
          <img
            src="/static/clients/th-charliesvision.jpg"
            alt="Charlie's Vision"
          />
        </div>
        <div>
          <img src="/static/clients/th-cosmiccart.jpg" alt="Cosmic Cart" />
        </div>
        <div>
          <img src="/static/clients/th-effective.jpg" alt="Cosmic Cart" />
        </div>
        <div>
          <img src="/static/clients/th-hinson.jpg" alt="Hinson" />
        </div>
        <div>
          <img src="/static/clients/th-iac.jpg" alt="IAC" />
        </div>
        <div>
          <img src="/static/clients/th-innovation.jpg" alt="Innovation" />
        </div>
        <div>
          <img src="/static/clients/th-invision.jpg" alt="Invision" />
        </div>
        <div>
          <img src="/static/clients/th-kimbrattain.jpg" alt="Kim Brattain" />
        </div>
        <div>
          <img src="/static/clients/th-missionfilm.jpg" alt="Mission Film" />
        </div>
        <div>
          <img src="/static/clients/th-nancy.jpg" alt="Nancy" />
        </div>
        <div>
          <img src="/static/clients/th-phase2.jpg" alt="Phase 2" />
        </div>
        <div>
          <img src="/static/clients/th-righthand.jpg" alt="Right Hand" />
        </div>
      </Masonry>
    </div>
  );
};

export default Freelance;
