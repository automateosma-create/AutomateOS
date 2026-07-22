# Auditing and Learning from Actuals

## Purpose
- Compare planned work with what actually happened.
- Improve future estimates, scheduling, and prioritization without adding manual overhead.

## Audit trail
- Preserve the original plan, later changes, actual completion, duration, and outcome.
- Use stable task and calendar-event identifiers so records can be reconciled across systems.
- Treat system logs and source databases as authoritative; dashboards are views, not separate sources of truth.

## Core metrics
- Completion rate.
- Planned versus actual duration.
- Start-time and deadline variance.
- Reschedule and deferral frequency.
- Work completed by category, priority, rotation, and energy level.

## Learning
- Update duration estimates only after enough comparable observations exist.
- Detect recurring overcommitment, unrealistic time windows, and tasks that are repeatedly deferred.
- Use learned patterns as scheduling recommendations; preserve explicit user rules and overrides.
- Never silently rewrite historical records.

## Reporting
- Daily: concise exceptions, missed commitments, and degraded workflows.
- Weekly: trends, estimate accuracy, bottlenecks, and recommended adjustments.
- Avoid vanity metrics that do not change a decision.

## Health check
- Verify recent planned items can be matched to actuals or explicitly marked unresolved.
- Verify required identifiers and timestamps are present and duplicate records are not being created.
- Log failures and surface degraded auditing in the daily system health summary.