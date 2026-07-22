# AutomateOS Phased Implementation Roadmap

## Purpose

This roadmap translates the accepted AutomateOS architecture into an implementation sequence. It is an engineering order of operations, not a promise of calendar dates. A phase begins only when its entry conditions are met and is complete only when its exit criteria are demonstrated.

GitHub is the canonical engineering source of truth. Notion mirrors this roadmap for planning and readability.

## Roadmap principles

Every phase must follow these rules:

- Reduce the user's total cognitive and administrative burden.
- Keep ChatGPT as the primary interface while deterministic workflows perform validation and mutation.
- Preserve one authoritative source for each data domain.
- Route Calendar mutations through explicit safety gates.
- Require stable identifiers, idempotency, structured logs, and auditable decisions.
- Fail conservatively when state, metadata, or intent is materially uncertain.
- Add practical health checks before a workflow is considered production.
- Keep derived surfaces from owning competing task, schedule, or operational state.
- Update contracts, current-state documentation, the changelog, and relevant ADRs with implementation changes.
- Keep credentials, protected health information, and sensitive personal data out of GitHub and diagnostic logs.

## Phase model

Each phase has five gates:

1. **Entry** — dependencies and decisions that must already exist.
2. **Build** — implementation work included in the phase.
3. **Validation** — behavior that must be tested.
4. **Exit** — evidence required before the phase is considered production.
5. **Deferred** — work intentionally excluded to control complexity.

Phases may overlap only where doing so does not create competing sources of truth or bypass an unfinished safety dependency.

## Phase 0 — Foundation baseline

**Status:** Completed documentation and architecture baseline; limited production runtime.

### Objective

Establish the governing architecture, current-state boundaries, and two safe production primitives before expanding automation breadth.

### Delivered

- AutomateOS Constitution and system overview.
- Source-of-truth map for Calendar, Sheets, GitHub, and Notion.
- Canonical API contracts and compatibility rules.
- ADR-0001 through ADR-0010.
- `PROJECT_STATE.md` and `CHANGELOG.md`.
- Production `Log Actuals` workflow.
- Production `Place Calendar Event Safely` workflow.
- Tested duplicate prevention, conflict handling, metadata preservation, and explicit stackability behavior.

### Remaining foundation hardening

The repository should eventually include sanitized n8n workflow exports, reproducible configuration notes, and automated contract or behavior tests. These artifacts are cross-cutting requirements and should be added incrementally as each production workflow is revised.

## Phase 1 — Safe Calendar lifecycle

**Priority:** Immediate

### Objective

Complete safe, reversible lifecycle management for AutomateOS-managed Calendar events before higher-level schedulers begin moving work automatically.

### Entry

- Safe event placement is production and behavior-tested.
- Calendar metadata and `Generated_Calendar_Events` reconciliation rules are stable.
- API error, retry, idempotency, and audit conventions are defined.

### Build

- Safe Calendar deletion workflow.
- Safe Calendar update and movement workflow.
- Deterministic target resolution using `generated_event_uid` and `google_event_id`.
- Precondition checks that compare expected and current event state.
- Soft-delete, cancellation, supersession, and reschedule statuses in the operational ledger.
- Audit records for attempted, blocked, completed, partially completed, and rolled-back mutations.
- Recovery procedures for Calendar success followed by ledger-write failure, and the reverse.
- Health checks for credentials, Calendar access, ledger access, metadata parsing, and recent workflow execution.
- Sanitized workflow exports and behavior fixtures where safe to publish.

### Validation

- Delete the intended AutomateOS-managed event without affecting unrelated events.
- Refuse deletion when identity is ambiguous or metadata is malformed.
- Move an event while preserving its stable AutomateOS identity and history.
- Update title, time, description, category, or metadata without creating an unintended duplicate.
- Repeat the same request without applying the mutation twice.
- Detect external edits and require review when a destructive request would overwrite materially changed state.
- Reconcile partial failures without falsely reporting completion.

