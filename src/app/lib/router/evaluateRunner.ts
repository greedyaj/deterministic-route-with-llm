import { getToolRegistry } from "../registry";
import { evaluateRouterOnRegistry } from "./evaluate";

export function runRouterEvaluation() {
  const registry = getToolRegistry();
  return evaluateRouterOnRegistry(registry);
}
