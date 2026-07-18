# Chrome Web Store listing

## Product details

**Name:** Sieved

**Summary:** Hide repetitive YouTube videos about buying the cheapest, worst, or strangest products from major retailers.

**Category:** Tools

**Language:** English

## Detailed description

Sieved removes a specific kind of repetitive content-factory video from
YouTube discovery surfaces: videos framed around buying or testing the cheapest,
worst, strangest, or otherwise sensational products from large retailers.

Filtering works across Home, Search, Subscriptions, channel pages, Shorts
shelves, featured videos, pinned playlists, playlist pages, and watch-page
recommendations. Videos opened directly are not blocked.

You stay in control:

- Enable or disable built-in retailers and trigger phrases.
- Add custom retailers and phrases.
- Allowlist channels you want to keep seeing.
- See how many cards were hidden on the current page.

All matching happens locally using metadata already displayed by YouTube.
Sieved has no advertising or telemetry, makes no remote network requests, and
does not inspect thumbnail images.

Sieved is an independent extension and is not affiliated with YouTube, Google,
Amazon, Temu, Walmart, AliExpress, Shein, Facebook, or Meta.

## Single purpose

Sieved hides YouTube discovery cards that match user-configurable patterns for
repetitive retailer-purchase content.

## Permission justifications

### `storage`

Stores whether filtering is enabled, the user's retailer and trigger selections,
custom filter phrases, and channel allowlist. Settings use Chrome sync storage so
they can persist across sessions and, if the user enables Chrome sync, browsers.

### `activeTab`

Used only after the user opens the toolbar popup. It lets the popup confirm that
the current tab is YouTube, display the number of cards hidden in that tab, and
offer to allowlist the current channel.

### Host access: `https://www.youtube.com/*` and `https://m.youtube.com/*`

Required to run the filter on YouTube. The content script reads rendered video
and channel metadata and hides matching discovery cards. It does not make remote
requests or run on other sites.

## Privacy questionnaire notes

These answers are prepared from the current package; confirm the dashboard's
current wording before submission.

- **Personally identifiable information:** No.
- **Health information:** No.
- **Financial and payment information:** No.
- **Authentication information:** No.
- **Personal communications:** No.
- **Location:** No.
- **Web history:** No history is collected or retained. Current YouTube page
  context is accessed transiently to provide the feature.
- **User activity:** No clicks, keystrokes, mouse position, or browsing activity
  are collected or transmitted.
- **Website content:** Yes. Video titles and channel metadata already rendered
  on YouTube are processed locally to decide which cards to hide.

Certify that data is not sold, used for unrelated purposes, used for credit or
lending, or transferred to third parties. The developer does not receive data
from the extension.

## URLs

- **Homepage:** https://github.com/kbmod/sieved
- **Support:** https://github.com/kbmod/sieved/issues
- **Privacy policy:** https://github.com/kbmod/sieved/blob/main/PRIVACY.md

## Assets

- Store icon: `store-listing/assets/icon-128.png`
- Screenshot: `store-listing/assets/screenshot-options-1280x800.png`
- Small promotional tile: `store-listing/assets/small-promo-440x280.png`
- Promo-video outline: `store-listing/VIDEO_SCRIPT.md`
