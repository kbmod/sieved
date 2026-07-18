import { describe, expect, it } from "vitest";
import { classifyCandidate } from "../src/shared/classifier";
import { cloneDefaults } from "../src/shared/defaults";
import { normalizeChannelIdentifier } from "../src/shared/normalize";

function blocked(title: string, channelIdentifiers: string[] = []): boolean {
  return classifyCandidate({ title, channelIdentifiers }, cloneDefaults()).blocked;
}

describe("classifyCandidate", () => {
  it.each([
    "I bought Amazon's CHEAPEST mud motor",
    "We ordered the WORST laptop from TEMU",
    "I tried Walmart's lowest-rated camping gear",
    "Buying Ali Express's sketchiest mini bike",
    "I bought the shittiest boat from Walmart",
    "Bought the cheapest outboard motor from Amazon",
    "We got the lowest-rated pressure washer at Walmart",
    "Temu sent me the worst mini bike",
    "The cheapest gaming PC from Walmart",
    "Amazon's cheapest boat motor is unbelievable",
    "How bad is the lowest rated laptop on Temu?",
    "AliExpress offers its most expensive mystery box",
    "I bought the cheapest item on the entire internet",
    "I BOUGHT THE CHEAPEST house in America",
    "I Bought the Cheapest Private Jet",
    "We purchased the absolute cheapest car we could find",
    "Bought the cheapest boat in the country",
    "Bought the worst product I could find",
    "We ordered the lowest-rated thing money can buy",
    "I bought Shein's cheapest wedding dress",
    "We tried the worst couch on Facebook Marketplace",
    "Buying FB Marketplace's sketchiest motorcycle",
  ])("blocks genre examples: %s", (title) => expect(blocked(title)).toBe(true));

  it.each([
    "Amazon mud motor review after one year",
    "The cheapest mud motor you can buy",
    "I bought a reliable mud motor from a local dealer",
    "Why Walmart is changing its store layout",
    "The worst engine failure I have ever repaired",
    "Why Walmart is no longer the cheapest grocery store",
    "Amazon's worst labor violations",
    "The most expensive cities with a Walmart",
    "The cheapest item you can buy",
    "I bought an inexpensive item from a local charity shop",
    "The worst thing about Facebook's marketplace strategy",
  ])("keeps titles missing one of the required signals: %s", (title) => expect(blocked(title)).toBe(false));

  it("reports a trigger without inventing a retailer for standalone factory phrasing", () => {
    expect(classifyCandidate(
      { title: "I BOUGHT the CHEAPEST house nobody wanted", channelIdentifiers: [] },
      cloneDefaults(),
    )).toEqual({ blocked: true, trigger: "Cheapest" });
  });

  it("respects disabled built-in rules", () => {
    const settings = cloneDefaults();
    settings.retailers.find((rule) => rule.id === "amazon")!.enabled = false;
    expect(classifyCandidate({ title: "I bought Amazon's cheapest boat", channelIdentifiers: [] }, settings).blocked).toBe(false);
  });

  it("uses custom retailer and trigger terms", () => {
    const settings = cloneDefaults();
    settings.customRetailers.push("shopmart");
    settings.customTriggers.push("most cursed");
    expect(classifyCandidate({ title: "We bought ShopMart's most cursed bicycle", channelIdentifiers: [] }, settings).blocked).toBe(true);
  });

  it("allows an exact channel identifier", () => {
    const settings = cloneDefaults();
    const channel = normalizeChannelIdentifier("https://youtube.com/@trustedcreator");
    settings.allowedChannels.push(channel);
    const result = classifyCandidate(
      { title: "I bought Amazon's cheapest boat", channelIdentifiers: ["/@TrustedCreator"] },
      settings,
    );
    expect(result.blocked).toBe(false);
  });

});
