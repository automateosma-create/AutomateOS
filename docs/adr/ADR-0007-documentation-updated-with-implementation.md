# ADR-0007: Update Engineering Documentation with Implementation Changes

## Status

Accepted

## Date

2026-07-22

## Context

AutomateOS combines AI interpretation, n8n workflows, Google services, schemas, metadata, and safety rules. A small undocumented implementation change can invalidate API examples, workflow assumptions, health checks, or future automation decisions. Documentation created long after implementation is likely to omit the reasoning and exact behavior that were clear when the change was made.

Future work will frequently be performed or assisted by AI systems. Those systems require current, explicit documentation and cannot safely infer production behavior from old conversations or names alone. New engineers also need a reliable route from architecture to workflow details and current contracts.

## Decision

Update canonical GitHub engineering documentation as part of the same implementation change or in an immediately following documentation commit before the work is considered complete.

The required documentation is proportional to the change. It may include workflow purpose, inputs, outputs, source-of-truth rules, failure behavior, tests, API contracts, schema changes, ADRs, and operational health checks. Broad ideas that are not implemented should remain concise and clearly labeled planned or exploratory.

Notion mirrors should be synchronized after GitHub. Documentation automation may assist with drafting, link updates, and drift detection, but generated changes must be grounded in the implemented behavior.

## Consequences

- Documentation drift is reduced because decisions are captured while context is fresh.
- Future AI assistants have a durable and current basis for maintenance.
- New engineers can understand both what exists and why it exists.
- Implementation work includes a documentation cost.
- Small changes require judgment about the proportional level of detail.
- Automated documentation checks become valuable as the repository grows.

## Alternatives Considered

- **Periodic documentation projects:** efficient in batches but allows long periods of dangerous drift.
- **Code and workflow exports only:** captures implementation but not intent, source-of-truth rules, or operational reasoning.
- **Notion-only documentation:** readable but weaker for implementation-linked version history and canonical diffs.
- **Document every speculative feature in detail:** rejected because it creates maintenance burden and false certainty.

## Future Revisions

The repository may add templates, documentation tests, link validation, changelog generation, or CI checks that require documentation updates for selected file changes. Automation should enforce freshness without creating unnecessary boilerplate.