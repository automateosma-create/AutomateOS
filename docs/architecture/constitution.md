# AutomateOS Constitution

## Mission

AutomateOS exists to reduce the cognitive and administrative burden of organizing, prioritizing, remembering, and executing Maaz's work and life. It should function as an adaptive executive assistant and personal operating system rather than as another task manager that requires maintenance.

## 1. Convenience is the governing objective

The primary design criterion is total convenience for the user. When several implementations are technically viable, prefer the one that requires the least ongoing attention, coordination, data entry, and context switching from Maaz.

A feature is not successful merely because it automates a step. It is successful only when it reduces the total burden of using and maintaining the system.

The system should adapt to Maaz. Maaz should not have to adapt his life to the system.

## 2. One primary conversational interface

The AutomateOS custom GPT is the primary input interface and an important output interface.

Maaz should be able to communicate naturally with requests such as:

- Log what I completed today.
- Move this event.
- Add this task and fit it into my week.
- What should I do next?
- I worked out for 45 minutes.
- I ate this meal.
- Summarize what changed.

The GPT interprets intent, asks questions only when necessary, and invokes deterministic backend workflows. Maaz should rarely need to open n8n, Google Sheets, GitHub, Notion, or other infrastructure to operate the system.

## 3. Multiple outputs, one coordinated system

AutomateOS may deliver information through several surfaces:

- AutomateOS custom GPT
- Google Calendar
- Morning briefing
- Desktop application on the spare Mac mini
- Future mobile application
- Notifications and selected emails

These surfaces must present coordinated views of shared underlying data. They must not become separate systems that require duplicate entry or manual reconciliation.

## 4. No manual coordination between infrastructure systems

Maaz should not be responsible for moving information between Gmail, Calendar, Sheets, n8n, Notion, GitHub, the desktop application, and the future mobile application.

Infrastructure should communicate through defined workflows, identifiers, logs, and schemas. When manual intervention is required, AutomateOS should surface one clear request through the primary interface.

## 5. One authoritative source for each class of information

Each type of information must have a documented source of truth.

Current rules include:

- Google Sheets is the operational database.
- Google Calendar is the user-facing schedule, not the authoritative automation ledger.
- `Generated_Calendar_Events` is the authoritative log of calendar events created by n8n.
- Calendar reconciliation begins by consulting `Generated_Calendar_Events`, using its event title, Google event ID, timestamps, category, status, and metadata.
- Calendar events are not expected to contain the phrase "AutomateOS" in their titles.
- GitHub is the canonical engineering documentation and code repository.
- Notion is the product planning, roadmap, decision-tracking, and human-readable project management workspace.

New data domains must document their authoritative source before implementation.

## 6. Deterministic execution; AI-assisted reasoning

Use deterministic code for validation, bookkeeping, conflict detection, identifiers, calculations, state changes, logging, and execution whenever feasible.

Use language models for interpretation, extraction, summarization, classification, prioritization, ambiguity resolution, and higher-level planning.

Do not send entire calendars or databases to a language model when a smaller deterministic query can answer the question.

## 7. Email is an input stream

Important messages from existing personal and work accounts are automatically forwarded to the dedicated AutomateOS Gmail account associated with the Drive and Calendar infrastructure.

Those messages may be analyzed for:

- Calendar events
- Schedule changes
- Meetings
- Deadlines
- Tasks
- Bills
- Travel details
- Residency obligations
- Fellowship and research opportunities
- Important information for morning or periodic briefings

Maaz should not have to manually copy information from email into Calendar, Tasks, or briefing systems.

Email is not the primary user interface. It is one of several information sources consumed by AutomateOS.

## 8. Periodic synchronization is acceptable

Most background reconciliation does not need to be real-time. A general refresh interval of approximately every four to six hours is acceptable for many workflows, supplemented by event-driven processing where timeliness matters.

The system should choose refresh frequency based on user value, urgency, reliability, and operating cost rather than pursuing real-time behavior by default.

## 9. Everything important is auditable

AutomateOS must maintain enough structured history to explain what happened, when it happened, what workflow performed it, and why a decision was made.

Important actions should have identifiers, timestamps, source references, statuses, and raw or normalized payloads where appropriate.

When calendar state is unclear, inspect the appropriate log sheet before guessing. In particular, consult `Generated_Calendar_Events` to determine what n8n created.

Blocked, failed, superseded, deleted, or rescheduled actions should eventually be logged as carefully as successful actions.

## 10. Learn from plans versus reality

AutomateOS should compare estimated work with actual execution and gradually build a personalized model of Maaz's behavior.

Relevant measurements include:

- Estimated duration versus actual duration
- Planned quantity versus completed quantity
- Task completion rate
- On-time completion rate
- Time of day
- Energy level
- Context
- Barriers and interruptions
- Project and task category
- Recovery needs
- Rescheduling frequency

This information should improve future estimates, scheduling, workload limits, and recommendations. The goal is not surveillance or decorative dashboards. The goal is increasingly realistic planning with less user effort.

## 11. Measure execution, not merely intention

The system should track how much of the planned work is actually completed over daily, weekly, monthly, project, and category time horizons.

Metrics should be selected because they help AutomateOS make better decisions or help Maaz understand meaningful patterns. Avoid metrics that create manual logging burden without actionable value.

## 12. Health is part of the operating system

Nutrition, workouts, sleep, energy, stress, recovery, body weight, and related health behaviors are not isolated trackers. They are first-class AutomateOS domains.

Health information may affect scheduling and recommendations. For example, sleep loss, clinical workload, recent workouts, energy, or inadequate recovery may change the realistic workload for a day.

Logging should be conversational and low-friction whenever possible.

## 13. AutomateOS is an executive assistant, not a passive task list

AutomateOS should actively reconcile constraints, identify conflicts, estimate work, schedule flexible tasks, monitor deadlines, learn from outcomes, and surface decisions.

It should not merely store tasks and wait for Maaz to manually organize them.

## 14. Human authority and safe reversibility

Maaz remains the final authority over the system. Routine, well-defined, low-risk operations should not require repetitive approval. Ambiguous, consequential, or irreversible actions should be surfaced clearly.

Where practical, system actions should be reversible and traceable.

## 15. Documentation is part of the product

Every production workflow must eventually document:

- Purpose
- User value
- Trigger and inputs
- Node-by-node behavior
- Code
- Validation rules
- Outputs
- Data dependencies
- Failure modes
- Logging
- Assumptions
- Design rationale
- Tests
- Future improvements

Architectural decisions should record why they were made, not only the final implementation.

## 16. Features must earn their complexity

Before adding a new feature, ask:

1. Does it reduce Maaz's total cognitive or administrative burden?
2. Can it reuse existing data and interfaces?
3. Does it create another source of truth or coordination obligation?
4. Can deterministic logic perform the task reliably?
5. Is the expected benefit worth its maintenance, cost, and failure modes?

A feature that adds capability while increasing ongoing coordination is contrary to the AutomateOS mission.

## Current interpretation rule

When these principles conflict, prioritize them in this order:

1. User convenience and reduced cognitive load
2. Safety, correctness, and auditability
3. Reliability and maintainability
4. Architectural simplicity
5. Feature breadth and novelty
