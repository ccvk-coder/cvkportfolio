import GlassCard from "./GlassCard";

const SkillCard = ({ skill }) => {
  const Icon = skill.icon;
  return (
    <GlassCard as="article" interactive className="flex flex-col gap-4">
      <span className="inset-panel grid size-11 place-items-center text-accent">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <h3 className="font-bold">{skill.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{skill.description}</p>
      </div>
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Proficiency</span>
          <span>{skill.level}%</span>
        </div>
        <div
          role="progressbar"
          aria-label={`${skill.title} proficiency`}
          aria-valuenow={skill.level}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-700"
            style={{ width: `${skill.level}%` }}
          />
        </div>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {skill.tools.map((tool) => (
          <li
            key={tool}
            className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
          >
            {tool}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
};

export default SkillCard;
