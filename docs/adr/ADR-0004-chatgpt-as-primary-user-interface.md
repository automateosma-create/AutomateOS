# ADR-0004: Use ChatGPT as the Primary User Interface

## Status

Accepted

## Date

2026-07-22

## Context

AutomateOS is intended to reduce cognitive load rather than become another application that requires manual upkeep. Its operations span calendar changes, task capture, actual-work logging, planning, prioritization, email-derived actions, health inputs, and requests such as “What should I do next?” A traditional interface would require the user to choose forms, fields, databases, and workflows before expressing the underlying intent.

A conversational model can interpret natural language, use current conversation context, resolve ambiguity, summarize results, and combine multiple domains in a single interaction. However, model memory and conversation history are not reliable operational databases, and direct model-driven mutations would weaken determinism and auditability.

## Decision

Use the AutomateOS custom GPT as the primary conversational input interface and an important output interface.

ChatGPT is responsible for:

- translating natural-language commands into versioned structured requests;
- using conversation context and permitted memory to reduce repeated explanation;
- reasoning about priorities, plans, tradeoffs, and ambiguity;
- asking questions only when missing information materially affects safety or correctness;
- presenting confirmations, recommendations, and failures clearly.

Deterministic n8n workflows remain responsible for validation, conflict checks, identifiers, state changes, calculations, and audit writes. Operational truth remains in connected systems rather than model memory.

The interface is designed for future portability: stable API contracts and modular workflows allow another conversational model, mobile client, or desktop application to invoke the same backend without rewriting business logic.

## Consequences

- The user can operate the system through ordinary language with less context switching.
- Complex cross-domain requests can be interpreted without exposing infrastructure details.
- Model output must be validated before execution.
- The GPT must not claim success until connected systems confirm it.
- Important state cannot exist only in a conversation.
- Changes in model provider or capabilities should not require changes to core workflow semantics.

## Alternatives Considered

- **Dedicated forms and dashboards as the primary interface:** predictable but burdensome for varied, contextual requests.
- **Direct use of n8n, Sheets, and Calendar:** exposes implementation details and requires manual coordination.
- **A custom mobile application first:** useful later, but expensive and likely to duplicate logic before contracts stabilize.

## Future Revisions

ChatGPT may be replaced or supplemented by other conversational models and native applications. The primary-interface decision should be revisited if another surface provides lower total user burden while preserving natural-language control, auditability, and backend portability.