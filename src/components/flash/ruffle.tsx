import Script from "next/script";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";

type Props = {
  src: string;
  style?: React.CSSProperties;
};

export const Ruffle = ({ src, ...rest }: Props) => {
  return (
    <>
      <Script
        src="/ruffle/ruffle.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window has been populated`)
        }
      />
      <AspectRatio ratio={16 / 9} className="flex justify-center">
        <object data={src} className="w-full" {...rest}>
          <param name="movie" value={src} />
          <p>
            Your browser does not support WASM,{" "}
            <Link href="https://ruffle.rs/">see Ruffle documentation</Link>.
          </p>
        </object>
      </AspectRatio>
    </>
  );
};

export default Ruffle;
