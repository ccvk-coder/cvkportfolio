import { Link } from "@tanstack/react-router";
import { Linkedin, Mail } from "lucide-react";
import { nav, profile } from "@/data/portfolio";
import { DesktopSidebar, MobileTopBar } from "./Sidebar";
import GlobalSearch from "./GlobalSearch";
import NavBar from "./NavBar";
import Galaxy from "./Galaxy";

const footerLinks = [
  {
    label: "Email",
    href: `mailto:${profile.contact.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "LinkedIn",
    href: profile.contact.linkedin,
    icon: Linkedin,
    external: true,
  },
];

const SiteFooter = () => (
  <footer className="mt-10 flex flex-col gap-5 border-t border-border pt-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-bold">{profile.fullName}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {profile.meta.role} · {profile.contact.location} · {profile.status}
        </p>
      </div>
      <nav aria-label="Footer" className="flex flex-wrap gap-2">
        {nav.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex min-h-11 items-center rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {footerLinks.map(({ label, href, icon: Icon, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-muted px-4 text-xs font-semibold text-foreground transition-colors hover:bg-surface-strong"
          >
            <Icon aria-hidden="true" className="size-4 text-accent" />
            {label}
          </a>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} {profile.fullName}
      </p>
    </div>
  </footer>
);

const AppShell = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Full-page fixed background starfield. */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Galaxy
          density={0.55}
          glowIntensity={0.2}
          flareIntensity={1}
          starSpeed={0.5}
          hueShift={43}
          mouseRepulsion
          clickWarp
          className="size-full"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] gap-6 px-3 py-6 sm:px-6">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <DesktopSidebar />
        <div className="min-w-0 flex-1">
          <MobileTopBar />
          {/* Desktop keeps the nav in the sidebar; phones get the floating bar. */}
          <div className="fixed inset-x-3 bottom-3 z-40 flex justify-center lg:hidden">
            <NavBar />
          </div>
          <GlobalSearch />
          <main id="main" className="pb-28 lg:pb-6">
            {children}
            <SiteFooter />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
