import {
  ProjectCard,
  ProjectCardProps,
} from "@/components/blocks/project-card";

const PastProjects = () => {
  const projects: ProjectCardProps[] = [
    {
      title: "Shipkit Next.js Starter",
      description: "Next-gen AI-powered Next.js boilerplate and tooling.",
      href: "https://shipkit.io",
    },
    {
      title: "Hitchhiker's Guide to the Galaxy",
      description: "A comprehensive guide to the galaxy.",
      href: "https://hitchhikersgalaxy.guide",
    },
    {
      title: "Uibrary UI Components",
      description: "UI components for modern web interfaces.",
      href: "https://uibrary.com",
    },
    {
      title: "Cloud0 AI Chat",
      description: "100% private, offline AI.",
      href: "https://cloud0.dev",
    },
    {
      title: "CrossOver Crosshair Overlay",
      description: "Crosshair overlay app for Windows, Mac, and Linux.",
      href: "https://gh.lacymorrow.com/crossover",
    },
    {
      title: "XSPF Jukebox Web Player",
      description: "A web-based XSPF playlist player.",
      href: "https://xspf-jukebox.vercel.app",
    },
    {
      title: "Cait and Lacy's Wedding Website",
      description: "Website for my wife ❤️",
      href: "https://caitandlacy.com",
    },
    {
      title: "Generative website.",
      description: "Generates pages on the fly with AI.",
      href: "https://gen.lacy.sh",
    },
    {
      title: "Live Interactive Globe Visualization",
      description: "Interactive globe visualization with real-time data.",
      href: "https://globe.lacy.sh",
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
