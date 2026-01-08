import registryData from "../../data/tools/registry.json";
import type { ToolRegistry } from "./types";
import { validateToolRegistry } from "./validate";

export function getToolRegistry(): ToolRegistry {
  const registry = registryData as ToolRegistry;
  if (!registry || !Array.isArray(registry.tools)) {
    throw new Error("Tool registry is invalid or missing tools array.");
  }
  const errors = validateToolRegistry(registry);
  if (errors.length > 0) {
    throw new Error(`Tool registry validation failed: ${errors.join(", ")}`);
  }
  return registry;
}
