import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Children } from "react";

const GithubLink = ({ href }: { href: string }) => {
  return (
    <span className="mx-1 inline-flex">
      <a href={href} className="">
        <span className="sr-only">Github Repository</span>
        <GitHubLogoIcon className="h-6 w-6" />
      </a>
    </span>
  );
};

export default GithubLink;
