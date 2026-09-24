# Implementation Plan: QE-35 Duplicate Todo

## Scope Guardrails
- Implement only behavior explicitly defined in `acceptance.feature`.
- Do not add extra duplicate triggers beyond double click.
- Do not add speculative validation, persistence, positioning, or UX behavior not present in requirements.

## Planned Steps
1. Inspect current Todo data flow to confirm existing fields include title, priority, and active/completed state.
2. Add a duplication action path triggered by double click on a Todo item.
3. Implement duplication rules:
   - copy title from source Todo
   - copy priority from source Todo
   - set duplicated Todo to active
   - assign a new unique identity to duplicated Todo
4. Ensure the duplicated Todo is present in the rendered list after duplication.
5. Verify behavior manually against `acceptance.feature` scenario.
6. Run quality gates:
   - `npm run lint`
   - `npm run build`

## Mapping to Acceptance
- Trigger: step 2 maps to "When I double click that Todo item".
- Duplication outcome: step 4 maps to "a duplicated Todo item is added to the list".
- Field copy/reset: step 3 maps to title/priority copy and active state.

## Out of Scope
- Exact insertion position of duplicated Todo in the list (`BDD-Q2` unresolved and explicitly OPTIONAL).
- Keyboard shortcuts or context-menu duplicate actions.
- Changes to Jira, GitHub workflow, or BDD approval automation.
- Additional business rules not explicitly stated in requirements.
