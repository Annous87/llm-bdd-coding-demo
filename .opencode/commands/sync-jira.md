# Sync BDD Workflow State to Jira

Synchronize verified BDD workflow events back to Jira so Product
Managers and other Jira users can follow engineering progress without
inspecting GitHub or the local repository.

Usage:

`/sync-jira <ISSUE-KEY> <EVENT>`

Supported events:

* clarification
* spec-approved
* implementation-approved
* merged

---

## Core Principles

Jira is the business requirements and PM communication channel.

Git/spec is the executable technical source of truth.

GitHub is the source of truth for pull requests, commits, review,
approval evidence, and merge state.

This command MAY create one Jira comment, but only through the
confirmation workflow defined below.

It MUST NOT:

* modify application or specification files
* modify Jira descriptions, acceptance criteria, fields, status,
  attachments, links, or other Jira records
* modify Git history or GitHub state
* commit, push, create or modify PRs, or merge
* invent requirements, answers, validation results, or approval evidence
* silently change question classification

---

# Jira Write Confirmation

Every Jira write follows:

`READ-ONLY ANALYSIS`

`-> EVIDENCE VERIFICATION`

`-> DUPLICATE CHECK`

`-> EXACT COMMENT PREVIEW`

`-> AWAITING CONFIRMATION`

`-> CONFIRM JIRA WRITE <ISSUE-KEY>`

`-> REVERIFY`

`-> ONE EXACT COMMENT`

`-> VERIFY WRITE`

No other path authorizes a Jira mutation.

## Phase 1 — Preview

Before proposing a write:

1. Validate the issue and event.
2. Read required Jira context.
3. Verify required evidence.
4. Check duplicates.
5. Construct the exact Jira comment.

Display:

`JIRA WRITE PREVIEW`

* Jira issue: `<ISSUE-KEY>`
* Event: `<EVENT>`

`Proposed comment:`

`<exact complete comment>`

Then:

`JIRA SYNC: AWAITING CONFIRMATION`

`No Jira write has been performed.`

`To authorize this exact comment: CONFIRM JIRA WRITE <ISSUE-KEY>`

Then STOP.

The preview becomes the pending Jira write.

## Pending Confirmation

A pending preview is bound to:

* one Jira issue
* one event
* one exact comment

The preview is immutable.

Only:

`CONFIRM JIRA WRITE <ISSUE-KEY>`

for the matching pending preview authorizes Phase 2.

Generic responses such as `yes`, `ok`, `proceed`, `approved`, or
`do it` do not authorize a write.

If no matching pending preview exists:

`JIRA WRITE: NOT AUTHORIZED`

Reason:

`No matching pending Jira write preview exists.`

A new `/sync-jira <ISSUE-KEY> <EVENT>` invocation replaces the previous
pending preview for that issue/event.

## Phase 2 — Confirmed Write

After valid confirmation:

1. Resolve the matching pending preview.
2. Re-run the relevant verification rules.
3. Re-run duplicate protection.
4. Confirm the exact preview remains valid.

If valid, post exactly the previewed comment and verify successful
creation.

If state changed:

`JIRA WRITE: CANCELLED`

Reason:

`State changed after preview. New preview required.`

Do not regenerate a different comment under the old confirmation.

The pending confirmation is consumed after:

* SUCCESS
* SKIPPED
* CANCELLED
* BLOCKED
* replacement by a new preview

A consumed confirmation cannot be reused.

---

# 1. Validate Input

Require exactly:

* one Jira issue key
* one supported event

Supported events:

* clarification
* spec-approved
* implementation-approved
* merged

Invalid or incomplete input stops the command without a Jira write.

---

# 2. Jira Verification Rules

For every event:

1. Retrieve the requested Jira issue through Atlassian MCP.
2. Verify the issue key matches the requested issue.
3. Read all relevant available Jira context.
4. Read current comments before duplicate analysis.
5. Never infer unavailable Jira information.

Relevant context includes:

* summary
* description
* acceptance criteria
* relevant fields
* comments
* previous BDD workflow comments
* clarification questions and answers
* classification overrides

