import { MixIcon } from "@radix-ui/react-icons";
import React from "react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <MixIcon className="h-5 w-5" />
      <div>Lacy Morrow</div>
    </div>
  );
};

export default Logo;
