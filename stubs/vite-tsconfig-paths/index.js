// No-op replacement for vite-tsconfig-paths.
// Vite 8 handles tsconfig path aliases natively when `resolve.tsconfigPaths: true`
// is set in the Vite config, so this plugin does nothing. It keeps a distinct
// plugin name so Vite does not emit the "duplicate tsconfig paths plugin" warning.
export default function tsconfigPathsStub() {
  return {
    name: "lovable-tsconfig-paths-stub",
    enforce: "pre",
  };
}

export const tsconfigPaths = tsconfigPathsStub;
