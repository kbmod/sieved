declare const browser: typeof chrome | undefined;

// Firefox's `browser` namespace and Chrome's Manifest V3 `chrome` namespace
// both return Promises for the APIs Sieved uses. Prefer Firefox's native
// namespace when it exists so the same source can be bundled for both stores.
export const isFirefox = typeof browser !== "undefined";
export const webext: typeof chrome = isFirefox ? browser! : chrome;
