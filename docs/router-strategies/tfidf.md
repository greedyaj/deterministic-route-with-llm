# TF-IDF Strategy

## Purpose
- Deterministic lexical matching with corpus-aware weighting.
- Improves ranking by down-weighting common words and up-weighting rare terms.

## How it works
- Build a TF-IDF index across all tools:
  - TF (term frequency) per tool.
  - IDF (inverse document frequency) across the full tool registry.
- Build a TF-IDF vector for the user intent/utterance.
- Compute cosine similarity between the query vector and each tool vector.
- Use cosine score as the tool score, filter by threshold, return top K.

## Notes
- Still word-based (not semantic), but more robust than raw overlap.
- Deterministic and local; requires full tool corpus to compute IDF.
