import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const texts = Array.isArray(body?.texts) ? body.texts : [];
    const model = typeof body?.model === "string" ? body.model : DEFAULT_EMBEDDING_MODEL;

    if (texts.length === 0 || !texts.every((text: unknown) => typeof text === "string")) {
      return NextResponse.json({ error: "Invalid texts payload" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.embeddings.create({
      model,
      input: texts,
    });

    return NextResponse.json({
      model: response.model,
      embeddings: response.data.map((item) => item.embedding),
    });
  } catch (err: any) {
    console.error("embeddings proxy error", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
