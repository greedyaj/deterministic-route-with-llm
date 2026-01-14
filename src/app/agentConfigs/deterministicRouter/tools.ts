import { tool } from "@openai/agents/realtime";

import registryData from "@/app/data/tools/registry.json";
import { routeTools } from "@/app/lib/router";
import type { RouterMatchStrategy } from "@/app/lib/router/matcher";
import type { RouterRequest } from "@/app/lib/router/types";
import type { ToolRegistry } from "@/app/lib/registry/types";
import type { Tool } from "@/app/types";

const registry = registryData as ToolRegistry;

export const routerToolDefinition: Tool = {
  type: "function",
  name: "router",
  description: "Route a user request to the most relevant tools.",
  parameters: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        description: "Short intent phrase distilled from the user request.",
      },
      utterance: {
        type: "string",
        description: "Optional raw user request (for logging only).",
      },
      context: {
        type: "string",
        description: "Optional short context summary.",
      },
      language: {
        type: "string",
        description: "Optional user language hint.",
      },
    },
    required: ["intent"],
    additionalProperties: false,
  },
};

function buildSessionToolsFromRouter(tools: { definition: { name: string; description: string; parameters: Tool["parameters"] } }[]): Tool[] {
  return [
    routerToolDefinition,
    ...tools.map((toolItem) => ({
      type: "function",
      name: toolItem.definition.name,
      description: toolItem.definition.description,
      parameters: toolItem.definition.parameters,
    })),
  ];
}

export const routerTool = tool({
  name: routerToolDefinition.name,
  description: routerToolDefinition.description,
  parameters: routerToolDefinition.parameters,
  execute: async (input, details) => {
    const request = input as RouterRequest;
    const getRouterMatchStrategy = context?.getRouterMatchStrategy as
      | (() => RouterMatchStrategy)
      | undefined;
    const response = routeTools(
      request,
      registry,
      typeof getRouterMatchStrategy === "function"
        ? getRouterMatchStrategy()
        : undefined
    );

    const context = details?.context as any;
    const updateSessionTools = context?.updateSessionTools as
      | ((tools: Tool[]) => void)
      | undefined;
    const setRouterStatus = context?.setRouterStatus as
      | ((status: { intent: string; toolCount: number; fallback: string }) => void)
      | undefined;

    if (typeof updateSessionTools === "function") {
      const sessionTools = buildSessionToolsFromRouter(response.tools);
      updateSessionTools(sessionTools);
      context.allowedToolNames = response.tools.map((toolItem) => toolItem.name);
    }
    context.activeIntent = response.intent;
    if (typeof setRouterStatus === "function") {
      setRouterStatus({
        intent: response.intent,
        toolCount: response.tools.length,
        fallback: response.fallback,
      });
    }

    return response;
  },
});

export const dummyTools = registry.tools.map((entry) =>
  tool({
    name: entry.name,
    description: entry.description,
    parameters: entry.parameters,
    execute: async (input, details) => {
      const context = details?.context as any;
      const allowedToolNames = context?.allowedToolNames as string[] | undefined;

      if (!Array.isArray(allowedToolNames) || allowedToolNames.length === 0) {
        return { error: "Router has not been called yet." };
      }
      if (!allowedToolNames.includes(entry.name)) {
        return { error: "Tool not allowed. Call router again." };
      }
      return {
        result: `${entry.name} tool executed`,
        input,
      };
    },
  })
);
