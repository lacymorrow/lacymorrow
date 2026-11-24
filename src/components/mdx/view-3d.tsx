import View3D from "@egjs/react-view3d";
import "@egjs/react-view3d/css/view3d-bundle.min.css";

import React from "react";

interface Props {
	src: string;
	[key: string]: unknown;
}

export const View3d = ({ src, ...props }: Props) => {
	return <View3D className="mx-auto h-full max-w-sm" src={src} zoom={false} {...props} />;
};
