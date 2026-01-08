import { ROUTER_MIN_SCORE } from "./config";
import type { RouterFallback } from "./types";

interface FallbackInput {
  utterance: string;
  candidateCount: number;
  topScore?: number;
}

export function decideFallback(input: FallbackInput): RouterFallback {
  if (input.utterance.trim().length === 0) {
    return "clarify";
  }
  if (input.candidateCount === 0) {
    return "clarify";
  }
  if (typeof input.topScore === "number" && input.topScore < ROUTER_MIN_SCORE) {
    return "clarify";
  }
  return "none";
}