### Exit

- Creation, update, movement, and deletion all use documented safety gates.
- All mutation outcomes are auditable from the operational ledger.
- Health checks can distinguish healthy, degraded, and failed Calendar lifecycle workflows.
- Production documentation and API examples match deployed behavior.

### Deferred

- Automatic displacement of fixed events.
- Broad multi-calendar optimization.
- AI-only conflict resolution without deterministic validation.

## Phase 2 — Task contract and flexible scheduling MVP

**Priority:** Next after Phase 1

### Objective

Represent flexible work precisely and place it into realistic free time without creating an autonomous scheduler that is difficult to audit or override.

### Entry

- Safe Calendar lifecycle operations are production.
- The `Tasks` source of truth and task-to-event linkage rules are agreed.
- Calendar placement, movement, and deletion can be retried idempotently.

### Build

- Expand the task contract to include:
  - stable task ID and lifecycle status;
  - estimated duration and uncertainty;
  - earliest start, scheduling window, and deadline;
  - hard versus soft constraints;
  - priority and urgency;
  - project, category, and context;
  - energy or attention requirements;
  - splitability and minimum block size;
  - dependencies and blocked state;
  - stackability and incompatible activities;
  - preferred time of day;
  - rescheduling policy and maximum deferrals;
  - source references and user overrides.
- Define task states such as captured, ready, scheduled, in progress, completed, deferred, blocked, cancelled, and superseded.
- Deterministic candidate-slot generation from free Calendar time and waking-hour rules.
- Capacity rules for sleep, commute, meals, clinical work, post-call recovery, and decompression.
- Scheduling decisions that explain why a slot was selected or rejected.
- Task-to-Calendar linkage and reconciliation.
- Explicit handling for missed, partially completed, and externally moved work blocks.

### Validation

- Place a flexible task within its permitted window before its deadline.
- Refuse placement when no safe feasible slot exists.
- Preserve fixed events and protected recovery time.
- Split only tasks that permit splitting and respect minimum block size.
- Replan after a conflict or missed block without duplicating the task.
- Preserve user changes and explicit overrides.
- Demonstrate compatible stacking only where the rules explicitly allow it.
- Produce the same result for equivalent deterministic inputs, apart from documented tie-breaking.

### Exit

- A user can capture a deadline-bounded flexible task conversationally and receive an auditable schedule proposal or placement.
- The scheduler can move or remove its own generated work blocks safely.
- Unscheduled and at-risk tasks are surfaced rather than silently dropped.
- Actual completion can be reconciled back to the originating task.

### Deferred

- Machine-learned duration estimates.
- Fully autonomous week-scale optimization across every life domain.
- Complex multi-user or team scheduling.

## Phase 3 — Gmail ingestion and structured capture

**Priority:** After the task and Calendar contracts can safely receive extracted work

### Objective

Turn forwarded email into traceable proposed events, tasks, deadlines, travel records, bills, and briefing items without allowing unverified extraction to mutate the schedule silently.

### Entry

- Task creation and Calendar lifecycle contracts are stable.
- Source references and idempotency keys can link an email to all derived records.
- Review and confidence rules are defined.

### Build

- Gmail polling or event-driven ingestion with durable message identity.
- Classification for event, schedule change, deadline, task, travel, bill, opportunity, informational item, and ignore.
- Structured extraction with original-message references and confidence.
- Duplicate and thread-aware processing.
- Read-only or proposal mode before automatic mutation.
- Rules for trusted senders, sensitive content, ambiguous dates, time zones, and conflicting instructions.
- Review queue surfaced through the primary interface.
- Safe promotion of approved proposals into task or Calendar workflows.
- Retention and redaction rules for raw email content in logs.

### Validation

