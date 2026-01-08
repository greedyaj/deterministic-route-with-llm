import { ROUTER_NORMALIZATION_RULES } from "./config";

export function normalizeText(input: string): string {
  let text = input;
  if (ROUTER_NORMALIZATION_RULES.caseFold === "lowercase") {
    text = text.toLowerCase();
  }
  if (ROUTER_NORMALIZATION_RULES.trim) {
    text = text.trim();
  }
  if (ROUTER_NORMALIZATION_RULES.collapseWhitespace) {
    text = text.replace(/\s+/g, " ");
  }
  return text;
}
