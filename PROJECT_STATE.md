# AutomateOS Project State

**State date:** 2026-07-22  
**Baseline:** Version 0.1 foundation  
**Documentation progress:** 17 / 18 baseline steps completed

## Purpose

This file is the concise handoff for the current AutomateOS implementation state. It records what is in production, what has been decided but not built, the authoritative data boundaries, known limitations, and the next engineering sequence.

GitHub is the canonical engineering source of truth. If this file conflicts with production workflow behavior, operational logs, or a later accepted architecture decision record, investigate the discrepancy and update this file rather than assuming the snapshot is current.

## Maturity vocabulary

- **Production** — implemented and tested.
- **Planned** — agreed direction or contract, not yet implemented.
- **Exploratory** — an idea that may change and is not an implementation commitment.

## Executive state

AutomateOS is in an early foundation stage. It has a defined architecture, source-of-truth model, API contract baseline, ten accepted architecture decision records, a phased implementation roadmap, a synchronized Notion product-and-planning hub, and two production n8n workflows.

The system is not yet an end-to-end autonomous personal operating system. Calendar deletion and movement, flexible scheduling, email processing, daily briefing generation, health ingestion, and adaptive scheduling remain planned.

## Production workflows

### Log Actuals

**Status:** Production

Current flow:

```text
AutomateOS GPT or approved webhook client
    -> n8n webhook
    -> validation and normalization
    -> append to Actuals_Log
    -> confirmed response
```

Current behavior:

- accepts one or more actual-work entries;
- preserves numeric zero values;
- records completed, partial, missed, or cancelled work;
- stores barriers, next actions, context, duration, and original payload data;
- uses the AutomateOS Database as the source of truth for actuals;
- must avoid duplicate actuals and flag uncertain task or event matches.

### Place Calendar Event Safely

**Status:** Production and behavior-tested

Current flow:

```text
AutomateOS GPT or approved webhook client
    -> n8n webhook
    -> normalize proposed event and metadata
    -> read relevant Google Calendar events
    -> deterministic overlap and placement decision
    -> create or return a non-creation decision
    -> record created event in Generated_Calendar_Events
    -> confirmed response
```

Current decisions include:

- `create`
- `create_stacked`
- `create_and_flag_existing_for_reschedule`
- `needs_reschedule_new_event`
- `needs_review`

Documented validation includes:

- open-slot event creation;
- prevention of repeated or conflicting UWorld placement;
- travel event creation;
- compatible podcast stacking during travel;
- blocking UWorld during travel;
- preservation and parsing of `AUTOMATEOS_METADATA_JSON` in Calendar descriptions.

The Google Calendar create node must use `calendar_description`, not the plain user-facing `description`, or the AutomateOS metadata will be lost.

## Current architecture

### Primary interface

The AutomateOS custom GPT is the primary conversational interface. It interprets natural-language requests, resolves material ambiguity, reads relevant sources of truth, and invokes deterministic workflows. It must not report success until the connected workflow confirms the result.

### Orchestration

n8n is the automation engine. It performs validation, deterministic decision logic, external-service calls, state mutation, and logging.

### Operational data

The `AutomateOS Database` Google Sheet is the current operational datastore.

Current tabs:

- `Actuals_Log`
- `Tasks`
- `Rotation_Assignments`
- `Call_Assignments`
- `Generated_Calendar_Events`
- `Daily_Briefs`
- `Automation_Log`
- `Rules`

`Daily_Briefs` exists but does not yet have a defined live schema.

### Scheduling

Google Calendar is the user-facing schedule and interoperable scheduling backend. The `Generated_Calendar_Events` sheet is the authoritative audit trail for events created by n8n.

Calendar titles remain natural titles such as `UWorld` or `Travel`. Reconciliation begins with `Generated_Calendar_Events`, using `generated_event_uid`, `google_event_id`, title, timestamps, category, status, and stored payload data.

### Email

Important messages are forwarded to the dedicated AutomateOS Gmail account. Automated classification and extraction of events, deadlines, tasks, travel, bills, and briefing content are planned, not production.

### Documentation and planning