Recognize:

`[BDD] CLARIFICATION REQUIRED`

`[BDD] OPTIONAL CLARIFICATIONS`

`[BDD] CLASSIFICATION OVERRIDE`

`[BDD] SPECIFICATION APPROVED`

`[BDD] IMPLEMENTATION APPROVED`

`[BDD] MERGED`

If required Jira evidence cannot be retrieved:

`JIRA SYNC: BLOCKED`

---

# 3. GitHub Verification Rules

These rules apply whenever an event requires GitHub evidence.

## Repository Resolution

Resolve repository context dynamically from:

`git remote get-url origin`

Derive:

`<ORIGIN-OWNER>/<ORIGIN-REPO>`

Support normal HTTPS and SSH GitHub remote formats.

`origin` is the only valid repository context.

Never use `upstream` as the PR repository.

Never hard-code:

* GitHub username
* organization
* repository owner
* repository name

Scope all GitHub queries explicitly to the resolved origin repository.

If origin cannot be resolved safely:

`EVIDENCE VERIFICATION: BLOCKED`

## PR Resolution

When an event depends on a PR, verify that the relevant PR:

* belongs to origin
* corresponds to the requested Jira issue/current workflow branch
* has the expected head branch
* targets the origin repository
* targets `main`

When the workflow requires an open PR, exactly one relevant open PR
must exist.

Do not silently select between ambiguous PRs.

## Current-State Verification

Evidence must represent the current state being synchronized.

Do not rely solely on:

* previous command output
* previous textual reports
* old approval comments
* local Git state
* branch deletion
* historical Jira markers

Approval evidence must satisfy the freshness semantics of the
corresponding approval gate.

A historical approval may describe an older state but cannot authorize
a newer state.

## Verification Failure

If required GitHub evidence cannot be independently verified:

`EVIDENCE VERIFICATION: BLOCKED`

`JIRA SYNC: BLOCKED`

Do not prepare an approval or merge comment.

These common rules do not replace event-specific verification below.

---

# 4. Stable Clarification Question IDs

Every clarification question uses:

`BDD-Q<n>`

Rules:

1. Reuse the same ID for the same underlying question.
2. Assign new questions the next unused ID.
3. Never renumber resolved or removed questions.
4. Never reuse an ID for a different question.

Use stable IDs in Jira comments, reports, answers, overrides, and
traceability.

---

# 5. Human Classification Overrides

A human stakeholder may explicitly override a question classification:

```text id="fjk61f"
[BDD] CLASSIFICATION OVERRIDE

BDD-Q1: OPTIONAL
BDD-Q3: BLOCKING
```

Supported values:

* BLOCKING
* OPTIONAL

A valid explicit human override takes precedence over the previous
classification.

BDD-generated comments are not human overrides.

Do not infer overrides from vague language.

`BLOCKING -> OPTIONAL` removes the workflow blocker but does not answer
the question or authorize invented behavior.

`OPTIONAL -> BLOCKING` makes the unresolved question a workflow
blocker.

An explicit answer and a classification override are different.

Resolved questions no longer participate in the completeness gate.

`/from-jira <ISSUE-KEY>` is responsible for re-evaluating requirements
after answers or overrides.

---

# 6. Clarification Event

For:

`/sync-jira <ISSUE-KEY> clarification`

Use the current requirements completeness analysis based on Jira
requirements, human comments, answers, and valid overrides.

Do not invent new questions during synchronization.

## Blocking Questions Exist

Prepare:

```text id="hm7c59"
[BDD] CLARIFICATION REQUIRED

The BDD workflow requires clarification before the executable
specification can proceed.

Blocking questions:

- BDD-Q1: <question>
- BDD-Q2: <question>

Optional questions:

- BDD-Q3: <question>

Optional questions do not block the BDD workflow, but the blocking
questions above must be resolved or explicitly reclassified before
the workflow can proceed.

A question classification may be explicitly changed using:

[BDD] CLASSIFICATION OVERRIDE

BDD-Q1: OPTIONAL

Changing a question to OPTIONAL removes it as a workflow blocker but
does not define the missing behavior.

Please answer clarification questions directly in this Jira issue.

Workflow state: BLOCKED
Next step: PM clarification in Jira
```

