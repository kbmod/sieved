import { normalizeChannelIdentifier } from "../shared/normalize";
import type { CurrentChannel, VideoCandidate } from "../shared/types";

export const RENDERER_SELECTOR = [
  "ytd-rich-item-renderer",
  "ytd-video-renderer",
  "ytd-grid-video-renderer",
  "ytd-rich-grid-media",
  "ytd-compact-video-renderer",
  "ytd-channel-video-player-renderer",
  "ytd-playlist-video-renderer",
  "ytd-playlist-panel-video-renderer",
  "ytd-playlist-renderer",
  "ytd-grid-playlist-renderer",
  "ytd-compact-playlist-renderer",
  "ytd-radio-renderer",
  "ytd-compact-radio-renderer",
  "ytd-reel-item-renderer",
  "ytm-shorts-lockup-view-model",
  "ytm-playlist-lockup-view-model",
  "yt-lockup-view-model",
  "ytd-notification-renderer",
  ".ytp-videowall-still",
].join(",");

const TITLE_SELECTORS = [
  "#video-title",
  "a#video-title-link",
  "#playlist-title",
  "a#playlist-title-link",
  ".yt-lockup-metadata-view-model__title",
  ".ytp-videowall-still-info-title",
  "h3 a[href*='/watch']",
  "h3 a[href*='/playlist?list=']",
  "a[href*='/playlist?list='][title]",
  "a[href*='/shorts/'][title]",
].join(",");

const CHANNEL_SELECTORS = [
  "#channel-name a",
  "ytd-channel-name a",
  "a[href^='/@']",
  "a[href^='/channel/']",
  "a[href^='/c/']",
  "a[href^='/user/']",
].join(",");

function textFrom(element: Element | null): string {
  if (!element) return "";
  return (
    element.getAttribute("title") ||
    element.textContent ||
    element.getAttribute("aria-label") ||
    ""
  ).trim();
}

function videoIdFrom(root: Element): string | undefined {
  const link = root.querySelector<HTMLAnchorElement>("a[href*='/watch?'], a[href*='/shorts/']");
  if (!link) return undefined;
  try {
    const url = new URL(link.href, location.origin);
    return url.searchParams.get("v") || url.pathname.match(/^\/shorts\/([^/?]+)/)?.[1];
  } catch {
    return undefined;
  }
}

export function extractCandidate(root: Element): VideoCandidate | null {
  const titleElement = root.matches(TITLE_SELECTORS) ? root : root.querySelector(TITLE_SELECTORS);
  let title = textFrom(titleElement);
  if (!title) {
    const link = root.querySelector<Element>(
      "a[href*='/watch?'][aria-label], a[href*='/shorts/'][aria-label], a[href*='/playlist?list='][aria-label]",
    );
    title = textFrom(link);
  }
  if (!title) return null;

  const channelIdentifiers = new Set<string>();
  for (const link of root.querySelectorAll<HTMLAnchorElement>(CHANNEL_SELECTORS)) {
    const hrefId = normalizeChannelIdentifier(link.getAttribute("href") || "");
    const nameId = normalizeChannelIdentifier(textFrom(link));
    if (hrefId) channelIdentifiers.add(hrefId);
    if (nameId) channelIdentifiers.add(nameId);
  }

  return { title, videoId: videoIdFrom(root), channelIdentifiers: [...channelIdentifiers] };
}

export function findRendererRoots(scope: ParentNode): Element[] {
  const roots = new Set<Element>();
  if (scope instanceof Element && scope.matches(RENDERER_SELECTOR)) roots.add(scope);
  for (const root of scope.querySelectorAll(RENDERER_SELECTOR)) roots.add(root);
  return [...roots];
}

export function detectCurrentChannel(): CurrentChannel | undefined {
  const pathMatch = location.pathname.match(/^\/(?:@[^/]+|channel\/[^/]+|c\/[^/]+|user\/[^/]+)/);
  if (pathMatch) {
    const identifier = normalizeChannelIdentifier(pathMatch[0]);
    const label = textFrom(document.querySelector("#channel-header-container #text, #page-header h1")) || pathMatch[0];
    return identifier ? { identifier, label } : undefined;
  }

  const owner = document.querySelector<HTMLAnchorElement>(
    "ytd-watch-metadata #owner a[href^='/'], #upload-info a[href^='/@'], ytd-video-owner-renderer a[href^='/']",
  );
  if (!owner) return undefined;
  const identifier = normalizeChannelIdentifier(owner.getAttribute("href") || "");
  return identifier ? { identifier, label: textFrom(owner) || identifier } : undefined;
}
