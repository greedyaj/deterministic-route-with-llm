import type { ToolIndex } from "./indexer";
import { buildToolIndex } from "./indexer";
import { getToolRegistry } from "./index";

let cachedIndex: ToolIndex | null = null;

export function loadToolIndex(): ToolIndex {
  if (!cachedIndex) {
    const registry = getToolRegistry();
    cachedIndex = buildToolIndex(registry);
  }
  return cachedIndex;
}

export function resetToolIndexCache(): void {
  cachedIndex = null;
}
