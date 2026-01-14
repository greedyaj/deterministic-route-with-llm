import type { ToolIndexEntry } from "../registry/indexer";
import { ROUTER_MATCH_STRATEGY } from "./config";
import type { ToolScoreResult } from "./scoring";
import { scoreToolMatch } from "./scoring";

export type RouterMatchStrategy = "lexical";
export const ROUTER_MATCH_STRATEGIES: RouterMatchStrategy[] = ["lexical"];
export type ToolMatchScorer = (utterance: string, tool: ToolIndexEntry) => ToolScoreResult;

export function getToolMatchScorer(
  strategy: RouterMatchStrategy = ROUTER_MATCH_STRATEGY
): ToolMatchScorer {
  switch (strategy) {
    case "lexical":
    default:
      return scoreToolMatch;
  }
}
