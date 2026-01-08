# Tool Catalog for POC (Design + Plan)

## Purpose
Seed the registry with enough tools to simulate large-scale routing and evaluate accuracy.

## Tool Catalog Targets
- 50-100 real tools across 8-10 domains
- Synthetic expansion to ~1000 tools via CRUD patterns
- 5-10 gold utterances per tool

## Domain Coverage (Real Tools)
- calendar, email, search, crm, docs, tickets, travel, weather, payments, device

## Synthetic Expansion Rules
- Base pattern: `<domain>.<operation>_<entity>`
- Operations: create, get, update, delete, list
- Each domain has 8-12 entities
- Each entity generates 5 tools (CRUD + list)
- Keywords/examples built from a small synonym set per operation

## Gold Utterance Guidelines
- 5-10 short utterances per tool
- Include action + entity + optional domain hint
- Keep to 3-10 words per example

## Plan Steps
1. Define domains and the base set of real tools. (done)
2. Define synthetic expansion rules (CRUD + domain variants). (done)
3. Draft example utterances per tool for the gold set. (done)
4. Establish naming conventions and consistent metadata tagging. (done)
