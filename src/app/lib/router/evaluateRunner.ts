import { getToolRegistry } from "../registry";
import { evaluateRouterOnRegistry } from "./evaluate";

export async function runRouterEvaluation() {
  const registry = getToolRegistry();
  return await evaluateRouterOnRegistry(registry);
}
