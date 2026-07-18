import { classifyCandidate } from "../shared/classifier";
import { isRuntimeMessage } from "../shared/messages";
import { loadSettings, STORAGE_AREA, STORAGE_KEY } from "../shared/settings";
import type { CurrentChannel, SettingsV1 } from "../shared/types";
import { webext } from "../shared/webext";
import { detectCurrentChannel, extractCandidate, findRendererRoots } from "./candidates";

const HIDDEN_ATTRIBUTE = "data-sieved-hidden";
const REASON_ATTRIBUTE = "data-sieved-reason";

let settings: SettingsV1;
let routeKey = currentRouteKey();
let lastCount = -1;
let lastChannelIdentifier = "";
let currentChannel: CurrentChannel | undefined;
let scanTimer: number | undefined;
let candidateSignatures = new WeakMap<Element, string>();

function currentRouteKey(): string {
  return `${location.pathname}${location.search}`;
}

function restore(root: Element): void {
  root.removeAttribute(HIDDEN_ATTRIBUTE);
  root.removeAttribute(REASON_ATTRIBUTE);
}

function scan(): void {
  scanTimer = undefined;
  const nextRoute = currentRouteKey();
  if (nextRoute !== routeKey) {
    for (const element of document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`)) restore(element);
    routeKey = nextRoute;
    candidateSignatures = new WeakMap();
    lastCount = -1;
  }

  for (const root of findRendererRoots(document)) {
    const candidate = extractCandidate(root);
    if (!candidate) {
      restore(root);
      continue;
    }
    const signature = JSON.stringify([candidate.title, candidate.videoId, candidate.channelIdentifiers, settings]);
    if (candidateSignatures.get(root) === signature) continue;
    candidateSignatures.set(root, signature);

    const result = classifyCandidate(candidate, settings);
    if (result.blocked) {
      root.setAttribute(HIDDEN_ATTRIBUTE, "true");
      root.setAttribute(REASON_ATTRIBUTE, [result.retailer, result.trigger].filter(Boolean).join(": "));
    } else {
      restore(root);
    }
  }

  currentChannel = detectCurrentChannel();
  publishState();
}

function scheduleScan(delay = 60): void {
  if (scanTimer !== undefined) window.clearTimeout(scanTimer);
  scanTimer = window.setTimeout(scan, delay);
}

function publishState(): void {
  const count = settings.enabled ? document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}="true"]`).length : 0;
  const channelIdentifier = currentChannel?.identifier ?? "";
  if (count === lastCount && channelIdentifier === lastChannelIdentifier) return;
  lastCount = count;
  lastChannelIdentifier = channelIdentifier;
  void webext.runtime.sendMessage({ type: "CONTENT_STATE", count, routeKey, currentChannel }).catch(() => undefined);
}

async function refreshSettings(): Promise<void> {
  settings = await loadSettings();
  candidateSignatures = new WeakMap();
  if (!settings.enabled) {
    for (const element of document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`)) restore(element);
  }
  scheduleScan(0);
}

async function start(): Promise<void> {
  settings = await loadSettings();

  const observer = new MutationObserver(() => scheduleScan());
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["title", "aria-label", "href"],
  });

  for (const eventName of ["yt-navigate-finish", "yt-page-data-updated", "popstate"]) {
    window.addEventListener(eventName, () => scheduleScan(0));
  }

  webext.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === STORAGE_AREA && STORAGE_KEY in changes) void refreshSettings();
  });

  webext.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!isRuntimeMessage(message) || message.type !== "GET_CONTENT_CONTEXT") return;
    sendResponse({ count: lastCount < 0 ? 0 : lastCount, routeKey, currentChannel: detectCurrentChannel() });
  });

  scan();
}

void start();
