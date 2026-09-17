# Rule: Implement Reviewed BDD Specification (OpenCode)

## Goal

Guide OpenCode to implement an already reviewed BDD specification for a Jira issue using a strict executable BDD workflow.

Usage:

`/implement-bdd <JIRA-ISSUE-KEY>`

## Scope and Safety

- Jira access is read-only when needed for context; do not modify Jira.
- Do not add requirements or behaviors beyond the approved specification.
- Do not commit, push, create branches, or create pull requests.
- `acceptance.feature` is the behavioral source of truth.

## Result Classifications

For an executed check, use exactly one of:

- `PASS` — the check executed successfully and the expected behavior was satisfied.
- `FAIL` — the check executed successfully and the expected behavior was not satisfied.
- `BLOCKED` — execution was attempted but could not be completed because of tooling, environment, MCP, browser, application startup, permissions, operating-system policy, or another execution constraint.

Use:

- `NOT RUN` — execution was not attempted.

Never classify `NOT RUN` as `BLOCKED`.
Never classify `BLOCKED` as `FAIL`.

## Process

### 1. Locate Specification Directory

Resolve the directory using:

`spec/<ISSUE-KEY>-*/`

If none or multiple ambiguous matches are found, stop and report clearly.

### 2. Read Approved Specification

Read:

- `prd.md`
- `acceptance.feature`
- `implementation-plan.md`

### 3. Establish Behavioral Source of Truth

Treat `acceptance.feature` as the behavioral source of truth.

If `implementation-plan.md` conflicts with acceptance behavior, acceptance behavior wins.

### 4. Enforce Specification Boundary

Implement only behaviors supported by the approved specification.

Do not invent or add:

- requirements
- edge cases
- UX flows
- technical scope
- refactoring unrelated to the approved behavior

### 5. Preflight Application and Playwright MCP

Before executing the RED baseline:

1. Verify Playwright MCP browser-action tools are available in the current execution context.
2. Verify the application under test is reachable at the expected local URL.
3. Use Playwright MCP to navigate to the application and perform a minimal non-mutating browser check.
4. Do not modify application code during preflight.

Classify preflight as:

- `PASS` — Playwright MCP browser actions work and the application is reachable.
- `BLOCKED` — Playwright MCP is unavailable, browser actions cannot execute, or the application cannot be reached.

If preflight is `BLOCKED`:

- stop immediately;
- do not execute RED scenarios;
- do not modify application code;
- report all subsequent stages as `NOT RUN`;
- report the exact preflight blocker.

### 6. Execute Complete Pre-Implementation RED Baseline

Before modifying application code, execute every scenario in the target `acceptance.feature` using Playwright MCP.

Execute scenarios using real user-visible browser interactions wherever applicable.

Do not replace required browser interactions with synthetic DOM event dispatch when that would not faithfully reproduce user behavior.

Classify every scenario as exactly:

- `PASS`
- `FAIL`
- `BLOCKED`

No target acceptance scenario may be omitted or sampled.

### 7. Enforce Strict RED Gate

Interpret results as:

- `FAIL` = valid RED evidence.
- `PASS` = behavior already exists.
- `BLOCKED` = scenario could not be reliably executed.

If any target acceptance scenario is `BLOCKED`:

- stop immediately;
- do not modify application code;
- report implementation as `NOT RUN`.

Implementation may proceed only when:

- zero scenarios are `BLOCKED`; and
- at least one scenario is `FAIL`, OR the approved `implementation-plan.md` explicitly requires a code change supported by the specification.

A mixed baseline of `PASS` + `FAIL` with zero `BLOCKED` is valid.

If every scenario already passes and no approved code change is required, report that implementation is unnecessary and stop.

### 8. Implement Minimum Necessary Changes

Implement only the minimum code changes required to satisfy the approved acceptance scenarios.

Follow:

- `acceptance.feature`
- `implementation-plan.md`
- repository conventions in `AGENTS.md`

Do not make unrelated changes.

