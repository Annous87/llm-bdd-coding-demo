# PRD: Duplicate Todo

## Jira Reference
- Issue key: `QE-35`
- Issue type: `Story`
- Status: `Backlog`

## Feature Context
The requested behavior is to let a user duplicate an existing Todo to create a similar task faster.

## Explicit Scope
- Add a way to duplicate an existing Todo.
- Duplication is triggered by a double click on the Todo item.
- The duplicated Todo keeps the same title and priority as the source Todo.
- The duplicated Todo always starts as active.

## Explicit Requirements
1. A user can duplicate an existing Todo.
2. The duplication trigger is a double click on the item.
3. The duplicated Todo preserves title and priority from the source item.
4. The duplicated Todo starts as active.

## Constraints
- Requirements are limited to behavior explicitly provided in Jira issue content and Jira clarification comments.
- `BDD-Q2` was explicitly reclassified to OPTIONAL and remains unanswered, so duplicated item placement is outside the acceptance contract for this cycle.

## Unresolved Blocking Questions
None.

## Unresolved Optional Questions
- `BDD-Q2`: Where should the duplicated Todo appear in the list (immediately after original, top, bottom, or other)?

## Resolved Clarification History
- `BDD-Q1`: RESOLVED by Jira clarification comment (`1048015`): duplicate keeps same title and priority, starts active.
- `BDD-Q3`: RESOLVED by Jira clarification comment (`1048079`): double click on the item triggers duplication.

## Human Classification Overrides
- `BDD-Q2`: BLOCKING -> OPTIONAL from Jira clarification comment (`1048079`).

## Traceability
- Original Jira issue (`QE-35`):
  - User intent to duplicate a Todo.
- Jira acceptance criteria in issue description:
  - "The user can duplicate an existing Todo."
- Jira clarification comment (`1048015`):
  - Duplicate keeps same title and priority.
  - Duplicate starts as active.
- Jira clarification and classification comment (`1048079`):
  - Classification override for `BDD-Q2` to OPTIONAL.
  - Double click on item triggers duplication.
- User clarification supplied during current command flow:
  - None.
