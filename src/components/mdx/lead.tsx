import { cn } from "@/lib/utils";

const Lead = ({
	children,
	className,
}: {
	children: JSX.Element;
	className?: string;
}) => {
	return (
		<>
			<p className={cn("my-4 text-xl", className)}>
				{children}
			</p>
		</>
	);
};

export default Lead;