- Process the same message or thread repeatedly without duplicate records.
- Extract explicit dates, times, locations, and deadlines accurately.
- Flag ambiguity rather than inventing missing facts.
- Preserve source links for every derived action.
- Distinguish a new obligation from an informational update or cancellation.
- Prevent low-confidence extraction from silently mutating Calendar or Tasks.

### Exit

- Important forwarded email can become a traceable proposal with minimal user effort.
- Approved proposals flow through the same safe task and Calendar interfaces as conversational requests.
- Ingestion failures and unprocessed-message backlogs appear in system health.

### Deferred

- Sending external email autonomously.
- Broad access to accounts containing protected health information.
- Fully autonomous actions from unknown or low-trust senders.

## Phase 4 — Daily briefing and system health

**Priority:** After the core sources can be read reliably

### Objective

Provide one concise daily operating view that combines schedule, priorities, deadlines, exceptions, and automation health without becoming another source of truth.

### Entry

- Calendar, task, actuals, and automation logs have stable read contracts.
- `Daily_Briefs` receives a defined schema and retention policy.
- Each production workflow exposes a practical health check.

### Build

- Brief-generation workflow with deterministic data gathering and AI-assisted summarization.
- Sections for today's schedule, priority work, deadlines, at-risk tasks, important email proposals, study targets, health context, and notable changes.
- System-health summary with healthy, degraded, and failed states.
- Delivery through the custom GPT and one low-friction passive surface.
- Refresh and invalidation rules for schedule or priority changes.
- Brief archival in `Daily_Briefs` without turning the brief into authoritative state.

### Validation

- Every displayed event or task traces to its authoritative source.
- Missing dependencies are reported explicitly rather than producing a falsely complete brief.
- The brief remains concise and suppresses low-value repetition.
- Updates do not create competing copies of tasks or events.
- Health failures identify the affected workflow and next useful action.

### Exit

- A reliable morning brief can be generated automatically and reproduced from source data.
- Degraded workflows are visible without requiring direct n8n inspection.
- Brief content remains a derived view and can be refreshed safely.

### Deferred

- Rich desktop dashboards with independent business logic.
- High-frequency real-time recomputation where four-to-six-hour reconciliation is sufficient.

## Phase 5 — Auditing, estimation, and adaptive scheduling

**Priority:** After enough comparable actuals exist

### Objective

Improve estimates and workload decisions from measured behavior while preserving explicit rules and avoiding overfitting to sparse personal data.

### Entry

- Planned tasks and generated Calendar blocks can be matched reliably to actuals.
- Duration, quantity, completion, deferral, context, and energy data are sufficiently complete.
- Historical records are immutable or change-audited.

### Build

- Daily and weekly execution audits.
- Estimated-versus-actual duration and quantity analysis.
- Completion and on-time rates by task category and context.
- Deferral, interruption, and repeated-overcommitment detection.
- Baseline estimates with sample counts and confidence intervals.
- Conservative learned recommendations with fallback to explicit defaults.
- Capacity adjustments informed by clinical workload, time of day, energy, and recovery.
- Explanation of which observations changed a recommendation.

### Validation

- Sparse or heterogeneous samples do not replace explicit estimates prematurely.
- Learned estimates remain bounded and reversible.
- User overrides take precedence.
- Historical records are not silently rewritten.
- Recommendations improve calibration on held-out or later observations before automatic use expands.

### Exit

- The system can recommend more realistic durations and daily capacity with visible confidence.
- Learning changes scheduling behavior only through documented, auditable parameters.
- Weekly audits produce actionable adjustments rather than decorative metrics.

### Deferred

- Opaque end-to-end reinforcement learning.
- Behavioral surveillance without a planning benefit.
- Automatic high-consequence decisions from low-confidence models.

## Phase 6 — Health and performance domains

**Priority:** Incremental after the core planning loop is reliable

### Objective

Integrate nutrition, workouts, sleep, energy, stress, and recovery as planning inputs without turning AutomateOS into a diagnostic medical system.

### Entry

