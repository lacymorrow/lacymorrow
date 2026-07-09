import resume from "@/data/resume.json";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const DateRange = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate?: string;
}) => (
  <span className="text-muted-foreground whitespace-nowrap text-sm">
    {formatDate(startDate)} &mdash; {endDate ? formatDate(endDate) : "Present"}
  </span>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-8">
    <h2 className="border-border mb-4 border-b pb-1 text-lg font-semibold tracking-tight">
      {title}
    </h2>
    {children}
  </section>
);

export const ResumeViewer = () => {
  const { basics, work, education, skills, projects, references } = resume;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{basics.name}</h1>
        <p className="text-muted-foreground mt-1 text-base">{basics.label}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span>{basics.location.city}, {basics.location.state}</span>
          <a href={`mailto:${basics.email}`} className="hover:underline">
            {basics.email}
          </a>
          <a href={basics.url} className="hover:underline">
            lacymorrow.com
          </a>
          {basics.profiles.map((p) => (
            <a key={p.network} href={p.url} className="hover:underline">
              {p.network}
            </a>
          ))}
        </div>
      </header>

      {/* Summary */}
      <Section title="Summary">
        <p className="whitespace-pre-line text-sm leading-relaxed">
          {basics.summary}
        </p>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        <div className="space-y-5">
          {work.map((job, i) => (
            <div key={i}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-semibold">
                  {job.url ? (
                    <a href={job.url} className="hover:underline">
                      {job.name}
                    </a>
                  ) : (
                    job.name
                  )}
                </h3>
                <DateRange startDate={job.startDate} endDate={job.endDate} />
              </div>
              <p className="text-muted-foreground text-sm">
                {job.position}
                {job.location && <> &middot; {job.location}</>}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{job.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.name}>
              <h3 className="text-sm font-semibold">
                {group.name}{" "}
                <span className="text-muted-foreground font-normal">
                  ({group.level})
                </span>
              </h3>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {group.keywords.join(" \u00b7 ")}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects">
        <div className="space-y-3">
          {projects.map((project, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold">
                {project.url ? (
                  <a href={project.url} className="hover:underline">
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h3>
              <p className="text-muted-foreground text-sm">{project.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section title="Education">
        {education.map((edu, i) => (
          <div key={i}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">{edu.institution}</h3>
              <DateRange startDate={edu.startDate} endDate={edu.endDate} />
            </div>
            <p className="text-muted-foreground text-sm">
              {edu.studyType}, {edu.area}
            </p>
          </div>
        ))}
      </Section>

      {/* References */}
      {references.length > 0 && (
        <Section title="References">
          {references.map((ref, i) => (
            <blockquote
              key={i}
              className="border-border border-l-2 pl-4 text-sm italic"
            >
              <p>{ref.reference}</p>
              <footer className="text-muted-foreground mt-1 not-italic">
                &mdash; {ref.name}
              </footer>
            </blockquote>
          ))}
        </Section>
      )}

      {/* Download links */}
      <div className="border-border mt-10 flex flex-wrap gap-4 border-t pt-6 text-sm">
        <a href="/resume.pdf" className="font-medium hover:underline">
          Download PDF
        </a>
        <a href="/resume.docx" className="font-medium hover:underline">
          Download DOCX
        </a>
        <a
          href="https://registry.jsonresume.org/lacymorrow"
          className="font-medium hover:underline"
        >
          View on JSON Resume
        </a>
        <a
          href="https://github.com/lacymorrow/resume"
          className="font-medium hover:underline"
        >
          Source on GitHub
        </a>
      </div>
    </div>
  );
};
