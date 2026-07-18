export interface BuiltInRule {
  id: string;
  label: string;
  terms: string[];
  enabled: boolean;
}

export interface SettingsV1 {
  version: 1;
  enabled: boolean;
  retailers: BuiltInRule[];
  triggers: BuiltInRule[];
  customRetailers: string[];
  customTriggers: string[];
  allowedChannels: string[];
}

export interface VideoCandidate {
  title: string;
  videoId?: string;
  channelIdentifiers: string[];
}

export interface CurrentChannel {
  label: string;
  identifier: string;
}

export interface TabState {
  count: number;
  routeKey: string;
  currentChannel?: CurrentChannel;
}
