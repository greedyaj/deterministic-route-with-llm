import { NextResponse } from "next/server";

import { getToolRegistry } from "@/app/lib/registry";
import { routeTools } from "@/app/lib/router";
import type { RouterRequest } from "@/app/lib/router/types";

export async function POST(request: Request) {
  const body = (await request.json()) as RouterRequest;
  if (!body || typeof body.utterance !== "string") {
    return NextResponse.json({ error: "Missing utterance" }, { status: 400 });
  }

  const registry = getToolRegistry();
  const response = routeTools(body, registry);
  return NextResponse.json(response);
}
