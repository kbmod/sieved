export function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘`]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9@'$]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeTerm(value: string): string {
  return normalizeText(value).slice(0, 100);
}

export function normalizeChannelIdentifier(value: string): string {
  const raw = value.trim();
  if (!raw) return "";

  let path = raw;
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://www.youtube.com/${raw.replace(/^\//, "")}`);
    path = decodeURIComponent(url.pathname).replace(/\/+$/, "");
  } catch {
    // Fall through to accepting a handle, channel id, or display name.
  }

  const cleanPath = path.replace(/^\//, "");
  if (cleanPath.startsWith("@")) return cleanPath.toLowerCase();
  if (/^channel\//i.test(cleanPath)) return `channel:${cleanPath.slice(8).toLowerCase()}`;
  if (/^(c|user)\//i.test(cleanPath)) {
    const [kind, ...rest] = cleanPath.split("/");
    return `${kind.toLowerCase()}:${rest.join("/").toLowerCase()}`;
  }
  if (/^UC[A-Za-z0-9_-]{10,}$/.test(raw)) return `channel:${raw.toLowerCase()}`;
  return `name:${normalizeText(raw)}`;
}

export function containsTerm(normalizedHaystack: string, rawNeedle: string): boolean {
  const needle = normalizeTerm(rawNeedle);
  if (!needle) return false;
  const padded = ` ${normalizedHaystack} `;
  return padded.includes(` ${needle} `) || padded.includes(` ${needle}'s `);
}
