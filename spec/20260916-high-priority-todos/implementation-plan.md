# Implementation Plan: High Priority Todos

## Overview

This plan implements high-priority support for todo items in a phased, BDD-aligned way. Work is ordered to establish data model and persistence first, then UI interactions, then rendering/sorting behavior, and finally validation against acceptance scenarios.

## Dependency Order

1. Data model update
2. Persistence compatibility update
3. Create/edit UI controls for priority
4. Priority-aware rendering and sorting
5. Visual distinction styling
6. End-to-end validation against acceptance criteria

## Phased Tasks

### 1) Extend todo domain model with priority (High)

- Add a priority field to todo item type (`high`/`normal` or boolean equivalent).
- Ensure default for new and legacy items is normal priority when unspecified.
- Confirm all app-level state operations compile with the updated type.

Related files (expected):

- `src/types/*`
- `src/App.tsx`
- Any todo-related interfaces used by components/hooks

Acceptance mapping:

- Supports scenarios: create normal, create high, update normal->high, update high->normal.

### 2) Update localStorage persistence and backward compatibility (High)

- Persist priority on save using existing storage key and structure conventions.
- On load, map existing records without priority to normal priority.
- Preserve deterministic behavior on refresh/load.

Related files (expected):

- `src/hooks/useLocalStorage.ts`
- `src/App.tsx` (or state hydration layer)

Acceptance mapping:

- Supports scenarios: persist priority after refresh, support many high-priority items.

### 3) Add priority controls in create flow (High)

- Add UI control to set high priority when adding a new todo.
- Ensure default create behavior remains normal priority unless explicitly enabled.
- Wire control state into todo creation handler.

Related files (expected):

- `src/components/TodoInput.tsx`
- `src/components/TodoInput.module.css`
- `src/App.tsx`

Acceptance mapping:

- Supports scenarios: create normal-priority todo, create high-priority todo.

### 4) Add priority toggle/edit controls for existing items (High)

- Add per-item control to mark normal -> high.
- Add per-item control to remove high -> normal.
- Ensure toggling updates state and persists via existing flow.

Related files (expected):

- `src/components/TodoItem.tsx`
- `src/components/TodoItem.module.css`
- `src/App.tsx`

Acceptance mapping:

- Supports scenarios: update normal->high, remove high priority.

### 5) Implement priority-aware ordering and visual distinction (Medium)

- Render high-priority items before normal-priority items.
- Preserve relative insertion/order within each priority group.
- Add clear visual treatment for high-priority items, aligned with current UI style.

Related files (expected):

- `src/components/TodoList.tsx` (if present)
- `src/components/TodoItem.tsx`
- `src/components/TodoItem.module.css`
- `src/App.tsx` (sorting strategy if centralized)

Acceptance mapping:

- Supports scenarios: high before normal, stable relative ordering, visual distinction, many high-priority items.

### 6) Verify empty-state parity and regression safety (Medium)

- Confirm existing empty-list behavior is unchanged.
- Validate no new priority-specific validation/error flows were introduced.
- Check behavior on desktop and mobile viewport widths.

Related files (expected):

- `src/components/TodoList.tsx`
- Existing empty-state render location(s)

Acceptance mapping:

- Supports scenario: empty-state behavior remains unchanged.

### 7) Execute BDD acceptance validation and finalize (High)

- Run through all scenarios in `acceptance.feature` against a running app via Playwright MCP.
- Record pass/fail notes and fix implementation mismatches.
- Run project checks (`npm run lint`, `npm run build`) before completion.

Related files (expected):

- `spec/20260916-high-priority-todos/acceptance.feature`
- Code files touched in prior phases

Acceptance mapping:

- Covers full feature completion metric: all BDD acceptance scenarios pass.

## Risks and Mitigations

- Sorting instability risk: implement deterministic grouping and preserve within-group order.
- Backward compatibility risk for old localStorage data: normalize missing priority to normal.
- UI clarity risk: ensure high-priority indicator is consistently visible in both desktop and mobile layouts.

## Validation Strategy (Scenario-Driven)

- Use `spec/20260916-high-priority-todos/acceptance.feature` as source of truth.
- Validate each scenario directly in UI behavior terms (creation, toggle, order, persistence, empty state).
- Avoid coupling acceptance checks to implementation details (internal variable names or component internals).
