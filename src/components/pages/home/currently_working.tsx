import { Poppins } from "next/font/google";
import Link from "next/link"; // Import Link for navigation

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Define an interface for project props for better type safety
interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
}

// Reusable Project Card component
const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  href,
}) => (
  <Link href={href} passHref legacyBehavior>
    <a
      target="_blank" // Open link in a new tab
      rel="noopener noreferrer" // Security best practice for new tabs
      className="group block rounded-xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50 p-6 shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg dark:border-zinc-700/60 dark:from-zinc-800/80 dark:to-zinc-900/80 dark:shadow-black/20 dark:hover:border-zinc-700 dark:hover:shadow-black/30"
    >
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </a>
  </Link>
);

const CurrentlyWorking = () => {
  const projects: ProjectCardProps[] = [
    {
      title: "Shipkit",
      description: "Next-gen AI-powered Next.js boilerplate and tooling.",
      href: "https://shipkit.io",
    },
    {
      title: "Uibrary",
      description: "UI components for modern web interfaces.",
      href: "https://uibrary.com",
    },
    {
      title: "Cloud0",
      description: "100% private, offline AI.",
      href: "https://cloud0.dev",
    },
  ];

  return (
    <div
      style={poppins.style}
      className="my-12 w-[80vw] max-w-[1200px] rounded-2xl border border-zinc-200/70 p-8 dark:border-zinc-800/70"
    >
      <h2 className="mb-8 text-xl font-semibold text-zinc-900 dark:text-white">
        Currently Working On
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
};

export default CurrentlyWorking;
