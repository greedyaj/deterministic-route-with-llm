# Rollout and Iteration (Design)

## Tuning Workflow
- Run evaluation over gold utterances.
- Review failures for recurring miss patterns.
- Adjust scoring weights and thresholds in small increments.
- Re-run evaluation and confirm improvements.

## Freeze Deterministic Config
- When precision/recall meets target, freeze:
  - `ROUTER_SCORE_WEIGHTS`
  - `ROUTER_MIN_SCORE`
  - `ROUTER_MAX_TOOLS`
  - tie-breaker rules
- Changes require re-evaluation and explicit review.

## Tool Authoring Guidelines
- Follow `context/plan/implementation/metadata.md` rules.
- Add 3-5 examples per tool before merging.
- Ensure tags/keywords cover likely user phrasing.
- Keep parameter schemas minimal and deterministic.
