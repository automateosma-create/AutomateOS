# AutomateOS

AutomateOS is a personal operating system designed to minimize cognitive load. Its purpose is to organize, prioritize, schedule, audit, and summarize Maaz's work and life with as little manual coordination as possible.

## Governing principle

The system should adapt to the user. The user should not have to coordinate manually between ChatGPT, Gmail, Google Calendar, Google Sheets, n8n, Notion, GitHub, the desktop briefing app, or the future mobile app.

The preferred design is always the one that reduces total friction, even when a more technically elaborate design is possible.

## Primary interface

The AutomateOS custom GPT is the main input and reasoning interface. Natural-language requests should be translated into structured actions and routed to deterministic workflows.

Typical inputs include:

- logging completed work or actual task duration;
- creating, moving, or deleting calendar events;
- recording tasks and deadlines;
- asking what to work on next;
- logging nutrition, workouts, energy, sleep, or barriers;
- reviewing important emails and extracted actions.

## Major components

- **AutomateOS custom GPT:** primary conversational interface.
- **n8n:** orchestration and deterministic workflow execution.
- **Google Sheets:** operational database and audit logs.
- **Google Calendar:** user-facing schedule.
- **AutomateOS Gmail:** central automation inbox for forwarded important email.
- **Google Drive:** storage for the operational database and supporting artifacts.
- **Morning briefing:** scheduled summary of priorities, schedule, important email, health, progress, and relevant external information.
- **Mac mini desktop app:** passive display surface for the morning briefing and periodic status refreshes.
- **Future mobile app:** mobile view and controlled input surface over the same underlying data.
- **GitHub:** canonical engineering documentation, code, schemas, workflow exports, and project state.
- **Notion:** product roadmap, backlog, milestones, and higher-level planning.

## Current production workflows

### Log Actuals

Accepts structured activity logs and appends them to `Actuals_Log`. It records planned versus actual quantity, duration, status, barriers, energy, context, notes, and raw input.

### Place Calendar Event Safely

Accepts a proposed event, checks conflicts, evaluates stackability and movability, creates the event when appropriate, and logs the result to `Generated_Calendar_Events`.

## Calendar source-of-truth rule

Google Calendar is the schedule display, but it is not the authoritative audit history of n8n activity.

When inspecting what AutomateOS created, moved, or intends to reconcile, check the `Generated_Calendar_Events` sheet first. It contains the event title, Google event ID, timestamps, category, status, and source assignment information.

Calendar events do not need to contain the phrase `AutomateOS`. Their actual titles are recorded in the log sheet.

## Email ingestion

Important messages from existing personal and work accounts are forwarded automatically to the dedicated AutomateOS Gmail account. The system analyzes them for meetings, deadlines, tasks, residency and fellowship updates, bills, travel, orders, financial notices, and morning-briefing content.

The user should not need to copy information manually from email into another system.

## Refresh model

AutomateOS uses event-driven execution where needed, but many reconciliation and briefing workflows can refresh approximately every four to six hours. This balances convenience, cost, and complexity.

## Auditing and learning

AutomateOS is intended to learn from actual behavior. It should compare estimates with outcomes and progressively improve scheduling.

Key measurements include task completion rate, on-time completion rate, estimated versus actual duration, completion by project and category, performance by time of day and energy level, repeated barriers, and study, research, workout, and nutrition adherence.

## Health integration

Nutrition, workouts, sleep, energy, stress, and recovery are part of the same operating system. They should influence planning rather than live in disconnected trackers.

## Documentation

- [AutomateOS Constitution](docs/architecture/constitution.md)
- [System Overview](docs/architecture/system-overview.md)
- [Master Documentation Tracker](https://github.com/automateosma-create/AutomateOS/issues/1)

## Status

AutomateOS is under active development. The operational Google Sheets database and two foundational n8n workflows are functioning. The immediate focus is documenting the current system accurately before expanding calendar mutation, flexible scheduling, auditing, briefings, email processing, and health modules.