Omit the Optional questions section when none exist.

## Optional Questions Only

Prepare:

```text id="yixf0g"
[BDD] OPTIONAL CLARIFICATIONS

The requirements are sufficient to proceed with BDD.

Optional questions:

- BDD-Q2: <question>
- BDD-Q3: <question>

These questions do not block the workflow.

Unanswered optional questions do not authorize OpenCode to invent
missing behavior.

A stakeholder may explicitly change classification using:

[BDD] CLASSIFICATION OVERRIDE

BDD-Q2: BLOCKING

Workflow state: PROCEEDING
Next step: BDD specification review
```

## No Questions

If no unresolved blocking or optional questions exist:

`JIRA SYNC: SKIPPED`

Reason:

`No clarification feedback is required.`

---

# 7. Clarification Duplicate Protection

Compare the current complete unresolved question set with previous:

* `[BDD] CLARIFICATION REQUIRED`
* `[BDD] OPTIONAL CLARIFICATIONS`

Compare:

* stable IDs
* question text
* BLOCKING / OPTIONAL classification

If equivalent:

`JIRA SYNC: SKIPPED`

Reason:

`Equivalent clarification feedback already exists.`

A new comment may be prepared when a question is:

* added
* resolved
* materially changed
* reclassified

The new comment should contain the complete current unresolved set.

---

# 8. Specification Approval Event

For:

`/sync-jira <ISSUE-KEY> spec-approved`

Apply the common Jira and GitHub verification rules.

Then verify the specification-specific evidence.

## Specification Verification

Verify:

* exactly one relevant specification directory exists
* `prd.md` exists
* `acceptance.feature` exists
* `implementation-plan.md` exists
* no implementation files are present when the specification gate
  requires specification-only review
* valid Human Gate 1 approval exists
* approval applies to the current specification
* approval is fresh relative to the latest specification-changing commit

Use exactly the same approval evidence model, mode selection, and
freshness semantics as:

`/check-bdd-approval <ISSUE-KEY>`

Do not introduce a second or stricter definition of Human Gate 1
inside `/sync-jira`.

The latest specification-changing commit is the latest PR commit
touching the current specification directory.

Do not blindly use PR HEAD.

Record its full commit SHA as:

`<LATEST-SPECIFICATION-COMMIT-SHA>`

Record its commit timestamp as:

`<LATEST-SPECIFICATION-COMMIT-TIMESTAMP>`

The full SHA is the effective specification version.

## Authoritative Human Gate 1 Evaluation

For `spec-approved`, Human Gate 1 MUST reproduce the approval algorithm
used by:

`/check-bdd-approval <ISSUE-KEY>`

Human Gate 1 MUST be evaluated independently from Jira synchronization
history.

Do not treat GitHub PR reviews as the only possible approval evidence.

Evaluate approval in the following order.

### TEAM MODE

First inspect GitHub PR reviews in the resolved origin repository.

A TEAM MODE approval is valid only when:

* the review state is `APPROVED`
* the reviewer is not the PR author
* the approval satisfies the freshness requirements of
  `/check-bdd-approval`

If qualifying TEAM MODE approval evidence exists, TEAM MODE takes
precedence and must be evaluated using exactly the same rules as
`/check-bdd-approval`.

If no qualifying TEAM MODE approval exists, do NOT fail Human Gate 1
yet.

Continue to SOLO POC MODE fallback.

### SOLO POC MODE Fallback

If no qualifying TEAM MODE approval exists, MUST evaluate SOLO POC
MODE.

An empty GitHub PR review list does NOT cause Human Gate 1 to fail.

For SOLO POC MODE, inspect PR issue comments on the relevant PR in the
resolved origin repository.

The approval evidence MUST be an exact comment from the PR author:

`BDD specification reviewed. Approved for implementation.`

Do not accept:

