import type { ToolIndex, ToolIndexEntry } from "../registry/indexer";
import type { ToolScoreBreakdown, ToolScoreResult } from "./scoring";

export interface EmbeddingsProvider {
  model: string;
  getEmbeddings: (texts: string[], model: string) => Promise<number[][]>;
}

export interface EmbeddingsIndex {
  model: string;
  toolEmbeddings: Map<string, number[]>;
  toolNorms: Map<string, number>;
}

const DEFAULT_BATCH_SIZE = 96;
let cachedIndex: EmbeddingsIndex | null = null;
let cachedRegistryVersion: string | null = null;
let cachedModel: string | null = null;
let pendingIndex: Promise<EmbeddingsIndex> | null = null;

function buildToolText(tool: ToolIndexEntry): string {
  const tags = tool.tags.length > 0 ? `tags: ${tool.tags.join(", ")}` : "";
  const keywords = tool.keywords.length > 0 ? `keywords: ${tool.keywords.join(", ")}` : "";
  const examples = tool.examples.length > 0 ? `examples: ${tool.examples.join(" | ")}` : "";
  return [tool.name, tool.description, tags, keywords, examples]
    .filter(Boolean)
    .join("\n");
}

function vectorNorm(vector: number[]): number {
  let sum = 0;
  for (const value of vector) {
    sum += value * value;
  }
  return Math.sqrt(sum);
}

function cosineSimilarity(query: number[], queryNorm: number, tool: number[], toolNorm: number): number {
  if (queryNorm === 0 || toolNorm === 0) {
    return 0;
  }
  let dot = 0;
  const length = Math.min(query.length, tool.length);
  for (let i = 0; i < length; i += 1) {
    dot += query[i] * tool[i];
  }
  return dot / (queryNorm * toolNorm);
}


async function embedBatch(
  texts: string[],
  provider: EmbeddingsProvider
): Promise<number[][]> {
  const embeddings = await provider.getEmbeddings(texts, provider.model);
  if (!Array.isArray(embeddings) || embeddings.length !== texts.length) {
    throw new Error("Embeddings provider returned mismatched length.");
  }
  return embeddings;
}

async function embedAll(
  texts: string[],
  provider: EmbeddingsProvider
): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += DEFAULT_BATCH_SIZE) {
    const batch = texts.slice(i, i + DEFAULT_BATCH_SIZE);
    const batchEmbeddings = await embedBatch(batch, provider);
    results.push(...batchEmbeddings);
  }
  return results;
}

export async function buildEmbeddingsIndex(
  index: ToolIndex,
  provider: EmbeddingsProvider
): Promise<EmbeddingsIndex> {
  if (
    cachedIndex &&
    cachedRegistryVersion === index.version &&
    cachedModel === provider.model
  ) {
    return cachedIndex;
  }
  if (pendingIndex) {
    return pendingIndex;
  }
  pendingIndex = (async () => {
    const texts = index.entries.map(buildToolText);
    const embeddings = await embedAll(texts, provider);
    const toolEmbeddings = new Map<string, number[]>();
    const toolNorms = new Map<string, number>();

    embeddings.forEach((embedding, idx) => {
      const tool = index.entries[idx];
      if (!tool) {
        return;
      }
      toolEmbeddings.set(tool.id, embedding);
      toolNorms.set(tool.id, vectorNorm(embedding));
    });

    const builtIndex: EmbeddingsIndex = {
      model: provider.model,
      toolEmbeddings,
      toolNorms,
    };

    cachedIndex = builtIndex;
    cachedRegistryVersion = index.version;
    cachedModel = provider.model;
    pendingIndex = null;
    return builtIndex;
  })();

  return pendingIndex;
}

export async function scoreToolsWithEmbeddings(
  utterance: string,
  index: ToolIndex,
  provider: EmbeddingsProvider
): Promise<ToolScoreResult[]> {
  const [queryEmbedding] = await embedBatch([utterance], provider);
  const queryNorm = vectorNorm(queryEmbedding);
  const embeddingsIndex = await buildEmbeddingsIndex(index, provider);

  return index.entries.map((tool) => {
    const toolEmbedding = embeddingsIndex.toolEmbeddings.get(tool.id);
    const toolNorm = embeddingsIndex.toolNorms.get(tool.id) ?? 0;
    const score = toolEmbedding
      ? cosineSimilarity(queryEmbedding, queryNorm, toolEmbedding, toolNorm)
      : 0;
    const breakdown: ToolScoreBreakdown = {
      token: score,
      phrase: 0,
      tag: 0,
      example: 0,
      total: score,
      tokenMatches: 0,
      tagMatches: 0,
      phraseMatches: 0,
      exampleBestMatch: 0,
    };

    return {
      toolId: tool.id,
      score,
      breakdown,
      reason: score > 0 ? "embeddings cosine" : "low match",
    };
  });
}
