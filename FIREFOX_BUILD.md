# Firefox reviewer build instructions

Sieved's submitted JavaScript is generated from TypeScript with esbuild. The
source archive contains all source files, build scripts, tests, and the npm lock
file required to reproduce the submitted Firefox package.

## Requirements

- Node.js 20 or later
- npm 9 or later
- `zip` available on `PATH` when creating the final archives
- Network access to the public npm registry for `npm ci`

No global npm packages are required.

## Reproduce the Firefox build

From the root of the extracted source archive, run:

```bash
npm ci
npm run typecheck
npm test
npm run build:firefox:release
npm run lint:firefox
```

The unpacked extension is produced in `dist-firefox/`. The submitted archive is
then reproducible with:

```bash
node scripts/package-firefox.mjs
```

This creates `release/sieved-firefox-1.0.1.zip`. ZIP timestamps may differ, but
the runtime files are generated from the same locked dependencies and source.

## Source mapping

- `src/content/content.ts` builds to `dist-firefox/content.js`.
- `src/background.ts` builds to `dist-firefox/background.js`.
- `src/popup/popup.ts` builds to `dist-firefox/popup.js`.
- `src/options/options.ts` builds to `dist-firefox/options.js`.
- Shared TypeScript under `src/shared/` is bundled into those entry points.
- Static files under `public/` are copied to `dist-firefox/`.
- `manifests/firefox.json` replaces the Chrome manifest in the Firefox build.

The release build intentionally omits source maps. There is no minification,
obfuscation, remote code, generated native code, or vendored third-party runtime
code.