- GitHub owns engineering documentation, contracts, ADRs, implementation history, production status, and the canonical phased implementation roadmap.
- Notion contains a synchronized product-and-planning hub with the product vision, current-state navigation, roadmap navigation, decisions, contracts, and changelog.
- `docs/architecture/notion-product-planning-mirror.md` defines the synchronization and ownership rules.
- A Notion mirror does not override the GitHub record.

### Output surfaces

Current and planned surfaces share underlying state rather than owning independent business logic:

- AutomateOS custom GPT;
- Google Calendar;
- morning briefing;
- Mac mini dashboard;
- future mobile application;
- notifications and selected email summaries.

## Source-of-truth map

- Completed and attempted work: `Actuals_Log`
- Flexible task records: `Tasks`
- Rotation assignments: `Rotation_Assignments`
- Call assignments: `Call_Assignments`
- n8n-created calendar-event audit: `Generated_Calendar_Events`
- User-visible schedule: Google Calendar
- Active operating rules: `Rules`
- Workflow execution results: `Automation_Log`
- Engineering documentation and architecture history: GitHub
- Product navigation, readable mirrors, milestones, and planning: Notion

Derived dashboards, summaries, GPT responses, Notion pages, and future applications are views. They must not silently become competing sources of truth.

## Interface and architecture baseline

The repository contains:

- canonical Version 1 API contracts for production and planned interfaces;
- common request and response conventions;
- authentication assumptions;
- error, retry, idempotency, metadata, and compatibility rules;
- ADR-0001 through ADR-0010 covering source-of-truth boundaries, Calendar, Sheets, ChatGPT, n8n, Calendar metadata, documentation discipline, measured learning, safety, and modularity;
- a phased implementation roadmap with dependencies, validation gates, exit criteria, and deferred scope;
- a defined Notion mirror structure for product vision, current state, roadmap, contracts, decisions, and project history.

Production webhook clients may still rely on transitional compatibility behavior described in the API contract. New producers should provide explicit version, request, source, timestamp, and idempotency fields.

## Safety invariants

- Calendar writes go through the safe placement workflow.
- Existing fixed events are not displaced automatically.
- Unknown or malformed scheduling information fails conservatively.
- Equivalent mutation requests must be idempotent.
- Compatible overlaps must be explicit and auditable.
- A write is not complete until its required operational and audit records are confirmed.
- Destructive, irreversible, or materially ambiguous operations require additional safeguards.
- Production workflows must expose practical health checks and surface degraded dependencies.

## Known limitations

- Only two workflows are currently documented as production.
- Calendar deletion and update or movement workflows are not yet production.
- Flexible deadline-task placement and automatic rescheduling are not yet production.
- Gmail ingestion and extraction are planned.
- Daily briefing generation and delivery are planned.
- The Mac mini and mobile surfaces are planned and must not own independent state.
- Health modules are architectural plans rather than diagnostic or production systems.
- Learning from actuals is defined, but a production personalized estimation model is not yet documented.
- Google Sheets is appropriate for the current stage but may require migration when concurrency, transactionality, referential integrity, or query complexity materially increase.
- The current repository baseline primarily records engineering documentation; deployment and runtime workflow artifacts should be versioned later when safe to publish without credentials or personal data.

## Immediate engineering sequence

The canonical order and phase gates are defined in [`docs/roadmap/phased-implementation-roadmap.md`](docs/roadmap/phased-implementation-roadmap.md).

1. Complete the safe Calendar lifecycle: deletion, update, movement, reconciliation, recovery, and health checks.
2. Expand the task contract and implement a deterministic flexible-scheduling MVP.
3. Add Gmail classification and structured capture in proposal-first mode.
4. Generate daily briefings and system-health summaries from authoritative sources.
5. Add actuals-based estimation and adaptive scheduling only after sufficient matched observations exist.
6. Integrate health and performance domains conservatively.
7. Add ambient Mac and mobile surfaces after core APIs and health endpoints are stable.

## Remaining Version 0.1 documentation step

1. Define documentation maintenance rules for future changes.

## Maintenance rule

Update this file when any of the following changes materially:

- production workflow inventory;
- source-of-truth ownership;
- major component status;
- accepted architecture;
- roadmap phase or immediate engineering sequence;
- known operational limitations.

Record the same material change in `CHANGELOG.md`. Preserve historical reasoning in ADRs rather than rewriting accepted decisions invisibly.
