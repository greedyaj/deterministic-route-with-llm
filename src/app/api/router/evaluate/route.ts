import { NextResponse } from "next/server";

import { getToolRegistry } from "@/app/lib/registry";
import { evaluateRouterOnRegistry } from "@/app/lib/router/evaluate";

export async function GET() {
  const registry = getToolRegistry();
  const summary = evaluateRouterOnRegistry(registry);
  return NextResponse.json(summary);
}
