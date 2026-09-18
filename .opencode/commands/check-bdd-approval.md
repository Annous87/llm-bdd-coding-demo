# Rule: Verify BDD Specification Approval Gate (OpenCode)

## Goal

Verify that the **current version** of the BDD specification for a Jira issue has passed the required human review gate in GitHub before implementation is allowed.

An approval for an earlier version of the specification MUST NOT authorize implementation of a later specification version.

Usage:

`/check-bdd-approval <JIRA-ISSUE-KEY>`

---

## Scope and Safety

* This command is verification-only.
* Do not modify files.
* Do not modify Jira.
* Do not modify GitHub.
* Do not modify git branches, commits, tags, pull requests, reviews, or comments.
* Do not modify application code.
* Do not run acceptance tests.
* Do not run application implementation.
* Do not create, update, commit, push, merge, or delete anything.
* Do not invoke `/implement-bdd`.
* Do not invoke `/sync-jira`.
* All git, GitHub, and filesystem operations performed by this command MUST be read-only.

---

## Core Approval Invariant

The valid lifecycle is:

`LATEST SPECIFICATION CHANGE -> HUMAN APPROVAL -> IMPLEMENTATION`

The following lifecycle is invalid:

`HUMAN APPROVAL -> LATER SPECIFICATION CHANGE -> IMPLEMENTATION`

Therefore:

> Human approval MUST be newer than the latest commit that changes the BDD specification.

The presence of an approval marker somewhere in the PR history is not sufficient.

---

## Process

### 1. Identify Repository Context

* Determine the current git branch.

* Read the local `origin` remote using the equivalent of:

  `git remote get-url origin`

* Dynamically derive:

  `<ORIGIN-OWNER>/<ORIGIN-REPO>`

  from the `origin` remote URL.

* Support standard GitHub HTTPS and SSH remote formats.

Examples:

`https://github.com/<OWNER>/<REPO>.git`

`https://github.com/<OWNER>/<REPO>`

`git@github.com:<OWNER>/<REPO>.git`

* Normalize the repository name by removing a trailing `.git` when present.

* Do not hard-code a GitHub username, organization, repository owner, or repository name.

* Treat the dynamically resolved origin repository as the **only valid repository** for this approval check.

* Do not use `upstream`.

* Do not infer the repository from an existing pull request.

* If `origin` is missing, invalid, unsupported, or cannot be resolved unambiguously to a GitHub owner/repository:

  * return `APPROVAL GATE: FAIL`
  * report `Repository context could not be resolved from origin.`
  * stop.

---

### 2. Validate Jira Issue Key

* Require a Jira issue key argument.

* The supplied key MUST be used consistently throughout the verification.

* Do not infer or silently substitute another Jira issue key.

* If the issue key is missing or invalid:

  * return `APPROVAL GATE: FAIL`
  * report the problem
  * stop.

---

### 3. Validate Branch-Issue Alignment

* Verify the current branch corresponds to the supplied `<JIRA-ISSUE-KEY>`.

For example, a branch such as:

`feature/SR-168023-archive-completed-todos`

corresponds to:

`SR-168023`

* Matching MUST be based on the explicit issue key, not merely a similar numeric value or description.

* If the current branch does not correspond to the supplied issue key:

  * return `APPROVAL GATE: FAIL`
  * report the branch/issue mismatch
  * stop.

---

### 4. Find Open Pull Request in Origin Repository

* Search for the open pull request for the current branch exclusively inside:

  `<ORIGIN-OWNER>/<ORIGIN-REPO>`

* Every GitHub CLI/API query used to locate or inspect the PR MUST explicitly specify the dynamically resolved origin repository.

Use the equivalent of:

`gh pr list --repo <ORIGIN-OWNER>/<ORIGIN-REPO> --head <CURRENT-BRANCH>`

* Do not search GitHub globally for the branch.

* Do not use `upstream`.

* Do not select a pull request from another repository even if its branch name or HEAD commit matches.

* Require exactly one matching open pull request in the origin repository.

#### No matching PR

