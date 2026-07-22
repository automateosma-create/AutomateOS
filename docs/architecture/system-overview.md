# AutomateOS System Overview

## Purpose

AutomateOS is a convenience-first personal operating system. It exists to reduce the effort required to remember, organize, schedule, execute, and review work and life responsibilities.

It is not intended to be a collection of disconnected productivity tools. It is one coordinated system with a primary conversational interface and several passive output surfaces.

## Primary interaction model

The AutomateOS custom GPT is the main user interface.

The user should be able to express intent naturally, such as logging work, scheduling an event, moving a call shift, recording a workout, or asking what to do next. The GPT interprets the request, produces structured data, and invokes the appropriate n8n workflow.

The user should rarely need to interact directly with n8n, Google Sheets, or workflow internals.

## Inputs

### Direct conversational input

The custom GPT receives natural-language requests concerning:

- tasks and deadlines;
- calendar changes;
- actual work completed;
- study and research progress;
- nutrition and workouts;
- sleep, energy, stress, and barriers;
- planning and prioritization.

### Email input

Important messages from existing personal and work accounts are forwarded automatically to the dedicated AutomateOS Gmail account.

These messages are analyzed for:

- meetings and events;
- deadlines;
- tasks and required follow-up;
- residency, fellowship, and research updates;
- travel details;
- bills and financial notices;
- material for daily briefings.

Email is an input stream, not the primary interface.

### Operational and historical input

AutomateOS also reads structured records from its Google Sheets database, including assignments, tasks, actuals, generated calendar events, rules, briefs, and automation logs.

## Reasoning and orchestration

### AutomateOS custom GPT

The GPT is used for language interpretation, ambiguity resolution, prioritization, summarization, and higher-level reasoning.

### n8n

n8n is the orchestration layer. It receives structured requests, validates them, applies deterministic rules, invokes Google services, and writes audit records.

### Deterministic code

Bookkeeping, conflict detection, duplicate detection, stackability checks, source-of-truth updates, and routine mutations should use deterministic code whenever practical. AI should not be used where predictable logic is sufficient.

## Operational data layer

The `AutomateOS Database` spreadsheet in Google Drive is the operational database.

Current tabs include:

- `Actuals_Log`
- `Tasks`
- `Rotation_Assignments`
- `Call_Assignments`
- `Generated_Calendar_Events`
- `Daily_Briefs`
- `Automation_Log`
- `Rules`

Each type of information should have one authoritative home. Other interfaces may display or cache the data but should not silently become competing sources of truth.

## Calendar model

Google Calendar is the user-facing schedule.

The `Generated_Calendar_Events` sheet is the authoritative audit trail of calendar events created by n8n. It records the real event title, Google event ID, source assignment, timestamps, category, and status.

When there is uncertainty about what n8n did, inspect this log sheet first. Do not search the calendar for an event titled `AutomateOS`; normal event titles come from the structured request and are recorded in the sheet.

## Outputs

### AutomateOS custom GPT

The GPT provides interactive responses, confirmations, explanations, recommendations, and targeted summaries.

### Google Calendar

Calendar is the primary schedule view for fixed clinical work, personal commitments, flexible work blocks, travel, workouts, meetings, and reminders.

### Morning briefing

The morning briefing should combine:

- today's schedule;
- high-priority tasks;
- deadlines;
- important email;
- study and research targets;
- nutrition and workout plans;
- recent completion metrics;
- weather, markets, news, and other relevant live information.

### Mac mini desktop app

A desktop app on the spare Mac mini should act as a passive dashboard for the morning briefing, current priorities, upcoming events, alerts, and progress metrics.

### Future mobile app

The future mobile app should provide a mobile window into the same underlying system. It should not create an independent task database or calendar logic.

## Refresh cadence

Some actions are event-driven and should happen immediately, such as explicitly requested calendar changes.

Broader reconciliation, email analysis, metric updates, and briefing refreshes may generally run every four to six hours. The cadence should remain configurable and should favor convenience without adding unnecessary cost or fragility.

## Auditing and adaptive scheduling

AutomateOS should compare planned work with actual outcomes.

The audit layer should progressively learn:

- how long different task categories actually take;
- which estimates are consistently inaccurate;
- completion probability by context, time of day, and energy level;
- repeated barriers;
- realistic daily capacity;
- which tasks are delayed, abandoned, or completed on time.

Core metrics should include daily, weekly, and monthly completion rates; on-time completion; estimated-to-actual duration error; and adherence across study, research, nutrition, and workouts.

These measurements should improve future scheduling rather than merely populate dashboards.

## Health and performance

Nutrition, workouts, sleep, recovery, energy, and stress are integrated inputs. The system should eventually use these signals to adjust planning and explain differences between intended and actual performance.

## Current implementation state

Two n8n workflows are in production:

1. `Log Actuals`
2. `Place Calendar Event Safely`

The current documentation effort is establishing a reliable Version 0.1 baseline before adding deletion, movement and update workflows, flexible scheduling, email processing, morning brief generation, auditing, and health modules.
