# AGENTS.md

This document provides OpenCode-native guidance for working in this repository.

## Project Overview

This is a Todo application built with Vite + React + TypeScript using a BDD (Behavior-Driven Development) workflow.

Feature work is specified in `spec/` with:
- PRD documents
- Gherkin acceptance criteria
- implementation plans

## Development Commands

```bash
npm run dev        # Start development server (usually on port 5173/5174)
npm run build      # TypeScript check + production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Architecture

- Components live in `src/components/`, with paired `.tsx` + `.module.css` files.
- State is managed with React hooks (`useState`) at the App level.
- Persistence uses localStorage via `src/hooks/useLocalStorage.ts`.
- Types are defined in `src/types/`.
- Styling uses CSS Modules and follows a minimalist UI direction.

## BDD + PRD Workflow

Use this sequence for feature work:

1. Create or refine the PRD in `spec/[date]-[feature]/prd.md`.
2. Define acceptance criteria in Gherkin in `spec/[date]-[feature]/acceptance.feature`.
3. Build an implementation plan in `spec/[date]-[feature]/implementation-plan.md`.
4. Implement in small increments aligned to the plan.
5. Validate behavior end-to-end against acceptance scenarios.

OpenCode command references:
- `/create-prd` for drafting/refining PRDs.
- `/planning-tasks` for implementation task breakdown and dependency ordering.

## Acceptance Source of Truth

- `acceptance.feature` is the source of truth for observable behavior.
- If implementation-plan details conflict with acceptance behavior, follow acceptance behavior.
- If acceptance behavior appears stricter than PRD requirements, flag it explicitly before changing specs or implementation.

## Acceptance Execution (Playwright MCP)

- Execute acceptance scenarios against a running app using Playwright MCP browser interaction.
- Do not generate local Playwright test files when validating BDD acceptance unless explicitly requested.
- Prefer scenario-by-scenario validation that maps directly to Gherkin steps and expected outcomes.

Environment note:
- In some containerized or remote dev setups, the app may be reachable via a network IP/hostname instead of `localhost`. Use the URL exposed by the running dev server.

## Quality Gates

Before considering feature work complete:
- Run `npm run lint`.
- Run `npm run build`.
- Record pass/fail results and explain failures, including whether they are implementation issues or environment/toolchain issues.

## Current Baseline Status (from existing project notes)

- TodoInput component: complete
- TodoItem component: complete
- useLocalStorage hook: complete
- Main App integration: pending/iterative by feature
- TodoList component: pending/iterative by feature

## Technical Conventions

- No Redux: keep state management at App level and pass via props.
- localStorage key convention: `simple-todo-items`.
- Keep component responsibilities clear (input, item behavior, list rendering, persistence).
- Avoid introducing scope beyond current PRD and acceptance criteria.
