import { ROUTER_SCORE_WEIGHTS } from "./config";
import { normalizeText } from "./normalize";
import { tokenizeList, tokenizeText } from "./tokenize";
import type { ToolIndexEntry } from "../registry/indexer";

export interface ToolScoreBreakdown {
  token: number;
  phrase: number;
  tag: number;
  example: number;
  total: number;
  tokenMatches: number;
  tagMatches: number;
  phraseMatches: number;
  exampleBestMatch: number;
}

export interface ToolScoreResult {
  toolId: string;
  score: number;
  breakdown: ToolScoreBreakdown;
  reason: string;
}

function ratio(matches: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(1, matches / total);
}

function countTokenMatches(queryTokens: string[], candidateTokens: string[]): number {
  if (queryTokens.length === 0 || candidateTokens.length === 0) {
    return 0;
  }
  const candidateSet = new Set(candidateTokens);
  return queryTokens.filter((token) => candidateSet.has(token)).length;
}

function phraseMatchCount(utterance: string, phrases: string[]): number {
  if (!utterance || phrases.length === 0) {
    return 0;
  }
  const normalizedUtterance = normalizeText(utterance);
  return phrases.filter((phrase) => {
    const normalizedPhrase = normalizeText(phrase);
    return normalizedPhrase.length > 0 && normalizedUtterance.includes(normalizedPhrase);
  }).length;
}

function bestExampleOverlap(queryTokens: string[], examples: string[]): number {
  if (queryTokens.length === 0 || examples.length === 0) {
    return 0;
  }
  return examples.reduce((best, example) => {
    const exampleTokens = tokenizeText(example);
    const matches = countTokenMatches(queryTokens, exampleTokens);
    const score = ratio(matches, queryTokens.length);
    return Math.max(best, score);
  }, 0);
}

function buildReason(breakdown: ToolScoreBreakdown): string {
  const reasons: string[] = [];
  if (breakdown.phraseMatches > 0) {
    reasons.push("keyword/phrase match");
  }
  if (breakdown.tagMatches > 0) {
    reasons.push("tag match");
  }
  if (breakdown.tokenMatches > 0) {
    reasons.push("token match");
  }
  if (breakdown.exampleBestMatch > 0) {
    reasons.push("example similarity");
  }
  return reasons.length > 0 ? reasons.join(", ") : "low match";
}

export function scoreToolMatch(utterance: string, tool: ToolIndexEntry): ToolScoreResult {
  const queryTokens = tokenizeText(utterance);
  const combinedTokens = [
    ...tool.tokens.name,
    ...tool.tokens.description,
    ...tool.tokens.keywords,
  ];

  const tokenMatches = countTokenMatches(queryTokens, combinedTokens);
  const tokenScore = ratio(tokenMatches, queryTokens.length);

  const phraseMatches = phraseMatchCount(utterance, tool.keywords);
  const phraseScore = ratio(phraseMatches, tool.keywords.length);

  const tagTokens = tokenizeList(tool.tags);
  const tagMatches = countTokenMatches(queryTokens, tagTokens);
  const tagScore = ratio(tagMatches, tool.tags.length);

  const exampleBestMatch = bestExampleOverlap(queryTokens, tool.examples);
  const exampleScore = exampleBestMatch;

  const total =
    tokenScore * ROUTER_SCORE_WEIGHTS.token +
    phraseScore * ROUTER_SCORE_WEIGHTS.phrase +
    tagScore * ROUTER_SCORE_WEIGHTS.tag +
    exampleScore * ROUTER_SCORE_WEIGHTS.example;

  const breakdown: ToolScoreBreakdown = {
    token: tokenScore,
    phrase: phraseScore,
    tag: tagScore,
    example: exampleScore,
    total,
    tokenMatches,
    tagMatches,
    phraseMatches,
    exampleBestMatch,
  };

  return {
    toolId: tool.id,
    score: total,
    breakdown,
    reason: buildReason(breakdown),
  };
}
