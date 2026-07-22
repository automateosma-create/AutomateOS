# ADR-0002: Use Google Calendar as the Scheduling Backend

## Status

Accepted

## Date

2026-07-22

## Context

AutomateOS needs a dependable place to represent time: clinical assignments, call, study blocks, travel, workouts, meetings, personal commitments, deadlines, and eventually flexible work placed by automation. Building a custom calendar database and complete scheduling client would duplicate mature functionality and require AutomateOS to own synchronization, recurrence, timezone handling, notifications, mobile access, and interoperability from the beginning.

AutomateOS also needs more audit information than Calendar alone provides. Calendar is therefore the user-facing schedule and external time backend, while structured tasks and automation records remain in their documented operational sources. `Generated_Calendar_Events` is the authoritative audit log for events created by n8n.

## Decision

Use Google Calendar as the canonical user-facing scheduling backend for time-bound events. AutomateOS will read and write Calendar through controlled n8n workflows rather than implement a custom calendar service during early development.

The decision is based on:

- **Interoperability:** Calendar is already available across web, desktop, mobile, email invitations, and other applications.
- **Reliability:** Google operates the synchronization, recurrence, timezone, availability, and notification infrastructure.
- **API support:** Calendar exposes mature APIs for reading, creating, updating, and deleting events.
- **Auditability:** Google event IDs, AutomateOS metadata, and the `Generated_Calendar_Events` log allow actions to be reconciled and explained.

Calendar is not the sole operational database. Tasks, rules, assignments, actuals, and automation logs retain their own sources of truth.

## Consequences

- Users receive a familiar schedule without a new calendar application.
- AutomateOS can interoperate with manually created events and external invitations.
- Calendar availability and API limits become external dependencies.
- Calendar writes must pass through safe, idempotent, auditable workflows.
- Reconciliation must account for manual edits and events lacking AutomateOS metadata.

## Alternatives Considered

- **Custom calendar and scheduler:** offers complete control but creates substantial product, synchronization, and reliability burden.
- **Google Sheets as the schedule:** visible and simple, but poor for daily calendar interaction, invitations, recurrence, and notifications.
- **A separate task-management calendar:** creates another interface and source-of-truth boundary for the user to maintain.

## Future Revisions

A custom scheduling service may later compute flexible placements or maintain richer scheduling state. Even then, Google Calendar may remain the presentation and interoperability layer. Any replacement must preserve stable identifiers, audit history, and compatibility with existing Calendar events.