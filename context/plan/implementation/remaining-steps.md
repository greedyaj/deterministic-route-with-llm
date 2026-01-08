# Remaining Implementation Steps

## Runtime Wiring
1. Add deterministicRouter scenario to the runtime scenario map in `src/app/App.tsx` so it can be selected in the UI. (done)
2. Pass a session tool-update callback into realtime context so the router tool can update session tools. (done)
3. Implement the session tool update handler to send `session.update` with the routed tool list. (done)
4. Ensure the router tool is the only tool visible before the first routing call. (done)

## Router-First Enforcement
5. Add a guard in tool execution to ensure router was called before any other tool (already done in dummy tool logic) and confirm it is wired via runtime context. (done)
6. If the router returns `fallback=clarify`, ensure the agent prompts for clarification and re-routes (instruction already in agent prompt). (done)

## UX Validation
7. Add a minimal UI indicator (optional) showing current routed tool count and last router intent. (done)
8. Verify chat and voice flows both call router before other tools. (done)

## Testing
9. Add a quick manual test checklist and example utterances for the deterministicRouter scenario. (done)
10. Run the evaluation endpoint and confirm non-zero recall on the gold examples. (done: recall@K=1.0)
