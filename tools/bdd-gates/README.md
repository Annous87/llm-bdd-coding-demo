# BDD Gate Evaluators (PoC)

This directory contains deterministic evaluators for BDD gate decisions.

Goal: keep approval and sync commands aligned by evaluating evidence once.

## Evaluators

- `repo-context.mjs`
  - Validates issue key format, branch/issue alignment, and GitHub origin parsing.
- `spec-context.mjs`
  - Resolves specification directory using `spec/<ISSUE-KEY>-<slug>/`.
  - Verifies required spec files and determines latest spec-changing commit.
- `gate1.mjs`
  - Canonical Human Gate 1 evaluator for specification approval freshness.
- `gate2.mjs`
  - Canonical Human Gate 2 evaluator for implementation approval freshness.

## CLI runner

Run:

```bash
node tools/bdd-gates/run.mjs <repo-context|spec-context|gate1|gate2> <input-json-file>
```

The command prints machine-readable JSON to stdout.

## Test coverage

Current tests target failure/pass cases observed during PoC execution:

- approval before spec change -> Gate 1 FAIL
- approval after spec change -> Gate 1 PASS
- empty reviews + valid solo comment -> Gate 1 PASS
- old Jira approval for SHA A + current SHA B -> not duplicate
- Gate 2 approval followed by new commit -> Gate 2 FAIL

Run tests:

```bash
npm run test:bdd-gates
```
