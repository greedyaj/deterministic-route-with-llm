# Lexical Strategy

## Purpose
- Fast, deterministic routing based on direct word/phrase overlap.
- Good for exact keyword matches and explicit tool names.

## How it works
- Normalize and tokenize the user intent/utterance.
- Compare against tool metadata tokens from:
  - name
  - description
  - keywords
  - tags
  - examples
- Score is a weighted sum of:
  - token overlap
  - keyword/phrase substring matches
  - tag overlap
  - best example overlap
- Filter tools below the minimum score, then return the top K.

## Notes
- No corpus-wide statistics are used.
- Fully deterministic and local.
