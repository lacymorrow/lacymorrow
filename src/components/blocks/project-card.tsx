import { LinkPreview } from "@/components/ui/link-preview";
import Link from "next/link"; // Import Link for navigation

// Define an interface for project props for better type safety
export interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
}

// Reusable Project Card component
export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  href,
}) => (
  <div className="group block rounded-xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50 p-6 shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg dark:border-zinc-700/60 dark:from-zinc-800/80 dark:to-zinc-900/80 dark:shadow-black/20 dark:hover:border-zinc-700 dark:hover:shadow-black/30">
    <LinkPreview
      url={href}
      className="mb-2 text-lg font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400"
    >
      {title}
    </LinkPreview>
    <Link
      href={href}
      target="_blank" // Open link in a new tab
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </Link>
  </div>
);
