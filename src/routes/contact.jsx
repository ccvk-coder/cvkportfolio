import { createFileRoute } from "@tanstack/react-router";
import { Mail, Linkedin, MapPin, CalendarCheck } from "lucide-react";
import { profile } from "@/data/portfolio";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";
import GlassCard from "@/components/GlassCard";
import PageHeader from "@/components/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Let's build something great" },
      {
        name: "description",
        content:
          "Get in touch about a project, system, or digital product. Open for selected projects, based in the Philippines.",
      },
      { property: "og:title", content: "Contact — Let's build something great" },
      {
        property: "og:description",
        content: "Have a project, system, or digital product in mind? Start a conversation.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { contact } = profile;

  return (
    <FadeIn>
      <PageHeader
        eyebrow="Contact"
        title="Let's Build Something Great."
        description="Have a project, system, or digital product in mind? Let's discuss how I can help."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <ContactForm />

        <div className="flex flex-col gap-4">
          <GlassCard className="flex items-start gap-3">
            <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="label-eyebrow">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1 block truncate text-sm font-semibold hover:text-accent"
              >
                {contact.email}
              </a>
            </div>
          </GlassCard>
          <GlassCard className="flex items-start gap-3">
            <Linkedin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="label-eyebrow">LinkedIn</p>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate text-sm font-semibold hover:text-accent"
              >
                {contact.linkedinLabel}
              </a>
            </div>
          </GlassCard>
          <GlassCard className="flex items-start gap-3">
            <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="label-eyebrow">Location</p>
              <p className="mt-1 text-sm font-semibold">{contact.location}</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-start gap-3">
            <CalendarCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="label-eyebrow">Availability</p>
              <p className="mt-1 text-sm font-semibold">{contact.availability}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </FadeIn>
  );
}
