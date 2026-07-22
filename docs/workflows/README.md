# AutomateOS n8n Workflows

Every AutomateOS n8n workflow is represented using the compact [n8n Workflow Specification v1](n8n-workflow-specification-v1.md) (`NWS-1`).

A workflow pack separates the concise human-readable model from exact implementation artifacts:

```text
<workflow-slug>/
├── spec.md
├── manifest.yaml
├── workflow.n8n.json
├── code/
└── fixtures/
```

## Workflow registry

| Workflow | Status | Risk | Spec | Manifest | Export | Code | Fixtures |
|---|---|---:|---:|---:|---:|---:|---:|
| [Place Calendar Event Safely](place-calendar-event-safely/spec.md) | Production | Critical | Complete | Complete | Missing | Complete | Partial |
| [Log Actuals](log-actuals/spec.md) | Production | High | Complete | Complete | Missing | Missing | Missing |

Artifact gaps are explicit. A workflow is not considered fully reproducible until the sanitized active n8n export, exact Code-node source, and required fixtures are captured.

## Standard resources

- [NWS-1 standard](n8n-workflow-specification-v1.md)
- [Workflow-pack template](templates/nws-1-workflow-pack-template.md)
- [Manifest JSON Schema](schemas/nws-1-manifest.schema.json)

## Required workflow-pack rules

- The `spec.md` is the five-minute human review surface.
- The `manifest.yaml` is the automation and linting surface.
- `workflow.n8n.json` preserves the exact sanitized graph and parameters.
- `code/` preserves exact Code-node source separately for review and diffing.
- `fixtures/` proves terminal branches and health behavior.
- Unknown or missing details are labeled, not inferred.
- Production status requires runtime evidence; documentation status alone is insufficient.
- Material workflow changes update the pack in the same implementation change.

## Adding a workflow

1. Copy the template into `docs/workflows/<workflow-slug>/spec.md`.
2. Create and validate `manifest.yaml` against the NWS-1 schema.
3. Export the active workflow from n8n and sanitize it as `workflow.n8n.json`.
4. Extract each Code node to `code/<node-slug>.js` without modifying source.
5. Add fixtures for each meaningful terminal branch.
6. Add the workflow to this registry.
7. Update API contracts, project state, changelog, roadmap, ADRs, and Notion when applicable.
