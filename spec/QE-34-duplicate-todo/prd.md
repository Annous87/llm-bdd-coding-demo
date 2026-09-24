# PRD: Duplicate Todo

## Jira Reference
- Issue key: `QE-34`
- Issue type: `Story`
- Status: `Backlog`

## Feature Context
The user wants to duplicate an existing Todo to quickly create a similar task.

## Explicit Scope
- Allow duplicating an existing Todo.
- Trigger duplication via double click on the Todo item.
- Place duplicated Todo at the top of the list.
- Copy title and priority from source Todo.
- Set duplicated Todo to active.

## Explicit Requirements
1. The user can duplicate an existing Todo.
2. The duplicate keeps the same title as the source Todo.
3. The duplicate keeps the same priority as the source Todo.
4. The duplicate always starts as active.
5. The duplicate appears at the top of the list.
6. Double click on the item triggers duplication.

## Constraints
- Only explicit Jira issue content and explicit Jira clarification comments are treated as requirements.
- No additional behavior is specified for persistence, error handling, or alternate duplicate actions.

## Unresolved Blocking Questions
None.

## Unresolved Optional Questions
None.

## Resolved Clarification History
- `BDD-Q1`: RESOLVED via Jira clarification comment `1047795`.
- `BDD-Q2`: RESOLVED via Jira clarification comment `1047795`.
- `BDD-Q3`: RESOLVED via Jira clarification comment `1047795`.

## Human Classification Overrides
None.

## Traceability
- Original Jira issue (`QE-34`): user story and initial acceptance statement.
- Jira acceptance criteria (issue description): "The user can duplicate an existing Todo".
- Jira clarification comment (`1047795`):
  - same title and priority,
  - starts active,
  - appears at top,
  - double click triggers duplication.
- User clarification supplied during command flow: None.
- Human classification override: None.
