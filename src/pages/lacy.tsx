const building = [
  {
    title: "Crossover",
    link: "https://github.com/lacymorrow/crossover",
  },
];

const projects = [
  {
    title: "fly5.live",
    link: "https://fly5.live",
  },
];

const extras = [
  {
    title: "lacymorrow.com",
    link: "https://lacymorrow.com",
  },
];

type ItemProps = {
  title: string;
  link: string;
};

const Item = ({ title, link }: ItemProps) => {
  return (
    <li className="flex flex-col justify-center">
      <a href={link}>{title}</a>
    </li>
  );
};

const List = ({ items }: { items: ItemProps[] }) => {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {items.map((item) => (
        <Item key={item.title} {...item} />
      ))}
    </ul>
  );
};

export default function Home() {
  return (
    <main className="flex justify-center p-xl">
      <div className="flex flex-col gap-lg max-w-lg">
        <h1 className="text-foreground text-xl font-semibold">Lacy Morrow</h1>
        <p className="fade-in-up">
          <span className="text-lg font-serif italic mr-1">
            Building things.
          </span>
          Crafting refined software and web interfaces. Previously, developer at{" "}
          <a href="https://www.twilio.com">Twilio</a>,{" "}
          <a href="https://www.longgame.com">LongGame</a>,{" "}
          <a href="https://www.viasat.com">Viasat</a>.
        </p>

        <p className="fade-in-up">
          I built{" "}
          <a
            className="outline-border outline-offset-2"
            href="https://github.com/lacymorrow/crossover"
          >
            crossover
          </a>
          , a crosshair app.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md fade-in-up">
          <div className="">
            <h2 className="text-muted-foreground text-sm font-serif italic">
              Building
            </h2>
            <List items={building} />
          </div>

          <div className="">
            <h2 className="text-muted-foreground text-sm font-serif italic">
              Projects
            </h2>
            <List items={projects} />
          </div>

          <div className="">
            <h2 className="text-muted-foreground text-sm font-serif italic">
              Extras
            </h2>
            <List items={extras} />
          </div>
        </div>

        <div className="">
          <h2 className="text-muted-foreground text-sm font-serif italic">
            Current
          </h2>
          <p>
            Currently working for{" "}
            <a href="https://www.rvohealth.com" target="_blank">
              RVOHealth.com
            </a>
            .
          </p>
        </div>

        <div className="">
          <h2 className="text-muted-foreground text-sm font-serif italic">
            Past
          </h2>
          <p></p>

          <h2 className="text-muted-foreground text-sm font-serif italic">
            Future
          </h2>
          <p>Looking for a patent attorney.</p>
        </div>

        <div className="text-sm">
          My fiance is a{" "}
          <a
            className=""
            href="https://www.caitrussellphotography.com/"
            target="_blank"
          >
            photographer
          </a>{" "}
          and{" "}
          <a href="https://www.cait-russell.com" target="_blank">
            designer
          </a>
          .
        </div>
        <p className="text-xs">
          <a href="mailto:me@lacymorrow.com">me@lacymorrow.com</a>
        </p>
      </div>
    </main>
  );
}
