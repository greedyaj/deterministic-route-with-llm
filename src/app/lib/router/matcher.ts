import type { ToolIndex, ToolIndexEntry } from "../registry/indexer";
import { ROUTER_MATCH_STRATEGY } from "./config";
import type { ToolScoreResult } from "./scoring";
import { scoreToolMatch } from "./scoring";
import { buildTfidfIndex, scoreToolMatchTfidf } from "./tfidf";

export type RouterMatchStrategy = "lexical" | "tfidf" | "embeddings";
export const ROUTER_MATCH_STRATEGIES: RouterMatchStrategy[] = ["lexical", "tfidf", "embeddings"];
export type ToolMatchScorer = (utterance: string, tool: ToolIndexEntry) => ToolScoreResult;

export function getToolMatchScorer(
  strategy: RouterMatchStrategy = ROUTER_MATCH_STRATEGY,
  toolIndex?: ToolIndex
): ToolMatchScorer {
  switch (strategy) {
    case "embeddings":
      return scoreToolMatch;
    case "tfidf": {
      if (!toolIndex) {
        return scoreToolMatch;
      }
      const tfidfIndex = buildTfidfIndex(toolIndex);
      return (utterance, tool) => scoreToolMatchTfidf(utterance, tool, tfidfIndex);
    }
    case "lexical":
    default:
      return scoreToolMatch;
  }
}
