# Deterministic Router POC Plan (High Level)

## Goal
Build a POC where the real-time LLM only sees a small, relevant tool subset by calling a deterministic router first. This avoids exposing up to ~1000 tools directly to the RT LLM.

## High-Level Flow
1. User audio/text -> RT LLM (only knows about `router` tool)
2. RT LLM calls `router(utterance, context)`
3. Router returns intent + ranked tool subset (top K)
4. RT LLM receives only those tool definitions and selects a tool
5. Tool runs -> RT LLM responds to user

## Project Placement
- Router is embedded in this codebase (no separate service).
- Create a new directory for router components and registry adapters (e.g., `src/app/lib/router/`).

## Router Tool Contract
Input:
- utterance: string
- context: optional short summary
- language: optional

Output:
- intent: string
- tools: list of { name, score, reason, definition }
- fallback: none | clarify | general

## Tool Registry Design
- No existing tools; define a new tool registry and schema from scratch.
- Each tool includes deterministic metadata: id, description, tags, keywords, examples, and a compact schema.
- Router builds an offline index from this registry (no LLM in router).
- Compact tool schemas are returned to the RT LLM.

## Routing Algorithm (Deterministic)
- Weighted lexical scoring (token/phrase/tag/example matches)
- Fixed weights and thresholds for repeatability
- Top-K selection with K <= 20 (configurable)
- Fallback if no tool passes threshold

## Determinism and Guardrails
- No LLM in router
- Fixed index + weights + thresholds
- Orchestrator enforces: RT LLM must call router first

## POC Tool Catalog
- Build a starter registry with 50-100 real tools across ~8-10 domains (calendar, email, search, CRM, docs, tickets, travel, weather, payments, device controls).
- Synthetic expansion to ~1000 tools using CRUD patterns and domain variants
- Gold utterance set per tool (5-10) for evaluation

## POC Test Plan
- Accuracy: precision@K, recall@K, no-match correctness
- Behavior: multi-intent and ambiguous utterances
- Observability: log input -> routed tools -> chosen tool -> outcome

## Open Questions
- Target K confirmed: 20 max tools surfaced to RT LLM.
