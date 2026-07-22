# AutomateOS API Contracts

## Purpose

This document is the canonical interface specification for communication between major AutomateOS components. It defines the current production contracts and the agreed Version 1 contracts for planned integrations.

GitHub is the engineering source of truth for these contracts. Notion may mirror this document for planning and readability, but implementation changes must be reflected here.

## Maturity labels

- **Production**: implemented and tested.
- **Planned**: agreed contract for a component that is not yet in production.
- **Exploratory**: not stable enough to be an API contract and therefore excluded from this document.

Current interface status:

- Custom GPT to n8n: **Production** for `log_actuals` and `place_calendar_event_safely`.
- n8n to Google Calendar: **Production** for safe event placement.
- n8n to Google Sheets: **Production** for `Actuals_Log`, `Generated_Calendar_Events`, and workflow logging used by current workflows.
- n8n to Gmail: **Planned**.
- n8n to Mac mini services: **Planned**.

## Common conventions

### Transport and encoding

- Network payloads use HTTPS and UTF-8 JSON unless an external service requires another format.
- Timestamps use ISO 8601 with an explicit UTC offset, for example `2026-07-22T08:30:00-05:00`.
- Date-only values use `YYYY-MM-DD`.
- The default user timezone is `America/Chicago` when a timezone is required and none is supplied.
- Numeric zero is a valid value and must not be converted to `null`, omitted, or treated as false.
- Unknown optional fields must be preserved in `raw_json` where practical and otherwise ignored safely.
- Secrets, OAuth tokens, webhook URLs, and credentials must never be included in payload examples, logs, Calendar metadata, or repository content.

### Common request fields

Production webhooks currently accept flat JSON objects. Version 1 keeps that shape so deployed workflows remain compatible.

Every new or updated producer should send:

- `api_version` — required for new producers; semantic contract version such as `1.0`.
- `action` — required; workflow action name.
- `request_id` — required; unique identifier for one invocation.
- `idempotency_key` — required for mutations; stable across retries of the same intended action.
- `source` — required; initiating surface such as `automateos_custom_gpt`, `email_ingestion`, or `manual_test`.
- `requested_at` — required; ISO 8601 timestamp.
- `timezone` — optional unless local times are present.

Existing production clients that omit `api_version`, `request_id`, or `idempotency_key` remain temporarily valid. The receiving workflow should generate missing identifiers, treat an absent version as `1.0`, and return the generated identifiers. New workflows must not depend on this compatibility behavior.

Example common request fields:

```json
{
  "api_version": "1.0",
  "action": "example_action",
  "request_id": "req_01J3G9W7KVN8B3Z6WDM2XQ1R4F",
  "idempotency_key": "example:source-record-123:v1",
  "source": "automateos_custom_gpt",
  "requested_at": "2026-07-22T08:30:00-05:00",
  "timezone": "America/Chicago"
}
```

### Common response envelope

New workflows should return this envelope. Existing workflows may temporarily return the documented result fields at the top level, but should add the envelope without removing legacy aliases during the Version 1 transition.

Required response fields:

- `ok` — boolean indicating whether the requested operation completed without an unresolved failure.
- `api_version` — version used to interpret the request.
- `action` — action that was processed.
- `request_id` — caller-provided or generated request identifier.
- `idempotency_key` — mutation identity when applicable.
- `status` — `completed`, `accepted`, `partial`, `skipped`, `blocked`, `degraded`, or `failed`.
- `result` — object containing action-specific output; may be empty.
- `warnings` — array; empty when there are no warnings.
- `error` — `null` or a structured error object.

```json
{
  "ok": true,
  "api_version": "1.0",
  "action": "example_action",
  "request_id": "req_01J3G9W7KVN8B3Z6WDM2XQ1R4F",
  "idempotency_key": "example:source-record-123:v1",
  "status": "completed",
  "result": {},
  "warnings": [],
  "error": null
}
```

A response must not claim completion until the external mutation and its required audit write have been confirmed.

## Authentication assumptions

Authentication is outside the JSON body.

