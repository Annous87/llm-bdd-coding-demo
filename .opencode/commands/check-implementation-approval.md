# Rule: Check Implementation Approval Before Merge (OpenCode)

## Goal

Verify that implementation for a Jira issue has received explicit human approval before it may be merged into `main`.

Usage:

`/check-implementation-approval <JIRA-ISSUE-KEY>`

Canonical evaluator:

`tools/bdd-gates/gate2.mjs`

This command should consume the evaluator result rather than re-implementing gate logic independently.

This command is verification-only.

It must not:
- modify application files;
- modify specification files;
- modify Jira;
- commit;
- push;
- merge;
- create or modify pull requests.

## Approval Modes

### SOLO POC

Because a pull request author cannot formally approve their own pull request, accept the following exact PR comment from the PR author:

`Implementation reviewed. Approved for merge.`

The approval comment must be newer than the latest commit currently contained in the pull request.

An approval comment created before the latest implementation commit is stale and must not count.

### TEAM

Require a genuine GitHub pull-request review with state:

`APPROVED`

The reviewer must be different from the PR author.

The approval must apply to the current PR head commit.

If additional commits were pushed after approval and the approval is no longer valid for the current head, the gate must fail.

## Process

### 1. Determine Repository and Branch

Determine:

- current Git repository;
- current branch;
- current HEAD commit;
- local `origin` remote using the equivalent of:

  `git remote get-url origin`

Dynamically derive `<ORIGIN-OWNER>/<ORIGIN-REPO>` from the local `origin` remote.

Support standard GitHub remote formats such as:

`https://github.com/<OWNER>/<REPO>.git`

`git@github.com:<OWNER>/<REPO>.git`

Do not hard-code a GitHub username, organization, repository owner, or repository name.

Treat the dynamically resolved `<ORIGIN-OWNER>/<ORIGIN-REPO>` as the only valid repository context for all GitHub operations performed by this command.

Do not use `upstream` to locate or validate the pull request.

The current branch must not be `main`.

Verify that the branch corresponds to the supplied Jira issue key.

Example:

`feature/<ISSUE-KEY>-<description>`

If branch and issue key do not align, fail.

### 2. Locate Pull Request in Origin Repository

Find the open GitHub pull request whose head is the current branch exclusively inside the dynamically resolved `<ORIGIN-OWNER>/<ORIGIN-REPO>`.

Every GitHub CLI/API query used to locate or inspect the pull request must explicitly specify `<ORIGIN-OWNER>/<ORIGIN-REPO>`.

Use the equivalent of:

`gh pr list --repo <ORIGIN-OWNER>/<ORIGIN-REPO> --head <CURRENT-BRANCH>`

Do not:

- search GitHub globally for the branch;
- use `upstream`;
- infer the repository from another open pull request;
- select a pull request from another repository even if its branch name or commit matches.

Require exactly one matching open pull request in the origin repository.

If no matching PR exists, fail with:

`No open pull request found in origin repository for current branch.`

If multiple matching PRs exist, fail with:

`Multiple matching pull requests found in origin repository.`

After locating the PR, verify:

- PR repository = `<ORIGIN-OWNER>/<ORIGIN-REPO>`
- PR head branch = current branch
- PR base repository = `<ORIGIN-OWNER>/<ORIGIN-REPO>`
- PR base branch = `main`

If any condition is false, fail with:

`Wrong PR target/base repository or branch.`

The upstream repository must never be used as a fallback.

### 3. Verify Current HEAD Is in the Pull Request

Retrieve the current PR head commit.

Verify that it matches the local current HEAD commit.

If local HEAD differs from the PR head, fail and report that the local branch and PR are not synchronized.

### 4. Verify BDD Specification Exists

Resolve:

`spec/<ISSUE-KEY>-*/`

For new Jira-driven work, this issue-key format is the required convention.

Require exactly one unambiguous specification directory.

Verify that the PR contains the approved BDD artifacts:

- `prd.md`
- `acceptance.feature`
- `implementation-plan.md`

If any required specification artifact is missing, fail.

### 5. Verify Implementation Changes Exist

Inspect the PR changed files.

Verify that application implementation changes exist in addition to the BDD specification.

Do not infer implementation merely from the existence of specification files.

Report the implementation files detected.

If no implementation changes are present, fail.

### 6. Verify Implementation Approval

Inspect the PR's review and comment history.

#### SOLO POC

Require the exact comment:

`Implementation reviewed. Approved for merge.`

The comment must:
- be authored by the PR author;
- occur after the latest commit currently in the PR.

If the exact marker does not exist, fail.

If it exists but predates the latest PR commit, fail with:

`Implementation approval is stale because commits were added after approval.`

Ordinary comments, similar wording, reactions, or implicit approval do not count.

#### TEAM

Require a genuine GitHub review with state:

`APPROVED`

The reviewer must:
- not be the PR author;
- be an authorized human reviewer.

The approval must remain valid for the current PR head.

If commits added after the review invalidate or supersede the approval, fail.

### 7. Verification Result

Return exactly one overall gate result:

`IMPLEMENTATION APPROVAL GATE: PASS`

or:

`IMPLEMENTATION APPROVAL GATE: FAIL`

## Required Report

Report:

- Jira issue
- Repository
- Branch
- Local HEAD
- Pull request
- PR base
- PR head
- Specification files
- Implementation files present
- Implementation files detected
- Approval mode
- Reviewer
- Latest PR commit timestamp
- Approval timestamp
- Approval evidence
- Approval freshness
- Gate result

### PASS

If all checks succeed, conclude:

`Implementation is approved for merge.`

Do not merge.

### FAIL

If any required condition fails:
- report the exact failed condition;
- stop;
- do not merge;
- do not modify anything.

## Required Invariant

`CURRENT IMPLEMENTATION -> HUMAN REVIEW -> FRESH APPROVAL -> MERGE ELIGIBLE`

Approval must always apply to the current implementation.

Any implementation commit added after approval requires a new human approval.
