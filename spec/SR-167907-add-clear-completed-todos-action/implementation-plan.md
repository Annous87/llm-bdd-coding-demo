# Implementation Plan: SR-167907 Clear completed todo items

## Inputs and Source of Truth

- Jira issue: `SR-167907`
- Behavioral source of truth: `spec/SR-167907-add-clear-completed-todos-action/acceptance.feature`
- Supporting requirements: `spec/SR-167907-add-clear-completed-todos-action/prd.md`

If implementation details conflict with acceptance behavior, acceptance behavior wins.

## Scope Alignment

Implement only:

- Conditional visibility of `Clear completed` when at least one completed todo exists.
- Clearing all completed todos while preserving active todos.
- Preserving active todo priority values and existing ordering behavior.
- Persisting resulting state via existing localStorage behavior.

Do not add undo, confirmation dialog, bulk selection, clearing active todos, backend persistence, or new state management.

## Incremental Tasks

1. Locate current todo action controls and completion-state derivation in `src/App.tsx`.
2. Add a derived predicate for whether any completed todos exist.
3. Add a `Clear completed` UI action rendered only when the predicate is true.
4. Implement action handler to remove all completed todos and keep active todos unchanged.
5. Ensure existing ordering logic and priority fields for remaining active todos are untouched by the clear action.
6. Verify persistence through existing state/localStorage flow (no new persistence mechanism).
7. Keep styling minimal and aligned with existing UI patterns in `src/App.css`.

## Validation Plan (BDD First)

1. Execute complete `acceptance.feature` for this issue via Playwright MCP pre-implementation (RED baseline).
2. Implement minimal code changes.
3. Execute complete `acceptance.feature` again via Playwright MCP (GREEN check).
4. Execute relevant existing BDD regression scenarios.
5. Run quality gates:
   - `npm run lint`
   - `npm run build`

Report all scenario and gate outcomes as `PASS`, `FAIL`, or `BLOCKED`.
If environment restrictions prevent execution (for example build restrictions), report `BLOCKED`.

## Non-Goals and Guardrails

- No Jira modifications.
- No automatic implementation beyond approved acceptance behavior.
- No git commit, push, branch creation, or PR creation within this workflow step.
