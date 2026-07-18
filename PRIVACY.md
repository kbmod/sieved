# Sieved privacy policy

Effective date: July 18, 2026

Sieved is a Chrome extension that filters repetitive YouTube video cards. Its
classification runs locally in the browser. The developer does not collect,
receive, sell, share, or use personal data from the extension.

## Data Sieved accesses

Sieved accesses only the information needed to provide its filtering and
allowlist features:

- On YouTube pages, it reads video titles, channel names and identifiers, video
  identifiers, and the current YouTube page address from content already shown
  in the page.
- When its toolbar popup is opened, it reads the active tab address to determine
  whether the tab is a YouTube page and to show filtering activity for that tab.
- It stores the enabled state, retailer and trigger choices, custom filter terms,
  and allowed channel identifiers with `chrome.storage.sync`.

Sieved does not inspect thumbnail image pixels. It makes no analytics,
advertising, telemetry, or other remote network requests, and it does not retain
a history of visited videos or pages.

Chrome may sync extension settings through the user's signed-in Google account
as part of the `chrome.storage.sync` service. That syncing is provided by Chrome,
not by Sieved or its developer, and is governed by Google's privacy policies.

## Permissions

- **YouTube site access** lets Sieved identify and hide matching video cards on
  `youtube.com` and `m.youtube.com`.
- **Active tab** lets the toolbar popup confirm that the current tab is YouTube,
  display that tab's hidden-card count, and offer a channel allowlist action.
- **Storage** saves filter preferences and allowed channels across browser
  sessions and, when Chrome sync is enabled, across the user's Chrome browsers.

## Control and deletion

Users can restore default settings from Sieved's settings page. Users can also
remove all extension settings by uninstalling Sieved; Chrome may separately
retain or synchronize settings according to the user's Chrome sync configuration.

## Limited Use

Sieved's use of information received from Chrome APIs adheres to the Chrome Web
Store User Data Policy, including the Limited Use requirements.

## Changes and contact

Material changes to this policy will be published in this repository with a new
effective date. Questions or privacy requests can be submitted through the
[Sieved support tracker](https://github.com/kbmod/sieved/issues).
