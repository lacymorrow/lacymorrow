import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const GithubLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <span className="mx-1 inline-flex">
      <Link href={href} className="">
        <span className="sr-only">Github Repository</span>
        <GitHubLogoIcon className="h-6 w-6" />
        {children}
      </Link>
    </span>
  );
};

export default GithubLink;
