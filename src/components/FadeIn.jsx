import { cn } from "@/lib/utils";

/** One entrance animation, CSS only, honours prefers-reduced-motion via styles.css. */
const FadeIn = ({ delay = 0, className, children }) => (
  <div
    className={cn("animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both", className)}
    style={delay ? { animationDelay: `${delay}s` } : undefined}
  >
    {children}
  </div>
);

export default FadeIn;
