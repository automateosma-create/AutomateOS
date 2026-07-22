# ADR-0005: Use n8n as the Automation Engine

## Status

Accepted

## Date

2026-07-22

## Context

AutomateOS must connect conversational requests, webhooks, Gmail, Google Calendar, Google Sheets, health inputs, briefings, and future services. The orchestration layer must support deterministic code, credentials, branching, retries, scheduled triggers, event-driven execution, and visible debugging without requiring a large custom backend at the foundation stage.

A fully custom service would maximize control but would also require framework selection, hosting, job scheduling, queue management, connector maintenance, observability, deployment tooling, and more code before the core product behavior is proven.

## Decision

Use n8n as the primary automation and orchestration engine for Version 0.1.

n8n was selected for:

- **Self-hosting:** workflows and credentials can be operated under AutomateOS control.
- **Flexibility:** visual nodes, code nodes, webhooks, schedules, and service integrations can be combined as needed.
- **Cost:** early workflows can be implemented without building or paying for a large bespoke platform.
- **Maintainability:** workflow execution can be inspected visually while deterministic logic remains explicit and testable.

n8n is an orchestration layer, not the source of truth. It receives versioned requests, validates them, invokes deterministic logic and external services, writes audit records, and returns confirmed results. Core rules should be isolated in code or clearly bounded nodes so they can be tested and migrated.

## Consequences

- Integrations can be built and modified rapidly.
- Workflow runs provide practical operational visibility.
- n8n availability and credential management become critical dependencies.
- Complex logic can become difficult to maintain if spread across many visual nodes.
- Workflow exports, contracts, health checks, and documentation must be versioned in GitHub.
- Business logic should avoid proprietary coupling where a portable function or service boundary is practical.

## Alternatives Considered

- **Custom application backend:** stronger control and testing, but higher initial engineering and operational burden.
- **Cloud-specific automation products:** convenient but may increase cost, lock-in, and limitations on complex deterministic logic.
- **Direct calls from ChatGPT to every external service:** rejected because it fragments validation, safety, retry, and audit behavior.

## Future Revisions

Individual workflows may move to dedicated services when complexity, performance, testing, or reliability warrants it. n8n may remain the outer orchestrator even when domain logic migrates. Stable API contracts and modular workflow boundaries are required to make replacement incremental rather than system-wide.