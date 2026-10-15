import { process } from "@/data/portfolio";
import GlassCard from "./GlassCard";

const Timeline = () => (
  <ol className="relative flex flex-col gap-4 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-primary before:via-secondary before:to-accent sm:before:left-6">
    {process.map((step) => (
      <li key={step.no} className="relative pl-12 sm:pl-16">
        <span
          aria-hidden="true"
          className="absolute left-2.5 top-5 size-5 rounded-full border border-border bg-background sm:left-3.5"
        >
          <span className="absolute inset-1 rounded-full bg-gradient-to-br from-primary to-accent" />
        </span>
        <GlassCard interactive className="flex flex-col gap-1.5">
          <p className="label-eyebrow">{step.no}</p>
          <h3 className="font-bold">{step.title}</h3>
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </GlassCard>
      </li>
    ))}
  </ol>
);

export default Timeline;
