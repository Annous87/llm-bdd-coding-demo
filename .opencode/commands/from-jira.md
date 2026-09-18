# Rule: Start BDD Workflow from Jira Issue (OpenCode)

## Goal

Guide OpenCode to start this repository's BDD workflow from an
existing Jira Cloud issue retrieved via the Atlassian MCP server.

Jira is the business requirements and PM communication channel.

This command analyzes requirements and generates BDD specification
artifacts when requirements are sufficiently complete.

Usage:

`/from-jira <ISSUE-KEY>`

## Scope and Safety

Jira retrieval and analysis in this command MUST be read-only.

Never modify:

- Jira issues
- Jira comments
- Jira fields
- Jira attachments
- Jira links
- Jira workflow status
- any other Jira record

Do not implement application code in this command.

Do not modify GitHub pull requests.

Do not commit or push.

Do not invent requirements.

Jira feedback is handled separately through:

`/sync-jira <ISSUE-KEY> <EVENT>`

This command MUST NOT automatically invoke `/sync-jira`.

A Jira write requires a separate explicit `/sync-jira` interaction
and its mandatory human confirmation gate.

---

## Process

### 1. Retrieve Jira Issue and Comments (Read-Only)

Use Atlassian MCP to fetch the issue identified by `<ISSUE-KEY>`.

Retrieve all relevant available requirement context, including:

- issue key
- summary
- description
- issue type
- status
- user story
- acceptance criteria
- business rules
- constraints
- relevant technical context
- relevant Jira comments
- previous BDD clarification comments
- subsequent PM / PO / BA / SME clarification answers
- human question classification overrides

Recognize previous BDD feedback markers including:

`[BDD] CLARIFICATION REQUIRED`

`[BDD] OPTIONAL CLARIFICATIONS`

`[BDD] CLASSIFICATION OVERRIDE`

If issue or comment retrieval fails because of authentication,
permissions, issue not found, timeout, MCP failure, or another
environmental problem:

`JIRA RETRIEVAL: BLOCKED`

Report the reason and stop.

Never infer missing Jira content.

---

### 2. Extract Explicit Requirements Only

Capture only information explicitly supported by:

1. the original Jira issue content, and
2. relevant Jira clarification comments.

Clearly mark information as missing or ambiguous when it is not
explicitly available.

Never invent:

- expected behavior
- acceptance criteria
- business rules
- persistence behavior
- UI behavior
- constraints
- edge cases
- scope
- technical requirements

A previous BDD-generated question is NOT requirement evidence.

A question becomes resolved only when Jira contains an explicit
answer or clarification that resolves it.

A human classification override changes whether an unresolved
question blocks the workflow.

It does NOT answer the question.

---

### 3. Resolve Previous Clarifications

Inspect relevant Jira comments for answers to questions previously
raised by the BDD workflow.

For each previous clarification question, classify it as:

- RESOLVED
- PARTIALLY RESOLVED
- UNRESOLVED

A clarification answer may resolve a previously blocking question.

If a Jira comment answers only part of a question, preserve the
remaining ambiguity.

Do not require the user to manually copy Jira answers into OpenCode
when those answers are already available through Jira.

When a Jira clarification comment materially contributes to a
requirement, preserve its origin for later PRD traceability.

Example requirement sources:

- Jira original issue
- Jira acceptance criteria
- Jira clarification comment
- user clarification supplied during the current command flow

A BDD-generated question itself is not requirement evidence.

---

### 4. Analyze Completeness for BDD

Evaluate whether the complete explicit requirement set is sufficient
to produce faithful executable BDD acceptance scenarios.

The purpose of this analysis is NOT to eliminate every possible
ambiguity.

The purpose is to determine whether remaining ambiguity prevents a
reliable executable acceptance contract.

Every unresolved question MUST be classified as either:

- BLOCKING
- OPTIONAL

---

## Requirement Question Classification

### A. Blocking Questions

A question is BLOCKING only when its answer is necessary to produce a
faithful executable BDD specification.

Typical blocking ambiguity may affect:

- observable acceptance behavior
- core business rules
- persistence behavior
- inclusion or exclusion scope
- contradictory requirements
- materially different expected outcomes
- materially different implementation scope when that scope affects
  acceptance behavior

Blocking questions prevent specification generation.

