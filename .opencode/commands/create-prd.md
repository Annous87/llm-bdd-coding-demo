# Rule: Generate Product Requirements Document (PRD)

## Goal

Guide OpenCode to create a detailed Product Requirements Document (PRD) in Markdown based on a user's feature request. The PRD must be clear, actionable, and suitable for junior developers to implement while preserving the repository's BDD workflow.

## Process

1. **Receive Initial Prompt:** User provides a brief description of the requested feature.
2. **Get Today's Date:** Retrieve date in `YYYYMMDD` format using the current environment.
3. **Ask Clarifying Questions:** Before writing the PRD, ask focused clarifying questions to capture the feature's "what" and "why".
4. **Generate Feature Slug:** Create a short lowercase hyphenated slug from the feature name.
5. **Create Spec Directory:** Use `spec/YYYYMMDD-feature-slug/`.
6. **Generate PRD:** Write `prd.md` in that directory using the structure below.
7. **Handoff:** Tell the user to run the OpenCode planning command next to create acceptance criteria and implementation tasks.

## Clarifying Questions (Examples)

Adapt questions to the feature, and include at least the following categories:

- **Problem/Goal:** What user problem is solved and why now?
- **Target Users:** Who uses this feature?
- **Core Workflows:** What must users be able to do end-to-end?
- **User Stories:** As a [role], I want [action], so that [benefit].
- **Acceptance Signals:** What outcomes prove this is done?
- **Scope/Boundaries:** What is explicitly out of scope?
- **Data/State:** What data is displayed, created, updated, persisted, or deleted?
- **Edge Cases:** Empty states, errors, retries, permission, validation.

## PRD Structure

`prd.md` should include:

1. **Introduction / Overview**
2. **Objectives**
3. **User Stories**
4. **Functional Requirements** (numbered, testable statements)
5. **Non-Goals (Out of Scope)**
6. **Design Considerations** (optional)
7. **Technical Considerations** (optional)
8. **Success Metrics**
9. **Open Questions**

## BDD Requirements

- The PRD must be written to support later conversion into Gherkin acceptance criteria.
- Functional requirements must be concrete enough to map to `Given/When/Then` scenarios.
- Maintain repository convention: all feature specs live under `spec/YYYYMMDD-feature-slug/`.

## Output

- **Format:** Markdown (`.md`)
- **Directory:** `spec/YYYYMMDD-feature-slug/`
- **Filename:** `prd.md`

## OpenCode Implementation Notes

- Prefer OpenCode-native tools to inspect and write files.
- Create the target directory path if it does not exist.
- Do not implement the feature during this command.
- Do not generate `acceptance.feature` here; that is handled by the planning command.

## Completion Criteria

The command is complete when:

1. Clarifying questions were asked and answered.
2. `spec/YYYYMMDD-feature-slug/prd.md` exists.
3. PRD content follows the structure above and reflects user answers.
4. User is informed they can run the planning command next.
