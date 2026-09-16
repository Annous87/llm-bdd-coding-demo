# Rule: Plan Tasks from PRD (OpenCode)

## Goal

Guide OpenCode to generate a BDD-aligned implementation plan from an existing PRD. The command must:

1. Locate and read `prd.md`
2. Generate `acceptance.feature` in valid Gherkin
3. Generate `implementation-plan.md`
4. Create and track implementation tasks using OpenCode-native task tracking

This preserves the repository workflow under `spec/YYYYMMDD-feature-slug/`.

## Inputs

User provides one of:

- A direct PRD file path (for example `spec/20250721-simple-todo-app/prd.md`)
- A feature spec directory path containing `prd.md`

## Process

1. **Resolve PRD Path**
   - If input is a directory, use `directory/prd.md`.
   - If PRD cannot be found, stop and return a clear error with expected path format.

2. **Analyze PRD**
   - Extract user stories, functional requirements, non-goals, constraints, and success metrics.
   - Identify implementation boundaries and risks.

3. **Generate Gherkin Acceptance Criteria**
   - Create `acceptance.feature` in the same directory as `prd.md`.
   - Use valid Gherkin syntax with a coherent `Feature` description and scenario coverage of core flows, edge cases, and state transitions.
   - Keep scenarios implementation-agnostic but executable in UI/CLI acceptance checks.

4. **Generate Implementation Plan**
   - Create `implementation-plan.md` in the same directory as `prd.md`.
   - Include:
     - phased implementation tasks (about 5-7 parent tasks)
     - optional subtasks when useful
     - dependency order
     - related files to create/modify
     - validation strategy tied back to acceptance scenarios

5. **Create and Track Tasks (OpenCode-native)**
   - Mirror parent tasks in OpenCode task tracking using `todowrite`.
   - Set priority (`high`, `medium`, `low`) and initial status (`pending`), with only one `in_progress` task when execution begins.

6. **Acceptance Execution Guidance**
   - Keep `acceptance.feature` as the acceptance specification source of truth.
   - Do not create conventional Playwright test files.
   - Scenarios should be executable by OpenCode through Playwright MCP against a running application.

## Gherkin Quality Rules

- Use standard structure:

```gherkin
Feature: ...
  As a ...
  I want ...
  So that ...

  Scenario: ...
    Given ...
    When ...
    Then ...
    And ...
```

- Prefer clear observable outcomes over implementation details.
- Cover:
  - happy paths
  - input validation and empty states
  - state change and persistence behavior where relevant
  - destructive actions and expected confirmations/effects

## Output Files

In the same directory as `prd.md`:

- `acceptance.feature`
- `implementation-plan.md`

## OpenCode-Native Task Tracking Format

Track each parent task with:

- `content`: concise actionable task
- `priority`: `high` | `medium` | `low`
- `status`: `pending` | `in_progress` | `completed` | `cancelled`

## Completion Criteria

This command is complete when:

1. PRD was found and analyzed.
2. `acceptance.feature` was generated with valid Gherkin.
3. `implementation-plan.md` was generated with actionable execution order.
4. OpenCode task tracking list was initialized to mirror the plan.
5. User receives a short summary and next step to execute acceptance scenarios via Playwright MCP against the running app.
