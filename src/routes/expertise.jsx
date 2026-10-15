import { createFileRoute } from "@tanstack/react-router";
import { expertise } from "@/data/portfolio";
import FadeIn from "@/components/FadeIn";
import PageHeader from "@/components/PageHeader";
import SkillCard from "@/components/SkillCard";

export const Route = createFileRoute("/expertise")({
  head: () => ({
    meta: [
      { title: "Expertise — UX/UI, Frontend, Systems, IT Support" },
      {
        name: "description",
        content:
          "Expertise across UX/UI design, frontend development, mobile design, system analysis, IT support, and visual design.",
      },
      { property: "og:title", content: "Expertise — UX/UI, Frontend, Systems, IT Support" },
      {
        property: "og:description",
        content: "The disciplines, tools, and skill areas Kyle works in day to day.",
      },
    ],
  }),
  component: ExpertisePage,
});

function ExpertisePage() {
  return (
    <FadeIn>
      <PageHeader
        eyebrow="Capabilities"
        title="Expertise"
        description="Six areas I work in, and the tools I use in each."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {expertise.map((skill) => (
          <SkillCard key={skill.title} skill={skill} />
        ))}
      </div>
    </FadeIn>
  );
}
