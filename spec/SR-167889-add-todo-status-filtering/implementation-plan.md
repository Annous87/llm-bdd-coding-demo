# Implementation Plan: Todo Status Filtering

## Overview

This plan introduces completion-status filters (`All`, `Active`, `Completed`) while preserving existing todo behavior, including persistence and high-priority ordering semantics. Acceptance behavior in `acceptance.feature` is the source of truth for observable outcomes.

## Traceability

- Jira source: `SR-167889`
- Acceptance source: `spec/SR-167889-add-todo-status-filtering/acceptance.feature`

## Dependency Order

1. Define filter domain model and default selection behavior.
2. Implement filter state wiring at app level.
3. Add filter controls and selected-state UI affordance.
4. Apply filtered rendering logic without mutating todo data.
5. Verify compatibility with existing high-priority ordering and persistence.
6. Validate acceptance scenarios and project quality gates.

## Phased Tasks

### 1) Add filter state model and default behavior (High)

- Introduce filter type with allowed values: `all`, `active`, `completed`.
- Initialize selected filter to `all` on app open.
- Keep filter state independent from todo storage state.

Related files (expected):

- `src/App.tsx`
- `src/types/*` (if central filter/type declaration is preferred)

Acceptance mapping:

- Default filter on application open.

### 2) Implement filter controls in UI (High)

- Render three visible controls: `All`, `Active`, `Completed`.
- Ensure currently selected filter is visually distinguishable.
- Wire control interactions to update selected filter immediately.

Related files (expected):

- `src/components/TodoList.tsx` or `src/App.tsx` (depending on ownership)
- `src/components/*.module.css` and/or `src/App.css`

Acceptance mapping:

- Default filter selected indicator.
- Show active/completed/all scenarios triggered by control selection.

### 3) Apply non-mutating filtered view logic (High)

- Derive visible todos from selected filter and existing todo completion state.
- Ensure filtering changes only rendered subset, not source todo list.
- Preserve existing behavior for empty filtered result sets.

Related files (expected):

- `src/App.tsx`
- `src/components/TodoList.tsx`

Acceptance mapping:

- Show only active todos.
- Show only completed todos.
- Return to all todos.
- Empty result for selected filter.

### 4) Preserve ordering and existing feature compatibility (High)

- Ensure filter application does not reorder items beyond existing ordering logic.
- Verify active-filter rendering keeps high-priority items ahead of normal-priority items where current behavior requires it.
- Confirm no side-effects on completion toggles/deletes from filter switching.

Related files (expected):

- `src/App.tsx`
- `src/components/TodoList.tsx`
- Any helper responsible for list ordering/grouping

Acceptance mapping:

- Changing filters does not modify todos.
- Active filter preserves priority ordering.

### 5) Validate persistence and regressions (Medium)

- Confirm existing localStorage todo persistence continues to work unchanged.
- Validate filter behavior does not alter persisted todo data structure unexpectedly.
- Verify no out-of-scope capabilities are introduced (search/custom filters/sort controls).

Related files (expected):

- `src/hooks/useLocalStorage.ts`
- `src/App.tsx`

Acceptance mapping:

- Supports all scenarios by ensuring baseline data behavior remains stable.

### 6) Execute acceptance and quality gates (High)

- Validate each scenario in `acceptance.feature` via Playwright MCP against a running app.
- Run `npm run lint` and `npm run build`.
- Record pass/fail, including explicit environment-blocked reasons if applicable.

Related files:

- `spec/SR-167889-add-todo-status-filtering/acceptance.feature`

## Risks and Mitigations

- Risk: Filter logic accidentally mutates list state.
  Mitigation: Use derived view computation and keep mutations isolated to existing todo actions.
- Risk: Priority ordering regression under `Active` filter.
  Mitigation: Reuse existing ordering mechanism before/while filtering and validate with targeted scenario.
- Risk: UI ambiguity about active filter.
  Mitigation: Provide clear selected-state visual treatment and verify across desktop/mobile layouts.

## Explicit Non-Goals Enforcement

- Do not add custom filters.
- Do not add priority-filtering controls.
- Do not add search, manual sort controls, due-date filters, tags, or backend integration.
- Do not persist selected filter state across reload.
