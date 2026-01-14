import { tokenizeText } from "./tokenize";
import type { ToolIndex, ToolIndexEntry } from "../registry/indexer";
import type { ToolScoreBreakdown, ToolScoreResult } from "./scoring";

interface TfidfIndex {
  idf: Map<string, number>;
  toolVectors: Map<string, Map<string, number>>;
  toolNorms: Map<string, number>;
}

function buildToolTokenList(tool: ToolIndexEntry): string[] {
  return [
    ...tool.tokens.name,
    ...tool.tokens.description,
    ...tool.tokens.tags,
    ...tool.tokens.keywords,
    ...tool.tokens.examples,
  ];
}

function computeTermFrequency(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  const total = tokens.length || 1;
  const tf = new Map<string, number>();
  counts.forEach((count, token) => {
    tf.set(token, count / total);
  });
  return tf;
}

function buildIdf(documents: string[][]): Map<string, number> {
  const docCount = documents.length;
  const df = new Map<string, number>();
  for (const tokens of documents) {
    const unique = new Set(tokens);
    for (const token of unique) {
      df.set(token, (df.get(token) ?? 0) + 1);
    }
  }
  const idf = new Map<string, number>();
  df.forEach((docFreq, token) => {
    const value = Math.log((docCount + 1) / (docFreq + 1)) + 1;
    idf.set(token, value);
  });
  return idf;
}

function buildVector(tf: Map<string, number>, idf: Map<string, number>): Map<string, number> {
  const vector = new Map<string, number>();
  tf.forEach((tfValue, token) => {
    const idfValue = idf.get(token);
    if (idfValue) {
      vector.set(token, tfValue * idfValue);
    }
  });
  return vector;
}

function vectorNorm(vector: Map<string, number>): number {
  let sum = 0;
  vector.forEach((value) => {
    sum += value * value;
  });
  return Math.sqrt(sum);
}

function cosineSimilarity(
  queryVector: Map<string, number>,
  queryNorm: number,
  toolVector: Map<string, number>,
  toolNorm: number
): number {
  if (queryNorm === 0 || toolNorm === 0) {
    return 0;
  }
  let dot = 0;
  queryVector.forEach((qValue, token) => {
    const tValue = toolVector.get(token);
    if (tValue) {
      dot += qValue * tValue;
    }
  });
  return dot / (queryNorm * toolNorm);
}

function countSharedTokens(queryTokens: string[], toolVector: Map<string, number>): number {
  if (queryTokens.length === 0) {
    return 0;
  }
  const unique = new Set(queryTokens);
  let matches = 0;
  unique.forEach((token) => {
    if (toolVector.has(token)) {
      matches += 1;
    }
  });
  return matches;
}

export function buildTfidfIndex(index: ToolIndex): TfidfIndex {
  const documents = index.entries.map(buildToolTokenList);
  const idf = buildIdf(documents);
  const toolVectors = new Map<string, Map<string, number>>();
  const toolNorms = new Map<string, number>();

  index.entries.forEach((entry, i) => {
    const tokens = documents[i] ?? [];
    const tf = computeTermFrequency(tokens);
    const vector = buildVector(tf, idf);
    toolVectors.set(entry.id, vector);
    toolNorms.set(entry.id, vectorNorm(vector));
  });

  return {
    idf,
    toolVectors,
    toolNorms,
  };
}

export function scoreToolMatchTfidf(
  utterance: string,
  tool: ToolIndexEntry,
  tfidfIndex: TfidfIndex
): ToolScoreResult {
  const queryTokens = tokenizeText(utterance);
  const queryTf = computeTermFrequency(queryTokens);
  const queryVector = buildVector(queryTf, tfidfIndex.idf);
  const queryNorm = vectorNorm(queryVector);
  const toolVector = tfidfIndex.toolVectors.get(tool.id) ?? new Map<string, number>();
  const toolNorm = tfidfIndex.toolNorms.get(tool.id) ?? 0;
  const score = cosineSimilarity(queryVector, queryNorm, toolVector, toolNorm);

  const breakdown: ToolScoreBreakdown = {
    token: score,
    phrase: 0,
    tag: 0,
    example: 0,
    total: score,
    tokenMatches: countSharedTokens(queryTokens, toolVector),
    tagMatches: 0,
    phraseMatches: 0,
    exampleBestMatch: 0,
  };

  return {
    toolId: tool.id,
    score,
    breakdown,
    reason: score > 0 ? "tfidf cosine" : "low match",
  };
}
