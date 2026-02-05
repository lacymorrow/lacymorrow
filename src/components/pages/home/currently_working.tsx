import {
  ProjectCard,
  ProjectCardProps,
} from "@/components/blocks/project-card";

const CurrentlyWorking = () => {
  const projects: ProjectCardProps[] = [
    {
      title: "Lacy Shell",
      description: "Talk to your terminal. Natural language routes to AI agents automatically.",
      href: "https://lacy.sh",
    },
    {
      title: "Juno",
      description: "Anthropic Computer Use for your desktop. AI that sees and clicks.",
      href: "https://junebug.ai",
    },
    {
      title: "Shipkit",
      description: "Ship Next.js apps in 30 seconds. Auth, payments, AI included.",
      href: "https://shipkit.io",
    },
    {
      title: "Uibrary",
      description: "Production-ready UI components. Copy, paste, ship.",
      href: "https://uibrary.com",
    },
    {
      title: "Build and Serve",
      description: "Development agency for teams that need senior engineering fast.",
      href: "https://buildandserve.com",
    },
    {
      title: "Vibe Rehab",
      description: "Code rescue for AI-generated projects. We fix vibe code.",
      href: "https://vibe.rehab",
    },
  ];

  return (
    <div className="my-12 w-[80vw] max-w-[1200px]">
      <h2 className="mb-6 text-lg font-medium text-zinc-900 dark:text-white">
        Currently Working On
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

export default CurrentlyWorking;
