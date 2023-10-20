import { Ruffle } from "react-ruffle";
import capitalize from "@/utils/capitalize";

type Props = {
  name: string;
  clickToPlay: boolean;
};

export const FlashArt = ({ name, clickToPlay }: Props) => {
  return (
    <>
      <h1 className="nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100">
        Flash Art: {capitalize(name)}
      </h1>
      <div className="my-8 flex flex-col items-center">
        <Ruffle
          src={`/flash/art/${name}.swf`}
          style={{ width: "300", height: "300" }}
          width="300"
          height="300"
        />
      </div>
      {clickToPlay && <p>Click to play</p>}
    </>
  );
};

export default FlashArt;
