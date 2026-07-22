# Google Sheets database

`AutomateOS Database` is the current operational datastore for AutomateOS. This document records only the spreadsheet structure that exists now.

## Source-of-truth rules

- `Tasks` is the source of truth for flexible tasks.
- `Actuals_Log` is the source of truth for completed, partial, or missed work.
- `Rotation_Assignments` is the source of truth for residency rotations.
- `Call_Assignments` is the source of truth for call shifts and recovery dates.
- `Generated_Calendar_Events` is the authoritative audit log for calendar events created by AutomateOS. Reconciliation starts here, using `google_event_id`.
- `Rules` stores active operating rules.
- `Automation_Log` stores workflow execution results.
- `Daily_Briefs` exists but has no schema yet.
- Do not invent columns in documentation. Update this file when the live sheet changes.

## Current schemas

### Actuals_Log
`timestamp`, `date`, `source`, `context`, `energy`, `task`, `project`, `task_category`, `planned_quantity`, `planned_unit`, `actual_quantity`, `actual_unit`, `duration_minutes`, `status`, `barrier`, `next_action`, `notes`, `raw_json`

### Tasks
`task_id`, `created_at`, `updated_at`, `project`, `task`, `task_category`, `status`, `priority`, `due_date`, `estimated_minutes`, `flexible`, `context`, `notes`, `source`

### Rotation_Assignments
`assignment_id`, `resident`, `training_level`, `rotation`, `start_date`, `end_date`, `active`, `source`, `notes`, `created_at`, `updated_at`

### Call_Assignments
`assignment_id`, `resident`, `training_level`, `call_type`, `call_date`, `start_datetime`, `end_datetime`, `recovery_date`, `active`, `source`, `notes`, `created_at`, `updated_at`

### Generated_Calendar_Events
`generated_event_uid`, `source_assignment_id`, `google_event_id`, `calendar_name`, `title`, `start_datetime`, `end_datetime`, `category`, `status`, `created_at`, `updated_at`, `raw_json`

### Daily_Briefs
No columns are currently defined.

### Automation_Log
`timestamp`, `workflow`, `action`, `status`, `summary`, `raw_json`

### Rules
`rule_id`, `category`, `rule_text`, `active`, `updated_at`
