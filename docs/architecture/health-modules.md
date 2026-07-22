# Health Modules

AutomateOS may track nutrition, workouts, sleep, energy, and related health signals as structured user-reported or device-derived data. These modules are planning and self-management tools, not diagnostic systems.

## Current role
- Record health inputs and actuals in the shared data layer.
- Surface concise trends, missed targets, and conflicts with the calendar or task plan.
- Feed relevant constraints into daily planning, such as low energy, inadequate sleep, recovery needs, or meal timing.

## Source of truth
Structured records in the AutomateOS database are authoritative. Calendar events represent planned time, while logged actuals represent what occurred. Generated summaries and recommendations are derived views and must not overwrite source data.

## Module boundaries
Each module should expose a small, stable schema and avoid duplicating data owned by another module. Cross-module conclusions should be generated at the reporting layer.

## Safety
Health outputs must clearly distinguish recorded facts, user goals, estimates, and model-generated suggestions. Urgent or high-risk symptoms must not be handled as routine optimization data.

## Health checks
Each production ingestion or reporting workflow must expose a practical check for freshness, malformed records, duplicate ingestion, missing required fields, and failed downstream writes. The daily system health report should identify degraded health modules without blocking unrelated workflows.