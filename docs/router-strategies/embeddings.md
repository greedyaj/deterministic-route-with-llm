# Embeddings Strategy

## Purpose
- Semantic matching beyond exact word overlap.
- Useful when user intent uses synonyms or paraphrases.

## How it works
- Convert user intent/utterance into an embedding vector via `/api/embeddings`.
- Convert each tool's text (name/description/keywords/examples) into embeddings.
- Compute cosine similarity between query and tool embeddings.
- Rank by similarity, filter by threshold, return top K.

## Notes
- Uses OpenAI embeddings (default model `text-embedding-3-small`).
- Adds latency/cost; tool embeddings are cached per registry version.
