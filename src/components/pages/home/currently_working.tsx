import {
  ProjectCard,
  ProjectCardProps,
} from "@/components/blocks/project-card";

const CurrentlyWorking = () => {
  const projects: ProjectCardProps[] = [
    {
      title: "Juno",
      description: "AI that controls your computer",
      href: "https://junebug.ai",
    },
    {
      title: "Build and Serve",
      description: "10x developer resources for your business.",
      href: "https://buildandserve.com",
    },
    {
      title: "Vibe Rehab",
      description: "We fix vibe code.",
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
