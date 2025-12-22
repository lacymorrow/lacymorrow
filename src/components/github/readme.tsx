import React from "react";
import { GitHubReadme } from "react-github-readme-md";
import Link from "next/link";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const Readme: React.FC<{ username: string; repo: string }> = ({
  username,
  repo,
}) => {
  return (
    <>
      <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-900">
        <div className="flex h-full items-center">
          <InfoCircledIcon />
        </div>
        <div className="text-xs">
          The following is content from the README.md file of the {repo}{" "}
          <Link
            href={`https://github.com/${username}/${repo}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline decoration-from-font [text-underline-position:from-font]"
          >
            GitHub Repository ↗
          </Link>
          .
        </div>
      </div>
      <GitHubReadme username={username} repo={repo} className="mt-6" />
    </>
  );
};

export default Readme;