Do not downgrade a genuinely required requirement to optional merely
to allow the workflow to proceed.

---

### B. Optional Questions

A question is OPTIONAL when answering it would be useful to the PM,
PO, BA, SME, designer, or engineering team, but the existing explicit
requirements already provide enough information to create a faithful
executable BDD specification.

Optional questions MUST NOT block specification generation.

Optional questions MUST NOT give the agent permission to invent
requirements.

If an optional detail is unspecified, omit that detail from the
acceptance contract unless technically unavoidable.

Potential examples may include:

- presentation preferences
- exact wording preferences
- minor UX preferences

but ONLY when those details are not themselves required observable
behavior.

Classification always depends on the actual Jira requirement.

No category of information is inherently optional.

For example, exact button wording is BLOCKING if Jira explicitly makes
that wording part of acceptance.

---

## Stable Question IDs

Every unresolved clarification question MUST receive a stable
identifier:

`BDD-Q<n>`

Examples:

- `BDD-Q1`
- `BDD-Q2`
- `BDD-Q3`

Once assigned to a specific question for a Jira issue, the identifier
must remain associated with that question across subsequent runs.

Do not renumber existing questions merely because another question was
resolved, removed, or reclassified.

When a materially new question is discovered, assign the next unused
identifier.

Use these identifiers in:

- final `/from-jira` reports
- Jira clarification feedback
- PM clarification tracking
- classification overrides
- PRD traceability where relevant

Example:

Blocking questions:

- `BDD-Q1`: Must the cleared state persist after page reload?

Optional questions:

- `BDD-Q2`: Is there preferred wording for the action?

When previous BDD clarification comments already contain stable
question IDs, reuse those IDs.

Never assign an existing `BDD-Q<n>` identifier to a different
question.

For a new question, inspect previous BDD question IDs in Jira and use
the next unused identifier.

Never renumber resolved historical questions.

---

## Human Question Classification Override

The initial BLOCKING / OPTIONAL classification is proposed by the BDD
analysis.

An authorized human stakeholder may explicitly override that
classification through a Jira comment.

Recognize the following format:

```text
[BDD] CLASSIFICATION OVERRIDE

BDD-Q1: OPTIONAL
BDD-Q3: BLOCKING
```

Supported override values are:

- BLOCKING
- OPTIONAL

A valid human classification override takes precedence over the
agent's previous classification.

Record the override and its Jira comment source in PRD traceability.

### BLOCKING -> OPTIONAL

Changing a question from BLOCKING to OPTIONAL means the unanswered
question no longer prevents specification generation.

It does NOT authorize the agent to invent an answer.

It does NOT define the missing behavior.

It does NOT authorize additional acceptance criteria.

Behavior that remains unspecified after an OPTIONAL override must be
omitted from the acceptance contract unless explicitly supported by
other requirement evidence.

### OPTIONAL -> BLOCKING

Changing a question from OPTIONAL to BLOCKING causes the completeness
gate to stop when that question remains unresolved.

### Resolved Questions

A classification override does not replace an explicit requirement
answer.

If the stakeholder provides an actual answer to the question, evaluate
the answer normally and mark the question RESOLVED when appropriate.

A resolved question no longer participates in the BLOCKING / OPTIONAL
gate.

### Safety

A BDD-generated Jira comment MUST NOT be interpreted as a human
classification override.

Do not infer an override from vague language.

Statements such as:

- "not important"
- "don't worry about it"
- "we can decide later"

must not automatically change classification unless the stakeholder's
intent is explicit enough to identify the question and desired
classification.

When classification intent is ambiguous, preserve the existing
classification.

---

## 5. Produce Formal Requirements Completeness Result

Before generating specification artifacts, produce the following
structured result:

`REQUIREMENTS COMPLETENESS: SUFFICIENT | INSUFFICIENT`

### Blocking questions

- `BDD-Q<n>`: `<question>`

or:

`None`

### Optional questions

- `BDD-Q<n>`: `<question>`

or:

`None`

`CLARIFICATION SYNC ELIGIBLE: YES | NO`

Apply these rules:

### Case 1 — Blocking questions exist

If one or more unresolved blocking questions exist:

`REQUIREMENTS COMPLETENESS: INSUFFICIENT`

`CLARIFICATION SYNC ELIGIBLE: YES`

