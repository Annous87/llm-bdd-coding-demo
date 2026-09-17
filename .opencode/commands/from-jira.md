# Rule: Start BDD Workflow from Jira Issue (OpenCode)

## Goal

Guide OpenCode to start this repository's BDD workflow from an existing Jira Cloud issue retrieved via the Atlassian MCP server.

Usage:

`/from-jira <ISSUE-KEY>`

## Scope and Safety

- Jira retrieval and analysis must be read-only.
- Never modify Jira issues, comments, fields, attachments, or linked records.
- Do not implement application code in this command.

## Process

1. **Retrieve Jira Issue (Read-Only)**
   - Use Atlassian MCP to fetch the issue identified by `<ISSUE-KEY>`.
   - If issue retrieval fails (auth, permissions, not found, timeout), stop and report the failure clearly.

2. **Extract Explicit Requirements Only**
   - Capture only information explicitly supported by Jira content:
     - issue key
     - summary
     - description
     - issue type
     - status
     - user story (if present)
     - acceptance criteria (if present)
     - business rules
     - constraints
     - relevant technical context
   - Clearly mark any field as missing or ambiguous when not explicitly present.

3. **Analyze Completeness for BDD**
   - Evaluate whether the extracted information is sufficient to produce reliable BDD acceptance scenarios.
   - Never invent missing requirements, acceptance criteria, expected behavior, business rules, constraints, or scope.

4. **Classify Missing Information**
   - **A. Blocking questions**: answers required before reliable acceptance scenarios can be produced.
   - **B. Non-blocking considerations**: useful clarifications that are not strictly required for acceptance definition.

5. **Gate on Blocking Information**
   - If any blocking information is missing:
     - stop the workflow
     - present blocking questions to the user
     - do not create `acceptance.feature`
     - do not implement code

6. **Proceed After Clarification**
   - After user clarification resolves blocking gaps, generate:

     `spec/<ISSUE-KEY>-<feature-slug>/`
     - `prd.md`
     - `acceptance.feature`
     - `implementation-plan.md`

## Output Requirements

### `prd.md`

- Must include a **Traceability** section containing the Jira issue key.
- Must clearly distinguish:
  - requirements originating from Jira
  - clarifications supplied by the user

### `acceptance.feature`

- Must include the Jira issue key as a top-level tag, for example:

```gherkin
@SR-145483
Feature: ...
```

- Must be based only on explicit Jira content plus user clarifications provided during this command flow.

### `implementation-plan.md`

- Must follow repository BDD workflow conventions and acceptance behavior.
- Must align to `acceptance.feature` as source of truth for observable behavior.

## Repository Methodology

- Follow the BDD methodology defined in `AGENTS.md`.
- Keep acceptance behavior as the source of truth.
- If implementation-plan details conflict with acceptance behavior, acceptance behavior wins.

## Stop Condition

After generating specification files, stop and allow human review.

- Do not implement the feature automatically.
- Wait for explicit user instruction before any implementation steps.
