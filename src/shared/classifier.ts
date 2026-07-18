import { containsTerm, normalizeChannelIdentifier, normalizeText } from "./normalize";
import type { SettingsV1, VideoCandidate } from "./types";

const ACQUISITION_PATTERNS = [
  /\b(?:buy|buys|bought|buying|order|orders|ordered|ordering|purchase|purchases|purchased|purchasing)\b/,
  /\b(?:test|tests|tested|testing|try|tries|tried|trying|unbox|unboxes|unboxed|unboxing)\b/,
  /\b(?:pick|picks|picked|picking)\s+up\b/,
  /\b(?:got|get|gets|getting)\s+(?:a|an|the|this|that|my|our)\b/,
  /\b(?:sent|sends)\s+(?:me|us)\b/,
  /\b(?:i|we)\s+(?:just\s+)?spent\b/,
];

const OFFER_FRAMING_TRIGGER_IDS = new Set(["cheapest", "lowest-rated", "most-expensive"]);
const STANDALONE_PURCHASE_PATTERN =
  /\b(?:(?:i|we)\s+)?(?:just\s+)?(?:bought|ordered|purchased)\s+(?:the\s+)?(?:absolute\s+|very\s+)?__TRIGGER__\b/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasRetailerOfferFraming(title: string, retailerTerm: string, triggerTerm: string): boolean {
  const retailer = normalizeText(retailerTerm).replace(/'s$/, "");
  const trigger = normalizeText(triggerTerm);
  if (!retailer || !trigger) return false;

  const retailerPattern = escapeRegExp(retailer);
  const triggerPattern = escapeRegExp(trigger);
  const gap = "(?: [a-z0-9@'$]+){0,6}";

  return [
    // Amazon's cheapest ..., Walmart cheapest ...
    new RegExp(`(?:^| )${retailerPattern}(?:'s)? ${triggerPattern}(?: |$)`),
    // The cheapest ... from/on Amazon
    new RegExp(`(?:^| )${triggerPattern}${gap} (?:from|on|through|via) ${retailerPattern}(?:'s)?(?: |$)`),
    // Walmart sells/offers its cheapest ...
    new RegExp(`(?:^| )${retailerPattern} (?:sells?|offers?|lists?)${gap} ${triggerPattern}(?: |$)`),
  ].some((pattern) => pattern.test(title));
}

function hasStandaloneFactoryFraming(title: string, triggerTerm: string): boolean {
  const trigger = normalizeText(triggerTerm);
  if (!trigger) return false;
  const pattern = new RegExp(STANDALONE_PURCHASE_PATTERN.source.replace("__TRIGGER__", escapeRegExp(trigger)));
  return pattern.test(title);
}

export interface Classification {
  blocked: boolean;
  retailer?: string;
  trigger?: string;
}

export function classifyCandidate(candidate: VideoCandidate, settings: SettingsV1): Classification {
  if (!settings.enabled) return { blocked: false };

  const candidateChannels = new Set(candidate.channelIdentifiers.map(normalizeChannelIdentifier).filter(Boolean));
  if (settings.allowedChannels.some((channel) => candidateChannels.has(channel))) {
    return { blocked: false };
  }

  const title = normalizeText(candidate.title);
  if (!title) return { blocked: false };

  const retailerRules = [
    ...settings.retailers.filter((rule) => rule.enabled).flatMap((rule) => rule.terms.map((term) => ({ label: rule.label, term }))),
    ...settings.customRetailers.map((term) => ({ label: term, term })),
  ];
  const retailers = retailerRules.filter((rule) => containsTerm(title, rule.term));

  const triggerRules = [
    ...settings.triggers
      .filter((rule) => rule.enabled)
      .flatMap((rule) => rule.terms.map((term) => ({
        label: rule.label,
        term,
        supportsOfferFraming: OFFER_FRAMING_TRIGGER_IDS.has(rule.id),
      }))),
    ...settings.customTriggers.map((term) => ({ label: term, term, supportsOfferFraming: true })),
  ];
  const triggers = triggerRules.filter((rule) => containsTerm(title, rule.term));
  if (!triggers.length) return { blocked: false };

  const standaloneTrigger = triggers.find((trigger) => hasStandaloneFactoryFraming(title, trigger.term));
  if (standaloneTrigger) return { blocked: true, trigger: standaloneTrigger.label };
  if (!retailers.length) return { blocked: false };

  const hasAcquisition = ACQUISITION_PATTERNS.some((pattern) => pattern.test(title));
  for (const retailer of retailers) {
    for (const trigger of triggers) {
      if (hasAcquisition || (trigger.supportsOfferFraming && hasRetailerOfferFraming(title, retailer.term, trigger.term))) {
        return { blocked: true, retailer: retailer.label, trigger: trigger.label };
      }
    }
  }

  return { blocked: false };
}