If no matching pull request exists:

* return `APPROVAL GATE: FAIL`
* explain that a BDD specification pull request must exist in the origin repository
* stop.

#### Multiple matching PRs

If multiple matching open pull requests exist:

* return `APPROVAL GATE: FAIL`
* report that multiple candidate pull requests exist
* stop.

#### Validate selected PR

Verify that the selected PR:

* belongs to `<ORIGIN-OWNER>/<ORIGIN-REPO>`
* has the current branch as its head branch
* targets `main`
* targets `<ORIGIN-OWNER>/<ORIGIN-REPO>` as its base repository

If any condition is false:

* return `APPROVAL GATE: FAIL`

* state:

  `Wrong PR target/base repository or branch.`

* stop.

The upstream repository MUST never be used as a fallback.

---

### 5. Identify the Specification Directory

* Locate the specification directory matching:

  `spec/<JIRA-ISSUE-KEY>-*/`

* Require exactly one matching specification directory.

#### No matching directory

If no matching directory exists:

* return `APPROVAL GATE: FAIL`

* report:

  `Specification directory not found.`

* stop.

#### Multiple matching directories

If multiple matching directories exist:

* return `APPROVAL GATE: FAIL`

* report:

  `Multiple specification directories found for Jira issue.`

* stop.

* Record the resolved directory as:

  `<SPEC-DIRECTORY>`

---

### 6. Inspect Pull Request Changed Files

* Read the complete list of files changed in the selected pull request.

* The changed-file inspection MUST be scoped explicitly to:

  `<ORIGIN-OWNER>/<ORIGIN-REPO>`

  and the selected PR.

* Do not infer changed files solely from the local working tree.

---

### 7. Verify Required Specification Files Exist in PR

Verify that the PR includes all of:

* `<SPEC-DIRECTORY>/prd.md`
* `<SPEC-DIRECTORY>/acceptance.feature`
* `<SPEC-DIRECTORY>/implementation-plan.md`

All three files MUST belong to the same resolved specification directory.

If any required specification file is missing:

* return `APPROVAL GATE: FAIL`
* identify the missing file or files
* stop.

---

### 8. Ensure Specification-Only Review Stage

Human Gate 1 is the approval of the specification **before application implementation begins**.

Verify that application implementation files are not included in the PR at this stage.

Specification/workflow files may exist as appropriate, but application source changes implementing the Jira story MUST NOT already be present.

If application implementation changes for the Jira story are present:

* return `APPROVAL GATE: FAIL`

* report:

  `Implementation files are already present before BDD specification approval.`

* explain that the specification must be approved before implementation

* stop.

Do not treat generated specification files themselves as implementation files.

---

### 9. Determine Latest Specification-Changing Commit

Determine the current specification version that requires approval.

Using the selected PR, inspect the commits affecting files under:

`<SPEC-DIRECTORY>/`

Identify the **latest commit in the PR that modifies any file inside the resolved specification directory**.

This includes modifications to:

* `prd.md`
* `acceptance.feature`
* `implementation-plan.md`
* any other file inside `<SPEC-DIRECTORY>/`

Record:

* latest specification commit SHA
* latest specification commit timestamp

Do NOT simply use the current PR HEAD.

A later application-code, documentation, tooling, or unrelated commit MUST NOT invalidate an otherwise current BDD specification approval unless that commit modifies `<SPEC-DIRECTORY>/`.

If no specification-changing commit can be identified:

* return `APPROVAL GATE: FAIL`

* report:

  `Unable to determine current BDD specification version.`

* stop.

---

### 10. Read Human Approval Evidence

Read the relevant GitHub review and PR-comment evidence from the selected PR.

All GitHub queries MUST remain explicitly scoped to:

`<ORIGIN-OWNER>/<ORIGIN-REPO>`

Do not modify reviews or comments.

Do not treat any of the following as approval:

* PR creation
* commits
* pushes
* ordinary discussion
* issue comments
* Jira comments
* implicit approval language
* generic comments such as `LGTM`, `OK`, `looks good`, `approved`, or `proceed`
* OpenCode-generated output
* the existence of the PR itself

