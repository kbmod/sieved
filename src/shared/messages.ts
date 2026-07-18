import type { CurrentChannel, TabState } from "./types";

export type RuntimeMessage =
  | { type: "CONTENT_STATE"; count: number; routeKey: string; currentChannel?: CurrentChannel }
  | { type: "GET_TAB_STATE"; tabId: number }
  | { type: "GET_CONTENT_CONTEXT" };

export function isRuntimeMessage(value: unknown): value is RuntimeMessage {
  return Boolean(value && typeof value === "object" && "type" in value);
}

export type TabStateResponse = TabState;
