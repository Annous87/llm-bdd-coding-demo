# PRD: Duplicate Todo

## Jira Issue
- Key: `SR-168533`
- Type: `Change`
- Status: `Neu`

## Feature Context
The request is to let users duplicate an existing Todo so they can create a similar task quickly.

## Explicit Scope
- Support duplicating an existing Todo.
- Trigger duplication by double clicking the Todo item.
- Insert the duplicate at the top of the list.
- Preserve source Todo title and priority in the duplicate.
- Set the duplicate to active state.

## Explicit Requirements
1. User can duplicate an existing Todo.
2. Duplicate action is triggered by double click on the item.
3. Duplicated Todo appears at the top of the list.
4. Duplicated Todo keeps the same title and priority as the source Todo.
5. Duplicated Todo always starts as active.

## Constraints
- Requirements are limited to explicit Jira issue content and Jira clarification comments.
- No additional behavior is defined for other fields, persistence semantics, validations, or error handling.

## Unresolved Blocking Questions
None.

## Unresolved Optional Questions
None.

## Resolved Clarification History
- `BDD-Q1`: RESOLVED by Jira clarification comment `1047550` (same title and priority, starts active).
- `BDD-Q2`: RESOLVED by Jira clarification comment `1047555` (duplicate appears at the top).
- `BDD-Q3`: RESOLVED by Jira clarification comment `1047555` (double click triggers duplication).

## Human Classification Overrides
None.

## Traceability
- Original Jira issue (`SR-168533`): user story to duplicate a Todo.
- Jira acceptance criteria (issue description): "The user can duplicate an existing Todo."
- Jira clarification comment `1047550`: duplicate keeps title and priority, starts active.
- Jira clarification comment `1047555`: duplicate appears at top; double click triggers duplication.
- User clarification supplied during this command flow: None.
- Human classification override: None.
