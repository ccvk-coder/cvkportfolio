<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Build & hosting decisions
- Kyle's hosting panel serves the repo's `public/` directory and may check it before/without building, so `public/` holds the finished, committed static site (index.html, route folders, assets, favicon, robots). Vite's `publicDir` is `static/` (favicon/robots source) so the committed site never collides with prerender. After any content change, regenerate `public/` by running `npm run build` in a clean /tmp copy with LOVABLE_* env stripped and copying its `public/` back. `npm run build` = `vite build && node scripts/prepare-hosting.mjs` (chained, not postbuild, so bun/ignore-scripts hosts still run it); the script reads `dist/client` or `.output/public` and stays skipped when `LOVABLE_SANDBOX=1`.
- Vite 8 resolves `@/` imports natively via `resolve.tsconfigPaths: true`; `vite-tsconfig-paths` in dependencies is a no-op stub (`stubs/vite-tsconfig-paths`) that only satisfies `@lovable.dev/vite-tanstack-config`'s peer dependency and silences the duplicate-plugin warning. Don't swap it back for the real package unless the config wrapper drops its internal plugin.
