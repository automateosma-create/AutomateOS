# Current Architecture and Data Flow

## Scope

This document describes only the architecture that currently exists or has been explicitly decided. It is intentionally concise and should not speculate in detail about unbuilt features.

AutomateOS is still early-stage. Most future capabilities remain planned rather than implemented. Documentation should therefore distinguish clearly between:

- **Production**: built and tested.
- **Planned**: agreed design direction, not yet implemented.
- **Exploratory**: ideas that may change.

## Current system boundaries

### Primary interface

The AutomateOS custom GPT is intended to be the main user-facing interface for logging, scheduling, planning, and asking what to do next.

### Orchestration

n8n executes deterministic workflows, validates inputs, writes operational data, and calls external services.

### Operational database

Google Sheets currently stores operational state in the `AutomateOS Database` spreadsheet.

Current tabs:

- `Actuals_Log`
- `Tasks`
- `Rotation_Assignments`
- `Call_Assignments`
- `Generated_Calendar_Events`
- `Daily_Briefs`
- `Automation_Log`
- `Rules`

### Calendar

Google Calendar is the user-facing schedule.

`Generated_Calendar_Events` is the authoritative audit log for events created by n8n. Calendar event titles are natural titles such as `UWorld` or `Travel`; they do not contain the word `AutomateOS` merely to identify them.

### Email

Important emails from existing accounts are forwarded to the dedicated AutomateOS Gmail account. The planned processing layer will classify those emails and extract events, deadlines, tasks, and briefing content.

### Documentation and planning

- GitHub is the canonical engineering documentation location.
- Notion is intended for roadmap, backlog, milestones, and product planning.

## Production workflows

### Log Actuals

Current data flow:

```text
AutomateOS GPT or webhook client
    -> n8n webhook
    -> validation and normalization code
    -> append rows to Actuals_Log
    -> return success response
```

The workflow accepts one or more actual-work entries, preserves numeric zero values, records barriers and next actions, and stores the original payload in `raw_json`.

### Place Calendar Event Safely

Current data flow:

```text
AutomateOS GPT or webhook client
    -> n8n webhook
    -> prepare proposed event
    -> read relevant Google Calendar events
    -> deterministic placement decision
    -> create event or return non-creation decision
    -> append created event to Generated_Calendar_Events
    -> return result
```

The workflow evaluates overlap, category, movability, priority, Eisenhower classification, and stackability. Current decision outcomes include:

- `create`
- `create_stacked`
- `create_and_flag_existing_for_reschedule`
- `needs_reschedule_new_event`
- `needs_review`

Created events include embedded AutomateOS metadata in the description.

## Current source-of-truth rules

- Actual completed work: `Actuals_Log`
- Structured task records: `Tasks`
- Rotation assignments: `Rotation_Assignments`
- Call assignments: `Call_Assignments`
- n8n-created calendar events: `Generated_Calendar_Events`
- User-visible schedule: Google Calendar
- Engineering documentation: GitHub
- Product roadmap and planning: Notion

When investigating a generated calendar event, inspect `Generated_Calendar_Events` first, then use its title and Google event ID to locate the corresponding Calendar event.

## Planned near-term data flows

These are agreed next steps but are not yet production workflows:

```text
Delete Calendar Event
Update or Move Calendar Event
Flexible Scheduling
Email Classification and Event Extraction
Daily Brief Generation
```

## Documentation discipline

Documentation should stay proportionate to implementation. A feature should receive detailed workflow documentation only after it is built or when a design decision is necessary to build it correctly. Broad future ideas should remain in the roadmap rather than being expanded into large speculative specifications.
