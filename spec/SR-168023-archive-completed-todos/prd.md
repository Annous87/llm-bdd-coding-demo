# PRD: Archive completed todos

## Jira Reference

- Jira issue key: `SR-168023`
- Summary: `[TestBDD] Add ability to archive todos`
- Issue type: `Change`
- Status: `Neu`

## Feature Context

- User story (Jira): As a user, I want to archive completed todos so that I can keep my todo list clean.

## Explicit Scope

### In Scope

- Archive completed todos.
- Archived completed todos are removed from the main todo list.
- Archiving uses one bulk action that archives all completed todos at once.
- Active todos are not affected by archiving completed todos.

### Out of Scope (not explicitly specified)

- Separate archived-todos view or archive history behavior.
- Per-item archive action.
- Archive action label text requirements.
- Additional UI behavior not explicitly stated in Jira.

## Explicit Requirements

- The user can archive completed todos.
- Active todos must not be affected.
- Archive result for completed todos: removed from the main todo list.
- Archive interaction model: one bulk action archives all completed todos at once.

## Constraints and Technical Context

- Requirements and clarifications are sourced from Jira only.
- Acceptance behavior must stay within explicitly supported scope.

## Clarification Status

### Resolved Clarification Questions

- `BDD-Q1`: RESOLVED — Archived completed todos are removed from the main todo list.
- `BDD-Q2`: RESOLVED — Archiving is performed using one bulk action that archives all completed todos at once.

### Unresolved Blocking Questions

- None.

### Unresolved Optional Questions

- `BDD-Q3`: Is there preferred user-facing wording for the archive action label?

## Human Classification Overrides

- None found.

## Traceability

- **Original Jira issue**
  - User story: archive completed todos to keep the list clean.
  - Acceptance criteria: user can archive completed todos; active todos must not be affected.
- **Jira clarification comment**
  - Comment `1044998`: `BDD-Q1` and `BDD-Q2` explicit answers.
- **User clarification supplied during this command flow**
  - None.
- **Human classification override**
  - None.