* partial matches
* paraphrases
* Jira comments
* BDD-generated synchronization comments
* comments from another user
* comments on another PR
* comments from another repository

If multiple valid exact SOLO approval comments exist, use the latest
one relevant to the current approval cycle.

Record:

* approval mode: `SOLO POC MODE`
* reviewer: `<PR-AUTHOR>`
* approval timestamp: `<HUMAN-GATE-1-APPROVAL-TIMESTAMP>`

The absence of qualifying TEAM MODE reviews is expected and valid in
SOLO POC MODE.

It MUST NOT by itself produce:

`Approval freshness: FAIL`

or:

`EVIDENCE VERIFICATION: BLOCKED`

## Human Gate 1 Freshness

Determine:

`<LATEST-SPECIFICATION-COMMIT-SHA>`

and:

`<LATEST-SPECIFICATION-COMMIT-TIMESTAMP>`

Determine the timestamp of the valid TEAM MODE or SOLO POC MODE
approval:

`<HUMAN-GATE-1-APPROVAL-TIMESTAMP>`

Compare:

`HUMAN-GATE-1-APPROVAL-TIMESTAMP > LATEST-SPECIFICATION-COMMIT-TIMESTAMP`

The comparison is strict.

If true:

`Approval freshness: PASS`

If false:

`Approval freshness: FAIL`

A previous Jira `[BDD] SPECIFICATION APPROVED` comment is synchronization
history only.

It is NOT Human Gate 1 approval evidence.

Its timestamp MUST NOT participate in Human Gate 1 freshness
calculation.

A Jira clarification, requirement-change, or BDD-Q comment timestamp
MUST NOT participate in Human Gate 1 freshness calculation.

The relevant chronological relationship is:

`LATEST SPECIFICATION CHANGE -> VALID HUMAN GATE 1 APPROVAL`

not:

`JIRA SPEC APPROVAL -> REQUIREMENT CHANGE`

and not:

`REQUIREMENT CHANGE -> PR REVIEW`

If `/check-bdd-approval` semantics would classify the same current
specification approval evidence as valid and fresh, `/sync-jira`
MUST reach the same Human Gate 1 result.

## Post-Approval Requirement Changes

A requirement change after an earlier
`[BDD] SPECIFICATION APPROVED` invalidates that earlier synchronized
approval state.

It does not permanently block future approval.

The re-approval cycle is COMPLETE when:

1. the requirement change has been processed through BDD intake
2. the current specification reflects the changed observable behavior
3. the changed specification is committed to the current PR
4. valid TEAM MODE or SOLO POC MODE Human Gate 1 evidence exists
5. that Human Gate 1 approval is strictly newer than the latest
   specification-changing commit

The chronological model is:

`SPEC A`

`-> HUMAN GATE 1 A`

`-> JIRA SPECIFICATION APPROVED A`

`-> REQUIREMENT CHANGE`

`-> SPEC B`

`-> SPECIFICATION-CHANGING COMMIT B`

`-> FRESH HUMAN GATE 1 B`

`-> JIRA SPECIFICATION APPROVED B`

Old Human Gate 1 A cannot authorize spec B.

Old Jira synchronization A cannot authorize spec B.

However, once Human Gate 1 B is valid and fresh for the latest
specification-changing commit, the re-approval requirement has been
satisfied.

If the current specification does NOT have valid fresh Human Gate 1
approval:

`REQUIREMENT CHANGE DETECTED`

`SPECIFICATION RE-APPROVAL REQUIRED: YES`

`Approval freshness: FAIL`

`JIRA SYNC: BLOCKED`

If the current specification DOES have valid fresh Human Gate 1
approval:

`REQUIREMENT CHANGE DETECTED`

`SPECIFICATION RE-APPROVAL REQUIRED: NO`

`Approval freshness: PASS`

Continue with version-aware duplicate protection.

Do NOT return:

`SPECIFICATION RE-APPROVAL REQUIRED: YES`

merely because a requirement change occurred after a historical Jira
`[BDD] SPECIFICATION APPROVED` comment.

Re-approval is required only while the current specification lacks
valid fresh Human Gate 1 approval.

