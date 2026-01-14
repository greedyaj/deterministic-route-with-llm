import { getToolRegistry } from "../registry";
import { evaluateRouterOnRegistry } from "./evaluate";
import type { EvaluationOptions } from "./evaluate";

export async function runRouterEvaluation(options: EvaluationOptions = {}) {
  const registry = getToolRegistry();
  return await evaluateRouterOnRegistry(registry, options);
}
