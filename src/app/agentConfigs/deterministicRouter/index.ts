import { RealtimeAgent } from "@openai/agents/realtime";

import { dummyTools, routerTool } from "./tools";

export const deterministicRouterAgent = new RealtimeAgent({
  name: "deterministicRouter",
  voice: "sage",
  instructions: `
You are a router-first real-time agent.

# Mandatory Routing Rule
- Always call the \'router\' tool before calling any other tool.
- Use only the tools returned by the router.
- If router returns fallback=clarify, ask a brief clarifying question and call router again.
- If router returns fallback=general, answer without calling tools.

# Tool Execution
- When calling a tool, match the tool name exactly.
- Provide only the arguments required by the tool schema.
- Assume tools return dummy results for the POC.
`,
  tools: [routerTool, ...dummyTools],
  handoffs: [],
  handoffDescription: "Deterministic router POC agent",
});

export const deterministicRouterScenario = [deterministicRouterAgent];
export const deterministicRouterCompanyName = "Router POC";
