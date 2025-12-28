import React, { useEffect } from "react";

export interface ImageGridProps
  extends React.ObjectHTMLAttributes<HTMLObjectElement> {
  rest?: Object;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  ...rest
}: ImageGridProps) => {
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

  useEffect(() => {
    // create script tag
    const script = document.createElement("script");
    script.src = "https://unpkg.com/isotope-layout";
    script.async = true;
    script.onload = () => {};

    // add script tag to body
    document.body.appendChild(script);
    return () => {
      // remove script tag from body
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div
        className="grid"
        data-isotope='{ "itemSelector": ".grid-item", "masonry": { "columnWidth": 200 } }'
        {...rest}
      >
        {items.map((item, index) => (
          <div className="grid-item" key={index}>
            <img src={item.src} alt={item.name} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageGrid;
