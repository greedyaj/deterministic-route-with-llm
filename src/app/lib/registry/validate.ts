import type { ToolRegistry, ToolRegistryEntry } from "./types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateToolEntry(tool: ToolRegistryEntry, index: number): string[] {
  const errors: string[] = [];
  if (!isNonEmptyString(tool.id)) {
    errors.push(`tools[${index}].id is required`);
  }
  if (!isNonEmptyString(tool.name)) {
    errors.push(`tools[${index}].name is required`);
  }
  if (!isNonEmptyString(tool.description)) {
    errors.push(`tools[${index}].description is required`);
  }
  if (!Array.isArray(tool.tags) || tool.tags.length === 0) {
    errors.push(`tools[${index}].tags must be a non-empty array`);
  }
  if (!Array.isArray(tool.keywords) || tool.keywords.length === 0) {
    errors.push(`tools[${index}].keywords must be a non-empty array`);
  }
  if (!Array.isArray(tool.examples) || tool.examples.length === 0) {
    errors.push(`tools[${index}].examples must be a non-empty array`);
  }
  return errors;
}

export function validateToolRegistry(registry: ToolRegistry): string[] {
  const errors: string[] = [];
  if (!isNonEmptyString(registry.version)) {
    errors.push("registry.version is required");
  }
  if (!Array.isArray(registry.tools)) {
    errors.push("registry.tools must be an array");
    return errors;
  }
  registry.tools.forEach((tool, index) => {
    errors.push(...validateToolEntry(tool, index));
  });
  return errors;
}