- Custom GPT to n8n webhooks must use an authenticated connector, a webhook secret, or an authenticated reverse proxy.
- Google Calendar, Gmail, and Google Sheets access must use credentials stored in n8n or another approved secret store.
- Mac mini services must require a service credential and must not rely only on network location.
- The `action`, `source`, `request_id`, and `idempotency_key` fields are identifiers, not authentication.
- Authentication material must not be copied into `raw_json`.

The exact credential provider may change without changing this contract.

## Custom GPT and n8n

### Interface role

The Custom GPT interprets natural language and sends structured requests. n8n validates, performs deterministic checks, mutates external systems, writes audit records, and returns confirmed results.

The GPT must:

- read the relevant source of truth before requesting a mutation when practical;
- ask for clarification only when missing information materially affects safety or correctness;
- provide a stable idempotency key for repeated mutation attempts;
- never report success before n8n confirms the result;
- surface `blocked`, `degraded`, and `failed` responses clearly.

### Action: `place_calendar_event_safely` — Production

Required fields:

- `action` — exactly `place_calendar_event_safely`.
- `title` — human-readable Calendar title.
- `start_datetime` — ISO 8601 date-time.
- `end_datetime` — ISO 8601 date-time later than `start_datetime`.

Conditionally required:

- `timezone` — required when either date-time lacks an explicit offset.

Optional fields:

- `generated_event_uid`
- `source_assignment_id`
- `description`
- `category`
- `movability`
- `eisenhower`
- `priority_score`
- `stackability`
- `attention_requirement`
- `location_requirement`
- `can_overlap_categories`
- `cannot_overlap_categories`
- `requires_review_if_overlap`
- common request fields

Validation rules:

- `end_datetime` must be after `start_datetime`.
- `priority_score` must be numeric when supplied.
- overlap-category fields must be arrays of strings.
- malformed or ambiguous time values must fail conservatively.
- equivalent mutation retries must use the same `idempotency_key` or `generated_event_uid`.

Example request:

```json
{
  "api_version": "1.0",
  "action": "place_calendar_event_safely",
  "request_id": "req_01J3GA0EJPS4Q6WZK3A89BHY7M",
  "idempotency_key": "calendar:uworld:2026-07-22T19:00-05:00:v1",
  "source": "automateos_custom_gpt",
  "requested_at": "2026-07-22T08:35:00-05:00",
  "generated_event_uid": "event_01J3GA0H3QMX9PWK7V4C12B8FD",
  "source_assignment_id": "task_uworld_2026-07-22",
  "title": "UWorld",
  "start_datetime": "2026-07-22T19:00:00-05:00",
  "end_datetime": "2026-07-22T20:00:00-05:00",
  "timezone": "America/Chicago",
  "description": "Complete planned UWorld block.",
  "category": "uworld",
  "movability": "flexible",
  "eisenhower": "Q2",
  "priority_score": 70,
  "stackability": "none",
  "attention_requirement": "high",
  "location_requirement": "any",
  "can_overlap_categories": [],
  "cannot_overlap_categories": ["medicine", "icu", "night_call", "travel", "date", "sleep"],
  "requires_review_if_overlap": false
}
```

Action-specific result fields:

- `should_create` — boolean.
- `decision` — current values include `create`, `create_stacked`, `create_and_flag_existing_for_reschedule`, `needs_reschedule_new_event`, `needs_review`, `duplicate`, or `blocked`.
- `audit_status` — `passed`, `passed_with_warning`, `blocked`, or `failed`.
- `reason` — human-readable decision explanation.
- `conflict_count`
- `compatible_conflict_count`
- `incompatible_conflict_count`
- `compatible_conflicts`
- `incompatible_conflicts`
- `google_event_id` — required when an event was created.
- `generated_event_uid`

Example blocked response:

```json
{
  "ok": true,
  "api_version": "1.0",
  "action": "place_calendar_event_safely",
  "request_id": "req_01J3GA0EJPS4Q6WZK3A89BHY7M",
  "idempotency_key": "calendar:uworld:2026-07-22T19:00-05:00:v1",
  "status": "blocked",
  "result": {
    "should_create": false,
    "decision": "needs_reschedule_new_event",
    "audit_status": "blocked",
    "reason": "Proposed flexible event conflicts with an existing non-stackable event.",
    "conflict_count": 1,
    "compatible_conflict_count": 0,
    "incompatible_conflict_count": 1,
    "generated_event_uid": "event_01J3GA0H3QMX9PWK7V4C12B8FD"
  },
  "warnings": [],
  "error": null
}
```

