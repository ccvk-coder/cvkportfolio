import { profile } from "@/data/portfolio";
import NavBar from "./NavBar";
import StatusBadge from "./StatusBadge";

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
  <aside
    aria-label="Profile"
    className="glass sticky top-6 hidden h-[calc(100dvh-3rem)] w-72 shrink-0 flex-col justify-between p-5 lg:flex"
  >
    <div>
      <ProfileBlock />
      <div className="mt-4">
        <StatusBadge label={profile.status} />
      </div>
      <hr className="my-5 border-border" />
      <NavBar layout="sidebar" />
    </div>
    <div className="inset-panel p-3">
      <p className="label-eyebrow">Last updated</p>
      <p className="mt-1 text-sm font-semibold">{profile.meta.lastUpdated}</p>
    </div>
  </aside>
);

export const MobileTopBar = () => (
  <header className="glass mb-5 flex items-center justify-between gap-3 p-4 lg:hidden">
    <ProfileBlock />
    <StatusBadge label="Available" className="hidden sm:inline-flex" />
  </header>
);
