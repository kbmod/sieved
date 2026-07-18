# Sieved privacy policy

Effective date: July 18, 2026

Sieved is a browser extension that filters repetitive YouTube video cards. Its
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
  and allowed channel identifiers. Chrome builds use `chrome.storage.sync`;
  Firefox builds use local extension storage and do not sync those settings.

Sieved does not inspect thumbnail image pixels. It makes no analytics,
advertising, telemetry, or other remote network requests, and it does not retain
a history of visited videos or pages.

Chrome may sync extension settings through the user's signed-in Google account
as part of the `chrome.storage.sync` service. That syncing is provided by Chrome,
not by Sieved or its developer, and is governed by Google's privacy policies.
Firefox settings remain in Firefox's local extension storage and are not sent
through Mozilla Sync by Sieved.

## Permissions

- **YouTube site access** lets Sieved identify and hide matching video cards on
  `youtube.com` and `m.youtube.com`.
- **Active tab** lets the toolbar popup confirm that the current tab is YouTube,
  display that tab's hidden-card count, and offer a channel allowlist action.
- **Storage** saves filter preferences and allowed channels across browser
  sessions. Chrome may sync them when Chrome sync is enabled; Firefox keeps them
  local to that Firefox installation.

## Control and deletion

Users can restore default settings from Sieved's settings page. Users can also
remove all extension settings by uninstalling Sieved; Chrome may separately
retain or synchronize settings according to the user's Chrome sync configuration.
Firefox's locally stored Sieved settings are removed with the extension.

## Limited Use

Sieved's use of information received from Chrome APIs adheres to the Chrome Web
Store User Data Policy, including the Limited Use requirements.

## Changes and contact

Material changes to this policy will be published in this repository with a new
effective date. Questions or privacy requests can be submitted through the
[Sieved support tracker](https://github.com/kbmod/sieved/issues).