## Version-Aware Duplicate Protection

For `spec-approved`, duplicate identity MUST be version-aware.

Define the effective specification version as:

`<LATEST-SPECIFICATION-COMMIT-SHA>`

A previous `[BDD] SPECIFICATION APPROVED` Jira comment is a duplicate
only when the available evidence proves that it represents BOTH:

* the same origin PR
* the same effective specification version

Therefore:

`PR #N + SPEC SHA A`

is different from:

`PR #N + SPEC SHA B`

even when the Jira marker and PR are identical.

The existence of `[BDD] SPECIFICATION APPROVED` alone MUST NOT be used
as duplicate evidence.

The PR alone MUST NOT be used as duplicate evidence.

A previous Jira approval comment that explicitly contains:

`Specification version: <SHA>`

can be compared directly with the current effective specification
version.

If the existing Jira approval comment does not contain enough
information to prove that it represents the current effective
specification version, it MUST NOT be treated as a duplicate of the
current version.

Historical approval comments remain historical workflow evidence but
do not suppress synchronization of a newly committed and freshly
approved specification version.

## Proposed Comment

After verification succeeds, prepare:

```text id="1g5fye"
[BDD] SPECIFICATION APPROVED

BDD specification has been reviewed and approved for implementation.

GitHub PR: <PR reference>
Specification version: <LATEST-SPECIFICATION-COMMIT-SHA>

Specification:

- prd.md
- acceptance.feature
- implementation-plan.md

Workflow state: SPEC APPROVED
Next step: Implementation
```

---

# 9. Implementation Approval Event

For:

`/sync-jira <ISSUE-KEY> implementation-approved`

Apply the common Jira and GitHub verification rules.

Then verify:

* implementation changes exist
* implementation corresponds to the current PR head
* valid Human Gate 2 approval exists
* approval is fresh relative to the current PR head

Use exactly the same approval evidence model, mode selection, and
freshness semantics as:

`/check-implementation-approval <ISSUE-KEY>`

Do not introduce a second or stricter definition of Human Gate 2
inside `/sync-jira`.

Never invent validation results.

Include validation details only when independently verifiable.

After verification succeeds:

```text id="wmx0yn"
[BDD] IMPLEMENTATION APPROVED

Implementation has been reviewed and approved for merge.

GitHub PR: <PR reference>

Validation:

<only verified validation information>

Workflow state: IMPLEMENTATION APPROVED
Next step: Merge
```

If no validation details can be verified, omit the Validation section.

---

# 10. Merged Event

For:

`/sync-jira <ISSUE-KEY> merged`

Apply the common Jira and GitHub verification rules.

Then verify through GitHub that the relevant PR state is:

`MERGED`

Retrieve the merge commit when available.

After verification succeeds:

```text id="4tz4x3"
[BDD] MERGED

Implementation has been merged to main.

GitHub PR: <PR reference>
Merge commit: <commit>

Workflow state: MERGED
```

---

# 11. General Duplicate Protection

Before every preview and again before every confirmed write, compare
current Jira comments with the current verified event state.

Event identity is:

* clarification:
  complete unresolved question set + classifications
* spec-approved:
  origin PR + latest specification-changing commit SHA
* implementation-approved:
  PR + current implementation state + approval
* merged:
  PR + merged state

For `spec-approved`, apply the version-aware duplicate rules from
Section 8.

Do NOT reduce `spec-approved` duplicate detection to marker existence.

If equivalent feedback already exists:

`JIRA SYNC: SKIPPED`

Reason:

`Equivalent Jira feedback already exists.`

Historical feedback for an older state is not automatically a
duplicate of the current state.

If equivalence cannot be proven from available evidence, do not
classify the current event as a duplicate.

---

# 12. Requirement Change Rule

Before Human Gate 1, Jira clarification may be incorporated into the
specification by `/from-jira`.

After Human Gate 1, the approved `acceptance.feature` is the behavioral
contract for that implementation cycle.

A later Jira comment or classification change that alters observable
behavior MUST NOT silently change that contract.

Until the change is incorporated, committed, and freshly approved:

