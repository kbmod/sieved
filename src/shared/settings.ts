import { cloneDefaults, DEFAULT_SETTINGS } from "./defaults";
import { normalizeChannelIdentifier, normalizeTerm } from "./normalize";
import type { BuiltInRule, SettingsV1 } from "./types";

export const STORAGE_KEY = "settings";

function mergeRules(value: unknown, defaults: BuiltInRule[]): BuiltInRule[] {
  const stored = Array.isArray(value) ? value : [];
  return defaults.map((rule) => {
    const match = stored.find((item) => item && typeof item === "object" && "id" in item && item.id === rule.id);
    return { ...rule, enabled: match && "enabled" in match ? Boolean(match.enabled) : rule.enabled };
  });
}

function cleanTerms(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string").map(normalizeTerm).filter(Boolean))].slice(0, 100);
}

function cleanChannels(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string").map(normalizeChannelIdentifier).filter(Boolean))].slice(0, 250);
}

export function sanitizeSettings(value: unknown): SettingsV1 {
  if (!value || typeof value !== "object") return cloneDefaults();
  const input = value as Partial<SettingsV1>;
  return {
    version: 1,
    enabled: typeof input.enabled === "boolean" ? input.enabled : true,
    retailers: mergeRules(input.retailers, DEFAULT_SETTINGS.retailers),
    triggers: mergeRules(input.triggers, DEFAULT_SETTINGS.triggers),
    customRetailers: cleanTerms(input.customRetailers),
    customTriggers: cleanTerms(input.customTriggers),
    allowedChannels: cleanChannels(input.allowedChannels),
  };
}

export async function loadSettings(): Promise<SettingsV1> {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  return sanitizeSettings(stored[STORAGE_KEY]);
}

export async function saveSettings(settings: SettingsV1): Promise<SettingsV1> {
  const clean = sanitizeSettings(settings);
  await chrome.storage.sync.set({ [STORAGE_KEY]: clean });
  return clean;
}
