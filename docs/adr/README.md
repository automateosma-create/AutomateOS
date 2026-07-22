# AutomateOS Architecture Decision Records

This directory contains accepted architecture decisions for AutomateOS. ADRs record why a durable decision was made, the alternatives considered, its consequences, and the conditions under which it may be revised.

GitHub is the canonical engineering source of truth. Notion may mirror these records for readability and navigation.

## Conventions

- ADRs use sequential four-digit identifiers.
- Filenames use `ADR-NNNN-descriptive-title.md`.
- New decisions receive a new ADR rather than rewriting history invisibly.
- A replaced decision remains in the repository and is marked `Superseded` with a link to the replacement.
- Material revisions should update `Status`, `Future Revisions`, and relevant links without erasing the original reasoning.
- Every ADR contains `Status`, `Date`, `Context`, `Decision`, `Consequences`, `Alternatives Considered`, and `Future Revisions`.

## Records

- [ADR-0001: Use GitHub as the Engineering Source of Truth](ADR-0001-github-as-engineering-source-of-truth.md)
- [ADR-0002: Use Google Calendar as the Scheduling Backend](ADR-0002-google-calendar-as-scheduling-backend.md)
- [ADR-0003: Use Google Sheets as the Early Operational Database](ADR-0003-google-sheets-as-early-operational-database.md)
- [ADR-0004: Use ChatGPT as the Primary User Interface](ADR-0004-chatgpt-as-primary-user-interface.md)
- [ADR-0005: Use n8n as the Automation Engine](ADR-0005-n8n-as-automation-engine.md)
- [ADR-0006: Identify AutomateOS Calendar Events with Structured Metadata](ADR-0006-metadata-based-calendar-events.md)
- [ADR-0007: Update Engineering Documentation with Implementation Changes](ADR-0007-documentation-updated-with-implementation.md)
- [ADR-0008: Learn Scheduling Estimates from Measured Actuals](ADR-0008-learn-from-measured-actuals.md)
- [ADR-0009: Prefer Safety Before Automation Breadth](ADR-0009-safety-before-automation.md)
- [ADR-0010: Use a Modular, Loosely Coupled Architecture](ADR-0010-modular-loosely-coupled-architecture.md)

## Status vocabulary

- `Proposed` — under consideration and not yet authoritative.
- `Accepted` — current architectural decision.
- `Deprecated` — retained temporarily but no longer preferred.
- `Superseded` — replaced by a later ADR.
- `Rejected` — considered and explicitly not adopted.