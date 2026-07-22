# Changelog

All notable engineering and documentation changes to AutomateOS are recorded in this file.

The format is based on Keep a Changelog. AutomateOS has not yet reached a stable production release; the Version 0.1 entry records the foundation baseline and does not imply that planned capabilities are implemented.

## [Unreleased]

### Added

- AutomateOS n8n Workflow Specification v1 (`NWS-1`) for compact, standardized workflow packs.
- Machine-readable NWS-1 manifest JSON Schema and reusable workflow-pack template.
- Workflow registry showing specification, export, Code-node, and fixture completeness.
- NWS-1 packs for `Place Calendar Event Safely` and `Log Actuals`.
- Exact preserved JavaScript for the two documented `Place Calendar Event Safely` Code nodes.

### Changed

- Existing narrative workflow pages now route to the standardized NWS-1 packs.
- Workflow documentation now separates the five-minute human review surface from exact sanitized n8n exports, Code-node files, and fixtures.
- Missing implementation artifacts are recorded explicitly rather than reconstructed from prose.

### Known gaps

- Sanitized active n8n exports are not yet preserved for the two production workflows.
- Exact `Log Actuals` Code-node source, node graph, retry behavior, and machine-readable fixtures remain to be captured.
- Exact non-Code node names and parameters for `Place Calendar Event Safely` require export verification.

### Planned

- Safe Google Calendar deletion.
- Safe Calendar event update and movement.
- Expanded task contracts for flexible deadlines, scheduling windows, dependencies, splitability, energy requirements, and rescheduling rules.
- Flexible-task scheduling and automatic rescheduling.
- Gmail classification and structured extraction.
- Daily briefing generation and delivery.
- Mac mini and future mobile presentation surfaces.
- Incremental learning from actual durations, completion patterns, context, and energy.
- Sanitized runtime exports, deployment configuration, automated contract tests, and behavior fixtures as production workflows mature.

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
- Canonical phased implementation roadmap covering dependencies, entry conditions, deliverables, validation, exit criteria, deferred scope, and cross-phase production requirements.
- Roadmap index under `docs/roadmap/`.
- Notion product-and-planning mirror specification defining product vision, current-state, roadmap, navigation, and synchronization boundaries.
- Unified Notion product-and-planning hub with a dedicated Product Vision page and links to the Current State, Roadmap, ADR, API Contract, and Changelog mirrors.
- Canonical documentation-maintenance policy defining change triggers, completion gates, proportionality, drift handling, security, and GitHub-to-Notion synchronization.
- Notion documentation baseline and synchronized API-contract, ADR, project-state, changelog, roadmap, product-vision, and maintenance-policy pages.

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
- Safety-first Calendar mutation, idempotency, conservative failure behavior, and workflow health-check requirements.
- Modular, loosely coupled workflows with explicit contracts.
- Measured actuals as the future basis for adaptive duration estimates and workload planning.
- Documentation as a completion requirement for material implementation changes.
- Preservation of architectural history through sequential and superseding ADRs rather than silent rewrites.
- Production status as an evidence-based state that cannot be granted by a planning or documentation label alone.

### Validated

- `Log Actuals` accepts structured actual-work records, preserves zero values, records partial completion, and stores original payload context.
- Safe Calendar placement creates events in open slots.
- Repeated or conflicting UWorld placement is prevented or returned for rescheduling.
- Travel events can be created in open time.
- Explicitly compatible podcast activity can stack during travel.
- UWorld is blocked during travel.
- Calendar metadata survives creation when the Google Calendar node uses `calendar_description`.

### Changed

- Documentation progress advanced from the initial foundation to 18 of 18 Version 0.1 baseline steps.
- The Version 0.1 documentation baseline was formally completed while the product remained correctly labeled as early-stage with only two production workflows.
- The master tracker was expanded with practical workflow-health requirements and a critical Calendar reconciliation rule.
- Calendar-event reconciliation was standardized to begin with `Generated_Calendar_Events` rather than title searches.
- Production, planned, exploratory, deprecated, and retired states were defined explicitly.
- Documentation maintenance became event- and risk-driven rather than a periodic boilerplate exercise.
- GitHub-to-Notion synchronization boundaries were formalized.

### Known limitations

- Only `Log Actuals` and `Place Calendar Event Safely` are documented as production workflows.
- Calendar deletion, movement, flexible scheduling, Gmail processing, daily brief generation, health ingestion, and adaptive learning remain planned.
- `Daily_Briefs` has no defined live schema.
- Google Sheets remains an early-stage datastore and may require a later relational migration.
- Runtime exports, deployment configuration, and automated repository test infrastructure are not yet part of the complete engineering artifact set.
- Completion of the documentation baseline does not represent completion of the planned product.

[Unreleased]: https://github.com/automateosma-create/AutomateOS/compare/0.1.0-baseline...HEAD
[0.1.0-baseline]: https://github.com/automateosma-create/AutomateOS/commits/main
