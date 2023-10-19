import { cn } from "@/lib/utils";

const Thick = ({
  children,
  className,
}: {
  children: JSX.Element;
  className?: string;
}) => {
  return <p className={cn("text-xl font-bold", className)}>{children}</p>;
};

export default Thick;