A domain decision such as `duplicate`, `needs_reschedule_new_event`, or `needs_review` is not a transport failure. It should normally return a valid response with `status` set to `skipped` or `blocked` rather than an unstructured server error.

### Action: `log_actuals` — Production

The workflow accepts one or more actual-work entries.

Required request fields:

- `action` — exactly `log_actuals`.
- `entries` — non-empty array.

Each entry requires:

- `task` — human-readable activity.
- `status` — for example `completed`, `partial`, `missed`, or `cancelled`.

Each entry should include when known:

- `timestamp`
- `date`
- `source`
- `context`
- `energy`
- `project`
- `task_category`
- `planned_quantity`
- `planned_unit`
- `actual_quantity`
- `actual_unit`
- `duration_minutes`
- `barrier`
- `next_action`
- `notes`
- `task_id`
- `generated_event_uid`
- `google_event_id`
- entry-level `idempotency_key`

Validation rules:

- zero quantities and zero duration values must be preserved.
- partial work must not be coerced to completed or missed.
- a reliable task or event identifier should be used when available.
- uncertain task matches must be returned for review rather than attached silently.
- repeated entries with the same idempotency key must not create duplicate rows.

Example request:

```json
{
  "api_version": "1.0",
  "action": "log_actuals",
  "request_id": "req_01J3GB2KQJY6ZXA4E7RC9N0WPT",
  "idempotency_key": "actuals:2026-07-22:uworld-evening:v1",
  "source": "automateos_custom_gpt",
  "requested_at": "2026-07-22T21:15:00-05:00",
  "timezone": "America/Chicago",
  "entries": [
    {
      "date": "2026-07-22",
      "task": "UWorld",
      "project": "ITE preparation",
      "task_category": "study",
      "planned_quantity": 20,
      "planned_unit": "questions",
      "actual_quantity": 14,
      "actual_unit": "questions",
      "duration_minutes": 42,
      "status": "partial",
      "energy": "low",
      "barrier": "Got home late",
      "next_action": "Reschedule the remaining six questions",
      "generated_event_uid": "event_01J3GA0H3QMX9PWK7V4C12B8FD",
      "idempotency_key": "actual:uworld:event_01J3GA0H3QMX9PWK7V4C12B8FD:v1"
    }
  ]
}
```

Example response:

```json
{
  "ok": true,
  "api_version": "1.0",
  "action": "log_actuals",
  "request_id": "req_01J3GB2KQJY6ZXA4E7RC9N0WPT",
  "idempotency_key": "actuals:2026-07-22:uworld-evening:v1",
  "status": "completed",
  "result": {
    "received": 1,
    "written": 1,
    "duplicates_skipped": 0,
    "ambiguous_matches": 0,
    "rows": [
      {
        "status": "written",
        "task": "UWorld",
        "matched_generated_event_uid": "event_01J3GA0H3QMX9PWK7V4C12B8FD"
      }
    ]
  },
  "warnings": [],
  "error": null
}
```

## n8n and Google Calendar — Production

### Read contract

Conflict checks consume Calendar events with these fields when available:

- `id`
- `summary`
- `description`
- `status`
- `start.dateTime` or `start.date`
- `end.dateTime` or `end.date`
- `created`
- `updated`

Cancelled events are ignored. Missing or invalid dates are treated conservatively when safety depends on determining overlap.

### Create contract

Calendar event creation requires:

- `summary` from the AutomateOS `title`.
- start date-time.
- end date-time.
- timezone when not encoded in the date-time.
- `description` set to the generated `calendar_description`, not the plain user description.

The Calendar create response must supply `id`. A successful Calendar write is not complete until the Google event ID and decision are recorded in `Generated_Calendar_Events`.

### Embedded metadata

The description must contain this marker and a valid JSON object:

```text
AUTOMATEOS_METADATA_JSON:
{...}
```

Required Version 1 metadata:

