import { cloneDefaults } from "../shared/defaults";
import { normalizeChannelIdentifier, normalizeTerm } from "../shared/normalize";
import { loadSettings, saveSettings } from "../shared/settings";
import type { BuiltInRule, SettingsV1 } from "../shared/types";

let settings: SettingsV1;
let statusTimer: number | undefined;

const retailerRules = document.querySelector<HTMLElement>("#retailer-rules")!;
const triggerRules = document.querySelector<HTMLElement>("#trigger-rules")!;
const customRetailers = document.querySelector<HTMLElement>("#custom-retailers")!;
const customTriggers = document.querySelector<HTMLElement>("#custom-triggers")!;
const allowedChannels = document.querySelector<HTMLElement>("#allowed-channels")!;
const saveStatus = document.querySelector<HTMLElement>("#save-status")!;

function showSaved(message = "Saved"): void {
  saveStatus.textContent = message;
  if (statusTimer !== undefined) window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => (saveStatus.textContent = ""), 1800);
}

async function persist(): Promise<void> {
  settings = await saveSettings(settings);
  showSaved();
}

function renderRules(container: HTMLElement, rules: BuiltInRule[], kind: "retailers" | "triggers"): void {
  container.replaceChildren();
  for (const rule of rules) {
    const label = document.createElement("label");
    label.className = "check";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = rule.enabled;
    checkbox.addEventListener("change", async () => {
      const target = settings[kind].find((item) => item.id === rule.id);
      if (target) target.enabled = checkbox.checked;
      await persist();
    });
    label.append(checkbox, document.createTextNode(rule.label));
    container.append(label);
  }
}

function renderChips(container: HTMLElement, values: string[], remove: (value: string) => Promise<void>): void {
  container.replaceChildren();
  for (const value of values) {
    const chip = document.createElement("span");
    chip.className = "chip";
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Remove ${value}`);
    button.textContent = "×";
    button.addEventListener("click", () => void remove(value));
    chip.append(document.createTextNode(value), button);
    container.append(chip);
  }
}

function render(): void {
  renderRules(retailerRules, settings.retailers, "retailers");
  renderRules(triggerRules, settings.triggers, "triggers");
  renderChips(customRetailers, settings.customRetailers, async (value) => {
    settings.customRetailers = settings.customRetailers.filter((item) => item !== value);
    await persist();
    render();
  });
  renderChips(customTriggers, settings.customTriggers, async (value) => {
    settings.customTriggers = settings.customTriggers.filter((item) => item !== value);
    await persist();
    render();
  });
  renderChips(allowedChannels, settings.allowedChannels, async (value) => {
    settings.allowedChannels = settings.allowedChannels.filter((item) => item !== value);
    await persist();
    render();
  });
}

function bindAddForm(formSelector: string, inputSelector: string, add: (value: string) => Promise<void>): void {
  const form = document.querySelector<HTMLFormElement>(formSelector)!;
  const input = document.querySelector<HTMLInputElement>(inputSelector)!;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = input.value;
    if (!value.trim()) return;
    await add(value);
    input.value = "";
    render();
  });
}

bindAddForm("#add-retailer", "#retailer-input", async (raw) => {
  const value = normalizeTerm(raw);
  if (value) settings.customRetailers = [...new Set([...settings.customRetailers, value])];
  await persist();
});

bindAddForm("#add-trigger", "#trigger-input", async (raw) => {
  const value = normalizeTerm(raw);
  if (value) settings.customTriggers = [...new Set([...settings.customTriggers, value])];
  await persist();
});

bindAddForm("#add-channel", "#channel-input", async (raw) => {
  const value = normalizeChannelIdentifier(raw);
  if (value) settings.allowedChannels = [...new Set([...settings.allowedChannels, value])];
  await persist();
});

document.querySelector("#reset")!.addEventListener("click", async () => {
  settings = await saveSettings(cloneDefaults());
  render();
  showSaved("Defaults restored");
});

void loadSettings().then((loaded) => {
  settings = loaded;
  render();
});
