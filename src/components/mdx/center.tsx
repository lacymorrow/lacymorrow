import { cn } from "@/lib/utils";

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
