import View3D from "@egjs/react-view3d";
import "@egjs/react-view3d/css/view3d-bundle.min.css";

import React from "react";

type Props = {
  src: string;
};

export const View3d = ({ src, ...props }: Props) => {
  return (
    <View3D
      className="mx-auto h-full max-w-sm"
      tag="div"
      src={src}
      zoom={false}
      onReady={(e) => {
        console.log(`Loaded ${src}`, e);
      }}
      onLoad={(e) => {
        console.log(`Loaded ${src}`, e);
      }}
      {...props}
    />
  );
};