Approval MUST satisfy one of the explicit modes below.

---

### 11. Evaluate TEAM MODE

TEAM MODE takes precedence when there is a qualifying GitHub review from someone other than the PR author.

A qualifying TEAM MODE approval requires:

* a GitHub pull-request review
* review state `APPROVED`
* reviewer is not the PR author
* review applies to the selected PR
* review is valid for the current specification version

Determine the latest qualifying `APPROVED` review from a reviewer other than the PR author.

Record:

* reviewer
* review timestamp
* review state
* reviewed commit SHA when available

#### TEAM MODE Freshness

The TEAM MODE approval MUST apply to the current specification state.

At minimum:

* the qualifying approval MUST NOT predate the latest specification-changing commit.

Where GitHub provides reviewed commit information, also use it to ensure that the approval does not apply only to an earlier specification state.

If the specification directory was modified after the qualifying approval:

* approval evidence is `STALE`

* approval freshness is `FAIL`

* return `APPROVAL GATE: FAIL`

* report:

  `Specification changed after the latest valid approval.`

* report:

  `Current BDD specification requires human re-approval.`

* stop.

If a current qualifying TEAM MODE approval exists:

* set `Approval mode: TEAM MODE`
* set reviewer to the qualifying reviewer
* set approval evidence to the qualifying GitHub `APPROVED` review
* set `Approval freshness: PASS`

Proceed to the final decision.

---

### 12. Evaluate SOLO POC MODE

If no qualifying TEAM MODE approval exists, evaluate SOLO POC MODE.

GitHub does not allow the PR author to formally approve their own PR, so SOLO POC MODE uses an explicit PR-author comment as human approval evidence.

The required exact marker is:

`BDD specification reviewed. Approved for implementation.`

Requirements:

* the comment MUST be on the selected PR
* the comment MUST be authored by the PR author
* the comment MUST contain the exact marker
* ordinary or approximate approval language is insufficient

Find all qualifying PR-author comments containing the exact marker.

If no qualifying marker exists:

* set `Approval mode: SOLO POC MODE`

* set `Approval evidence: NOT FOUND`

* return `APPROVAL GATE: FAIL`

* report:

  `Missing human approval for the current BDD specification.`

* stop.

If multiple qualifying comments exist, use the **latest qualifying approval comment** for freshness evaluation.

Record:

* reviewer / comment author
* approval comment timestamp

---

### 13. Verify SOLO POC Approval Freshness

Compare:

* latest specification-changing commit timestamp
* latest qualifying SOLO POC approval-comment timestamp

The approval is current only if the approval comment was created **after** the latest specification-changing commit.

Required ordering:

`LATEST SPECIFICATION COMMIT -> APPROVAL COMMENT`

If:

`approval timestamp <= latest specification-changing commit timestamp`

then the approval is stale.

A stale approval MUST NOT authorize implementation.

Return:

`APPROVAL GATE: FAIL`

and report:

* `Approval mode: SOLO POC MODE`
* `Reviewer: <PR-AUTHOR>`
* `Approval evidence: STALE`
* `Approval freshness: FAIL`
* `Latest specification commit: <SHA>`
* `Latest specification commit timestamp: <TIMESTAMP>`
* `Latest approval timestamp: <TIMESTAMP>`
* `Specification changed after the latest valid approval.`
* `Current BDD specification requires human re-approval.`

Then stop.

Do NOT accept an older approval merely because the exact marker still exists somewhere in the PR history.

If the latest qualifying approval comment is newer than the latest specification-changing commit:

* set `Approval evidence: PASS`
* set `Approval freshness: PASS`

Proceed to the final decision.

---

### 14. Re-Approval After Requirement Changes

A Jira requirement clarification or requirement change may cause `/from-jira` to update the BDD specification.

If that produces a new specification-changing commit after an existing approval, the existing approval becomes stale automatically.

For example:

`Specification Commit A`

`-> Human Approval A`

`-> Jira requirement change`

`-> Specification Commit B`

