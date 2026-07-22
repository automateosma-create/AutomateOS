# AutomateOS Documentation Maintenance Rules

## Purpose

This document defines how AutomateOS documentation must be maintained after the Version 0.1 baseline. It converts ADR-0007, which requires documentation to change with implementation, into an operational policy that can be applied by engineers and AI assistants.

Documentation is part of the product. A change is not complete when the runtime behavior changes; it is complete when the implemented behavior, contracts, tests, current-state records, history, and readable mirrors agree.

## Scope

These rules apply to:

- production and planned n8n workflows;
- custom GPT behavior and connected actions;
- Google Calendar, Gmail, Sheets, Drive, and future service integrations;
- operational schemas, identifiers, metadata, and source-of-truth ownership;
- API contracts, examples, compatibility rules, retries, and errors;
- architecture documents and Architecture Decision Records;
- project state, roadmap, changelog, and repository navigation;
- Notion mirrors and product-planning pages;
- sanitized workflow exports, fixtures, health checks, and operating procedures added later.

## Governing principles

1. **GitHub is canonical for engineering truth.** Contracts, architecture, workflow behavior, implementation history, production status, and roadmap gates are maintained in GitHub.
2. **Operational systems are canonical for live operational state.** Calendar, Sheets, Gmail, n8n execution data, and audit logs determine what actually occurred.
3. **Notion is a synchronized product and planning layer.** It improves readability and navigation but does not override GitHub or live operational records.
4. **Documentation changes with implementation.** Required documentation is updated in the same implementation change or in an immediately following documentation commit before the work is considered complete.
5. **Detail is proportional to maturity and risk.** Production behavior and safety-critical decisions require precise documentation. Speculative work remains concise and labeled planned or exploratory.
6. **History is preserved.** Durable decisions, previous contracts, and superseded behavior are not silently rewritten out of existence.
7. **Claims require evidence.** Documentation must not describe a capability as production without implementation and validation evidence.
8. **Security and privacy take precedence over completeness.** Secrets, credentials, protected health information, and unnecessary sensitive personal data do not belong in GitHub, examples, fixtures, or diagnostic logs.

## Canonical documentation map

### Repository entry points

- `README.md` — project orientation and navigation.
- `PROJECT_STATE.md` — current production status, architecture boundaries, limitations, and immediate handoff state.
- `CHANGELOG.md` — notable engineering and documentation history.
- `docs/roadmap/phased-implementation-roadmap.md` — canonical implementation phases, dependencies, validation gates, exit criteria, and deferred scope.

### Architecture and interfaces

- `docs/architecture/constitution.md` — governing product principles.
- `docs/architecture/system-overview.md` — high-level product and system model.
- `docs/architecture/current-architecture-and-data-flow.md` — current implementation and data paths.
- `docs/architecture/api-contracts.md` — component interfaces, payloads, compatibility, error, retry, idempotency, and metadata rules.
- `docs/architecture/google-sheets-database.md` — operational schemas and source-of-truth rules.
- `docs/architecture/notion-product-planning-mirror.md` — Notion hierarchy, ownership, and synchronization rules.

### Decisions and workflows

- `docs/adr/` — durable architectural decisions and their history.
- `docs/workflows/` — implemented workflow purpose, inputs, behavior, outputs, dependencies, failure modes, logging, health checks, and validation.
- Future sanitized runtime exports, fixtures, and deployment notes should be linked from the corresponding workflow document rather than becoming undocumented standalone artifacts.

## Maturity vocabulary

Every material capability must use one of these labels consistently:

- **Production** — implemented, validated, operationally observable, and documented.
- **Planned** — agreed direction or contract that is not yet implemented and validated.
- **Exploratory** — an idea under consideration that may change and is not an implementation commitment.
- **Deprecated** — still present temporarily but no longer preferred for new use.
- **Retired** — intentionally removed from active use, with migration or historical context preserved where needed.

A capability must not move from planned or exploratory to production solely because a Notion status, issue checkbox, or document was changed. Production status requires runtime evidence and completion of the relevant roadmap or workflow exit criteria.

## Change classification

Use the smallest documentation change that fully preserves correctness.

### Editorial change

Examples include spelling, formatting, broken links, or wording that does not alter meaning.

Required actions:

- update the affected document;
- verify that meaning, status, and source-of-truth ownership are unchanged;
- do not add changelog or ADR entries unless the correction reveals a material prior error.

### Local implementation change

Examples include a new optional field, a localized validation rule, a renamed internal node, or a non-breaking workflow improvement.

Required actions may include:

