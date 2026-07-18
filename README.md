# Sieved

Sieved is a local-only Chrome extension that removes YouTube discovery cards
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

## Privacy

Classification happens entirely in the browser from metadata already rendered
by YouTube. Sieved makes no network requests, performs no telemetry, and does
not inspect image pixels or send browsing information to a remote classifier.
