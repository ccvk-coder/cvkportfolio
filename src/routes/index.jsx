import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { dashboardCards, profile, projects } from "@/data/portfolio";
import FadeIn from "@/components/FadeIn";
import GlassCard from "@/components/GlassCard";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import StatusBadge from "@/components/StatusBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kyle — UX/UI Designer & Digital Product Builder" },
      {
        name: "description",
        content:
          "Portfolio of Christ Vein Cabalida (Kyle): UX/UI design, frontend development, system analysis, and IT support for enterprise systems.",
      },
      { property: "og:title", content: "Kyle — UX/UI Designer & Digital Product Builder" },
      {
        property: "og:description",
        content:
          "Designing intuitive digital experiences and building practical systems that connect people, technology, and business.",
      },
    ],
  }),
  component: HomePage,
});

const featuredProjects = projects.filter((project) => !project.type).slice(0, 3);

function HomePage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col gap-12">
      <FadeIn>
        <GlassCard as="section" className="overflow-hidden p-7 sm:p-10">
          <StatusBadge label={profile.status} />
          <p className="mt-6 text-lg text-muted-foreground">{profile.greeting}</p>
          <h1 className="mt-2 max-w-[22ch] text-display font-extrabold tracking-tight">
            {profile.title}
          </h1>
          <p className="mt-4 max-w-[62ch] text-muted-foreground">{profile.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/work"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-gradient-to-r from-primary to-secondary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              View My Work
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-muted px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-strong"
            >
              <Mail aria-hidden="true" className="size-4" />
              Contact Me
            </Link>
          </div>
        </GlassCard>
      </FadeIn>

      <section aria-label="Profile summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <FadeIn key={card.no} delay={0.06 * (index + 1)}>
            <GlassCard interactive className="h-full">
              <p className="label-eyebrow">
                {card.no} — {card.label}
              </p>
              <p className="mt-3 text-lg font-bold">{card.value}</p>
            </GlassCard>
          </FadeIn>
        ))}
      </section>

      <section aria-labelledby="featured-work-title" className="flex flex-col gap-5">
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-eyebrow">Selected work</p>
              <h2
                id="featured-work-title"
                className="mt-2 text-section font-extrabold tracking-tight"
              >
                Systems people use every day
              </h2>
              <p className="mt-2 max-w-[58ch] text-sm text-muted-foreground">
                A few of the platforms I designed and specified, from HR and recruitment to gym
                operations.
              </p>
            </div>
            <Link
              to="/work"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-border bg-muted px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-strong"
            >
              All projects
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <FadeIn key={project.id} delay={0.24 + 0.05 * index} className="h-full">
              <ProjectCard project={project} onOpen={setSelected} />
            </FadeIn>
          ))}
        </div>

        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      </section>
    </div>
  );
}
