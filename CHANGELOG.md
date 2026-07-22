# Changelog

All notable engineering and documentation changes to AutomateOS are recorded in this file.

The format is based on Keep a Changelog. AutomateOS has not yet reached a stable production release; the Version 0.1 entry records the foundation baseline and does not imply that planned capabilities are implemented.

## [Unreleased]

### Added

- Canonical phased implementation roadmap covering dependencies, entry conditions, deliverables, validation, exit criteria, deferred scope, and cross-phase production requirements.
- Roadmap index under `docs/roadmap/`.
- Notion product-and-planning mirror specification defining product vision, current-state, roadmap, navigation, and synchronization boundaries.
- Unified Notion product-and-planning hub with a dedicated Product Vision page and links to the existing Current State, Roadmap, ADR, API Contract, and Changelog mirrors.

### Planned

- Safe Google Calendar deletion.
- Safe Calendar event update and movement.
- Expanded task contracts for flexible deadlines, scheduling windows, dependencies, splitability, energy requirements, and rescheduling rules.
- Flexible-task scheduling and automatic rescheduling.
- Gmail classification and structured extraction.
- Daily briefing generation and delivery.
- Mac mini and future mobile presentation surfaces.
- Incremental learning from actual durations, completion patterns, context, and energy.
- Long-term documentation-maintenance rules.

## [0.1.0-baseline] - 2026-07-22

### Added

- AutomateOS Constitution defining convenience, low cognitive load, auditability, deterministic execution, human authority, and documentation discipline.
- Repository README and system overview.
- Current architecture and data-flow documentation.
- Google Sheets operational-database schemas and source-of-truth rules.
- Custom GPT interface and execution-boundary documentation.
- Email-ingestion, morning-briefing, Mac mini, mobile-output, auditing, learning, and health-module architecture documents.
- Production workflow documentation for `Log Actuals` and `Place Calendar Event Safely`.
- Canonical API contracts covering GPT, n8n, Calendar, Gmail, Sheets, Mac mini services, logging, auditing, authentication, validation, retries, idempotency, metadata, versioning, and compatibility.
- Architecture Decision Record directory and ADR-0001 through ADR-0010.
- `PROJECT_STATE.md` as the current implementation and handoff snapshot.
- Notion documentation baseline, API-contract mirror, and Architecture Decision Record mirror.

### Established

- GitHub as the canonical engineering documentation and architecture-history source.
- Notion as the human-readable mirror and product-planning workspace.
- ChatGPT as the primary user interface.
- n8n as the deterministic orchestration and mutation layer.
- Google Sheets as the early operational datastore.
- Google Calendar as the user-facing scheduling backend.
- `Generated_Calendar_Events` as the authoritative audit trail for n8n-created Calendar events.
- Structured `AUTOMATEOS_METADATA_JSON` Calendar descriptions for identity, conflict analysis, duplicate prevention, auditing, and future rescheduling.
- One source of truth for each data domain and derived output surfaces that do not own competing state.
- Safety-first calendar mutation, idempotency, conservative failure behavior, and workflow health-check requirements.
- Modular, loosely coupled workflows with explicit contracts.
- Measured actuals as the future basis for adaptive duration estimates and workload planning.

### Validated

- `Log Actuals` accepts structured actual-work records, preserves zero values, records partial completion, and stores original payload context.
- Safe Calendar placement creates events in open slots.
- Repeated or conflicting UWorld placement is prevented or returned for rescheduling.
- Travel events can be created in open time.
- Explicitly compatible podcast activity can stack during travel.
- UWorld is blocked during travel.
- Calendar metadata survives creation when the Google Calendar node uses `calendar_description`.

### Changed

- Documentation progress advanced from the initial foundation to 17 of 18 Version 0.1 baseline steps.
- The master tracker was expanded with practical workflow-health requirements and a critical Calendar reconciliation rule.
- Calendar-event reconciliation was standardized to begin with `Generated_Calendar_Events` rather than title searches.
- Production and planned behavior were separated explicitly throughout the documentation.

### Known limitations

- Only `Log Actuals` and `Place Calendar Event Safely` are documented as production workflows.
- Calendar deletion, movement, flexible scheduling, Gmail processing, daily brief generation, health ingestion, and adaptive learning remain planned.
- `Daily_Briefs` has no defined live schema.
- Google Sheets remains an early-stage datastore and may require a later relational migration.
- Runtime exports, deployment configuration, and automated repository test infrastructure are not yet part of the documented foundation baseline.

[Unreleased]: https://github.com/automateosma-create/AutomateOS/compare/0.1.0-baseline...HEAD
[0.1.0-baseline]: https://github.com/automateosma-create/AutomateOS/commits/main