- `metadata_version`
- `generated_event_uid`
- `source_assignment_id`
- `category`
- `movability`
- `eisenhower`
- `priority_score`
- `stackability`
- `attention_requirement`
- `location_requirement`
- `can_overlap_categories`
- `cannot_overlap_categories`
- `requires_review_if_overlap`

The current production workflow does not yet write `metadata_version`. Version 1 readers must treat missing `metadata_version` as `1.0`. Updated producers must write it explicitly. Unknown additive metadata fields must be ignored and preserved where possible.

Example Calendar description:

```text
Complete planned UWorld block.

---
AUTOMATEOS_METADATA_JSON:
{"metadata_version":"1.0","generated_event_uid":"event_01J3GA0H3QMX9PWK7V4C12B8FD","source_assignment_id":"task_uworld_2026-07-22","category":"uworld","movability":"flexible","eisenhower":"Q2","priority_score":70,"stackability":"none","attention_requirement":"high","location_requirement":"any","can_overlap_categories":[],"cannot_overlap_categories":["medicine","icu","night_call","travel","date","sleep"],"requires_review_if_overlap":false}
---
```

### Idempotency

- `generated_event_uid` is the persistent AutomateOS identity for a generated event.
- `google_event_id` is the external Calendar identity after creation.
- Before retrying an uncertain create, n8n must reconcile `Generated_Calendar_Events` and Calendar using these identifiers.
- Title text alone must not be used as an idempotency key.
- A known duplicate returns a domain decision and does not create another event.

## n8n and Gmail — Planned

Email is an input stream, not an operational source of truth. Gmail messages are read, classified, and converted into proposed tasks, events, deadlines, bills, travel records, or briefing items. Downstream writes use their own validated workflows.

### Message ingestion contract

Required normalized fields:

- `api_version`
- `message_id`
- `thread_id`
- `internal_date`
- `from`
- `to`
- `subject`
- `labels`
- `source_account`

Optional fields:

- `cc`
- `bcc`
- `reply_to`
- `snippet`
- `body_text`
- `body_html`
- `attachments`
- `headers`

Each attachment descriptor may include:

- `attachment_id`
- `filename`
- `mime_type`
- `size_bytes`

Example normalized message:

```json
{
  "api_version": "1.0",
  "message_id": "18f9example123",
  "thread_id": "18f9example123",
  "internal_date": "2026-07-22T07:45:00-05:00",
  "from": [{"name": "Residency Office", "email": "redacted@example.org"}],
  "to": [{"name": "AutomateOS", "email": "redacted@example.org"}],
  "subject": "Updated night call assignment",
  "labels": ["INBOX", "UNREAD"],
  "source_account": "automateos_gmail",
  "snippet": "Your night call has been moved...",
  "body_text": "Your night call has been moved from July 18 to July 25.",
  "attachments": []
}
```

### Classification result contract

Required fields:

- `message_id`
- `parser_version`
- `action_required`
- `classifications`
- `extracted_items`
- `confidence`
- `requires_review`
- `reason`
- `source_reference`

Example:

```json
{
  "message_id": "18f9example123",
  "parser_version": "1.0",
  "action_required": true,
  "classifications": ["schedule_change", "residency"],
  "extracted_items": [
    {
      "type": "calendar_change",
      "action": "move_event",
      "old_date": "2026-07-18",
      "new_date": "2026-07-25",
      "title": "Night call"
    }
  ],
  "confidence": 0.96,
  "requires_review": false,
  "reason": "The message explicitly states both the previous and replacement dates.",
  "source_reference": "gmail:18f9example123"
}
```

### Gmail idempotency and retry

- The ingestion identity is `gmail:{message_id}:{parser_version}`.
- Reprocessing the same message with the same parser version must not create duplicate downstream records.
- A new parser version may produce a new classification record but must reconcile prior downstream actions before mutating state.
- Gmail reads may retry on rate limits, timeouts, and 5xx errors.
- Downstream Calendar or Sheets mutations must follow their own idempotency contracts.

## n8n and Google Sheets

The `AutomateOS Database` spreadsheet is the current operational database. Sheet headers are API fields and must not be renamed, reordered by automation, or expanded without updating the database documentation and this contract.

