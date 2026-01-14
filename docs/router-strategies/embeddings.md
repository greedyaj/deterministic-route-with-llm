# Embeddings Strategy

## Purpose
- Semantic matching beyond exact word overlap.
- Useful when user intent uses synonyms or paraphrases.

## How it works (conceptual)
- Convert user intent/utterance into an embedding vector.
- Convert each tool's text (name/description/keywords/examples) into an embedding vector.
- Compute cosine similarity between query and tool embeddings.
- Rank by similarity, filter by threshold, return top K.

## Notes
- Requires an embedding model or service.
- Adds latency/cost and may be less deterministic than lexical methods.
- Not implemented yet in this repository (strategy placeholder only).
