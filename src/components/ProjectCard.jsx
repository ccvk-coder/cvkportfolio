import { ArrowUpRight } from "lucide-react";
import GlassCard from "./GlassCard";
import ProjectPreview from "./ProjectPreview";

const ProjectCard = ({ project, onOpen }) => (
  <GlassCard as="article" interactive className="flex flex-col gap-4">
    <ProjectPreview hue={project.hue} label={project.name} image={project.image} />
    <div className="flex flex-col gap-2">
      <p className="label-eyebrow">{project.category}</p>
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-sm text-muted-foreground">{project.summary}</p>
    </div>
    <ul className="flex flex-wrap gap-1.5">
      {project.tools.map((tool) => (
        <li
          key={tool}
          className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
        >
          {tool}
        </li>
      ))}
    </ul>
    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
      <span className="text-xs text-muted-foreground">{project.role}</span>
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        View Project
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  </GlassCard>
);

export default ProjectCard;
