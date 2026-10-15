import { createFileRoute } from "@tanstack/react-router";
import { aboutParagraphs, profile } from "@/data/portfolio";
import FadeIn from "@/components/FadeIn";
import GlassCard from "@/components/GlassCard";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Kyle, UX/UI Designer & System Analyst" },
      {
        name: "description",
        content:
          "Kyle is a multidisciplinary technology professional working across UX/UI design, frontend development, system analysis, and IT support.",
      },
      { property: "og:title", content: "About — Kyle, UX/UI Designer & System Analyst" },
      {
        property: "og:description",
        content:
          "Multidisciplinary work across UX/UI design, frontend development, system analysis, and IT support.",
      },
    ],
  }),
  component: AboutPage,
});

const infoRows = [
  ["Role", profile.meta.role],
  ["Specialization", profile.meta.specialization],
  ["Experience", profile.meta.experience],
  ["Location", profile.meta.location],
  ["Current focus", profile.meta.focus],
];

function AboutPage() {
  return (
    <FadeIn>
      <PageHeader
        eyebrow="Profile"
        title="About Me"
        description="A short view of how I work and what I focus on."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <GlassCard as="section" className="flex flex-col gap-4">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-[72ch] text-muted-foreground">
              {paragraph}
            </p>
          ))}
          <ul className="mt-2 grid gap-3 sm:grid-cols-2">
            {["UX/UI Design", "Frontend Development", "System Analysis", "IT Support", "WordPress", "Graphic Design"].map(
              (item) => (
                <li key={item} className="inset-panel px-4 py-3 text-sm font-semibold">
                  {item}
                </li>
              ),
            )}
          </ul>
        </GlassCard>

        <GlassCard as="aside" aria-label="Profile information" className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="size-24 rounded-full object-cover ring-2 ring-primary/50"
            />
            <div>
              <p className="font-bold">{profile.fullName}</p>
              <p className="text-xs text-muted-foreground">{profile.meta.role}</p>
            </div>
            <StatusBadge label={profile.status} />
          </div>
          <dl className="flex flex-col gap-3">
            {infoRows.map(([label, value]) => (
              <div key={label} className="inset-panel px-4 py-3">
                <dt className="label-eyebrow">{label}</dt>
                <dd className="mt-1 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </div>
    </FadeIn>
  );
}
