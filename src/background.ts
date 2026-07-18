import { isRuntimeMessage } from "./shared/messages";
import type { TabState } from "./shared/types";

const tabStates = new Map<number, TabState>();

function updateBadge(tabId: number, count: number): void {
  void chrome.action.setBadgeBackgroundColor({ tabId, color: "#6f9f28" });
  void chrome.action.setBadgeText({ tabId, text: count > 0 ? (count > 999 ? "999+" : String(count)) : "" });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isRuntimeMessage(message)) return;

  if (message.type === "CONTENT_STATE" && sender.tab?.id !== undefined) {
    const state: TabState = {
      count: message.count,
      routeKey: message.routeKey,
      currentChannel: message.currentChannel,
    };
    tabStates.set(sender.tab.id, state);
    updateBadge(sender.tab.id, state.count);
    return;
  }

  if (message.type === "GET_TAB_STATE") {
    sendResponse(tabStates.get(message.tabId) ?? { count: 0, routeKey: "" });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => tabStates.delete(tabId));
