import { execFileSync } from "node:child_process";
import { access, mkdir, readFile, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const sourceDirectory = resolve("dist-firefox");
const manifest = JSON.parse(await readFile(resolve(sourceDirectory, "manifest.json"), "utf8"));
const packageMetadata = JSON.parse(await readFile("package.json", "utf8"));
const releaseDirectory = resolve("release");
const extensionArchive = resolve(releaseDirectory, `sieved-firefox-${manifest.version}.zip`);
const sourceArchive = resolve(releaseDirectory, `sieved-firefox-${manifest.version}-source.zip`);

if (manifest.version !== packageMetadata.version) {
  throw new Error(`Version mismatch: Firefox manifest ${manifest.version}, package ${packageMetadata.version}`);
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

await Promise.all(requiredFiles.map((file) => access(resolve(sourceDirectory, file))));

const builtFiles = await readdir(sourceDirectory, { recursive: true });
const forbiddenFiles = builtFiles.filter((file) => file.endsWith(".map"));
if (forbiddenFiles.length > 0) {
  throw new Error(`Firefox release build contains source maps: ${forbiddenFiles.join(", ")}`);
}

await mkdir(releaseDirectory, { recursive: true });
await Promise.all([rm(extensionArchive, { force: true }), rm(sourceArchive, { force: true })]);

execFileSync(
  resolve("node_modules/.bin/web-ext"),
  [
    "build",
    "--source-dir",
    sourceDirectory,
    "--artifacts-dir",
    releaseDirectory,
    "--filename",
    `sieved-firefox-${manifest.version}.zip`,
    "--overwrite-dest",
    "--no-input",
  ],
  { stdio: "inherit" },
);

const sourceEntries = [
  ".gitignore",
  "LICENSE",
  "README.md",
  "PRIVACY.md",
  "FIREFOX_BUILD.md",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vitest.config.ts",
  "assets",
  "manifests",
  "public",
  "scripts",
  "src",
  "tests",
];

execFileSync("zip", ["-q", "-r", sourceArchive, ...sourceEntries], { cwd: resolve("."), stdio: "inherit" });

console.log(`Created ${extensionArchive}`);
console.log(`Created ${sourceArchive}`);
