# AutomateOS

AutomateOS is a personal operating system designed to reduce the cognitive and administrative burden of organizing and executing work and life.

The system is still early-stage. Only a small number of workflows are currently in production. Documentation should distinguish clearly between what is built, what is planned, and what remains exploratory.

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
- **Place Calendar Event Safely** — evaluates calendar conflicts and creates/logs events when appropriate.

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

Documentation is deliberately proportional to implementation. Production workflows and necessary architectural decisions receive detailed documentation. Unbuilt ideas should remain concise in the roadmap until implementation requires more detail.

## Repository map

- `docs/architecture/constitution.md` — governing principles
- `docs/architecture/system-overview.md` — high-level system description
- `docs/architecture/current-architecture-and-data-flow.md` — current implementation and data paths
- GitHub Issues — baseline work tracker and implementation backlog

## Status

AutomateOS is in an early foundation stage. The immediate engineering sequence is:

1. document current state and source-of-truth boundaries;
2. finish safe calendar deletion and movement workflows;
3. implement flexible scheduling;
4. add email classification and event extraction;
5. build briefing, health, auditing, and learning layers incrementally.
