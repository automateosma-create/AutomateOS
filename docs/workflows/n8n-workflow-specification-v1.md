# AutomateOS n8n Workflow Specification v1

## Purpose

The **n8n Workflow Specification v1** (`NWS-1`) is the standard representation for every AutomateOS n8n workflow. It is designed to be compact enough to review quickly while preserving enough information to understand, reproduce, test, audit, and safely modify the workflow.

A workflow is represented as a **workflow pack**, not a long narrative document.

```text
docs/workflows/<workflow-slug>/
├── spec.md                 # compact human-readable workflow card
├── manifest.yaml           # machine-readable summary
├── workflow.n8n.json       # sanitized exact n8n export
├── code/                   # exact Code-node source, one file per node
└── fixtures/               # sanitized test inputs and expected outputs
```

The `spec.md` file is the entry point. The export and Code-node files provide implementation fidelity without making the human-readable specification unwieldy.

## Required completeness states

Every workflow pack declares each artifact as:

- `complete` — captured and verified against the active workflow;
- `partial` — some required detail is captured, but known gaps remain;
- `missing` — required artifact has not been captured;
- `not_applicable` — the workflow genuinely does not use the artifact.

A workflow may be documented while an artifact is incomplete, but it must not be described as fully reproducible until the sanitized export, exact Code-node source, and required fixtures are complete.

## File responsibilities

### `spec.md`

The shortest complete human-readable description of the workflow. It contains:

1. identity and maturity;
2. one-line architecture;
3. inputs and outputs;
4. node map;
5. branch matrix;
6. mutations and sources of truth;
7. error, retry, and idempotency behavior;
8. exact implementation-artifact links;
9. tests and health checks;
10. known limitations and next change.

### `manifest.yaml`

A machine-readable index for automation, linting, dashboards, and future documentation generation. It records identity, status, artifact completeness, triggers, systems read and written, credentials by logical name, code nodes, branches, side effects, and validation state.

### `workflow.n8n.json`

A sanitized export of the active n8n workflow. It must preserve node names, node types, parameters, connections, expressions, settings, and workflow metadata required for reconstruction.

It must remove or redact:

- credentials and credential IDs when disclosure is unsafe;
- webhook production secrets;
- tokens, cookies, private certificates, and API keys;
- protected health information and unnecessary personal data;
- unredacted production examples.

Redaction must be explicit. Do not replace secrets with plausible-looking fake values.

### `code/`

Every n8n Code node is stored as an exact source file named with a stable node slug, for example:

```text
code/prepare-proposed-event.js
code/decide-calendar-placement.js
```

The spec records the n8n node name, language, run mode, file path, and SHA-256 hash. Exact source belongs in these files rather than in the compact main specification unless the code is fewer than approximately 20 lines.

### `fixtures/`

Fixtures contain sanitized request and expected-response pairs for the workflow's meaningful paths. At minimum, include:

- normal success;
- validation failure;
- duplicate or idempotent replay when relevant;
- blocked or negative branch;
- degraded dependency or partial-failure behavior;
- each mutation-producing branch.

## Canonical compact structure

Each `spec.md` uses the following fixed order.

### 1. Header

```yaml
---
spec: NWS-1
workflow_id: wf_<stable_slug>
n8n_name: Exact active n8n workflow name
version: 1.0.0
status: production | planned | exploratory | deprecated | retired
risk: low | medium | high | critical
owner: AutomateOS
last_verified: YYYY-MM-DD
---
```

### 2. Workflow card

A compact table containing:

- purpose;
- trigger;
- terminal outcomes;
- systems read;
- systems written;
- source of truth;
- side effects;
- idempotency key or rule;
- authentication or credential aliases;
- artifact completeness.

### 3. Architecture

Provide both:

- a one-line path such as `Webhook → Normalize → Read Calendar → Decide → [Create → Audit | No-write response]`;
- a Mermaid flowchart when the workflow has more than one branch or more than six nodes.

The diagram shows control flow only. Detailed field transformations remain in the node and contract tables.

### 4. Contract

Use compact input and output tables.

Input fields:

| Field | Type | Req | Default | Meaning / validation |
|---|---|---:|---|---|

Output fields:

| Field | Type | Always | Meaning |
|---|---|---:|---|

