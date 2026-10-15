import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import ProjectPreview from "./ProjectPreview";

const Field = ({ label, children }) => (
  <div>
    <p className="label-eyebrow">{label}</p>
    <p className="mt-1 text-sm">{children}</p>
  </div>
);

const ProjectModal = ({ project, onClose }) => (
  <Dialog.Root open={Boolean(project)} onOpenChange={(open) => (open ? null : onClose())}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
      <Dialog.Content className="glass fixed left-1/2 top-1/2 z-50 max-h-[88dvh] w-[min(56rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-6 data-[state=open]:animate-in data-[state=open]:zoom-in-95">
        {project ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-eyebrow">{project.category}</p>
                <Dialog.Title className="mt-1 text-2xl font-extrabold tracking-tight">
                  {project.name}
                </Dialog.Title>
              </div>
              <Dialog.Close
                aria-label="Close project details"
                className="inset-panel grid size-11 shrink-0 place-items-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <X aria-hidden="true" className="size-4" />
              </Dialog.Close>
            </div>

            <Dialog.Description className="mt-3 text-sm text-muted-foreground">
              {project.summary}
            </Dialog.Description>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <ProjectPreview
                hue={project.hue}
                label={project.name}
                image={project.image}
                className="aspect-[16/10] sm:col-span-2"
              />
              <div className="inset-panel flex flex-col gap-4 p-4">
                <Field label="Role">{project.role}</Field>
                <Field label="Tools">{project.tools.join(" • ")}</Field>
              </div>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["Overview", project.overview],
                ["Challenge", project.challenge],
                ["Solution", project.solution],
                ["My Contribution", project.contribution],
                ["Result", project.result],
              ].map(([label, value]) => (
                <div key={label} className="inset-panel p-4">
                  <dt className="label-eyebrow">{label}</dt>
                  <dd className="mt-1.5 text-sm text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default ProjectModal;
