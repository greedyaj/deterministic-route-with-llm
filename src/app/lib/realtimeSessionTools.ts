import type { Tool } from "@/app/types";

export function buildSessionToolUpdateEvent(tools: Tool[]) {
  return {
    type: "session.update",
    session: {
      tools,
    },
  };
}
