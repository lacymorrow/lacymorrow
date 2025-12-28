import React from "react";
import { cn } from "@/lib/utils";

const Lead = ({
	children,
	className,
}: {
	children: React.ReactNode;
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
