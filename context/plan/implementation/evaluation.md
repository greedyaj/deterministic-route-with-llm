# Evaluation and Logging (Design + Plan)

## Purpose
Validate deterministic routing quality and provide visibility for iteration.

## Metrics
- precision@K
- recall@K
- no-match correctness

## Logging Fields
- input utterance
- routed tools and scores
- tool selected by RT LLM
- outcome (success/failure)

## Evaluation Harness Shape
- Scripted runner that feeds gold utterances into the router
- Aggregates metrics per domain and per operation
- Outputs a summary report (JSON + console table)

## Plan Steps
1. Define evaluation datasets (gold utterances per tool). (done)
2. Define the evaluation harness shape (scripted + manual runs). (done)
3. Define logging schema and where logs are stored. (done)
4. Define a tuning workflow for weights and thresholds. (done)
