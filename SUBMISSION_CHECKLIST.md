# Chrome Web Store submission checklist

## Publisher account

- [ ] Register the publishing Google account as a Chrome Web Store developer,
      accept the developer agreement, and pay the one-time registration fee.
- [ ] Confirm the developer email is monitored; Google sends review and policy
      notices to that address, and the account email cannot later be changed.

## Before upload

- [ ] Confirm `main` contains the public `PRIVACY.md` at the URL in the listing.
- [ ] Review the store copy and privacy disclosures in
      `store-listing/STORE_LISTING.md` against the current dashboard wording.
- [ ] Run `npm ci` and `npm run release` from a clean checkout.
- [ ] Load `dist/` unpacked in Chrome and test Home, Search, Subscriptions,
      channel pages, playlists, Shorts shelves, and watch recommendations.
- [ ] Confirm the popup, enable toggle, hidden count, settings page, custom terms,
      channel allowlisting, and restore-defaults action work.
- [ ] Inspect `release/sieved-1.0.0.zip`; `manifest.json` must be at the ZIP root
      and the archive must not contain source maps, tests, or development files.

## Dashboard

- [ ] Upload `release/sieved-1.0.0.zip` as a new item.
- [ ] Paste the product details and detailed description from the store listing.
- [ ] Upload the 128 px icon, 1280 x 800 screenshot, and 440 x 280 small promo.
- [ ] Record and upload the short demo outlined in
      `store-listing/VIDEO_SCRIPT.md` if the dashboard requires a promo-video URL.
- [ ] Add the homepage, support, and privacy-policy URLs.
- [ ] Add the single-purpose statement and all permission justifications.
- [ ] Complete privacy disclosures, including local processing of YouTube website
      content and settings stored with Chrome sync storage.
- [ ] Choose distribution regions and visibility.
- [ ] Enter reviewer test instructions if the dashboard requests them.
- [ ] Preview the listing and verify that screenshots and copy describe the
      submitted version exactly.
- [ ] Submit for review only after all dashboard sections show complete.

## Future releases

- Increment the four-part-compatible manifest version before every upload.
- Re-run the release command and repeat the unpacked-package smoke test.
- Update screenshots, listing copy, permissions, and the privacy policy whenever
  functionality or data handling changes.
