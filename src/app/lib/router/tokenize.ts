import { normalizeText } from "./normalize";

export function tokenizeText(value: string): string[] {
  const normalized = normalizeText(value);
  if (!normalized) {
    return [];
  }
  return normalized.split(/[^a-z0-9]+/i).filter(Boolean);
}

export function tokenizeList(values: string[]): string[] {
  return values.flatMap(tokenizeText);
}
