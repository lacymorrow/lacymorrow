import {
  ProjectCard,
  ProjectCardProps,
} from "@/components/blocks/project-card";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const PastProjects = () => {
  const projects: ProjectCardProps[] = [
    {
      title: "Shipkit",
      description: "Next-gen AI-powered Next.js boilerplate and tooling.",
      href: "https://shipkit.io",
    },
    {
      title: "Hitchhiker's Galaxy.guide",
      description: "A comprehensive guide to the galaxy.",
      href: "https://hitchhikersgalaxy.guide",
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
    {
      title: "CrossOver",
      description: "Crosshair overlay app for Windows, Mac, and Linux.",
      href: "/play/crossover",
    },
    {
      title: "XSPF Jukebox",
      description: "A web-based XSPF playlist player.",
      href: "/play/flash/xspf",
    },
  ];

  return (
    <div
      style={poppins.style}
      className="my-12 w-[80vw] max-w-[1200px] rounded-2xl border border-zinc-200/70 p-8 dark:border-zinc-800/70"
    >
      <h2 className="mb-8 text-xl font-semibold text-zinc-900 dark:text-white">
        Past Projects
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
};

export default PastProjects;
