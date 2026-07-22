# ADR-0010: Use a Modular, Loosely Coupled Architecture

## Status

Accepted

## Date

2026-07-22

## Context

AutomateOS spans a conversational interface, n8n workflows, Google services, operational storage, briefings, health modules, desktop and mobile surfaces, and future learning services. These components will mature at different rates and may be replaced independently. A tightly coupled design would make a change in one provider or workflow cascade through the entire system.

Early development also requires rapid experimentation. The architecture must allow a workflow to be tested, deployed, disabled, or migrated without creating multiple competing sources of truth or duplicating business logic across every interface.

## Decision

Design AutomateOS as a set of modular, loosely coupled workflows and services connected through explicit versioned contracts, stable identifiers, documented source-of-truth boundaries, and audit records.

Each module should:

- own a narrow responsibility;
- read and write through documented interfaces;
- avoid maintaining a second authoritative copy of another module’s data;
- expose practical tests and health checks;
- return structured success, blocked, degraded, and failure states;
- remain replaceable without requiring every caller to understand its internal implementation.

Presentation surfaces such as ChatGPT, the morning briefing, the Mac mini app, and a future mobile app consume shared services and data. They do not independently recreate scheduling, validation, or persistence logic.

## Consequences

- Components can be replaced or migrated incrementally.
- Individual workflows are easier to test and reason about.
- Failures can be isolated and surfaced without disabling unrelated modules.
- New clients can reuse the same backend contracts.
- Interface design, versioning, and identifier discipline require ongoing effort.
- Excessive fragmentation must be avoided; modules should earn their boundaries through real responsibilities.

## Alternatives Considered

- **One monolithic application:** simpler deployment initially, but harder to evolve across integrations and output surfaces.
- **Independent automation scripts without shared contracts:** fast to start, but creates inconsistent validation, logging, and data ownership.
- **Business logic duplicated in each client:** provides local flexibility but guarantees drift and difficult migrations.
- **Microservices for every feature immediately:** modular in theory, but operationally excessive for the current stage.

## Future Revisions

Module boundaries may be consolidated when separation adds no practical value or split when a domain gains distinct reliability, scaling, or security needs. The decision favors meaningful modularity, not maximal service count. Any revision must preserve source-of-truth clarity and contract compatibility.