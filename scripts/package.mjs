import { execFileSync } from "node:child_process";
import { access, mkdir, readFile, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const manifest = JSON.parse(await readFile("dist/manifest.json", "utf8"));
const packageMetadata = JSON.parse(await readFile("package.json", "utf8"));
const releaseDirectory = resolve("release");
const archive = resolve(releaseDirectory, `sieved-${manifest.version}.zip`);

if (manifest.version !== packageMetadata.version) {
  throw new Error(`Version mismatch: manifest ${manifest.version}, package ${packageMetadata.version}`);
}

const requiredFiles = [
  "manifest.json",
  "background.js",
  "content.js",
  "content.css",
  "popup.html",
  "popup.js",
  "popup.css",
  "options.html",
  "options.js",
  "options.css",
  "icons/icon-16.png",
  "icons/icon-32.png",
  "icons/icon-48.png",
  "icons/icon-128.png",
];

await Promise.all(requiredFiles.map((file) => access(resolve("dist", file))));

const distFiles = await readdir("dist", { recursive: true });
const forbiddenFiles = distFiles.filter((file) => file.endsWith(".map"));
if (forbiddenFiles.length > 0) {
  throw new Error(`Release build contains source maps: ${forbiddenFiles.join(", ")}`);
}

await mkdir(releaseDirectory, { recursive: true });
await rm(archive, { force: true });

execFileSync("zip", ["-q", "-r", archive, "."], {
  cwd: resolve("dist"),
  stdio: "inherit",
});

console.log(`Created ${archive}`);
