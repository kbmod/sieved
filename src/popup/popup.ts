import { loadSettings, saveSettings } from "../shared/settings";
import type { TabState } from "../shared/types";
import { webext } from "../shared/webext";

const enabledInput = document.querySelector<HTMLInputElement>("#enabled")!;
const hiddenCount = document.querySelector<HTMLElement>("#hidden-count")!;
const allowChannel = document.querySelector<HTMLButtonElement>("#allow-channel")!;
const moreSettings = document.querySelector<HTMLButtonElement>("#more-settings")!;
const pageMessage = document.querySelector<HTMLElement>("#page-message")!;

async function activeTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await webext.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function init(): Promise<void> {
  const [settings, tab] = await Promise.all([loadSettings(), activeTab()]);
  enabledInput.checked = settings.enabled;

  if (!tab?.id || !tab.url?.includes("youtube.com")) {
    pageMessage.textContent = "Open YouTube to see filtering activity.";
    return;
  }

  let state: TabState = await webext.runtime.sendMessage({ type: "GET_TAB_STATE", tabId: tab.id });
  try {
    state = await webext.tabs.sendMessage(tab.id, { type: "GET_CONTENT_CONTEXT" });
  } catch {
    // The tab may predate extension installation; the service-worker state is still useful.
  }

  hiddenCount.textContent = String(Math.max(0, state.count));
  if (state.currentChannel && !settings.allowedChannels.includes(state.currentChannel.identifier)) {
    allowChannel.hidden = false;
    allowChannel.textContent = `Allow ${state.currentChannel.label}`;
    allowChannel.addEventListener("click", async () => {
      const next = await loadSettings();
      next.allowedChannels = [...new Set([...next.allowedChannels, state.currentChannel!.identifier])];
      await saveSettings(next);
      allowChannel.hidden = true;
      pageMessage.textContent = "Channel added to the allowlist.";
    });
  }
}

enabledInput.addEventListener("change", async () => {
  const settings = await loadSettings();
  settings.enabled = enabledInput.checked;
  await saveSettings(settings);
  pageMessage.textContent = settings.enabled ? "Filtering enabled." : "Filtering disabled.";
});

moreSettings.addEventListener("click", () => void webext.runtime.openOptionsPage());

void init();
