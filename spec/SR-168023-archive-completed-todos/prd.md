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
- Archived todos remain available after archiving.
- Users can view archived todos in a separate archived-todos view.
- Archiving is different from permanently clearing completed todos.

### Out of Scope (not explicitly specified)

- Per-item archive action.
- Archive action label text requirements.
- Additional UI behavior not explicitly stated in Jira.

## Explicit Requirements

- The user can archive completed todos.
- Active todos must not be affected.
- Archive result for completed todos: removed from the main todo list.
- Archive interaction model: one bulk action archives all completed todos at once.
- Archived todos remain available after being removed from the main list.
- The user can view archived todos in a separate archived-todos view.
- Archiving is not permanent clearing of completed todos.

## Constraints and Technical Context

- Requirements and clarifications are sourced from Jira only.
- Acceptance behavior must stay within explicitly supported scope.

## Clarification Status

### Resolved Clarification Questions

- `BDD-Q1`: RESOLVED — Archived completed todos are removed from the main todo list.
- `BDD-Q2`: RESOLVED — Archiving is performed using one bulk action that archives all completed todos at once.
- `BDD-Q4`: RESOLVED — Archived todos remain available after archiving and can be viewed in a separate archived-todos view.

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
  - Comment `1045093`: `BDD-Q4` explicit clarification that archiving is not permanent clear and archived todos must be viewable in a separate archived-todos view.
- **User clarification supplied during this command flow**
  - None.
- **Human classification override**
  - None.
