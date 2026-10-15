import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { dashboardCards, profile } from "@/data/portfolio";
import FadeIn from "@/components/FadeIn";
import GlassCard from "@/components/GlassCard";
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

function HomePage() {
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

      <FadeIn delay={0.3}>
        <GlassCard as="section" aria-label="Current activity" className="grid gap-4 sm:grid-cols-3">
          <div className="inset-panel p-4">
            <p className="label-eyebrow">Current focus</p>
            <p className="mt-1.5 font-semibold">{profile.meta.focus}</p>
          </div>
          <div className="inset-panel p-4">
            <p className="label-eyebrow">Projects</p>
            <p className="mt-1.5 font-semibold">04+</p>
          </div>
          <div className="inset-panel p-4">
            <p className="label-eyebrow">Design tool</p>
            <p className="mt-1.5 font-semibold">{profile.meta.designTool}</p>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
