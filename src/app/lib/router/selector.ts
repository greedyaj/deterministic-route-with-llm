import { ROUTER_MAX_TOOLS, ROUTER_MIN_SCORE, ROUTER_TIE_BREAKERS } from "./config";
import type { ToolScoreResult } from "./scoring";

export interface RankedToolScore extends ToolScoreResult {
  tagMatchCount: number;
  toolName: string;
}

function applyTieBreakers(a: RankedToolScore, b: RankedToolScore): number {
  for (const rule of ROUTER_TIE_BREAKERS) {
    if (rule === "score_desc") {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      continue;
    }
    if (rule === "tag_match_desc") {
      if (a.tagMatchCount !== b.tagMatchCount) {
        return b.tagMatchCount - a.tagMatchCount;
      }
      continue;
    }
    if (rule === "name_asc") {
      if (a.toolName !== b.toolName) {
        return a.toolName.localeCompare(b.toolName);
      }
    }
  }
  return 0;
}

export function selectTopTools(scored: RankedToolScore[]): RankedToolScore[] {
  return scored
    .filter((result) => result.score >= ROUTER_MIN_SCORE)
    .sort(applyTieBreakers)
    .slice(0, ROUTER_MAX_TOOLS);
}
