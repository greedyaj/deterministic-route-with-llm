# Testing Checklist (Deterministic Router POC)

## Manual UI Checklist
- Select the `deterministicRouter` scenario in the Scenario dropdown.
- Send a short utterance (text) such as:
  - "schedule a meeting tomorrow"
  - "find email attachments"
  - "cancel a flight"
  - "update invoice"
- Confirm the Router status indicator updates (intent/tool count/fallback).
- Confirm the agent calls `router` before any other tool.
- Confirm a routed tool executes and returns a dummy result.
- For ambiguous input (e.g., "help me"), confirm fallback=clarify and a follow-up question.

## Voice Flow Checklist
- Repeat the same test utterances via voice input.
- Confirm router-first behavior and dummy tool execution.

## Example Utterances (Quick Smoke)
- "create calendar event"
- "show my inbox"
- "edit contact"
- "list tickets"
- "find flight"
- "get weather alert"
- "delete invoice"
- "change device brightness"
