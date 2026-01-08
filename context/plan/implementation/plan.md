# Implementation Plan (Step by Step, No Code)

## Phase 1: Define Data Shapes
1. Define the tool registry schema (id, name, description, tags, keywords, examples, parameters). (done)
2. Define the router request/response schema (intent, optional utterance, context, language -> intent, tools[], fallback). (done)
3. Decide canonical metadata rules (how tags/keywords/examples are authored and reviewed). (done)

## Phase 2: Project Structure
4. Create router module directory under `src/app/lib/router/`. (done)
5. Create registry module directory under `src/app/lib/registry/`. (done)
6. Create a data directory for tool definitions (e.g., `src/app/data/tools/`). (done)

## Phase 3: Router Core Design
7. Specify the deterministic scoring function (token/phrase/tag/example weights). (done)
8. Define matching thresholds and tie-break rules. (done)
9. Define Top-K selection rules (K <= 20). (done)
10. Define fallback behaviors for low-confidence or ambiguous inputs. (done)

## Phase 4: Registry and Indexing
11. Create rules for validating tool metadata completeness. (done)
12. Decide the offline indexing strategy (precomputed token maps, tag lookup, example matching). (done)
13. Define how the router loads and refreshes the index at runtime. (done)

## Phase 5: RT LLM Orchestration
14. Define the orchestration contract: RT LLM calls router on intent changes or when no tool list is active. (done)
15. Define how the tool subset is injected into the RT LLM context. (done)
16. Define how to handle multi-intent inputs (return multiple clusters or ask clarifying). (done)

## Phase 6: Tool Catalog for POC
17. Draft the initial 50-100 real tools across 8-10 domains. (done)
18. Define synthetic expansion rules to reach ~1000 tools (CRUD patterns + domain variants). (done)
19. Create a small gold set of utterances per tool for evaluation. (done)

## Phase 7: Evaluation and Logging
20. Define evaluation metrics (precision@K, recall@K, no-match correctness). (done)
21. Define logging fields (input, routed tools, chosen tool, outcome). (done)
22. Decide the test harness shape and inputs (manual + scripted). (done)

## Phase 8: Rollout and Iteration
23. Review routing accuracy on the gold set; tune weights and thresholds. (done)
24. Freeze the scoring configuration for deterministic behavior. (done)
25. Document operating guidelines for adding new tools. (done)
