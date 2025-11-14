import {
  ProjectCard,
  ProjectCardProps,
} from "@/components/blocks/project-card";

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
    <div className="my-12 w-[80vw] max-w-[1200px]">
      <h2 className="mb-6 text-lg font-medium text-zinc-900 dark:text-white">
        Past Projects
      </h2>
      <div className="grid grid-cols-1 gap-px border-t border-l border-zinc-200 dark:border-zinc-800 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.title}
            className="border-b border-r border-zinc-200 dark:border-zinc-800"
          >
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastProjects;
