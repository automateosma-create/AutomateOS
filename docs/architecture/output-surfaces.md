# Output Surfaces

- AutomateOS uses one underlying system state with multiple presentation surfaces.
- The custom GPT is the primary conversational input/output surface.
- Google Calendar is the canonical time and scheduling surface.
- The morning briefing summarizes the day, priorities, risks, and system health.
- The Mac mini app is a persistent desktop display for the briefing and key status.
- The future mobile app should provide quick capture, review, and completion actions without duplicating business logic.
- Notion may mirror high-level plans and project status, but GitHub remains the engineering source of truth.
- New surfaces must consume shared APIs or database state rather than create separate logic or records.
- Conflicting data should be resolved using the documented source-of-truth rules.
- Every production surface must expose a practical health check and surface degraded dependencies clearly.
