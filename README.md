# Sieved

Sieved is a local-only browser extension that removes YouTube discovery cards
for the content-factory trend built around buying or testing sensationally bad,
cheap, or extreme products from large online retailers.

The extension does not block a video that you open directly. It filters cards
on YouTube surfaces such as Home, Search, Subscriptions, channel pages, Shorts
shelves, featured channel videos, pinned playlist cards, playlists, and
watch-page recommendations.

Matching normally requires a configured retailer and sensational qualifier. It
accepts both explicit actions (for example, “Bought the cheapest…”) and
retailer-linked offer wording (for example, “The cheapest motor from Amazon” or
“Walmart's cheapest laptop”). High-confidence completed-purchase constructions
such as “I bought the cheapest…” are also filtered when the title omits a
retailer, regardless of capitalization or the object being purchased.

## Development

```bash
npm install
npm test
npm run build
```

Load the generated `dist` directory from `chrome://extensions` after enabling
Developer mode and choosing **Load unpacked**.

Useful commands:

- `npm run typecheck` checks TypeScript without emitting files.
- `npm test` runs the classifier and DOM extraction tests.
- `npm run verify` runs type checking, tests, and a production build.
- `npm run release` verifies the extension, creates a source-map-free production
  build, and packages it as `release/sieved-<version>.zip` for Web Store upload.
- `npm run build:firefox` creates an unpacked Firefox build in `dist-firefox/`.
- `npm run release:firefox` verifies and validates the Firefox build, then creates
  the AMO upload and reviewer-source archives under `release/`.

## Privacy

Classification happens entirely in the browser from metadata already rendered
by YouTube. Sieved makes no network requests, performs no telemetry, and does
not inspect image pixels or send browsing information to a remote classifier.
See the full [privacy policy](PRIVACY.md) for data-access and browser-storage details.

## Chrome Web Store

Submission copy and permission justifications are in
[`store-listing/STORE_LISTING.md`](store-listing/STORE_LISTING.md). Follow
[`SUBMISSION_CHECKLIST.md`](SUBMISSION_CHECKLIST.md) to build, test, and submit a
release.

## Firefox Add-ons

Firefox-specific build reproduction instructions are in
[`FIREFOX_BUILD.md`](FIREFOX_BUILD.md). The AMO listing and reviewer handoff are
documented in [`FIREFOX_SUBMISSION.md`](FIREFOX_SUBMISSION.md).

## License

Sieved is open-source software licensed under the
[Mozilla Public License 2.0](LICENSE).
