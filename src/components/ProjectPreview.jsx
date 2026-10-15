/**
 * Project visual: renders the real project screenshot when one is supplied,
 * otherwise falls back to a CSS-only placeholder.
 */
const ProjectPreview = ({ hue, label, image, className = "aspect-[16/9]" }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={`${label} — project preview`}
        loading="lazy"
        className={`inset-panel w-full object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${label} — placeholder preview`}
      className={`inset-panel relative w-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, oklch(0.4 0.16 ${hue} / 45%), oklch(0.2 0.05 264 / 80%))`,
      }}
    >
      <div className="absolute inset-0 flex flex-col gap-2 p-4">
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-accent/70" />
          <span className="size-2 rounded-full bg-foreground/30" />
          <span className="size-2 rounded-full bg-foreground/20" />
        </div>
        <div className="h-2 w-1/3 rounded-full bg-foreground/35" />
        <div className="grid flex-1 grid-cols-3 gap-2">
          <div className="rounded-md bg-foreground/10" />
          <div className="col-span-2 rounded-md bg-foreground/[0.07]" />
        </div>
        <div className="h-2 w-1/2 rounded-full bg-foreground/20" />
      </div>
    </div>
  );
};

export default ProjectPreview;