- Conversational actuals and task scheduling are stable.
- Health data categories, retention, privacy, and source-of-truth rules are defined.
- Safety boundaries distinguish tracking and planning from diagnosis or treatment.

### Build

- Low-friction logging for workouts, nutrition, sleep, energy, stress, and recovery.
- Goals and plans clearly separated from measured facts and model suggestions.
- Health-context summaries for capacity planning.
- Workout and meal scheduling through the same safe task and Calendar interfaces.
- Trend reporting that minimizes manual data burden.

### Validation

- Recorded facts are not confused with estimates or advice.
- Missing data does not produce confident health conclusions.
- Health context can adjust workload recommendations conservatively.
- Sensitive data is appropriately restricted and redacted from engineering logs.

### Exit

- Health behaviors can be logged and used as transparent planning context.
- The module remains non-diagnostic and does not bypass user authority.

### Deferred

- Clinical diagnosis, medication management, or emergency decision-making.
- Unnecessary collection of sensitive data that does not improve planning.

## Phase 7 — Ambient surfaces and platform hardening

**Priority:** After core workflows provide stable read and mutation APIs

### Objective

Expose the same AutomateOS state through Mac mini and mobile surfaces while improving reliability, security, reproducibility, and data-platform scalability.

### Entry

- Core services have versioned contracts and reliable health endpoints.
- The briefing and task/calendar APIs can support read-only clients.
- Authentication and authorization boundaries are documented.

### Build

- Passive Mac mini dashboard for brief, current priorities, upcoming events, alerts, and health.
- Mobile capture, review, completion, and notification interface.
- Clients remain thin and do not own independent scheduling logic.
- Secure service authentication, least-privilege credentials, and secret rotation.
- Versioned n8n exports, deployment notes, fixtures, and automated contract tests.
- Backup, restore, disaster-recovery, and reconciliation procedures.
- Observability for latency, error rate, stale data, and workflow backlog.
- Formal criteria and migration plan for moving operational state from Sheets to a relational database when necessary.

### Validation

- Multiple surfaces show consistent state after refresh and reconnection.
- Offline or stale clients cannot silently overwrite newer authoritative state.
- A failed surface does not impair core workflow execution.
- Backup and recovery exercises restore identifiers and audit history.
- Contract changes preserve compatibility or provide an explicit migration path.

### Exit

- AutomateOS can be used conversationally and passively without manual reconciliation between interfaces.
- Runtime configuration is reproducible and operational failures are diagnosable.
- Data-platform migration can occur behind stable interfaces when justified.

### Deferred

- Independent client databases that become new sources of truth.
- Premature microservices or infrastructure that does not reduce user burden.

## Cross-phase release requirements

A workflow or service is not production merely because its happy path works. Each production promotion requires:

- documented purpose, inputs, outputs, dependencies, and source-of-truth effects;
- versioned request and response contracts;
- input validation and conservative unknown-state behavior;
- stable identifiers and idempotency where mutations occur;
- success, blocked, duplicate, degraded, and failure tests as applicable;
- operational and audit logging;
- practical health checks;
- recovery behavior for partial external-system failures;
- credentials and personal data excluded from version control;
- `PROJECT_STATE.md`, `CHANGELOG.md`, and relevant Notion views updated;
- a GitHub issue or pull request linking implementation, tests, documentation, and rollout evidence.

## Roadmap change control

This roadmap is expected to evolve. Reordering a phase is acceptable when new evidence changes dependencies or risk, but the reason must be recorded.

- Minor sequencing or wording changes may update this document and the changelog.
- A change to a durable architecture decision should create or supersede an ADR.
- A change to source-of-truth ownership must update the Constitution, architecture documents, API contracts, project state, and relevant ADRs.
- A phase should not be marked complete until its exit criteria are demonstrated in production or an explicitly documented production-like environment.
- Planned work must remain labeled planned until implementation and validation are complete.