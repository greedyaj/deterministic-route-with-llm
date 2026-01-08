import { RealtimeAgent } from "@openai/agents/realtime";

import { dummyTools, routerTool } from "./tools";

export const deterministicRouterAgent = new RealtimeAgent({
  name: "deterministicRouter",
  voice: "sage",
  instructions: `
You are a router-first real-time agent.

# Mandatory Routing Rule
- For every user message, derive a short intent phrase (3-8 words).
- Call the \'router\' tool only when the intent changes or when you have no active tool list.
- When you call \'router\', pass the intent phrase in the \`intent\` field (optionally include the raw user utterance in \`utterance\`).
- Use only the tools returned by the most recent router call.
- If router returns fallback=clarify, ask a brief clarifying question and call router again.
- If router returns fallback=general, answer without calling tools.
- If any tool returns an error asking you to call router, call router immediately.

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
