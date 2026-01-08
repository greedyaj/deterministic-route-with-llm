# RT LLM Orchestration (Design + Plan)

## Purpose
Ensure the RT LLM always calls the router first and only sees a curated subset of tools (max 20).

## Rules
- Router is the only tool visible initially.
- RT LLM must call router before any other tool.
- Tool subset injected into RT LLM context after routing.

## Orchestration Contract
- Initial tool list: `[router]` only.
- On router response:
  - Replace tool list with routed tools.
  - Update instructions to reflect the available tools.
- If router fallback is `clarify`, RT LLM asks a clarifying question and re-calls router.
- If router fallback is `general`, RT LLM responds without tool calls.

## Multi-Intent Handling
- If router returns tools from distinct domains with similar scores:
  - RT LLM asks a clarifying question before choosing.
- If user explicitly requests two actions, RT LLM can execute sequentially.

## Plan Steps
1. Define the orchestration contract and enforcement point. (done)
2. Specify how the router result becomes the tool list for the RT LLM. (done)
3. Define handling for multi-intent: return multiple tool clusters or ask clarifying. (done)
4. Define how to handle fallback = clarify/general. (done)
