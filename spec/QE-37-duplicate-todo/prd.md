# PRD: Duplicate Todo

## Jira Reference
- Issue key: `QE-37`
- Issue type: `Story`
- Status: `Backlog`

## Feature Context
The requested behavior is to let a user duplicate an existing Todo to create a similar task faster.

## Explicit Scope
- Add a way to duplicate an existing Todo.
- Duplication is triggered by a double click on the Todo item.
- The duplicated Todo appears at the top of the Todo list.
- The duplicated Todo keeps the same title and priority as the source Todo.
- The duplicated Todo always starts as active.

## Explicit Requirements
1. A user can duplicate an existing Todo.
2. The duplication trigger is a double click on the item.
3. The duplicated Todo is inserted at the top of the list.
4. The duplicated Todo preserves title and priority from the source item.
5. The duplicated Todo starts as active.

## Constraints
- Requirements are limited to behavior explicitly provided in Jira issue content and Jira clarification comments.
- No additional behavior is defined for persistence, alternate triggers, additional fields, or error handling.

## Unresolved Blocking Questions
None.

## Unresolved Optional Questions
None.

## Resolved Clarification History
- `BDD-Q1`: RESOLVED by Jira clarification comment (`1048426`): duplicate keeps same title and priority, starts active.
- `BDD-Q2`: RESOLVED by Jira clarification comment (`1048426`): duplicated item appears at the top.
- `BDD-Q3`: RESOLVED by Jira clarification comment (`1048426`): double click on the item triggers duplication.

## Human Classification Overrides
None found.

## Traceability
- Original Jira issue (`QE-37`):
  - User intent to duplicate a Todo.
- Jira acceptance criteria in issue description:
  - "The user can duplicate an existing Todo."
- Jira clarification comment (`1048426`):
  - Duplicate keeps same title and priority.
  - Duplicate starts as active.
  - Duplicate appears at the top.
  - Double click on item triggers duplication.
- User clarification supplied during current command flow:
  - None.
- Human classification override:
  - None.