Reads return objects keyed by the exact sheet headers. Writes append or update values under the exact existing headers. Contract-only metadata that has no approved column must be stored inside `raw_json` until the live schema is deliberately changed.

### Current sheet contracts

#### `Actuals_Log` — Production

Current fields:

`timestamp`, `date`, `source`, `context`, `energy`, `task`, `project`, `task_category`, `planned_quantity`, `planned_unit`, `actual_quantity`, `actual_unit`, `duration_minutes`, `status`, `barrier`, `next_action`, `notes`, `raw_json`

Required for a new row:

- `timestamp`
- `date`
- `source`
- `task`
- `status`
- `raw_json`

#### `Tasks`

Current fields:

`task_id`, `created_at`, `updated_at`, `project`, `task`, `task_category`, `status`, `priority`, `due_date`, `estimated_minutes`, `flexible`, `context`, `notes`, `source`

Required for a new row:

- `task_id`
- `created_at`
- `updated_at`
- `task`
- `status`
- `source`

#### `Rotation_Assignments`

Current fields:

`assignment_id`, `resident`, `training_level`, `rotation`, `start_date`, `end_date`, `active`, `source`, `notes`, `created_at`, `updated_at`

#### `Call_Assignments`

Current fields:

`assignment_id`, `resident`, `training_level`, `call_type`, `call_date`, `start_datetime`, `end_datetime`, `recovery_date`, `active`, `source`, `notes`, `created_at`, `updated_at`

#### `Generated_Calendar_Events` — Production

Current fields:

`generated_event_uid`, `source_assignment_id`, `google_event_id`, `calendar_name`, `title`, `start_datetime`, `end_datetime`, `category`, `status`, `created_at`, `updated_at`, `raw_json`

Required after a successful create:

- `generated_event_uid`
- `google_event_id`
- `calendar_name`
- `title`
- `start_datetime`
- `end_datetime`
- `category`
- `status`
- `created_at`
- `updated_at`
- `raw_json`

#### `Daily_Briefs` — Planned

The tab exists but has no approved schema. No production workflow may invent columns. The schema must be documented before writes begin.

#### `Automation_Log` — Production

Current fields:

`timestamp`, `workflow`, `action`, `status`, `summary`, `raw_json`

Required fields:

- all current fields.

#### `Rules`

Current fields:

`rule_id`, `category`, `rule_text`, `active`, `updated_at`

### Write acknowledgment

An internal Sheets write should normalize its result to:

```json
{
  "ok": true,
  "spreadsheet": "AutomateOS Database",
  "sheet": "Actuals_Log",
  "operation": "append",
  "affected_rows": 1,
  "record_ids": ["actual:uworld:event_01J3GA0H3QMX9PWK7V4C12B8FD:v1"],
  "written_at": "2026-07-22T21:15:03-05:00"
}
```

If an external mutation succeeds but its required Sheets audit write fails, the workflow must return `degraded` with the external identifier and must reconcile before attempting the external mutation again.

## n8n and Mac mini services — Planned

The Mac mini is a presentation and local-service surface, not a source of truth. It receives derived briefing data and exposes health information. The deployment hostname and network transport are configuration; the JSON contract is stable.

### Brief delivery

Logical endpoint: `POST /v1/briefs`

Required fields:

- `api_version`
- `brief_id`
- `generated_at`
- `brief_date`
- `timezone`
- `status`
- `sections`

Optional fields:

- `expires_at`
- `source_revision`
- `warnings`

Example request:

```json
{
  "api_version": "1.0",
  "brief_id": "brief_2026-07-23_main_v1",
  "generated_at": "2026-07-23T05:00:00-05:00",
  "brief_date": "2026-07-23",
  "timezone": "America/Chicago",
  "status": "ready",
  "sections": {
    "schedule": [],
    "priorities": [],
    "deadlines": [],
    "health_context": [],
    "important_email": [],
    "system_health": [
      {"component": "calendar_placement", "status": "healthy"}
    ]
  },
  "warnings": []
}
```

Required acknowledgment fields:

- `ok`
- `brief_id`
- `received_at`
- `display_state`

