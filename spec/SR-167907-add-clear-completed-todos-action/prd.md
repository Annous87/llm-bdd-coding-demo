# PRD: Add clear completed todos action

## Traceability

- Jira issue key: `SR-167907`

## Jira-Sourced Inputs

- **Summary:** `[TestBDD] Add clear completed todos action`
- **Issue type:** `Change`
- **Status:** `Neu`
- **User story:**
  - As a user of the Todo application,
  - I want to remove all completed todos with one action,
  - so that I can clean up my todo list without deleting completed items individually.

## Requirements (from Jira)

- Display a `Clear completed` action when at least one completed todo exists.
- Activating `Clear completed` removes all completed todos.
- Active todos remain unchanged.
- High-priority status of remaining active todos remains unchanged.
- Existing todo ordering behavior remains unchanged.
- If no completed todos exist, `Clear completed` is not displayed.
- Resulting todo state persists using existing localStorage behavior.

## Acceptance Criteria (from Jira)

- AC1: No completed todos -> `Clear completed` is not visible.
- AC2: Completed todo exists -> `Clear completed` is visible.
- AC3: Activating `Clear completed` removes completed todos and keeps active todos.
- AC4: Active todos retain existing priority values after clearing.
- AC5: Cleared state persists after reload.
- AC6: If no completed todos remain after clearing, action is no longer visible.

## Scope (from Jira)

### In Scope

- Clear all completed todos.
- Existing completion state.
- Existing priority behavior.
- Existing localStorage persistence.

### Out of Scope

- Undo.
- Confirmation dialog.
- Bulk selection.
- Clear active todos.
- Backend persistence.
- New state-management framework.

## Constraints and Technical Context (from Jira)

- Validate acceptance scenarios using Playwright MCP.
- Existing BDD acceptance scenarios must continue to pass.
- `npm run lint` must pass.
- `npm run build` must pass, or be reported as `BLOCKED` if environment prevents execution.
- Do not change unrelated application behavior.

## User Clarifications Provided During This Command

- None.

## Missing or Ambiguous Fields

- None that block acceptance definition.
