# Calendar Event Placement Safety

## Purpose

`Place Calendar Event Safely` is the single write gate for AutomateOS-created Google Calendar events. It decides whether a proposed event may be created, stacked with an existing event, rejected as a duplicate, or returned for rescheduling. Calendar writes must not bypass this workflow.

## Source of truth

Before interpreting calendar activity, inspect `Generated_Calendar_Events` in the AutomateOS Database. It records titles, Google event IDs, creation decisions, and audit data for events created by n8n. Calendar titles are human-readable and are not expected to contain “AutomateOS.”

## Required event metadata

AutomateOS metadata is serialized into the Google Calendar event description as `AUTOMATEOS_METADATA_JSON`. The Google Calendar Create Event node must use:

```text
Description = {{ $json.calendar_description }}
```

Using `{{ $json.description }}` drops the generated metadata and breaks reliable duplicate, movability, category, and stackability checks.

## Decision flow

1. Normalize the proposed event and its AutomateOS metadata.
2. Read relevant existing calendar events for the proposed window.
3. Parse `AUTOMATEOS_METADATA_JSON` from existing event descriptions when present.
4. Check for an exact or equivalent prior event.
5. Classify overlaps by category, movability, and stackability.
6. Return a placement decision and audit result.
7. Create the event only when the returned decision permits it.
8. Record the result in `Generated_Calendar_Events`.

## Decisions

- `create`: the requested window is safe and the event may be created.
- `create_stacked`: the overlap is intentionally compatible and the event may share the window.
- `needs_reschedule_new_event`: an existing event should remain; the proposed event must be moved.
- `duplicate`: an equivalent event already exists; do not create another copy.
- `blocked`: the overlap is unsafe or insufficiently classified; do not write to the calendar.

Only safe, deterministic decisions are executed automatically. Reschedule, duplicate, blocked, malformed-metadata, and failed-audit outcomes must not create a new calendar event.

## Duplicate and rescheduling behavior

Duplicate detection uses event timing and metadata rather than title text alone. A repeated UWorld placement test correctly returns:

```json
{
  "should_create": false,
  "decision": "needs_reschedule_new_event"
}
```

The existing conflict is recognized as category `uworld` with flexible movability, so the new request is returned for rescheduling instead of producing a duplicate or overwriting the existing block.

## Stackability

Overlaps are allowed only when the involved activities are explicitly compatible. A travel block placed in an open slot returns `create`. A podcast requested for the exact same travel window returns `create_stacked` with `audit_status: passed`. This confirms that compatible secondary activities may coexist without weakening protection against ordinary conflicts.

Stackability is an explicit property, not a general permission to overlap. Unknown or incompatible combinations remain blocked or require rescheduling.

## Audit requirements

Each invocation should record enough information to reconstruct the decision:

- proposed event identity and time window;
- relevant existing event IDs;
- parsed category, movability, and stackability;
- final `decision` and `should_create` value;
- audit status and reason;
- created Google event ID when a write occurs;
- failure details when parsing, calendar access, creation, or logging fails.

A calendar write is not complete until the Google event ID and decision are recorded in `Generated_Calendar_Events`.

## Safety invariants

- No production workflow writes directly to Google Calendar outside this gate.
- Existing fixed events are never displaced automatically.
- Missing or invalid metadata must fail conservatively.
- Equivalent requests must be idempotent.
- Compatible stacking must be explicit and auditable.
- Logging failure is a degraded state and must surface in health reporting.

## Health check

The practical health check should verify:

1. metadata survives a create-and-read round trip;
2. an open-slot event returns `create`;
3. a repeated equivalent request does not create a second event;
4. a compatible overlap returns `create_stacked`;
5. an incompatible conflict is blocked or returned for rescheduling;
6. every created test event appears in `Generated_Calendar_Events` with its Google event ID.

Any failed check should mark calendar placement as degraded in the daily AutomateOS system health report.