At this point:

`Human Approval A = STALE`

A new approval is required:

`Specification Commit B`

`-> Human Approval B`

Only Human Approval B may authorize implementation of Specification Commit B.

A new PR is NOT required solely because the specification changed.

The same Jira-story PR may continue to be used, provided the current specification receives fresh approval.

---

### 15. Final Approval Conditions

Return `APPROVAL GATE: PASS` only if ALL applicable conditions are satisfied:

* repository context resolved from `origin`
* current branch corresponds to the supplied Jira issue
* exactly one matching open PR exists in the origin repository
* PR repository is the origin repository
* PR head branch is the current branch
* PR base repository is the origin repository
* PR base branch is `main`
* exactly one specification directory exists
* all required specification files are included in the PR
* implementation files are not present
* latest specification-changing commit was successfully identified
* valid human approval evidence exists
* approval evidence is newer than the latest specification-changing commit
* approval freshness is `PASS`

Failure of any required condition MUST produce:

`APPROVAL GATE: FAIL`

Do not partially approve the specification.

---

## Structured Result

Return the result using this structure:

`APPROVAL GATE: PASS` or `APPROVAL GATE: FAIL`

`Jira issue: <ISSUE-KEY>`

`Branch: <CURRENT-BRANCH>`

`Pull request: <PR-URL or NOT FOUND>`

`Specification files: PASS | FAIL`

`Implementation files present: YES | NO`

`Approval mode: SOLO POC MODE | TEAM MODE | NONE`

`Reviewer: <USERNAME or NONE>`

`Approval evidence: PASS | NOT FOUND | STALE | INVALID`

`Approval freshness: PASS | FAIL | NOT EVALUATED`

`Latest specification commit: <SHA or NOT DETERMINED>`

`Latest specification commit timestamp: <TIMESTAMP or NOT DETERMINED>`

`Latest approval timestamp: <TIMESTAMP or NOT FOUND>`

For a failure, additionally report:

`Missing condition: <EXACT FAILURE REASON>`

Do not omit freshness information when approval evidence exists.

---

## Final Decision Statement

### PASS

If all conditions pass, state:

`BDD specification is approved for implementation.`

### FAIL — Missing Approval

If no valid human approval exists, state the exact missing approval condition and stop.

### FAIL — Stale Approval

If approval exists but predates the latest specification-changing commit, state:

`Specification changed after the latest valid approval.`

`Current BDD specification requires human re-approval.`

Do not authorize implementation.

### FAIL — Other Validation Error

State the exact failed condition and stop.

---

## Examples

### Valid Initial Approval

`SPEC COMMIT A -> APPROVAL A`

Result:

`Approval evidence: PASS`

`Approval freshness: PASS`

`APPROVAL GATE: PASS`

---

### Invalid Approval After Specification Change

`SPEC COMMIT A -> APPROVAL A -> SPEC COMMIT B`

Approval A is stale.

Result:

`Approval evidence: STALE`

`Approval freshness: FAIL`

`APPROVAL GATE: FAIL`

---

### Valid Re-Approval

`SPEC COMMIT A -> APPROVAL A -> SPEC COMMIT B -> APPROVAL B`

Approval B is newer than the latest specification change.

Result:

`Approval evidence: PASS`

`Approval freshness: PASS`

`APPROVAL GATE: PASS`

---

### Unrelated Commit After Approval

`SPEC COMMIT A -> APPROVAL A -> UNRELATED TOOLING COMMIT B`

If Commit B does not modify `<SPEC-DIRECTORY>/`, Approval A remains valid.

The latest specification-changing commit remains Commit A.

Result:

`Approval freshness: PASS`

provided all other gate conditions pass.

---

## Stop Condition

After returning the approval gate result, stop.

Do not:

* implement application code
* run `/implement-bdd`
* run acceptance tests
* modify the specification
* modify Jira
* invoke `/sync-jira`
* create or modify GitHub comments or reviews
* create or modify pull requests
* commit
* push
* merge
* switch branches
* perform any write operation

This command verifies approval only.
