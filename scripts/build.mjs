import { cp, mkdir, rm } from "node:fs/promises";
import { build } from "esbuild";

const release = process.argv.includes("--release");

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });

const shared = {
  bundle: true,
  target: "chrome120",
  sourcemap: !release,
  logLevel: "info",
};

await build({
  ...shared,
  entryPoints: ["src/content/content.ts"],
  outfile: "dist/content.js",
  format: "iife",
});

await build({
  ...shared,
  entryPoints: {
    background: "src/background.ts",
    popup: "src/popup/popup.ts",
    options: "src/options/options.ts",
  },
  outdir: "dist",
  format: "esm",
});
