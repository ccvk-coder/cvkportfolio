// Host-safe build: rebuilds when possible, otherwise keeps the committed public/ site.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const major = Number(process.versions.node.split(".")[0]);
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
const hasSite = existsSync(path.join(root, "public", "index.html"));

if (major < 22 || !existsSync(viteBin)) {
  console.log(
    `[build] Skipping rebuild (node ${process.versions.node}, vite ${existsSync(viteBin) ? "found" : "missing"}).`,
  );
  if (hasSite) {
    console.log("[build] Using the prebuilt site already in public/.");
    process.exit(0);
  }
  console.error("[build] public/index.html missing and cannot rebuild.");
  process.exit(1);
}

const run = (args) => spawnSync(process.execPath, args, { stdio: "inherit" }).status ?? 1;
const code = run([viteBin, "build"]);
if (code !== 0) {
  if (hasSite) {
    console.warn("[build] vite build failed — keeping the prebuilt site in public/.");
    process.exit(0);
  }
  process.exit(code);
}
process.exit(run([path.join(root, "scripts", "prepare-hosting.mjs")]));
