import { DesktopSidebar, MobileNav, MobileTopBar } from "./Sidebar";
import GlobalSearch from "./GlobalSearch";
import Threads from "./Threads";

const AppShell = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Full-page fixed background Threads animation */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Threads
          color="#7C3AED"
          lineCount={90}
          thickness={0.6}
          softness={1.3}
          amplitude={1.7}
          distance={0.4}
          waves={1.05}
          speed={0.6}
          split={0.04}
          fray={0.5}
          angle={25}
          taper={0.85}
          brightness={1.4}
          parting={0}
          enableMouseInteraction
          fade={0}
          opacity={1}
          seed={0}
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
          <GlobalSearch />
          <MobileTopBar />
          <main id="main" className="pb-28 lg:pb-6">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </div>
  );
};

export default AppShell;
