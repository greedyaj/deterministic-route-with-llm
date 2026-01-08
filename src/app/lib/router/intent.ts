import { ROUTER_MIN_SCORE } from "./config";
import type { ToolIndexEntry } from "../registry/indexer";

export function deriveIntent(
  topTool: ToolIndexEntry | undefined,
  topScore: number | undefined
): string {
  if (!topTool || typeof topScore !== "number") {
    return "unknown";
  }
  if (topScore < ROUTER_MIN_SCORE) {
    return "unknown";
  }
  return topTool.name;
}
