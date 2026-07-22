# ADR-0006: Identify AutomateOS Calendar Events with Structured Metadata

## Status

Accepted

## Date

2026-07-22

## Context

Calendar titles are written for people and may be duplicated, renamed, shortened, localized, or shared by unrelated activities. Titles such as `UWorld`, `Travel`, or `Meeting` do not contain enough information to determine which workflow created an event, whether it is movable, which categories may overlap, or whether a repeated request is a duplicate.

AutomateOS must support safe conflict detection, idempotency, auditing, deletion, movement, and future automatic rescheduling. These operations require stable identities and machine-readable attributes while preserving natural titles in the Calendar interface.

## Decision

Every Calendar event created by AutomateOS must contain structured metadata in its description and must be recorded in `Generated_Calendar_Events`.

The current metadata marker is `AUTOMATEOS_METADATA_JSON`. The metadata includes or is expected to include:

- metadata version;
- `generated_event_uid`;
- source assignment or task identifier;
- category;
- movability;
- Eisenhower classification and priority;
- stackability and overlap rules;
- attention and location requirements;
- review requirements.

The persistent AutomateOS identity is `generated_event_uid`. The external Calendar identity is `google_event_id`. Titles remain natural and are never treated as unique identifiers.

Metadata and logged IDs are used for duplicate detection, conflict classification, auditing, and future move, delete, and rescheduling workflows. Missing or malformed metadata must reduce confidence and cause conservative behavior.

## Consequences

- Events can be traced to their originating workflow or assignment.
- Equivalent requests can be recognized without relying on title text.
- Safe automatic rescheduling can reason about movability and compatibility.
- Human-readable Calendar titles remain uncluttered.
- Manual edits to descriptions may damage metadata and must be detected.
- Metadata schemas require versioning and backward-compatible readers.
- Calendar metadata does not replace the authoritative generated-events audit log.

## Alternatives Considered

- **Encode AutomateOS information in titles:** visible but intrusive, brittle, and inadequate for structured rules.
- **Store metadata only in Sheets:** preserves the audit record but makes reconciliation harder when a Calendar event is encountered independently.
- **Rely only on Google event IDs:** identifies the external object but does not encode AutomateOS semantics or source relationships.

## Future Revisions

Metadata may later move to extended properties or another supported Calendar mechanism. Any migration must retain human-readable titles, stable identities, backward-compatible parsing, and reconciliation with `Generated_Calendar_Events`.