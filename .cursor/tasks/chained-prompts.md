# Chained Prompts for Continuous Development

This document contains templates for creating continuous development workflows in Cursor through chained prompts.

## How Chained Prompts Work

1. Each prompt includes instructions to complete a specific task
2. At the end of its response, Cursor will suggest the next prompt to run
3. You can copy the suggested next prompt and run it immediately
4. This creates a continuous workflow without needing to formulate new prompts

## Template Structure

```
[TASK DESCRIPTION]

Once you've completed this task, suggest the next logical step by providing a ready-to-copy prompt that continues this development flow. Format your suggestion like this:

NEXT PROMPT: [Next task description with detailed context from what you've just learned/done]
```

## Chained Workflow Examples

### Feature Development Workflow

#### Step 1: Requirements Analysis

```
Analyze the following feature requirements and break them down into technical components:

[PASTE FEATURE REQUIREMENTS HERE]

Consider all aspects including UI components, data models, API needs, and state management.

Once you've completed this analysis, suggest the next logical step by providing a ready-to-copy prompt that continues this development flow. Format your suggestion like this:

NEXT PROMPT: [Next task description with detailed context from what you've just learned]
```

#### Step 2: Component Design

The AI will suggest something like:

```
NEXT PROMPT: Based on the requirements analysis, design the component architecture for this feature. Create a diagram or structured outline showing the relationship between components, data flow, and state management. Include TypeScript interfaces for the data models.
```

#### Step 3: Implementation

The AI will suggest something like:

```
NEXT PROMPT: Implement the [SPECIFIC_COMPONENT] according to the design. Start with the TypeScript interfaces, then create the component structure, followed by the logic implementation. Use our project's standard patterns with React, TypeScript, and Tailwind CSS.
```

#### Step 4: Testing

The AI will suggest something like:

```
NEXT PROMPT: Create tests for the newly implemented [SPECIFIC_COMPONENT]. Include unit tests for the core logic and component tests for rendering and interaction. Ensure all edge cases are covered based on the requirements.
```

### Bug Fix Workflow

#### Step 1: Issue Analysis

```
Analyze the following bug report and identify potential causes:

[PASTE BUG REPORT HERE]

Explore possible areas in the code where this issue might originate.

Once you've completed this analysis, suggest the next logical step by providing a ready-to-copy prompt that continues this development flow. Format your suggestion like this:

NEXT PROMPT: [Next task description with detailed context from what you've just learned]
```

#### Step 2: Debugging

The AI will suggest something like:

```
NEXT PROMPT: Let's examine the [SPECIFIC_COMPONENT] identified in the analysis. Show the relevant code sections and identify the specific issues causing the bug. Track the data flow and state changes to pinpoint the exact problem.
```

#### Step 3: Fix Implementation

The AI will suggest something like:

```
NEXT PROMPT: Implement a fix for the bug in [SPECIFIC_COMPONENT]. Modify the [SPECIFIC_FUNCTION] to correctly handle the [SPECIFIC_CASE] that's causing the issue. Ensure the fix preserves existing functionality while addressing the bug.
```

#### Step 4: Verification

The AI will suggest something like:

```
NEXT PROMPT: Create a test case that verifies the bug fix for [SPECIFIC_COMPONENT]. The test should reproduce the original issue and confirm that the fix resolves it. Also check for any potential regressions.
```

## Best Practices for Chained Prompts

1. **Include Context**: Each prompt should contain sufficient context from previous steps
2. **Clear Deliverables**: Specify exactly what you expect the AI to produce
3. **Self-Documenting**: The chain of prompts should document the development process
4. **Incremental Progress**: Break complex tasks into smaller, manageable prompts
5. **Verification Steps**: Include verification prompts to ensure quality 