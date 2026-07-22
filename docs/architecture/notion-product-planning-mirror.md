# Notion Product and Planning Mirror

## Purpose

Notion provides the human-readable product and planning surface for AutomateOS. It mirrors the product vision, current implementation state, phased roadmap, and selected engineering documentation so that the system can be understood and navigated without reading the repository tree directly.

GitHub remains the canonical engineering source of truth. Notion is a synchronized planning and navigation layer; it must not silently override contracts, architecture decisions, implementation state, or workflow behavior recorded in GitHub.

## Required Notion structure

The AutomateOS documentation baseline should expose a product and planning hub containing:

- **Product Vision** — a readable synthesis of the Constitution and System Overview;
- **Current State** — a link to the maintained `PROJECT_STATE.md` mirror;
- **Phased Implementation Roadmap** — a link to the maintained roadmap mirror;
- **Architecture Decisions** — navigation to the ADR mirror;
- **API Contracts** — navigation to the interface specification;
- **Changelog** — navigation to the maintained project history;
- **Canonical sources** — direct links back to the corresponding GitHub records.

Existing detailed mirrors should be linked rather than duplicated. The product and planning hub may summarize them, but it should not create a second independently maintained copy of the same state or roadmap.

## Product vision mirror

The Notion Product Vision page should explain:

- the mission to reduce Maaz's cognitive and administrative burden;
- the experience promise of one primary conversational interface;
- the role of ChatGPT for interpretation and planning;
- the role of n8n and deterministic code for validation and mutation;
- the use of shared sources of truth rather than disconnected productivity tools;
- the intended domains: schedule, tasks, actuals, email, study, research, health, briefings, and future passive surfaces;
- the priority order of convenience, safety, reliability, simplicity, and feature breadth;
- the distinction between the current foundation-stage product and the long-term adaptive executive-assistant vision;
- explicit non-goals, including competing task databases, opaque mutation, unnecessary manual coordination, and premature complexity.

Canonical sources:

- `docs/architecture/constitution.md`
- `docs/architecture/system-overview.md`
- `README.md`

## Current-state mirror

The Notion Current State page mirrors `PROJECT_STATE.md` and should remain concise enough to answer:

- what is in production;
- what is planned;
- what remains exploratory;
- which component owns each data domain;
- what limitations are currently material;
- what engineering phase is next.

When current state changes, update GitHub first and then synchronize Notion. Operational behavior and logs take precedence if the documentation is stale.

## Roadmap mirror

The Notion roadmap mirrors `docs/roadmap/phased-implementation-roadmap.md` and may provide planning-friendly navigation, summaries, and milestone views. The GitHub roadmap owns phase definitions, dependencies, validation requirements, exit criteria, and deferred scope.

A roadmap item must remain labeled planned until implementation and validation are complete. Notion status changes must not promote a capability to production without corresponding GitHub and runtime evidence.

## Synchronization rules

- GitHub changes first for engineering facts, contracts, architecture, and production status.
- Notion is updated in the same documentation workflow or immediately afterward.
- Every Notion mirror states its canonical GitHub source.
- Do not duplicate a detailed mirror when a link and short summary are sufficient.
- Material product-vision changes update the Constitution or System Overview before the Notion summary.
- Material architecture changes create or supersede an ADR.
- Production-state changes update `PROJECT_STATE.md` and `CHANGELOG.md`.
- Roadmap changes update the canonical roadmap and changelog.
- If synchronization is incomplete, the Notion page should say that it may be stale rather than presenting uncertain information as current.

## Ownership boundaries

- **GitHub:** engineering truth, contracts, ADRs, implementation history, production status, and canonical roadmap gates.
- **Notion:** readable product vision, planning navigation, milestone views, and synchronized documentation mirrors.
- **Operational systems:** live schedule, task, actual, workflow, and audit state.

The Notion mirror is successful when a new engineer or future AI assistant can understand the product direction, find the current state, locate the roadmap, and reach canonical engineering records without creating a competing source of truth.
