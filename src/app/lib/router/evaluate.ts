import { ROUTER_MAX_TOOLS } from "./config";
import { routeTools } from "./index";
import type { RouterMatchStrategy } from "./matcher";
import type { EmbeddingsProvider } from "./embeddings";
import type { ToolRegistry } from "../registry/types";

export interface EvaluationFailure {
  toolId: string;
  toolName: string;
  utterance: string;
  topTools: string[];
  intent: string;
  fallback: string;
}

export interface EvaluationSummary {
  totalUtterances: number;
  correctAtK: number;
  recallAtK: number;
  precisionAtK: number;
  totalReturned: number;
  averageReturned: number;
  failures: EvaluationFailure[];
}

export interface EvaluationOptions {
  maxFailures?: number;
  strategy?: RouterMatchStrategy;
  embeddingsProvider?: EmbeddingsProvider;
}

export async function evaluateRouterOnRegistry(
  registry: ToolRegistry,
  options: EvaluationOptions = {}
): Promise<EvaluationSummary> {
  const maxFailures = options.maxFailures ?? 50;
  let totalUtterances = 0;
  let correctAtK = 0;
  let totalReturned = 0;
  const failures: EvaluationFailure[] = [];

  for (const tool of registry.tools) {
    for (const utterance of tool.examples) {
      totalUtterances += 1;
      const response = await routeTools({ intent: utterance, utterance }, registry, {
        strategy: options.strategy,
        embeddingsProvider: options.embeddingsProvider,
      });
      totalReturned += response.tools.length;
      const rank = response.tools.findIndex((candidate) => candidate.name === tool.name);
      const matched = rank >= 0;
      if (matched) {
        correctAtK += 1;
      } else if (failures.length < maxFailures) {
        failures.push({
          toolId: tool.id,
          toolName: tool.name,
          utterance,
          topTools: response.tools.map((candidate) => candidate.name),
          intent: response.intent,
          fallback: response.fallback,
        });
      }
    }
  }

  const recallAtK = totalUtterances > 0 ? correctAtK / totalUtterances : 0;
  const precisionAtK = totalUtterances > 0 ? correctAtK / (totalUtterances * ROUTER_MAX_TOOLS) : 0;
  const averageReturned = totalUtterances > 0 ? totalReturned / totalUtterances : 0;

  return {
    totalUtterances,
    correctAtK,
    recallAtK,
    precisionAtK,
    totalReturned,
    averageReturned,
    failures,
  };
}
