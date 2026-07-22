# Email Ingestion Pipeline

- **Purpose:** Convert important forwarded emails into structured AutomateOS data with minimal manual work.
- **Inputs:** Personal/work emails forwarded to the dedicated AutomateOS Gmail account.
- **Flow:** Receive email → determine whether action is needed → extract events, tasks, deadlines, bills, travel, residency, fellowship, research, or briefing items → write to the correct source of truth → log the result.
- **Rules:** Email is an input stream, not the operational source of truth; avoid duplicate tasks/events; prefer deterministic parsing when practical; use AI for interpretation or ambiguity; retain source references; log success, failure, and skipped messages.
- **Health check:** The workflow must expose a test/check confirming inbox access, message retrieval, parsing, destination writes, and logging. Its status should be included in the daily system-health check.