```json
{
  "ok": true,
  "brief_id": "brief_2026-07-23_main_v1",
  "received_at": "2026-07-23T05:00:02-05:00",
  "display_state": "queued"
}
```

`brief_id` is the idempotency key. Re-delivery replaces or reuses the same logical brief rather than creating duplicate cards.

### Health endpoint

Logical endpoint: `GET /v1/health`

```json
{
  "status": "healthy",
  "service_version": "1.0.0",
  "api_versions": ["1.0"],
  "last_brief_id": "brief_2026-07-23_main_v1",
  "last_brief_received_at": "2026-07-23T05:00:02-05:00",
  "display_connected": true
}
```

The Mac mini service may retry only its local display operation. It must not mutate Calendar, Tasks, or other authoritative state directly.

## Logging interface

Every production workflow writes a concise record to `Automation_Log` and retains a structured payload in `raw_json`.

Required logical fields:

- `timestamp`
- `workflow`
- `action`
- `status`
- `summary`
- `request_id`
- `idempotency_key` when applicable
- `api_version`
- dependency results
- error details when applicable

Only the existing sheet columns are written directly. Additional logical fields belong inside `raw_json` until the sheet schema is updated.

Allowed workflow log statuses:

- `success`
- `partial`
- `skipped`
- `blocked`
- `degraded`
- `failed`

Example `raw_json`:

```json
{
  "api_version": "1.0",
  "request_id": "req_01J3GA0EJPS4Q6WZK3A89BHY7M",
  "idempotency_key": "calendar:uworld:2026-07-22T19:00-05:00:v1",
  "dependencies": {
    "calendar_read": "success",
    "calendar_write": "not_attempted",
    "audit_write": "success"
  },
  "decision": "needs_reschedule_new_event"
}
```

Logging rules:

- redact secrets and sensitive authentication data;
- retain source identifiers needed for reconciliation;
- distinguish `skipped` from `failed`;
- do not silently discard failed log writes;
- a log failure marks the workflow or affected action as degraded.

## Audit interface

Audit records explain what was proposed, what the workflow observed, what decision it made, what it changed, and why.

Required logical fields for a state-changing decision:

- `audit_id`
- `timestamp`
- `api_version`
- `workflow`
- `action`
- `request_id`
- `idempotency_key`
- `source`
- `source_reference`
- `decision`
- `reason`
- `audit_status`
- relevant before-state identifiers
- relevant after-state identifiers
- dependency outcomes
- error details when applicable

For Calendar placement, the audit record must additionally include:

- `generated_event_uid`
- relevant existing Google event IDs
- parsed category, movability, and stackability
- `should_create`
- conflict counts
- created `google_event_id` when applicable

The current Calendar audit is stored through `Generated_Calendar_Events` and structured `raw_json`. Other workflows may use `Automation_Log` plus their domain source of truth until a dedicated audit store is approved.

Audit records are append-oriented. Corrections should supersede or reference earlier records rather than silently rewriting history.

## Error contract

