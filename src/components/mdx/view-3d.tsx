import dynamic from "next/dynamic";

import type { ComponentProps } from "react";

// @egjs/react-view3d carries its own copy of three, about 400 KB gzipped.
// It is used by a handful of /play/3d pages, so it loads on demand rather
// than riding in _app with every page on the site.
const View3D = dynamic(() => import("@egjs/react-view3d"), { ssr: false });

type Props = {
  src: string;
} & Partial<ComponentProps<"div">>;

export const View3d = ({ src, ...props }: Props) => {
  return (
    <View3D
      className="mx-auto h-full max-w-sm"
      src={src}
      zoom={false}
      {...props}
    />
  );
};
