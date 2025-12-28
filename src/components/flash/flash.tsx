import { Ruffle } from "react-ruffle";
import { AspectRatio } from "../ui/aspect-ratio";

type Props = {
	name: string;
	params?: string;
	width?: string | number;
	height?: string | number;
};

export const Flash = ({ name, width, height, params }: Props) => {
	const w = width ? `${String(width)}px` : "auto";
	const h = height ? `${String(height)}px` : "auto";
	return (
		<div className="mt-8">
			<AspectRatio
				ratio={16 / 9}
				className="flex justify-center mx-auto"
				style={{ width: w, height: h }}
			>
				<Ruffle src={`/flash/${name}.swf?${params}`} width={width} height={height} />
			</AspectRatio>
		</div>
	);
};

export default Flash;
