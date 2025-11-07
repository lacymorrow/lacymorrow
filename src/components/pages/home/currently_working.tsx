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
