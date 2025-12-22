import React from "react";
import { cn } from "@/lib/utils";

const Center = ({
  children,
  className,
}: {
  children: React.ReactNode;
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
