# ADR-0003: Use Google Sheets as the Early Operational Database

## Status

Accepted

## Date

2026-07-22

## Context

AutomateOS is in a foundation stage with a small number of production workflows and rapidly evolving schemas. The operational data must be inspectable during debugging and easy to edit while tasks, assignments, actuals, rules, event mappings, briefs, and automation logs are still being defined.

A relational database would provide stronger transactions, constraints, indexing, concurrency, and query performance. It would also introduce schema migrations, hosting, administration, credentials, backup procedures, and an additional interface before the product model is stable.

## Decision

Use the `AutomateOS Database` Google Sheet as the Version 0.1 operational database. Each data class has a documented authoritative tab, and documentation must reflect the live headers rather than invent future columns.

Google Sheets is selected during early development because it provides:

- **Simplicity:** minimal infrastructure and direct n8n integration.
- **Visibility:** records can be inspected and corrected without specialized database tools.
- **Rapid iteration:** schemas and workflows can evolve quickly while requirements are being discovered.
- **Migration path:** stable identifiers, explicit schemas, API contracts, and `raw_json` preserve enough structure to migrate later.

Sheets is not treated as an unstructured notebook. Workflows must use stable identifiers, validated fields, idempotent writes, status values, and audit records.

## Consequences

- Development and debugging remain accessible and inexpensive.
- Operational state can be reviewed directly when automation behavior is unclear.
- Referential integrity and concurrency protections must be implemented in workflow logic.
- Large datasets, complex queries, and high write volume will eventually become inefficient.
- Schema changes require coordinated updates to workflows, contracts, and documentation.

## Alternatives Considered

- **PostgreSQL or another relational database immediately:** technically stronger, but premature while schemas and product boundaries remain fluid.
- **Notion databases:** readable for planning but less suitable as a deterministic automation datastore.
- **Calendar or conversational memory as operational storage:** rejected because neither can represent the full structured state reliably.

## Future Revisions

Migrate to a relational database when concurrency, transactions, query complexity, data volume, latency, or integrity requirements materially exceed what Sheets can safely support. The migration should preserve identifiers and source-of-truth boundaries, expose compatibility APIs, and run reconciliation before Sheets is retired or made read-only.