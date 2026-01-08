import { ToolParameters } from "../../types";

export interface ToolRegistryEntry {
  id: string;
  name: string;
  description: string;
  tags: string[];
  keywords: string[];
  examples: string[];
  parameters: ToolParameters;
}

export interface ToolRegistry {
  version: string;
  tools: ToolRegistryEntry[];
}
