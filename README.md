# LLM-BDD Coding

This project demonstrates a novel approach to Behavior-Driven Development (BDD) using Large Language Models (LLMs) for acceptance testing. Instead of writing traditional e2e test glue code, we leverage LLMs with Model Context Protocol (MCP) to perform acceptance tests based on Gherkin specifications.

## Why This Approach?

Through practical experience, I discovered that coding LLM assistants perform significantly better when given clear, well-defined objectives. This led to the realization that Gherkin syntax is uniquely suited for both human and LLM consumption:

- **Clear Goal Definition**: LLMs excel when they have explicit acceptance criteria to work towards
- **Dual Readability**: Gherkin is naturally readable by both humans and LLMs, creating a shared understanding
- **Cognitive Load Management**: Developers can review and validate acceptance criteria without overwhelming cognitive burden
- **Goal Confirmation**: Both parties can confirm they're working towards the same objectives before implementation begins

## Overview

The project uses Cucumber's Gherkin syntax to define acceptance criteria, but unlike traditional Cucumber implementations, there's no need to write step definitions or glue code. Instead, an LLM (Claude in this example) interprets the Gherkin scenarios and executes them through browser automation via MCP.

## Demo

Watch a demonstration of this approach in action: [LLM-BDD Coding Demo](https://youtu.be/WvGY_Jcm_kY)

## Prerequisites

- Claude Code installed and configured
- Node.js and npm
- A running development server

## Setup

1. Install Playwright MCP in Claude Code:
   ```bash
   claude mcp add playwright npx @playwright/mcp@latest
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Running Acceptance Tests

1. Open Claude Code in your IDE (VS Code/Cursor)
2. Enter the following prompt:
   ```
   Please run acceptance tests based on @spec/20250721-simple-todo-app/acceptance.feature. The dev server is already running at http://localhost:5173/
   ```

Claude will then:
- Read the Gherkin acceptance criteria
- Use Playwright MCP to interact with the browser
- Execute each scenario and validate the expected outcomes
- Report the test results

## Project Structure

```
├── spec/                           # BDD specifications
│   └── 20250721-simple-todo-app/
│       ├── acceptance.feature      # Gherkin acceptance criteria
│       ├── implementation-plan.md  # Implementation roadmap
│       └── prd.md                 # Product requirements
├── src/                           # Application source code
└── README.md                      # This file
```

## AI-assisted BDD development

This repository supports both Claude Code and OpenCode.

### Claude Code
Project instructions: `CLAUDE.md`
Commands: `.claude/commands/`

### OpenCode
Project instructions: `AGENTS.md`
Commands: `.opencode/commands/`

Both workflows use the same BDD specifications under `spec/`
and execute acceptance scenarios through Playwright MCP.

The shared workflow is: PRD -> Gherkin acceptance scenarios -> implementation plan -> implementation -> Playwright MCP acceptance validation.

## Benefits

- **No Glue Code**: Eliminate the maintenance burden of step definitions
- **Natural Language**: Write acceptance criteria in plain Gherkin syntax
- **Flexible Testing**: LLMs can adapt to UI changes without code updates
- **Rapid Validation**: Quickly verify implementations against specifications

## Enhanced Version: BDD + TDD

For even more robust development, you can combine BDD with Test-Driven Development (TDD):

- **BDD**: Handles high-level acceptance testing (as shown in this project)
- **TDD**: Manages component-level test-driven development

### TDD Workflow with LLMs

1. **Interface First**: LLM writes unimplemented interfaces, empty classes, or empty functions
2. **Test Descriptions**: LLM writes test descriptions (the narrative parts in `describe()` and `it()` blocks)
3. **Developer Review**: Developer confirms the test structure aligns with requirements
4. **Test Implementation**: LLM implements the test logic
5. **Red Phase**: Run tests to confirm they all fail
6. **Green Phase**: LLM implements the actual functionality to make tests pass

### TDD Integration

I've published TDD integration rules on GitHub that can be adapted for Claude Code:
- Repository: [cursor-tdd-rules](https://github.com/yurenju/cursor-tdd-rules)
- Originally designed for Cursor but easily adaptable for Claude Code with minor adjustments

This combined BDD + TDD approach provides:
- High-level acceptance criteria through BDD
- Detailed component specifications through TDD
- Clear red-green-refactor cycles
- Better code coverage and design

## Notes

While this example uses Claude Code, the same principle applies to other LLM-powered development tools like Cursor. The key innovation is using LLMs to bridge the gap between human-readable specifications and automated testing.