`REQUIREMENT CHANGE DETECTED`

`SPECIFICATION RE-APPROVAL REQUIRED: YES`

After the changed requirement is incorporated, committed, and receives
valid fresh Human Gate 1 approval using the same semantics as
`/check-bdd-approval`:

`REQUIREMENT CHANGE DETECTED`

`SPECIFICATION RE-APPROVAL REQUIRED: NO`

The previous approval remains historical evidence only.

A historical Jira `[BDD] SPECIFICATION APPROVED` marker MUST NOT override
a newer valid Human Gate 1 approval decision.

An empty GitHub PR review list MUST NOT be interpreted as missing Human
Gate 1 evidence until the SOLO POC MODE fallback has also been
evaluated.

---

# 13. Jira Write Failure

If Jira comment creation fails:

`JIRA SYNC: BLOCKED`

Reason:

`Jira write failed.`

Do not claim Jira was updated and do not retry automatically.

The confirmation is consumed.

A retry requires a new synchronization cycle, preview, and
confirmation.

---

# 14. Decision Table

Use this table after required Jira/GitHub verification and duplicate
checks to determine the next action.

| Condition                                                         | Result                                                  | Jira write         |
| ----------------------------------------------------------------- | ------------------------------------------------------- | ------------------ |
| Required evidence cannot be verified                              | `BLOCKED`                                               | No                 |
| Equivalent current feedback is proven                             | `SKIPPED`                                               | No                 |
| Blocking clarification questions exist                            | Preview `[BDD] CLARIFICATION REQUIRED`                  | Await confirmation |
| Only optional clarification questions exist                       | Preview `[BDD] OPTIONAL CLARIFICATIONS`                 | Await confirmation |
| No clarification questions exist                                  | `SKIPPED`                                               | No                 |
| Qualifying TEAM MODE Gate 1 approval exists                       | Evaluate TEAM MODE freshness                            | Depends on result  |
| No qualifying TEAM MODE approval exists                           | Evaluate SOLO POC MODE; do not fail yet                 | Depends on result  |
| Valid fresh SOLO POC MODE Gate 1 approval exists                  | Human Gate 1 PASS                                       | Continue           |
| Requirement changed and current spec lacks fresh Gate 1 approval  | `BLOCKED` + re-approval required                        | No                 |
| Requirement changed and current spec has fresh Gate 1 approval    | Re-approval complete; continue `spec-approved`          | Await confirmation |
| Current spec has valid fresh Gate 1 approval                      | Preview version-specific `[BDD] SPECIFICATION APPROVED` | Await confirmation |
| Existing spec-approved marker is for a different spec SHA         | Not duplicate; continue `spec-approved`                 | Await confirmation |
| Current implementation has valid fresh Gate 2 approval            | Preview `[BDD] IMPLEMENTATION APPROVED`                 | Await confirmation |
| Relevant PR is verified `MERGED`                                  | Preview `[BDD] MERGED`                                  | Await confirmation |
| Valid confirmation matches pending preview and state is unchanged | `SUCCESS` after verified write                          | Exactly one        |
| Confirmation has no matching pending preview                      | `NOT AUTHORIZED`                                        | No                 |
| State changes after preview                                       | `CANCELLED`                                             | No                 |
| Jira comment creation fails                                       | `BLOCKED`                                               | No                 |

Precedence:

`BLOCKED -> PROVEN DUPLICATE/SKIPPED -> EVENT-SPECIFIC DECISION -> PREVIEW -> CONFIRMATION -> REVERIFY -> WRITE`

Never use the table as a substitute for the detailed verification
rules above.

For `spec-approved`, do not classify approval evidence as missing
until both approval paths have been evaluated in order:

`TEAM MODE -> SOLO POC MODE FALLBACK`

A historical requirement change is not itself a current blocker.

The current blocker test is:

`DOES CURRENT SPECIFICATION HAVE VALID FRESH HUMAN GATE 1 APPROVAL?`

If YES, re-approval is complete and synchronization may proceed to
duplicate protection.

If NO, synchronization is blocked.