The workflow is blocked.

### Case 2 — Only optional questions exist

If there are no blocking questions but one or more optional questions:

`REQUIREMENTS COMPLETENESS: SUFFICIENT`

`CLARIFICATION SYNC ELIGIBLE: YES`

The workflow may continue.

### Case 3 — No questions remain

If there are no blocking or optional questions:

`REQUIREMENTS COMPLETENESS: SUFFICIENT`

`CLARIFICATION SYNC ELIGIBLE: NO`

The workflow may continue.

---

## 6. Completeness Gate

### If Requirements Are Insufficient

If:

`REQUIREMENTS COMPLETENESS: INSUFFICIENT`

then:

- report every blocking question with its stable `BDD-Q<n>` ID
- report optional questions separately with their stable IDs
- do not create specification artifacts
- do not update existing specification artifacts
- do not implement application code
- do not modify Jira
- do not modify GitHub
- stop

Report:

`SPECIFICATION GENERATION: NOT RUN`

The blocking questions may subsequently be communicated to the PM
through:

`/sync-jira <ISSUE-KEY> clarification`

This command itself MUST NOT post those questions to Jira.

---

### If Requirements Are Sufficient

If:

`REQUIREMENTS COMPLETENESS: SUFFICIENT`

then specification generation may proceed.

Optional questions MUST remain visible in the final report but MUST
NOT prevent specification generation.

If optional questions exist, they may subsequently be communicated
through:

`/sync-jira <ISSUE-KEY> clarification`

Do not invent answers to optional questions when generating the
specification.

Unspecified optional behavior must remain outside the acceptance
contract.

---

## 7. Generate Specification Artifacts

When the completeness gate passes, generate:

`spec/<ISSUE-KEY>-<feature-slug>/`

This is the required convention for new Jira-driven work. Do not create new date-based spec directories for Jira-driven issues.

containing:

- `prd.md`
- `acceptance.feature`
- `implementation-plan.md`

If a matching specification directory already exists, use the
existing directory rather than creating a duplicate.

Do not create multiple specification directories for the same Jira
issue.

---

## Output Requirements

### `prd.md`

The PRD MUST contain:

- Jira issue key
- feature context
- explicit scope
- explicit requirements
- relevant constraints
- unresolved blocking questions, if any
- unresolved optional questions, if any
- relevant resolved clarification history
- relevant human classification overrides
- Traceability section

The Traceability section MUST distinguish requirement origin.

At minimum distinguish:

- Original Jira issue
- Jira acceptance criteria
- Jira clarification comment
- User clarification supplied during the command flow
- Human classification override, when relevant

Do not represent a clarification as part of the original Jira issue
when it originated later in a comment.

Do not represent a classification override as an answer to the
underlying requirement question.

Do not represent agent inference as requirement evidence.

Where useful, preserve stable `BDD-Q<n>` identifiers in traceability.

---

### `acceptance.feature`

The acceptance feature is the executable behavioral contract.

It MUST include the Jira issue key as a top-level tag.

Example:

```gherkin
@SR-145483
Feature: ...
```

Scenarios MUST be based only on explicit requirements supported by:

- Jira issue content
- Jira acceptance criteria
- Jira clarification answers
- explicit user clarification supplied during this command flow

Do not create scenarios for optional questions that remain unanswered.

Do not turn a BLOCKING -> OPTIONAL classification override into an
acceptance requirement.

Do not add speculative:

- edge cases
- UX behavior
- business rules
- persistence behavior
- validation rules
- error handling

unless explicitly supported by requirement evidence.

Acceptance behavior is the source of truth for observable behavior.

---

### `implementation-plan.md`

The implementation plan MUST:

- follow repository BDD workflow conventions
- align with `acceptance.feature`
- remain inside explicitly supported scope
- avoid unrelated refactoring
- avoid speculative functionality

If implementation-plan details conflict with acceptance behavior:

`acceptance.feature` wins.

---

## 8. Approved Specification Protection

Before incorporating new Jira clarification comments or classification
overrides into an existing specification, determine whether Human
Gate 1 has already approved the specification for the current
implementation cycle.

### Before Human Gate 1 Approval

Jira clarification answers may:

- resolve blocking questions
- resolve optional questions
- update requirement understanding
- cause specification artifacts to be generated or updated

