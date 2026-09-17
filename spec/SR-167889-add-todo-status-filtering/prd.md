# Product Requirements Document: Todo Status Filtering

## Introduction / Overview

This feature adds status-based filtering to the Todo application so users can focus on relevant work by viewing all items, only active items, or only completed items. The selected filter affects visibility only and does not change underlying todo data.

## Traceability

- Jira issue key: `SR-167889`
- Source issue summary: `[TestBDD]Add todo status filtering`

## Requirements Origin

### Requirements from Jira

- The app must provide three filters: `All`, `Active`, and `Completed`.
- `All` must be selected by default when the application opens.
- `All` displays all todos.
- `Active` displays only not completed todos.
- `Completed` displays only completed todos.
- Changing filters must not delete todos, change completion status, or reorder todos.
- Filtering controls visibility only.
- Filtering must apply immediately on filter selection.
- Existing high-priority ordering behavior must remain intact within filtered results.
- Existing localStorage persistence must continue to work.
- UI must show three visible controls: `All | Active | Completed`.
- The selected filter must be visually distinguishable.

### Clarifications Supplied by User During This Command Flow

- No additional product-behavior clarifications were supplied beyond Jira content.

## User Story (from Jira)

As a user of the Todo application, I want to filter my todos by completion status, so that I can focus on either outstanding or completed tasks.

## Functional Requirements

1. The system must present `All`, `Active`, and `Completed` filter options.
2. On application open, the system must default to `All`.
3. Under `All`, the system must render all todos regardless of completion state.
4. Under `Active`, the system must render only todos with incomplete status.
5. Under `Completed`, the system must render only todos with completed status.
6. Switching filters must not mutate todo entities (no deletion, completion toggle, or reordering side effects).
7. If a filter yields no results, the application must remain usable.
8. For filtered active results, existing high-priority-before-normal ordering must be preserved.

## Business Rules

- Filter selection controls visibility only.
- Underlying todo dataset remains unchanged when switching filters.
- Existing high-priority ordering semantics continue to apply.

## Constraints

- Continue using current React architecture.
- Do not introduce a backend.
- Keep existing localStorage mechanism for todos.
- Do not introduce a new state-management framework solely for this feature.
- Do not extend scope to custom filters, priority filtering, search, sort controls, due dates, or tags.
- Do not persist selected filter across app close/reload.

## Scope

### In Scope

- `All` / `Active` / `Completed` filters.
- Filtering by completion status.
- Immediate UI response to filter changes.
- Preservation of existing high-priority ordering behavior in filtered lists.

### Out of Scope

- Additional/custom filters.
- Filtering by priority.
- Search and sorting controls.
- Due dates and tags/categories.
- Backend/API changes.
- Persisting selected filter across reload.

## Acceptance Criteria Source

Acceptance behavior is defined in `acceptance.feature` and is derived from Jira AC1-AC7 only.

## Missing or Ambiguous Information

- Missing: None that block BDD acceptance scenario definition.
- Ambiguous but non-blocking: exact visual placement of filter controls (`above or below` list is acceptable per Jira), and exact styling details are implementation-specific.