### 9. Execute Complete Post-Implementation GREEN Validation

After implementation, execute every scenario in the target `acceptance.feature` again via Playwright MCP.

Classify every scenario as:

- `PASS`
- `FAIL`
- `BLOCKED`

No scenario may be omitted or sampled.

Feature acceptance outcome:

- all scenarios `PASS` -> `PASS`
- any scenario `FAIL` -> `FAIL`
- any scenario `BLOCKED` -> `BLOCKED`

If feature acceptance is not `PASS`, do not proceed to regression or quality gates.

Report regression and quality gates as `NOT RUN` and stop.

### 10. Execute Complete BDD Regression

After target feature acceptance is `PASS`, discover existing BDD acceptance features under `spec/`, excluding the target feature already validated.

Execute every scenario from every applicable existing `acceptance.feature` via Playwright MCP.

Regression must be complete.

Do not:

- sample representative scenarios;
- report a feature as `PASS` based on partial execution;
- substitute synthetic browser events for required real user interactions;
- silently omit scenarios that are difficult to execute.

For each regression scenario classify:

- `PASS`
- `FAIL`
- `BLOCKED`

For each regression feature report:

- total scenarios;
- PASS count;
- FAIL count;
- BLOCKED count.

Overall regression outcome:

- all scenarios `PASS` -> `PASS`
- any scenario `FAIL` -> `FAIL`
- any scenario `BLOCKED` -> `BLOCKED`

If complete regression execution cannot be performed reliably, report regression as `BLOCKED`, identify exactly which scenarios could not be executed, and do not claim regression passed.

### 11. Run Quality Gates

After regression execution, run:

- `npm run lint`
- `npm run build`

For each command:

- command succeeds -> `PASS`
- command executes and reports a project/code failure -> `FAIL`
- command execution is prevented or interrupted by an environmental/tooling restriction -> `BLOCKED`
- command was not attempted -> `NOT RUN`

Known environmental restrictions, including operating-system policy preventing required executables from running, must be classified as `BLOCKED`, not `FAIL`.

Do not classify a deliberately skipped command as `BLOCKED`.

### 12. Final Report

Present a structured report containing:

#### Specification
- Jira issue
- specification directory
- behavioral source of truth

#### Preflight
- Playwright MCP availability
- application reachability
- outcome

#### RED Baseline
For every target acceptance scenario:
- scenario name
- PASS / FAIL / BLOCKED

Include totals.

#### Implementation
- whether implementation started
- files modified
- concise description of changes

#### GREEN Validation
For every target acceptance scenario:
- scenario name
- PASS / FAIL / BLOCKED

Include totals and overall feature acceptance outcome.

#### Regression
For every existing BDD feature:
- feature/spec path
- total scenarios
- PASS
- FAIL
- BLOCKED

Include overall regression outcome.

Explicitly state whether regression execution was complete.

#### Quality Gates
- `npm run lint`: PASS / FAIL / BLOCKED / NOT RUN
- `npm run build`: PASS / FAIL / BLOCKED / NOT RUN

#### Final Workflow Outcome

Report one of:

- `PASS` — target acceptance passed, complete regression passed, and required quality gates passed or have explicitly documented environmental BLOCKED status.
- `FAIL` — behavioral validation, regression, or a quality gate produced an actual failure.
- `BLOCKED` — required validation could not be completed because of an execution/environment/tooling constraint.

Never report overall `PASS` if regression was sampled or incomplete.

### 13. Stop Condition

After the final report:

- stop;
- do not modify Jira;
- do not commit;
- do not push;
- do not create branches;
- do not create or modify pull requests.

## Required Invariant

`APPROVED SPEC -> PREFLIGHT -> EXECUTABLE RED -> IMPLEMENTATION -> COMPLETE GREEN -> COMPLETE REGRESSION -> QUALITY GATES`

If preflight or RED cannot execute reliably, implementation must not start.

If GREEN does not pass completely, regression and quality gates must not start.

If regression is sampled or incomplete, regression must not be reported as PASS.
