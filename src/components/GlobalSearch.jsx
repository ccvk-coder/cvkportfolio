import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, Search, X } from "lucide-react";
import { nav, projects, expertise } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const searchableItems = [
  ...nav.map(({ to, label, icon }) => ({
    to,
    label,
    description: `${label} page`,
    icon,
    keywords: label,
    category: "Page",
  })),
  ...projects.map((project) => ({
    to: "/work",
    label: project.name,
    description: project.category,
    icon: BriefcaseBusiness,
    keywords: `${project.name} ${project.category} ${project.tags.join(" ")} ${project.summary}`,
    category: "Project",
  })),
  ...expertise.map((item) => ({
    to: "/expertise",
    label: item.title,
    description: item.tools.join(" • "),
    icon: item.icon,
    keywords: `${item.title} ${item.description} ${item.tools.join(" ")}`,
    category: "Expertise",
  })),
];

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return nav.slice(0, 6).map(({ to, label, icon }) => ({
        to,
        label,
        description: `${label} page`,
        icon,
        category: "Page",
      }));
    }

    return searchableItems
      .filter((item) => item.keywords.toLowerCase().includes(term))
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
        searchRef.current?.blur();
      }
    };

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeSearch = () => {
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="sticky top-3 z-50 mb-5 lg:top-6">
      {/* Click-away backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "relative z-50 flex min-h-14 items-center gap-3 rounded-[var(--radius-lg)] border px-4 py-2.5 transition-all duration-200",
          open
            ? "border-primary/60 bg-[oklch(0.18_0.035_264)] shadow-[0_12px_32px_rgba(0,0,0,0.6)] ring-2 ring-primary/40"
            : "glass"
        )}
      >
        <Search aria-hidden="true" className="size-5 shrink-0 text-accent" />
        <label htmlFor="portfolio-search" className="sr-only">
          Search portfolio
        </label>
        <input
          ref={searchRef}
          id="portfolio-search"
          type="search"
          value={query}
          autoComplete="off"
          placeholder="Search pages, projects, and expertise..."
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-hidden placeholder:text-muted-foreground"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            className="grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery("");
              searchRef.current?.focus();
            }}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : (
          <span className="hidden shrink-0 rounded-md border border-border bg-muted px-2 py-1 text-[0.625rem] font-bold text-muted-foreground sm:inline-flex">
            CTRL K
          </span>
        )}

        {open && (
          <div
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-border/80 bg-[oklch(0.17_0.035_264)] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
            role="listbox"
          >
            <div className="flex items-center justify-between border-b border-border/40 px-3 py-2 text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
              <span>{query ? `Search results (${results.length})` : "Quick navigation"}</span>
              <span className="font-normal lowercase text-muted-foreground/70">ESC to close</span>
            </div>

            {results.length > 0 ? (
              <div className="grid gap-1 pt-1">
                {results.map(({ to, label, description, icon: Icon, category }, index) => (
                  <Link
                    key={`${to}-${label}-${index}`}
                    to={to}
                    onClick={closeSearch}
                    className="group grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all duration-150 hover:bg-surface-strong hover:ring-1 hover:ring-border/60"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface text-accent shadow-xs transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="block truncate text-sm font-bold text-foreground group-hover:text-white">
                          {label}
                        </span>
                        {category && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[0.625rem] font-semibold text-muted-foreground group-hover:text-foreground">
                            {category}
                          </span>
                        )}
                      </div>
                      <span className="block truncate text-xs text-muted-foreground group-hover:text-foreground/80">
                        {description}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No matching pages, projects, or expertise found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;