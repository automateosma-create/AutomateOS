# ADR-0008: Learn Scheduling Estimates from Measured Actuals

## Status

Accepted

## Date

2026-07-22

## Context

Initial task durations are estimates. Their accuracy varies by activity, context, energy, clinical workload, time of day, interruptions, and the amount of work requested. Static estimates cause repeated overcommitment or unused capacity and force the user to keep correcting the scheduler manually.

AutomateOS already distinguishes plans from actual execution. Actuals can capture duration, quantity, completion state, energy, barriers, and task category. This creates an evidence base for increasingly realistic planning, but noisy observations or small sample sizes must not immediately override explicit instructions.

## Decision

Use measured actuals to progressively supersede unsupported duration assumptions with personalized evidence-based estimates.

The learning layer will:

- preserve the original estimate and every measured outcome;
- group only sufficiently comparable observations;
- track sample size, variability, recency, and relevant context;
- calculate a central estimate and an uncertainty range or confidence interval;
- blend defaults with measured data when evidence is limited;
- increase the weight of measured data as confidence improves;
- treat learned values as scheduling inputs and recommendations, not irreversible facts;
- preserve explicit user rules and overrides.

Historical records are never silently rewritten. A learned estimate changes future planning while the system retains the information needed to explain how it was derived.

## Consequences

- Scheduling should become more realistic and require fewer manual corrections.
- The system can detect systematic underestimation, overcommitment, and context-dependent performance.
- Reliable learning requires consistent identifiers and low-friction actuals logging.
- Sparse or biased data can produce misleading estimates unless uncertainty is represented.
- The model must distinguish task categories, quantities, and contexts rather than average unrelated work.
- Recommendations must remain explainable.

## Alternatives Considered

- **Keep fixed user-entered estimates forever:** simple but prevents adaptation.
- **Replace estimates after every observation:** responsive but unstable and vulnerable to outliers.
- **Use population averages:** useful as defaults, but less accurate for a personal operating system.
- **Use an opaque predictive model without retained history:** potentially powerful but difficult to audit and trust.

## Future Revisions

The learning method may evolve from weighted descriptive statistics to hierarchical or probabilistic models. Revisions must preserve explainability, uncertainty, historical data, user overrides, and the ability to compare a new model against prior scheduling performance.