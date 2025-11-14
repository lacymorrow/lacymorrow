"use client";

import { LinkPreview } from "@/components/ui/link-preview";
import Link from "next/link";

export interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  href,
}) => {
  const isExternal = href.startsWith("http");
  
  return (
    <LinkPreview
      url={href}
      width={280}
      height={180}
      className="block h-full"
    >
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="group block h-full p-4 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <h3 className="mb-1 text-base font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </Link>
    </LinkPreview>
  );
};
