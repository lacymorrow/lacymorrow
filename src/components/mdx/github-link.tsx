import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const GithubLink = ({ href }: { href: string }) => {
  return (
    <span className="mx-1 inline-flex">
      <Link href={href} className="">
        <span className="sr-only">Github Repository</span>
        <GitHubLogoIcon className="h-6 w-6" />
      </Link>
    </span>
  );
};

export default GithubLink;
