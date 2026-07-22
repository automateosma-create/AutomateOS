# ADR-0009: Prefer Safety Before Automation Breadth

## Status

Accepted

## Date

2026-07-22

## Context

AutomateOS is intended to take action rather than merely suggest it. Calendar creation, movement, deletion, task rescheduling, email-derived actions, and future health or financial workflows can create real consequences when inputs are ambiguous, duplicated, stale, or malformed.

Maximizing automation without protective boundaries would reduce convenience only when everything works perfectly. In practice, silent duplicate events, displaced fixed commitments, destructive operations, and unlogged failures create more cognitive burden than the manual work they replace.

## Decision

Safety, correctness, and auditability take precedence over automation breadth.

The system will apply the following principles:

- validate calendar changes and other mutations before execution;
- use stable identities and idempotency keys to prevent duplicates;
- read the relevant source of truth before changing state;
- preserve fixed events and explicit user constraints;
- require safeguards or confirmation for ambiguous, consequential, destructive, or irreversible operations;
- make routine, reversible, well-defined operations automatic without repetitive approval;
- fail conservatively when metadata, time values, authentication, dependencies, or audit writes are invalid;
- log successful, blocked, failed, superseded, deleted, and rescheduled actions;
- report degraded states instead of silently claiming success.

A mutation is not complete until both the external action and its required audit write are confirmed. Safe non-action is preferable to an untraceable or destructive guess.

## Consequences

- Automation may refuse or defer some requests that a more permissive system would execute.
- The user receives fewer duplicates and destructive surprises.
- Every production workflow needs validation, error handling, idempotency, audit behavior, and health checks.
- Reversible operations can become increasingly autonomous as their rules mature.
- Safety logic must be tested as carefully as successful-path behavior.

## Alternatives Considered

- **Maximum autonomy with correction afterward:** convenient when correct, but unsafe and cognitively expensive when wrong.
- **Require confirmation for every mutation:** safe but contrary to the goal of reducing repetitive administrative burden.
- **Depend on the language model to judge every risk:** flexible but insufficiently deterministic for routine state changes.

## Future Revisions

As workflows accumulate evidence and stronger tests, selected operations may move from review-required to automatic. Changes in autonomy level should be explicit, documented, reversible where practical, and supported by observed reliability rather than optimism.