import { ToolParameters } from "../../types";

export type RouterFallback = "none" | "clarify" | "general";

export interface RouterRequest {
  utterance: string;
  context?: string;
  language?: string;
}

export interface RouterToolDefinition {
  name: string;
  description: string;
  parameters: ToolParameters;
}

export interface RouterCandidateTool {
  name: string;
  score: number;
  reason: string;
  definition: RouterToolDefinition;
}

export interface RouterResponse {
  intent: string;
  tools: RouterCandidateTool[];
  fallback: RouterFallback;
}