---

# 15. Final Report

Always return:

### Jira Sync

* Jira issue: `<ISSUE-KEY>`
* Event: `<EVENT>`
* Jira read: PASS / BLOCKED
* Evidence verification: PASS / BLOCKED / NOT REQUIRED
* Duplicate check: PASS / DUPLICATE / NOT RUN
* Jira write authorization: REQUIRED / CONFIRMED / NOT AUTHORIZED / NOT REQUIRED
* Jira write: SUCCESS / SKIPPED / BLOCKED / NOT RUN
* Comment marker: `<BDD marker>` / NONE

For clarification also report:

* Blocking questions: `<count>`
* Optional questions: `<count>`
* Human classification overrides detected: `<count>`

For `spec-approved` when applicable also report:

* Requirement change detected: YES / NO
* Specification re-approval required: YES / NO
* Approval mode: TEAM MODE / SOLO POC MODE / NONE
* Reviewer: `<reviewer>` / NONE
* Latest specification commit: `<SHA>`
* Latest specification commit timestamp: `<timestamp>`
* Effective specification version: `<LATEST-SPECIFICATION-COMMIT-SHA>`
* Latest approval timestamp: `<timestamp>` / NONE
* Approval freshness: PASS / FAIL

## Awaiting Confirmation

`JIRA SYNC: AWAITING CONFIRMATION`

`No Jira write has been performed.`

`To authorize this exact comment: CONFIRM JIRA WRITE <ISSUE-KEY>`

Then STOP.

## Success

`JIRA SYNC: SUCCESS`

`Jira feedback synchronized successfully.`

## Skipped

`JIRA SYNC: SKIPPED`

`No Jira write was necessary.`

## Cancelled

`JIRA WRITE: CANCELLED`

`State changed after preview. New preview required.`

## Blocked

`JIRA SYNC: BLOCKED`

`Jira was not updated.`

## No Matching Preview

`JIRA WRITE: NOT AUTHORIZED`

`No matching pending Jira write preview exists.`

---

# Workflow Invariants

BDD lifecycle:

`JIRA REQUIREMENT`

`-> BDD ANALYSIS`

`-> HUMAN CLARIFICATION / CLASSIFICATION`

`-> BDD SPECIFICATION`

`-> HUMAN GATE 1`

`-> IMPLEMENTATION`

`-> HUMAN GATE 2`

`-> MERGE`

`-> JIRA FEEDBACK`

Requirement-change lifecycle:

`APPROVED SPEC A`

`-> REQUIREMENT CHANGE`

`-> UPDATED SPEC B`

`-> FRESH HUMAN GATE 1`

`-> JIRA SPEC APPROVAL B`

Gate 1 evaluation:

`TEAM MODE`

`-> if no qualifying TEAM approval: SOLO POC MODE`

`-> VALID APPROVAL`

`-> FRESHNESS CHECK`

Gate 1 freshness invariant:

`LATEST SPECIFICATION CHANGE -> FRESH HUMAN GATE 1 -> JIRA SYNCHRONIZATION`

For the same repository, PR, specification directory, specification
commit, and GitHub approval evidence:

`/check-bdd-approval <ISSUE-KEY>`

and:

`/sync-jira <ISSUE-KEY> spec-approved`

MUST produce the same Human Gate 1 validity and freshness result.

An empty GitHub PR review list does not imply approval failure when a
valid SOLO POC MODE approval comment exists.

A historical Jira synchronization marker cannot invalidate a newer
valid Human Gate 1 approval.

Version identity:

`SPECIFICATION VERSION = LATEST SPECIFICATION-CHANGING COMMIT SHA`

Jira write lifecycle:

`VERIFY -> PREVIEW -> CONFIRM -> REVERIFY -> ONE EXACT WRITE`

No synchronization step may invent requirements or evidence, silently
change the approved behavioral contract, treat a historical approval
marker as proof of a current-version duplicate, use Jira synchronization
history as a substitute for Human Gate 1 evidence, ignore the SOLO POC
MODE fallback, or perform an unconfirmed Jira write.
