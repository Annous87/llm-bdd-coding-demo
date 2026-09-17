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
   - Determine the GitHub repository for the current workspace.

2. **Validate Branch-Issue Alignment**
   - Verify the current branch corresponds to the supplied `<JIRA-ISSUE-KEY>`.
   - If it does not correspond, return `APPROVAL GATE: FAIL` with the mismatch and stop.

3. **Find Open Pull Request for Current Branch**
   - Find the open GitHub pull request associated with the current branch.
   - If no open pull request exists:
     - return `APPROVAL GATE: FAIL`
     - explain that a BDD specification pull request must be created and reviewed
     - stop.

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