Link to the canonical API contract when one exists instead of duplicating large schemas. Include only fields needed to understand routing, mutation, identity, and safety.

### 5. Node map

| ID | Exact n8n node name | Type | Reads | Produces / side effect | Next |
|---|---|---|---|---|---|

Rules:

- IDs are stable short identifiers such as `N01`, `N02`, and `N03`.
- Exact n8n names are preserved.
- Every node appears once.
- Configuration-only nodes may be grouped only when they are identical and have no branching or mutation role.
- Code nodes link to exact source files.

### 6. Branch matrix

| Branch | Condition | Nodes executed | Output | Mutation |
|---|---|---|---|---|

Every IF, Switch, error branch, early return, and meaningful Code-node decision appears here. Conditions must be written deterministically, not as vague prose.

### 7. Data and side effects

Record:

- data stores and external services read;
- data stores and external services written;
- source-of-truth ownership;
- stable identifiers;
- audit records;
- mutation order;
- partial-failure and compensation behavior.

### 8. Code map

| Node | File | Mode | Hash | Purpose |
|---|---|---|---|---|

Do not paraphrase implementation logic here. The branch matrix describes behavior; the linked source file preserves exact code.

### 9. Reliability

Use one compact matrix:

| Concern | Rule |
|---|---|
| Validation | ... |
| Idempotency | ... |
| Retry | ... |
| Timeout | ... |
| Partial failure | ... |
| Audit | ... |
| Recovery | ... |

Unknown behavior is recorded as `not documented` and creates a documentation or implementation follow-up. It is never silently assumed.

### 10. Validation and health

| Test ID | Scenario | Expected terminal outcome | Required side effect |
|---|---|---|---|

The workflow is production-ready only when the applicable terminal branches have fixtures or recorded validation evidence and a practical health check exists.

### 11. Operations

Keep this section short:

- activation state;
- trigger path or schedule, with secrets redacted;
- credential aliases;
- dependency health requirements;
- deployment or import notes;
- known limitations;
- next planned change.

## `manifest.yaml` minimum fields

```yaml
spec: NWS-1
workflow_id: wf_example
n8n_name: AutomateOS - Example
version: 1.0.0
status: production
risk: high
owner: AutomateOS
last_verified: 2026-07-22
trigger:
  type: webhook
  path: redacted
artifacts:
  spec: complete
  manifest: complete
  workflow_export: complete
  code: complete
  fixtures: partial
systems:
  reads: [google_calendar]
  writes: [google_calendar, generated_calendar_events]
source_of_truth:
  primary: generated_calendar_events
credentials:
  - alias: google_calendar_primary
    system: google_calendar
nodes:
  - id: N01
    name: Prepare Input
    type: code
branches:
  - id: B01
    condition: should_create == true
    outcome: created
side_effects:
  - google_calendar.create_event
  - google_sheets.append_generated_event
health_check:
  status: implemented
  reference: fixtures/health-open-slot.json
```

The full schema is stored at `docs/workflows/schemas/nws-1-manifest.schema.json`.

## Versioning

Workflow versions use semantic versioning:

- patch — internal correction that preserves contract and terminal behavior;
- minor — additive input, output, branch, node, or side effect that remains backward compatible;
- major — breaking contract, source-of-truth, mutation, branch, or safety behavior change.

The active n8n workflow name remains human-readable. Stable identity is provided by `workflow_id`, not by the display name.

## Change rules

A material workflow change is incomplete until the workflow pack is synchronized.

Update at least:

- `workflow.n8n.json` after any active graph or parameter change;
- relevant `code/*.js` after any Code-node change;
- `spec.md` after contract, branch, mutation, reliability, or operational changes;
- `manifest.yaml` after identity, status, system, node, branch, artifact, or validation changes;
- fixtures after terminal behavior changes;
- `PROJECT_STATE.md`, `CHANGELOG.md`, roadmap, API contracts, ADRs, and Notion when required by the documentation-maintenance policy.

## Review rules

A reviewer should be able to answer within five minutes:

1. What triggers this workflow?
2. What does it read and mutate?
3. What are every terminal branch and side effect?
4. Where is the exact code and active sanitized graph?
5. How are duplicates, retries, partial failure, and audit handled?
6. Which tests prove each important path?
7. What is missing or stale?

If the workflow pack cannot answer these questions, it is incomplete.
