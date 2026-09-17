# Rule: Verify BDD Specification Approval Gate (OpenCode)

## Goal

Verify that the BDD specification for a Jira issue has passed the required human review gate in GitHub before implementation is allowed.

Usage:

`/check-bdd-approval <JIRA-ISSUE-KEY>`

## Scope and Safety

- This command is verification-only.
- Do not modify files, Jira, GitHub, git branches, commits, pull requests, or application code.
- Do not run acceptance tests.
- Do not implement anything.

## Process

1. **Identify Repository Context**

   - Determine the current git branch.
   - Read the local `origin` remote using the equivalent of:

     `git remote get-url origin`

   - Dynamically derive `<ORIGIN-OWNER>/<ORIGIN-REPO>` from the `origin` remote URL.

   - Support standard GitHub HTTPS and SSH remote formats.

   Examples:

   `https://github.com/<OWNER>/<REPO>.git`

   `git@github.com:<OWNER>/<REPO>.git`

   - Do not hard-code a GitHub username, organization, or repository owner.
   - Treat the dynamically resolved origin repository as the only valid repository for this approval check.
   - Do not use `upstream`.
   - Do not infer the repository from an existing pull request.

2. **Validate Branch-Issue Alignment**

   - Verify the current branch corresponds to the supplied `<JIRA-ISSUE-KEY>`.

   - If it does not correspond:
     - return `APPROVAL GATE: FAIL`
     - report the mismatch
     - stop.

3. **Find Open Pull Request in Origin Repository**

   - Search for the open pull request for the current branch exclusively inside `<ORIGIN-OWNER>/<ORIGIN-REPO>`.

   - Every GitHub CLI/API query used to locate or inspect the PR must explicitly specify the dynamically resolved origin repository.

   Use the equivalent of:

   `gh pr list --repo <ORIGIN-OWNER>/<ORIGIN-REPO> --head <CURRENT-BRANCH>`

   - Do not search GitHub globally for the branch.
   - Do not use `upstream`.
   - Do not select a pull request from another repository even if its branch name or HEAD commit matches.

   - Require exactly one matching open pull request in the origin repository.

   - If no matching pull request exists:
     - return `APPROVAL GATE: FAIL`
     - explain that a BDD specification pull request must be created in the origin repository
     - stop.

   - If multiple matching pull requests exist:
     - return `APPROVAL GATE: FAIL`
     - report that multiple candidate pull requests exist
     - stop.

   - Verify the selected PR:
     - belongs to `<ORIGIN-OWNER>/<ORIGIN-REPO>`
     - has the current branch as its head branch
     - targets `main`
     - targets `<ORIGIN-OWNER>/<ORIGIN-REPO>` as its base repository

   - If any condition is false:
     - return `APPROVAL GATE: FAIL`
     - state `Wrong PR target/base repository or branch.`
     - stop.

   - The upstream repository must never be used as a fallback.

4. **Inspect Pull Request Changed Files**
   - Read the list of files changed in the pull request.

5. **Verify Required Specification Files Exist in PR**
   - Verify the PR includes all of:
     - `spec/<ISSUE-KEY>-*/prd.md`
     - `spec/<ISSUE-KEY>-*/acceptance.feature`
     - `spec/<ISSUE-KEY>-*/implementation-plan.md`
   - If any required specification file is missing, return `APPROVAL GATE: FAIL` and stop.

6. **Ensure Specification-Only Review Stage**
   - Verify application implementation files are not included at this specification-review stage.
   - If application source changes are present:
     - return `APPROVAL GATE: FAIL`
     - explain that approval must cover specification before implementation
     - stop.

7. **Verify Human Approval Evidence**
   - Evaluate approval using exactly one of the supported modes:

   - **SOLO POC MODE**
     - Because GitHub does not allow a PR author to approve their own PR, accept an explicit review/comment from the PR author containing the exact marker:

       `BDD specification reviewed. Approved for implementation.`

   - **TEAM MODE**
     - If a GitHub review with state `APPROVED` exists from a reviewer other than the PR author, the human review requirement is satisfied.

   - Do not treat ordinary comments, implicit language, pull request creation, commits, or the existence of the pull request itself as approval.

8. **Return Structured Result**
   - Return exactly this structure:
     - `APPROVAL GATE: PASS` or `APPROVAL GATE: FAIL`
     - `Jira issue:`
     - `Branch:`
     - `Pull request:`
     - `Specification files:`
     - `Implementation files present:`
     - `Approval mode:`
     - `Reviewer:`
     - `Approval evidence:`

9. **Final Decision Statement**
   - If PASS, state:

     `BDD specification is approved for implementation.`

   - If FAIL, state the exact missing condition and stop.

## Stop Condition

After returning the approval gate result, stop.
