import { cn } from "@/lib/utils";
import { Children } from "react";

const Center = ({
  children,
  className,
}: {
  children: JSX.Element;
  className?: string;
}) => {
  return (
    <>
      <span className={cn("my-4 grid place-content-center", className)}>
        {children}
      </span>
    </>
  );
};

export default Center;
