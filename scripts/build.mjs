import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { build } from "esbuild";

const release = process.argv.includes("--release");
const targetArgument = process.argv.find((argument) => argument.startsWith("--target="));
const target = targetArgument?.split("=")[1] ?? "chrome";

if (target !== "chrome" && target !== "firefox") {
  throw new Error(`Unknown build target: ${target}`);
}

const outputDirectory = target === "firefox" ? "dist-firefox" : "dist";

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp("public", outputDirectory, { recursive: true });

if (target === "firefox") {
  await copyFile("manifests/firefox.json", `${outputDirectory}/manifest.json`);
}

const shared = {
  bundle: true,
  target: target === "firefox" ? "firefox140" : "chrome120",
  sourcemap: !release,
  logLevel: "info",
};

await build({
  ...shared,
  entryPoints: ["src/content/content.ts"],
  outfile: `${outputDirectory}/content.js`,
  format: "iife",
});

await build({
  ...shared,
  entryPoints: {
    background: "src/background.ts",
    popup: "src/popup/popup.ts",
    options: "src/options/options.ts",
  },
  outdir: outputDirectory,
  format: "esm",
});
