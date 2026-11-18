import { useCallback } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { nav } from "@/data/portfolio";
import GooeyNav from "./GooeyNav";

const paths = nav.map((item) => item.to);

/** Match "/work" and anything nested under it to its nav item. */
const activeIndexFor = (pathname) => {
  const path = pathname.replace(/\/+$/, "") || "/";
  const index = paths.findIndex((to) => to === path || (to !== "/" && path.startsWith(`${to}/`)));
  return index === -1 ? 0 : index;
};

/** Frame colours from the site tokens so the bar reads as part of the glass system. */
const frameVars = {
  "--gn-frame": "oklch(0.23 0.04 264 / 72%)",
  "--gn-frame-edge": "oklch(0.99 0 0 / 14%)",
  "--gn-frame-highlight": "oklch(1 0 0 / 12%)",
  "--gn-frame-shadow":
    "0 18px 44px -20px oklch(0.1 0.02 264 / 75%), 0 4px 14px -8px oklch(0.1 0.02 264 / 55%)",
};

/** Sidebar rows: same padding and type size as the original sidebar links. */
const sidebarVars = {
  "--gn-font": "14px",
  "--gn-x": "12px",
  "--gn-y": "11px",
  "--gn-gap": "4px",
};

const sidebarClasses =
  "w-full [&>div]:w-full [&_ul]:flex-col [&_ul]:items-stretch [&_li]:w-full [&_ul_button]:w-full [&_ul_a]:w-full";

/**
 * layout="sidebar" — vertical list inside the desktop sidebar (frame off, icons on).
 * layout="bar"     — the floating pill bar used on phones.
 */
const NavBar = ({ layout = "bar" }) => {
  const sidebar = layout === "sidebar";
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeIndex = activeIndexFor(pathname);

  // Items render as buttons, so navigation stays client-side instead of reloading the page.
  const handleChange = useCallback(
    (index) => {
      const to = paths[index];
      if (to) navigate({ to });
    },
    [navigate],
  );

  return (
    <GooeyNav
      items={nav.map(({ label, icon: Icon }) => (sidebar ? { label, icon: <Icon /> } : { label }))}
      activeIndex={activeIndex}
      onChange={handleChange}
      theme="dark"
      color="#22d3ee"
      colors={["#22d3ee", "#7c3aed", "#a78bfa"]}
      size="sm"
      frame={!sidebar}
      particleCount={14}
      spread={44}
      animationTime={620}
      timeVariance={280}
      gooeyness={0.55}
      wobble={0.45}
      className={sidebar ? sidebarClasses : "nav-bar-compact [&_ul]:justify-center"}
      style={sidebar ? sidebarVars : frameVars}
    />
  );
};

export default NavBar;
