import type { SettingsV1 } from "./types";

export const DEFAULT_SETTINGS: SettingsV1 = {
  version: 1,
  enabled: true,
  retailers: [
    { id: "amazon", label: "Amazon", terms: ["amazon", "amazon's"], enabled: true },
    { id: "temu", label: "Temu", terms: ["temu", "temu's"], enabled: true },
    { id: "walmart", label: "Walmart", terms: ["walmart", "walmart's", "wal mart"], enabled: true },
    { id: "aliexpress", label: "AliExpress", terms: ["aliexpress", "ali express", "aliexpress's"], enabled: true },
    { id: "shein", label: "Shein", terms: ["shein", "shein's"], enabled: true },
    {
      id: "facebook-marketplace",
      label: "Facebook Marketplace",
      terms: ["facebook marketplace", "facebook's marketplace", "fb marketplace"],
      enabled: true,
    },
  ],
  triggers: [
    { id: "cheapest", label: "Cheapest", terms: ["cheapest"], enabled: true },
    { id: "worst", label: "Worst", terms: ["worst", "shittiest", "crappiest", "trashiest"], enabled: true },
    { id: "lowest-rated", label: "Lowest rated", terms: ["lowest rated", "lowest-rated", "1 star", "one star"], enabled: true },
    { id: "sketchiest", label: "Sketchiest", terms: ["sketchiest", "shadiest", "most dangerous"], enabled: true },
    { id: "weirdest", label: "Weirdest", terms: ["weirdest", "strangest", "most bizarre"], enabled: true },
    { id: "most-expensive", label: "Most expensive", terms: ["most expensive", "priciest"], enabled: true },
  ],
  customRetailers: [],
  customTriggers: [],
  allowedChannels: [],
};

export function cloneDefaults(): SettingsV1 {
  return structuredClone(DEFAULT_SETTINGS);
}
