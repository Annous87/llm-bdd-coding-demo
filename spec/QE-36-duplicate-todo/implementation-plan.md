# Implementation Plan: QE-36 Duplicate Todo

## Scope Guardrails
- Implement only behavior explicitly defined in `acceptance.feature`.
- Do not add extra duplicate triggers beyond double click.
- Do not add speculative validation, persistence, or UX behavior not present in requirements.

## Planned Steps
1. Inspect current Todo domain model and rendering flow to confirm existing fields include title, priority, and active/completed state.
2. Add a duplication action path triggered by double click on a Todo item.
3. Implement duplication rules:
   - copy title from source Todo
   - copy priority from source Todo
   - set duplicated Todo to active
   - insert duplicated Todo at the top of the list
4. Ensure duplicated Todo gets a new unique identity (implementation necessity, not new requirement).
5. Verify behavior manually against `acceptance.feature` scenario.
6. Run quality gates:
   - `npm run lint`
   - `npm run build`

## Mapping to Acceptance
- Trigger: step 2 maps to "When I double click that Todo item".
- Placement: step 3 maps to "added at the top of the list".
- Field copy/reset: step 3 maps to title/priority copy and active state.

## Out of Scope
- Keyboard shortcuts or context-menu duplicate actions.
- Changes to Jira, GitHub workflow, or BDD approval automation.
- Additional business rules not explicitly stated in requirements.