Structured error object:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "end_datetime must be after start_datetime",
  "retryable": false,
  "dependency": null,
  "details": {
    "field": "end_datetime"
  }
}
```

Canonical error codes:

- `VALIDATION_ERROR` — invalid or missing input; do not retry without changing the request.
- `UNSUPPORTED_VERSION` — receiver cannot process `api_version`; do not retry unchanged.
- `AUTHENTICATION_ERROR` — missing or invalid credentials.
- `AUTHORIZATION_ERROR` — authenticated caller lacks permission.
- `NOT_FOUND` — required source record or external object does not exist.
- `IDEMPOTENCY_CONFLICT` — the key was previously used for materially different content.
- `MALFORMED_METADATA` — required metadata cannot be parsed safely.
- `UNSAFE_CONFLICT` — deterministic safety rule blocks the mutation.
- `REVIEW_REQUIRED` — ambiguity or consequence requires human review.
- `RATE_LIMITED` — dependency returned a rate limit; retry according to server guidance.
- `DEPENDENCY_TIMEOUT` — dependency outcome is unknown; reconcile before retrying mutations.
- `DEPENDENCY_UNAVAILABLE` — dependency is temporarily unavailable.
- `SHEETS_WRITE_FAILED` — operational database write failed.
- `AUDIT_WRITE_FAILED` — side effect may have succeeded but required audit confirmation failed.
- `PARTIAL_FAILURE` — batch contains both successful and failed items.
- `INTERNAL_ERROR` — unexpected workflow failure.

Known safety decisions such as duplicate detection or a request needing rescheduling should use the action result when possible rather than being collapsed into `INTERNAL_ERROR`.

## Retry behavior

### Safe reads

Calendar, Gmail, and Sheets reads may retry on timeouts, rate limits, and 5xx responses. Default retry policy:

1. first retry after approximately 2 seconds;
2. second retry after approximately 10 seconds;
3. third retry after approximately 30 seconds;
4. add jitter when multiple workflows may retry together.

Honor a dependency-provided `Retry-After` value when present.

### Mutations

- Mutations require an idempotency key.
- Validation, authentication, authorization, review-required, and unsafe-conflict outcomes are not retried automatically.
- A mutation may retry a confirmed pre-write transient failure.
- When a timeout or disconnect makes the write outcome uncertain, reconcile the authoritative log and external system before retrying.
- If the external write succeeded but the audit write failed, do not repeat the external write blindly. Return `AUDIT_WRITE_FAILED`, include the external identifier, and run reconciliation.
- Batch operations retry only failed items with stable item-level idempotency keys.

### Maximum automatic retry scope

A workflow should stop automatic retries when:

- three attempts have failed;
- the error is marked non-retryable;
- an idempotency conflict occurs;
- the outcome of a prior mutation remains unknown after reconciliation;
- additional attempts could create duplicate or destructive state.

The failure must then be logged and surfaced through system health.

## Idempotency expectations

Idempotency keys identify intended effects, not individual HTTP attempts.

Recommended namespaces:

- Calendar event: `calendar:{source_record}:{logical_time}:v1`
- Actual log entry: `actual:{task_or_event_id}:{completion_timestamp}:v1`
- Gmail ingestion: `gmail:{message_id}:{parser_version}`
- Sheet write: `{sheet}:{domain_record_id}:v1`
- Brief delivery: `brief:{brief_date}:{variant}:v1`

Rules:

- The same key and equivalent content return the prior result or a no-op acknowledgment.
- The same key with materially different content returns `IDEMPOTENCY_CONFLICT`.
- Generated identifiers must be stored before or atomically with the first external mutation when practical.
- Idempotency records must remain available for at least as long as a delayed retry could reasonably occur.

## Versioning strategy

- Contract versions use `MAJOR.MINOR`, beginning with `1.0`.
- A minor version may add optional fields, new non-breaking enum values, or additional response detail.
- A major version is required for removing or renaming fields, changing field meaning, changing requiredness in a breaking way, or changing idempotency behavior.
- Producers send one `api_version` per request.
- Receivers return the interpreted version.
- An unsupported version returns `UNSUPPORTED_VERSION` and should include `supported_versions` in `error.details`.
- Workflow implementation versions may use semantic patch versions such as `1.0.2`; patch versions do not change the API contract.

## Forward and backward compatibility

Version 1 compatibility rules:

- receivers ignore unknown additive fields;
- producers do not depend on optional response fields unless negotiated;
- absent `api_version` is interpreted as `1.0` only for existing production callers;
- absent Calendar `metadata_version` is interpreted as `1.0` for existing events;
- renamed fields require a transition period in which both old and new names are accepted but only the canonical name is emitted;
- enum consumers must handle unknown values conservatively;
- old major versions remain available until their callers and persisted records are migrated or an explicit deprecation decision is documented;
- persisted raw payloads retain the version used when they were created.

## Contract-change procedure

A material contract change requires:

1. update this document;
2. update affected workflow documentation;
3. update sample payloads and health checks;
4. update live Google Sheets schemas before documenting new direct columns;
5. preserve or explicitly migrate persisted identifiers and metadata;
6. record a breaking architectural decision when a major version changes;
7. synchronize the Notion mirror after GitHub is committed.

No production integration should silently change a required field, identifier, retry rule, source-of-truth boundary, or mutation safety invariant.