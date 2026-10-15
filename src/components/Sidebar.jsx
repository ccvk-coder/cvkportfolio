import { Link } from "@tanstack/react-router";
import { nav, profile } from "@/data/portfolio";
import StatusBadge from "./StatusBadge";

const NavList = ({ onNavigate }) => (
  <ul className="flex flex-col gap-1">
    {nav.map(({ to, label, icon: Icon }) => (
      <li key={to}>
        <Link
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          activeProps={{
            className:
              "bg-surface-strong text-foreground border border-border shadow-[0_0_0_1px_var(--color-border),0_8px_24px_oklch(0.55_0.22_264/25%)]",
          }}
        >
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          {label}
        </Link>
      </li>
    ))}
  </ul>
);

const ProfileBlock = () => (
  <div className="flex items-center gap-3">
    <img
      src={profile.avatar}
      alt={profile.fullName}
      className="size-12 shrink-0 rounded-full object-cover ring-2 ring-primary/50"
    />
    <div className="min-w-0">
      <p className="truncate font-bold">{profile.fullName}</p>
      <p className="truncate text-xs text-muted-foreground">{profile.meta.role}</p>
    </div>
  </div>
);

export const DesktopSidebar = () => (
  <nav
    aria-label="Main"
    className="glass sticky top-6 hidden h-[calc(100dvh-3rem)] w-72 shrink-0 flex-col justify-between p-5 lg:flex"
  >
    <div>
      <ProfileBlock />
      <div className="mt-4">
        <StatusBadge label={profile.status} />
      </div>
      <hr className="my-5 border-border" />
      <NavList />
    </div>
    <div className="inset-panel p-3">
      <p className="label-eyebrow">Last updated</p>
      <p className="mt-1 text-sm font-semibold">{profile.meta.lastUpdated}</p>
    </div>
  </nav>
);

export const MobileNav = () => (
  <nav
    aria-label="Main"
    className="glass fixed inset-x-3 bottom-3 z-40 flex justify-between gap-1 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
  >
    {nav.map(({ to, label, icon: Icon }) => (
      <Link
        key={to}
        to={to}
        activeOptions={{ exact: to === "/" }}
        aria-label={label}
        className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-md px-1 py-1.5 text-[0.625rem] font-semibold text-muted-foreground transition-colors"
        activeProps={{ className: "bg-surface-strong text-foreground" }}
      >
        <Icon aria-hidden="true" className="size-4" />
        <span className="truncate">{label === "Contact Me" ? "Contact" : label}</span>
      </Link>
    ))}
  </nav>
);

export const MobileTopBar = () => (
  <header className="glass mb-5 flex items-center justify-between gap-3 p-4 lg:hidden">
    <ProfileBlock />
    <StatusBadge label="Available" className="hidden sm:inline-flex" />
  </header>
);
