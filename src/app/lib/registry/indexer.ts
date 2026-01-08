import { tokenizeList, tokenizeText } from "../router/tokenize";
import type { ToolRegistry, ToolRegistryEntry } from "./types";

export interface ToolIndexEntry {
  id: string;
  name: string;
  description: string;
  tags: string[];
  keywords: string[];
  examples: string[];
  parameters: ToolRegistryEntry["parameters"];
  tokens: {
    name: string[];
    description: string[];
    tags: string[];
    keywords: string[];
    examples: string[];
  };
}

export interface ToolIndex {
  version: string;
  entries: ToolIndexEntry[];
}

export function buildToolIndex(registry: ToolRegistry): ToolIndex {
  return {
    version: registry.version,
    entries: registry.tools.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      tags: tool.tags,
      keywords: tool.keywords,
      examples: tool.examples,
      parameters: tool.parameters,
      tokens: {
        name: tokenizeText(tool.name),
        description: tokenizeText(tool.description),
        tags: tokenizeList(tool.tags),
        keywords: tokenizeList(tool.keywords),
        examples: tokenizeList(tool.examples),
      },
    })),
  };
}
