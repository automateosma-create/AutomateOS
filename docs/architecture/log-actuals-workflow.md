# Log Actuals Workflow

## Purpose
The Log Actuals workflow records what Maaz actually did so AutomateOS can compare planned work with completed work, improve future estimates, and reschedule unfinished work without relying on memory.

## Inputs
Actuals may be submitted through the Custom GPT or another approved input surface. A log should identify the relevant task or calendar block when possible and capture the actual outcome, duration, completion status, and any useful context such as energy, delay, interruption, or reason for non-completion.

## Source of truth
The AutomateOS Database is the canonical source of truth for logged actuals. Calendar events remain the source of truth for scheduled time; actuals describe execution and do not silently rewrite historical calendar records.

## Processing rules
1. Match the entry to an existing task or generated calendar event when a reliable identifier exists.
2. Preserve the user's original report and store normalized fields separately.
3. Record partial completion rather than forcing a binary completed/not-completed result.
4. Flag uncertain matches instead of attaching an actual to the wrong task.
5. Send unfinished work back to the planning workflow only when it remains relevant.

## Learning
Actual duration, completion rate, energy, and recurring failure reasons may inform future duration estimates and scheduling decisions. Learned values should remain explainable and should not overwrite explicit user instructions.

## Safety and reliability
The workflow must be idempotent, avoid duplicate actuals, and expose a practical health check covering input receipt, database write success, task/event matching, and downstream rescheduling. Failed or ambiguous writes must be surfaced rather than silently discarded.
