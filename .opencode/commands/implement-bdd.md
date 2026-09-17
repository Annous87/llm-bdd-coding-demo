# Rule: Implement Reviewed BDD Specification (OpenCode)

## Goal

Guide OpenCode to implement an already reviewed BDD specification for a Jira issue.

Usage:

`/implement-bdd <JIRA-ISSUE-KEY>`

## Scope and Safety

- Jira access is read-only when needed for context; do not modify Jira.
- Do not add requirements or behaviors beyond the approved specification.
- Do not commit, push, create branches, or create pull requests.

## Process

1. **Locate Specification Directory**
   - Resolve directory by issue key pattern:

     `spec/<ISSUE-KEY>-*/`

   - If none or multiple ambiguous matches are found, stop and report clearly.

2. **Read Approved Specification Files**
   - Read:
     - `prd.md`
     - `acceptance.feature`
     - `implementation-plan.md`

3. **Set Behavioral Source of Truth**
   - Treat `acceptance.feature` as the behavioral source of truth.
   - If `implementation-plan.md` conflicts with acceptance behavior, acceptance behavior wins.

4. **Specification Boundary Enforcement**
   - Implement only behaviors supported by approved spec content.
   - Do not invent or add extra requirements, edge cases, UX flows, or technical scope.

5. **Run Pre-Implementation Acceptance Baseline (RED)**
   - Before modifying any application code, execute the complete `acceptance.feature` against the current app using Playwright MCP.
   - Classify every scenario as exactly one of:
     - `PASS`
     - `FAIL`
     - `BLOCKED`

6. **Interpret RED Baseline and Enforce Strict Gate**
   - Interpret results as:
     - `FAIL` = valid RED evidence (scenario executable, behavior not yet satisfied).
     - `PASS` = behavior already exists.
     - `BLOCKED` = scenario could not be executed because of tooling, environment, MCP, browser, application startup, permissions, or another execution problem.
   - Never interpret `BLOCKED` as `FAIL`.
   - Strict pre-implementation gate:
     - If any scenario is `BLOCKED`, stop immediately.
     - Do not modify application code.
     - Do not proceed with implementation.
     - Report the blocker and what must be resolved before retrying.
   - Implementation may proceed only when:
     - zero scenarios are `BLOCKED`, and
     - at least one scenario is `FAIL`, or the approved `implementation-plan.md` explicitly requires a code change supported by the specification.
   - A RED baseline does not require every scenario to fail.
   - A mixed baseline (`PASS` + `FAIL`) with zero `BLOCKED` is valid.

7. **Implement Minimum Necessary Changes**
   - Implement the minimum code changes required to satisfy approved acceptance scenarios.
   - Follow `implementation-plan.md` task ordering and repository conventions in `AGENTS.md`.

8. **Run Post-Implementation Acceptance Validation (GREEN Gate)**
   - After implementation, re-execute the complete `acceptance.feature` via Playwright MCP.
   - Classify every scenario as:
     - `PASS`
     - `FAIL`
     - `BLOCKED`
   - Determine feature acceptance outcome:
     - All required scenarios `PASS` -> feature acceptance `PASS`.
     - Any scenario `FAIL` -> feature acceptance `FAIL`.
     - Any scenario `BLOCKED` -> feature acceptance `BLOCKED`.

9. **Run Regression and Quality Gates**
   - Only after feature acceptance validation, execute relevant existing BDD regression scenarios.
   - Run quality gates as separate checks:
     - `npm run lint`
     - `npm run build`
   - Report each quality gate as exactly one of `PASS`, `FAIL`, or `BLOCKED`.
   - Report environmental restrictions (including known build execution restrictions) as `BLOCKED`, not behavioral failures.

10. **Stop Condition**
   - Present final implementation and validation report.
   - Stop after reporting.
   - Do not perform Jira modifications, git commits, pushes, branching, or pull request creation.

## Reporting Requirements

- Include pre-implementation (RED baseline) scenario-by-scenario results.
- Include post-implementation scenario-by-scenario results.
- Include regression results and quality gate outcomes.
- Use `BLOCKED` for environmental/tooling restrictions and execution constraints.
- If pre-implementation RED has any `BLOCKED`, report implementation as not started.

## Required Invariant

`APPROVED SPEC -> executable RED baseline -> implementation -> GREEN -> regression -> quality gates`

If the RED baseline cannot be executed, implementation must not start.