Human classification overrides may:

- change BLOCKING to OPTIONAL
- change OPTIONAL to BLOCKING
- change the requirements completeness result

Preserve traceability to the clarification or override source.

### After Human Gate 1 Approval

The approved `acceptance.feature` becomes the behavioral contract for
the active implementation cycle.

A later Jira comment MUST NOT silently change that contract.

A later classification override MUST NOT silently change the approved
behavioral contract when the override affects observable acceptance
behavior.

If a later Jira comment or classification override introduces,
removes, or changes observable behavior relative to the approved
specification, report:

`REQUIREMENT CHANGE DETECTED`

Explain which requirement changed.

Report:

`SPECIFICATION RE-APPROVAL REQUIRED: YES`

The specification must be updated and Human Gate 1 must be performed
again before implementation proceeds under the changed requirement.

Do not silently implement the changed behavior under the previous
approval.

Do not treat the previous Gate 1 approval as approval of the changed
specification.

---

## 9. Repository Methodology

Follow the BDD methodology defined in `AGENTS.md`.

Maintain the responsibility model:

Jira
= business requirements and PM communication

`spec/`
= executable requirement contract

OpenCode
= analysis and orchestration

Playwright MCP
= behavioral validation

GitHub
= code review and human approval evidence

`/sync-jira`
= controlled Jira feedback channel

Keep acceptance behavior as the source of truth.

If implementation-plan details conflict with acceptance behavior,
acceptance behavior wins.

---

## 10. Final Report

Always return a structured result.

### Jira

- Issue: `<ISSUE-KEY>`
- Jira retrieval: PASS / BLOCKED
- Relevant Jira clarification comments found: YES / NO
- Human classification overrides found: YES / NO

### Requirements

`REQUIREMENTS COMPLETENESS: SUFFICIENT | INSUFFICIENT`

Blocking questions:

- `BDD-Q<n>`: `<question>`
- or `None`

Optional questions:

- `BDD-Q<n>`: `<question>`
- or `None`

Resolved clarification questions:

- `BDD-Q<n>`: RESOLVED
- or `None`

Human classification overrides:

- `BDD-Q<n>`: BLOCKING -> OPTIONAL
- `BDD-Q<n>`: OPTIONAL -> BLOCKING
- or `None`

`CLARIFICATION SYNC ELIGIBLE: YES | NO`

### Specification

- Specification generation: PASS / NOT RUN / BLOCKED
- Directory: `<path>` or `N/A`
- `prd.md`: CREATED / UPDATED / UNCHANGED / NOT RUN
- `acceptance.feature`: CREATED / UPDATED / UNCHANGED / NOT RUN
- `implementation-plan.md`: CREATED / UPDATED / UNCHANGED / NOT RUN

### Approval Protection

- Existing Human Gate 1 approval detected: YES / NO
- Requirement change detected: YES / NO
- Specification re-approval required: YES / NO

### Workflow Outcome

If blocking questions remain:

`BDD INTAKE: BLOCKED`

`Next step: resolve blocking requirements.`

If clarification sync is eligible:

`Jira feedback available through: /sync-jira <ISSUE-KEY> clarification`

If requirements are sufficient and specification generation succeeds:

`BDD INTAKE: PASS`

`Next step: human review of the generated BDD specification.`

---

## Stop Condition

After generating specification files, stop and allow human review.

Do not implement the feature automatically.

Do not execute `/implement-bdd`.

Do not execute `/sync-jira`.

Do not approve the specification.

Do not modify Jira.

Do not commit or push.

Wait for explicit user instruction before any implementation or Jira
write steps.

---

## Invariant

The workflow MUST preserve:

`JIRA REQUIREMENT + EXPLICIT CLARIFICATIONS`

`-> COMPLETENESS ANALYSIS`

`-> STABLE BDD-Q IDs`

`-> BLOCKING / OPTIONAL CLASSIFICATION`

`-> HUMAN CLARIFICATION / CLASSIFICATION OVERRIDE`

`-> EXECUTABLE BDD SPECIFICATION`

`-> HUMAN REVIEW`

No missing requirement may be silently invented to move the workflow
forward.

Changing a question from BLOCKING to OPTIONAL changes whether it
blocks the workflow.

It does not answer the question.