- update the affected workflow or architecture document;
- update examples, fixtures, and tests that encode the behavior;
- update the API contract when an external or cross-component interface changes;
- add a changelog entry when the change is operationally notable.

### Material production change

Examples include a new production workflow, changed mutation behavior, new failure semantics, source-of-truth changes, destructive operations, or changes that affect user-visible outcomes.

Required actions:

- update or create the workflow document;
- update contracts and examples;
- update tests and health checks;
- update `PROJECT_STATE.md`;
- update `CHANGELOG.md`;
- update the roadmap when phase scope, sequence, or exit evidence changes;
- synchronize relevant Notion mirrors;
- create or update an ADR when the change alters a durable architectural decision.

### Architecture change

Examples include replacing Google Sheets, changing the scheduling backend, moving business logic between ChatGPT and n8n, or introducing a new source of truth.

Required actions:

- create a new ADR or supersede an existing ADR;
- update architecture and data-flow documentation;
- update API contracts and migration rules;
- update `PROJECT_STATE.md`, `CHANGELOG.md`, and the roadmap;
- synchronize Notion after GitHub;
- preserve the prior decision and explain the transition.

### Emergency operational change

A safety, availability, or data-integrity fix may be deployed before documentation is complete when delay would create greater risk.

Required actions:

- record the emergency change in a GitHub issue as soon as practical;
- document temporary behavior and known uncertainty;
- complete the normal documentation, tests, and changelog updates immediately afterward;
- do not close the incident or implementation issue until documentation is synchronized;
- create an ADR if the emergency change becomes a durable architectural direction.

## Required updates by change type

### Workflow behavior

When workflow inputs, validation, decisions, outputs, mutations, logging, retry behavior, or failure handling change:

- update the corresponding document in `docs/workflows/`;
- update API contracts for any cross-component change;
- update sample payloads and expected responses;
- update behavior tests, fixtures, and health checks;
- document partial-failure and recovery behavior;
- update project state if production capability or limitations changed;
- update the changelog when the change is notable.

### API or webhook contract

When a request, response, error, authentication assumption, metadata field, or compatibility rule changes:

- update `docs/architecture/api-contracts.md`;
- identify whether the change is additive, deprecating, or breaking;
- preserve old-version behavior or provide a migration path;
- update all known producers and consumers;
- update examples and validation tests;
- record breaking or operationally meaningful changes in the changelog.

### Schema or source-of-truth change

When a Sheet tab, column, identifier, relationship, ownership boundary, or storage system changes:

- update the database schema documentation before or with deployment;
- document migration, backfill, validation, and rollback behavior;
- update contracts and workflow documents that read or write the data;
- update source-of-truth maps in architecture and project-state records;
- create or supersede an ADR for durable ownership or datastore changes;
- update Notion navigation after GitHub.

Automation must not rename, reorder, remove, or reinterpret operational fields without corresponding documentation and migration handling.

### Calendar metadata or reconciliation change

When Calendar identity, metadata, duplicate detection, stackability, or reconciliation changes:

- update Calendar workflow documentation and API contracts;
- preserve stable identifiers and audit history;
- update metadata examples and parser compatibility rules;
- validate existing events and ledger records where applicable;
- continue reconciliation from `Generated_Calendar_Events`, not title-only Calendar search, unless a new accepted ADR changes this rule.

### Product vision or governing principle

When the mission, priority order, human-authority rule, or product interaction model changes:

- update the Constitution or System Overview first;
- create or supersede an ADR if architecture is affected;
- update the Notion Product Vision mirror afterward;
- record material changes in the changelog.

### Roadmap or production status

When implementation order, phase scope, dependencies, validation gates, or production status changes:

- update the canonical roadmap;
- update `PROJECT_STATE.md` when current or next-phase state changes;
- update the changelog;
- synchronize the Notion roadmap and current-state views;
- preserve the distinction between completion of documentation and completion of runtime implementation.

### Incident, bug, or operational discovery

When runtime behavior conflicts with documentation:

- treat live operational evidence and logs as evidence of what occurred, not as permission to leave documentation stale;
- open or update a GitHub issue describing the discrepancy;
- correct the implementation, documentation, or both;
- add a regression test or health check when practical;
- update the changelog for material incidents or behavior corrections;
- add or revise an ADR when the discrepancy reveals an architectural decision.

## Documentation completion gate

An implementation issue or pull request is not complete until all applicable items below are satisfied:

