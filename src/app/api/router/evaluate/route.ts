import { NextResponse } from "next/server";

import { getToolRegistry } from "@/app/lib/registry";
import { evaluateRouterOnRegistry } from "@/app/lib/router/evaluate";
import type { RouterMatchStrategy } from "@/app/lib/router/matcher";

export async function GET(request: Request) {
  const registry = getToolRegistry();
  const url = new URL(request.url);
  const strategy = url.searchParams.get("strategy") as RouterMatchStrategy | null;
  const summary = await evaluateRouterOnRegistry(registry, {
    strategy: strategy || undefined,
  });
  return NextResponse.json(summary);
}
