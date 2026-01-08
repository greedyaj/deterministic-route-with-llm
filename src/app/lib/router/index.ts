import type { ToolRegistry } from "../registry/types";
import type { RouterCandidateTool, RouterRequest, RouterResponse } from "./types";
import { scoreToolMatch } from "./scoring";
import { selectTopTools } from "./selector";
import { decideFallback } from "./fallback";
import { deriveIntent } from "./intent";
import { buildToolIndex } from "../registry/indexer";

export function routeTools(request: RouterRequest, registry: ToolRegistry): RouterResponse {
  const query = (request.intent ?? request.utterance ?? "").trim();
  if (!query) {
    return {
      intent: "",
      tools: [],
      fallback: "clarify",
    };
  }
  const index = buildToolIndex(registry);
  const scored = index.entries.map((tool) => {
    const scoreResult = scoreToolMatch(query, tool);
    return {
      ...scoreResult,
      tagMatchCount: scoreResult.breakdown.tagMatches,
      toolName: tool.name,
    };
  });

  const ranked = selectTopTools(scored);
  const tools: RouterCandidateTool[] = ranked.map((result) => {
    const entry = index.entries.find((tool) => tool.id === result.toolId);
    if (!entry) {
      throw new Error(`Tool registry entry not found for id: ${result.toolId}`);
    }
    return {
      name: entry.name,
      score: result.score,
      reason: result.reason,
      definition: {
        name: entry.name,
        description: entry.description,
        parameters: entry.parameters,
      },
    };
  });

  const topScore = ranked[0]?.score;
  const topTool = ranked.length > 0 ? index.entries.find((tool) => tool.id === ranked[0].toolId) : undefined;
  const intent = request.intent?.trim() || deriveIntent(topTool, topScore);
  const fallback = decideFallback({
    utterance: query,
    candidateCount: tools.length,
    topScore,
  });

  return {
    intent,
    tools,
    fallback,
  };
}
