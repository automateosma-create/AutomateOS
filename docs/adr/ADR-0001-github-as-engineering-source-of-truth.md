# ADR-0001: Use GitHub as the Engineering Source of Truth

## Status

Accepted

## Date

2026-07-22

## Context

AutomateOS uses several systems for different purposes. GitHub contains code and engineering documentation, while Notion is intended for roadmap, planning, decision tracking, and readable project views. Without a clear authority, the same architecture description could diverge across GitHub, Notion, conversational history, and implementation notes.

Engineering changes need version history, reviewable diffs, stable file paths, links to implementation changes, and a record that future engineers or AI assistants can inspect without relying on prior conversations. Notion remains useful for navigation and readability, but it is easier for mirrored pages to drift from executable artifacts.

## Decision

GitHub is the canonical source of truth for AutomateOS code, API contracts, workflow documentation, architecture documents, ADRs, schemas recorded for engineering use, and implementation history.

Notion may mirror this material for readability, roadmap context, and project management. When GitHub and Notion disagree about an engineering detail, GitHub governs. A material implementation change is not fully documented until the corresponding GitHub documentation is updated. Notion should then be synchronized without creating a competing specification.

## Consequences

- Engineering decisions are versioned, diffable, attributable, and recoverable.
- Documentation can be linked directly to commits, issues, and future pull requests.
- Future AI assistants can ground work in a stable repository rather than conversational memory.
- Notion remains a useful human-readable surface but must be maintained as a mirror.
- Documentation changes may require an additional synchronization step after the GitHub update.

## Alternatives Considered

- **Notion as the sole source of truth:** easier for casual reading, but weaker for code-adjacent versioning, diffs, and reproducible engineering history.
- **Both systems as co-equal authorities:** rejected because conflicts would require manual reconciliation.
- **Conversation history as authority:** rejected because conversations are incomplete, difficult to audit, and not suitable for durable engineering state.

## Future Revisions

This decision may be revised if AutomateOS adopts a documentation platform that provides repository-grade versioning and automated bidirectional synchronization. Until then, Notion remains subordinate to GitHub for engineering truth.