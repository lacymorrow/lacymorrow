import {
  ProjectCard,
  ProjectCardProps,
} from "@/components/blocks/project-card";

const PastProjects = () => {
  const projects: ProjectCardProps[] = [
    {
      title: "CrossOver",
      description: "Gaming overlay for any screen. Windows, Mac, and Linux.",
      href: "https://gh.lacymorrow.com/crossover",
    },
    {
      title: "Hitchhiker's Guide to the Galaxy",
      description: "My favorite book, now an AI. Ask it anything. Probably inaccurately.",
      href: "https://hitchhikersgalaxy.guide",
    },
    {
      title: "Cait and Lacy",
      description: "Website for my wife ❤️",
      href: "https://caitandlacy.com",
    },
    {
      title: "Cloud0 AI Chat",
      description: "100% private, offline AI. Your data never leaves your machine.",
      href: "https://cloud0.dev",
    },
    {
      title: "Generative Website",
      description: "Pages generated on the fly with AI. No templates.",
      href: "https://gen.lacy.sh",
    },
    {
      title: "Interactive Globe",
      description: "Real-time data visualization on a 3D globe.",
      href: "https://globe.lacy.sh",
    },
    {
      title: "XSPF Jukebox",
      description: "Web-based playlist player. One of the original web audio players.",
      href: "https://xspf-jukebox.vercel.app",
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
