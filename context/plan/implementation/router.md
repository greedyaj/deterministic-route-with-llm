# Router Component (Design + Plan)

## Purpose
Deterministically select a small subset of tools (max 20) based on user intent, without using an LLM.

## Inputs
- Utterance (string)
- Optional context summary
- Optional language

## Outputs
- Intent label (string)
- Ranked tool list (name, score, reason, compact schema)
- Fallback directive: none | clarify | general

## Deterministic Scoring Design
- Token match score (stem/normalize)
- Phrase match score (keyword sequences)
- Tag match score (domain/category alignment)
- Example match score (closest example strings)
- Fixed weights and deterministic tie-breakers

## Selection Rules
- Apply threshold to exclude weak matches
- Return top-K tools with K <= 20
- If no tools pass threshold: return fallback

## Plan Steps
1. Specify the scoring weights and normalization rules. (done)
2. Define the threshold and tie-breakers. (done)
3. Define the router response format in detail. (done)
4. Document fallback behavior and when to ask clarifying questions. (done)