- implemented behavior is identified clearly;
- maturity status is correct;
- canonical workflow or architecture documentation is updated;
- request, response, schema, metadata, and error examples match implementation;
- tests or validation evidence cover success and relevant blocked, duplicate, degraded, and failure paths;
- health-check behavior is documented for production workflows;
- source-of-truth ownership is unchanged or explicitly updated;
- idempotency, retry, audit, and recovery implications are addressed;
- `PROJECT_STATE.md` is updated when current production state or limitations changed;
- `CHANGELOG.md` records notable changes;
- roadmap status or phase evidence is updated when applicable;
- ADRs are created or superseded for durable decisions;
- Notion mirrors are synchronized after GitHub;
- no secrets or sensitive data were introduced;
- links and referenced filenames resolve;
- the closing issue or pull request links implementation, validation, and documentation evidence.

If an item does not apply, it may be omitted without adding boilerplate. The implementer should be able to explain why the remaining documentation is sufficient for safe operation and future maintenance.

## ADR maintenance

- New durable decisions receive the next sequential ADR number.
- Do not rewrite an accepted decision to make history appear cleaner.
- A replaced decision is marked `Superseded` and links to its replacement.
- Material clarifications may update links, consequences, or future-revision conditions without erasing original context.
- Architecture documents describe the current design; ADRs preserve why the design changed over time.

## Contract and example maintenance

- Examples must be realistic but sanitized.
- Numeric zero, empty values, timestamps, identifiers, and optional-field behavior must not be simplified in ways that change semantics.
- Breaking changes require a new major contract version or an explicitly documented compatibility transition.
- Additive changes must remain compatible with producers and consumers that ignore unknown optional fields.
- Deprecated fields remain documented through the supported transition period.
- Examples that are not verified against current behavior must be labeled illustrative rather than production-validated.

## Project-state and changelog maintenance

Update `PROJECT_STATE.md` whenever any of the following changes materially:

- production workflow inventory;
- source-of-truth ownership;
- major component status;
- accepted architecture;
- roadmap phase or immediate engineering sequence;
- material operational limitations;
- security, privacy, recovery, or observability posture.

Update `CHANGELOG.md` for notable additions, changes, deprecations, removals, fixes, security changes, migrations, and baseline or release milestones.

Do not use the changelog as a replacement for workflow documentation, migration instructions, or ADR reasoning.

## Notion synchronization

- GitHub changes first for engineering facts, contracts, architecture, production status, and roadmap gates.
- Notion is updated in the same documentation workflow or immediately afterward.
- Each detailed Notion mirror identifies its canonical GitHub source.
- Existing mirrors are linked rather than duplicated unnecessarily.
- If synchronization is incomplete, the Notion page must state that it may be stale.
- Notion status changes cannot promote a capability to production without matching GitHub and runtime evidence.
- Product planning may originate in Notion, but accepted engineering decisions and implementation commitments are recorded canonically in GitHub.

## Drift review triggers

A focused documentation review is required:

- before promoting a workflow to production;
- at the exit of each roadmap phase;
- after a material production incident or recovery exercise;
- when a source of truth, contract version, datastore, or authentication boundary changes;
- before a baseline, release, or major migration is declared complete;
- when an engineer or AI assistant discovers contradictory documentation.

The review should compare documentation with deployed workflow behavior, current schemas, operational logs, tests, and accepted ADRs. Review frequency should follow meaningful change and risk rather than create a calendar-driven documentation ritual with no operational value.

## Security and privacy

Never commit:

- passwords, API keys, OAuth tokens, webhook secrets, session cookies, or private certificates;
- protected health information;
- unredacted private email content;
- personal addresses, financial account numbers, or unnecessary sensitive identifiers;
- raw workflow exports containing credentials or personal data.

Use synthetic or redacted examples. Sanitized workflow exports must be reviewed before publication. Security-relevant omissions should be described as intentionally redacted rather than replaced with plausible but false values.

## Responsibility

The person or AI assistant implementing a change is responsible for identifying and completing the required documentation updates. Reviewers verify that documentation matches evidence and that the change has not created a competing source of truth.

AI-assisted documentation must inspect current repository records and implemented behavior before editing. It must not infer production behavior from old conversations, filenames, Notion summaries, or intended designs alone.

## Policy maintenance

This policy is itself maintained under the same rules.

- Editorial clarifications may update this document directly.
- Material changes to documentation ownership or the same-change requirement should create or supersede an ADR.
- Updates that change required release or production gates must be recorded in the changelog and synchronized to Notion.
- Requirements should be removed when they no longer improve safety, maintainability, or user convenience; complexity is not a goal.

## Version 0.1 baseline transition

The completion of the 18-step Version 0.1 documentation baseline establishes the initial durable record of AutomateOS. It does not mean the full product is implemented. Future engineering proceeds through the phased implementation roadmap, and every material change is governed by this maintenance policy.