# AutomateOS

AutomateOS is a personal operating system designed to reduce the cognitive and administrative burden of organizing and executing work and life.

The system is still early-stage. Only a small number of workflows are currently in production. Documentation distinguishes clearly between what is built, what is planned, and what remains exploratory.

## Governing objective

AutomateOS should minimize the amount of mental effort required to organize and execute life. The system should adapt to the user rather than requiring the user to coordinate multiple tools.

Read the [AutomateOS Constitution](docs/architecture/constitution.md) for the current governing principles. It is a living, editable document.

## Primary interface

The AutomateOS custom GPT is intended to be the primary interface for:

- logging completed work;
- adding and scheduling tasks;
- moving calendar events;
- planning days and weeks;
- recording workouts and nutrition;
- asking what to do next.

The GPT interprets intent and invokes deterministic n8n workflows. Google Sheets, Calendar, Gmail, GitHub, Notion, and future apps are supporting infrastructure and output surfaces.

## Current architecture

```text
User / forwarded email
        ↓
AutomateOS custom GPT or n8n trigger
        ↓
n8n orchestration and deterministic logic
        ↓
Google Sheets operational database
        ↓
Google Calendar and other output surfaces
```

See [Current Architecture and Data Flow](docs/architecture/current-architecture-and-data-flow.md) for the implementation-level view.

## Current production workflows

- **Log Actuals** — validates and records completed work in `Actuals_Log`.
- **Place Calendar Event Safely** — evaluates calendar conflicts and creates and logs events when appropriate.

Most other capabilities remain planned.

## Important source-of-truth rule

Google Calendar is the user-facing schedule. The `Generated_Calendar_Events` sheet is the authoritative audit log for events created by n8n.

Calendar event titles are natural titles such as `UWorld` or `Travel`; they are not identified by placing “AutomateOS” in the title. When investigating generated events, inspect `Generated_Calendar_Events` first and use its Google event ID and title.

## Email component

Important emails from existing accounts are forwarded to the dedicated AutomateOS Gmail account associated with the Calendar and Drive infrastructure. The planned email-processing workflow will analyze those messages for events, schedule changes, deadlines, tasks, travel, bills, and briefing content.

## Planned output surfaces

- Google Calendar
- AutomateOS custom GPT
- Morning briefing
- Mac mini desktop dashboard
- Future iPhone app
- Notifications and selected email summaries

These should remain coordinated views over shared underlying data, not independent systems.

## Documentation approach

Documentation is deliberately proportional to implementation. Production workflows and necessary architectural decisions receive detailed documentation. Unbuilt ideas remain concise in the roadmap until implementation requires more detail.

GitHub is the canonical engineering source. Notion provides the synchronized product vision, current-state, roadmap, decision, contract, and planning navigation described in the [Notion Product and Planning Mirror](docs/architecture/notion-product-planning-mirror.md).

The 18-step Version 0.1 documentation baseline is complete. Future engineering and documentation changes follow the [Documentation Maintenance Rules](docs/maintenance/documentation-maintenance-rules.md). A material implementation is not complete until applicable contracts, workflow documentation, tests, health checks, project state, changelog, ADRs, and Notion mirrors agree with the implemented behavior.

## Repository map

- [`PROJECT_STATE.md`](PROJECT_STATE.md) — current implementation, limitations, and immediate handoff state
- [`CHANGELOG.md`](CHANGELOG.md) — notable engineering and documentation history
- [`docs/maintenance/documentation-maintenance-rules.md`](docs/maintenance/documentation-maintenance-rules.md) — required documentation updates, review gates, drift handling, and synchronization policy
- [`docs/roadmap/phased-implementation-roadmap.md`](docs/roadmap/phased-implementation-roadmap.md) — sequenced implementation phases, dependencies, validation, and exit gates
- `docs/architecture/constitution.md` — governing principles
- `docs/architecture/system-overview.md` — high-level system description
- `docs/architecture/current-architecture-and-data-flow.md` — current implementation and data paths
- `docs/architecture/api-contracts.md` — canonical component interface contracts
- `docs/architecture/notion-product-planning-mirror.md` — Notion hierarchy, ownership, and synchronization rules
- `docs/adr/` — accepted architecture decision records
- GitHub Issues — implementation backlog and traceable change records

## Status

AutomateOS is in an early foundation stage. The documentation baseline is complete, but the full product is not. The current implementation state is recorded in [`PROJECT_STATE.md`](PROJECT_STATE.md), and implementation order is governed by the [Phased Implementation Roadmap](docs/roadmap/phased-implementation-roadmap.md).

The immediate phases are:

1. complete safe Calendar deletion, update, and movement;
2. expand the task contract and implement flexible scheduling;
3. add Gmail classification and structured capture;
4. build daily briefing delivery and workflow-health reporting;
5. add auditing, learning, health, and ambient surfaces incrementally after their dependencies are stable.