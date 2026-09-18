# Implementation Plan: SR-168023 Archive completed todos

## Inputs and Source of Truth

- Jira issue: `SR-168023`
- Behavioral source of truth: `spec/SR-168023-archive-completed-todos/acceptance.feature`
- Supporting requirements: `spec/SR-168023-archive-completed-todos/prd.md`

If implementation details conflict with acceptance behavior, acceptance behavior wins.

## Scope Alignment

Implement only:

- One bulk archive action for completed todos.
- Removal of completed todos from the main todo list when archive action is used.
- Preservation of active todos during archive operation.
- Persistence of archived completed todos as archived (not cleared) items.
- A separate archived-todos view that displays archived completed todos.

Do not implement behavior that is not explicitly supported by Jira evidence (for example per-item archiving, or specific label wording requirements).

## Incremental Tasks

1. Locate current todo state handling and completion filtering in the app.
2. Add a bulk archive action path that targets completed todos only.
3. Ensure archive action removes completed todos from the main todo list.
4. Ensure active todos remain unchanged after archive action.
5. Persist archived completed todos separately from main todos.
6. Add and wire a separate archived-todos view that displays archived completed todos only.
7. Keep changes limited to behavior required by `acceptance.feature`.

## Validation Plan (BDD First)

1. Validate the `acceptance.feature` scenario against current behavior (RED baseline if not implemented).
2. Implement minimal behavior needed for the scenario.
3. Re-validate scenario behavior (GREEN check).
4. Run repository quality gates:
   - `npm run lint`
   - `npm run build`

Report execution outcomes as `PASS`, `FAIL`, or `BLOCKED`.

## Non-Goals and Guardrails

- No unrelated refactoring.
- No speculative acceptance behavior.
- No Jira write actions in this step.
- No commit, push, or PR operations in this step.
