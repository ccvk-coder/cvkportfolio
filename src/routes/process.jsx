import { createFileRoute } from "@tanstack/react-router";
import FadeIn from "@/components/FadeIn";
import PageHeader from "@/components/PageHeader";
import Timeline from "@/components/Timeline";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Process — From discovery to developer handoff" },
      {
        name: "description",
        content:
          "A six-step design process: discover, research, define, design, validate, and handoff.",
      },
      { property: "og:title", content: "Process — From discovery to developer handoff" },
      {
        property: "og:description",
        content: "How Kyle moves a project from requirements to implementation-ready design.",
      },
    ],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <FadeIn>
      <PageHeader
        eyebrow="Workflow"
        title="Process"
        description="How a project moves from first conversation to developer handoff."
      />
      <Timeline />
    </FadeIn>
  );
}
