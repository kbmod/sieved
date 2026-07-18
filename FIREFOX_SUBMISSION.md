# Firefox Add-ons submission

## Upload files

- Extension: `release/sieved-firefox-1.0.1.zip`
- Reviewer source: `release/sieved-firefox-1.0.1-source.zip`

Choose **On this site** when submitting if Sieved should be publicly listed on
addons.mozilla.org. Select Firefox desktop as the compatible platform for the
initial release.

The initial AMO release requires Firefox desktop 142 or later. This matches the
minimum version where Mozilla's required built-in data-collection declaration is
supported without compatibility warnings.

The Firefox manifest intentionally omits `browser_specific_settings.gecko_android`.
Mozilla uses the absence of that key to keep this version off the Firefox for
Android listing until Android has been tested explicitly.

## Listing

- **Name:** Sieved
- **URL slug:** `sieved` if available
- **Summary:** Hide repetitive YouTube videos about buying the cheapest, worst,
  or strangest products from major retailers.
- **Description:** Use the detailed description in
  `store-listing/STORE_LISTING.md`.
- **Experimental:** No
- **Requires payment or non-free services:** No
- **Categories:** Photos, Music & Videos; Search Tools; Appearance
- **Homepage:** https://github.com/kbmod/sieved
- **Support website:** https://github.com/kbmod/sieved/issues
- **License:** Mozilla Public License 2.0
- **Privacy policy:** https://github.com/kbmod/sieved/blob/main/PRIVACY.md

Use `store-listing/assets/icon-128.png` and
`store-listing/assets/screenshot-options-1280x800.png` for the listing. AMO may
resize the screenshot after upload.

## Source code question

Answer **Yes** when asked whether source code must be provided, then upload the
reviewer source archive. Paste the commands from `FIREFOX_BUILD.md` into the
build-instructions field.

## Notes for reviewers

```text
Sieved requires no account or credentials. It runs only on youtube.com and
m.youtube.com. Visit a YouTube discovery surface and search for retailer-purchase
titles such as "I bought the cheapest item from Amazon." Matching discovery cards
are hidden locally. Open the toolbar popup to view the hidden-card count, or open
More settings to configure retailers, trigger phrases, and allowed channels.

The extension makes no remote requests, includes no remote code, telemetry, ads,
or tracking, and declares data_collection_permissions.required as "none". In the
Firefox build, user preferences remain in browser.storage.local and are not sent
through Mozilla Sync. The submitted JavaScript is bundled from TypeScript without
minification; full source and exact build instructions are included in the
separate source archive.
```
