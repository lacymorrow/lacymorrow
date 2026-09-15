import { FlashPlayer } from "./player";
import capitalize from "@/utils/capitalize";

type Props = {
  name: string;
  /** Kept for the MDX pages that still pass it. The pieces play on their own. */
  clickToPlay?: boolean;
};

export const FlashArt = ({ name }: Props) => {
  return (
    <>
      <h1 className="nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100">
        Flash Art: {capitalize(name)}
      </h1>
      <div className="my-8 flex flex-col items-center">
        <FlashPlayer src={`/flash/art/${name}.swf`} />
      </div>
    </>
  );
};

export default FlashArt;
