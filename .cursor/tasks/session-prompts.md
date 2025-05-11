# Session Management for Prolonged Development Tasks

This document provides templates for managing long-running development sessions in Cursor by creating state awareness across multiple prompts.

## Session Context Management

The key to automated continuation is maintaining context across multiple interactions. These templates help the AI remember what it's done and what's next.

### Session Initialization Template

```
Let's start a development session for: [TASK_DESCRIPTION]

Session ID: [UNIQUE_IDENTIFIER]
Focus: [PRIMARY_GOAL]
Current Phase: Planning

Please maintain this session context in your responses and reference the Session ID in each reply.

First, let's analyze the requirements and break down this task into concrete steps.
```

### Context Continuation Template

```
Continuing Session [SESSION_ID] for [TASK_DESCRIPTION]
Previous Phase: [LAST_PHASE]
Current Phase: [CURRENT_PHASE]
Completed Steps:
- [STEP_1]
- [STEP_2]

Let's proceed with the next step: [NEXT_STEP_DESCRIPTION]
```

### Session Summary Template

```
Please summarize Session [SESSION_ID] for [TASK_DESCRIPTION]
Track progress against our initial plan, highlight completed items, current status, and remaining work.
Also suggest the next session prompt to continue this work.
```

## Example Session Workflow

### Initial Session Start

```
Let's start a development session for: Creating a data visualization dashboard component

Session ID: DASH-20230812
Focus: Implement a responsive dashboard with interactive charts
Current Phase: Planning

Please maintain this session context in your responses and reference the Session ID in each reply.

First, let's analyze the requirements and break down this task into concrete steps.
```

### Continuation After Planning

```
Continuing Session DASH-20230812 for Creating a data visualization dashboard component
Previous Phase: Planning
Current Phase: Component Structure
Completed Steps:
- Analyzed requirements
- Identified necessary chart types (bar, line, pie)
- Listed required data models and props
- Documented responsive behavior requirements

Let's proceed with creating the basic component structure and TypeScript interfaces.
```

### Continuation After Structure

```
Continuing Session DASH-20230812 for Creating a data visualization dashboard component
Previous Phase: Component Structure
Current Phase: Implementation
Completed Steps:
- Analyzed requirements
- Identified necessary chart types (bar, line, pie)
- Listed required data models and props
- Documented responsive behavior requirements
- Created TypeScript interfaces for all data models
- Established base component structure with props validation
- Set up responsive container layouts

Let's implement the chart rendering logic starting with the bar chart component.
```

## Session State Object

For complex sessions, include a structured state object:

```
Continuing Session [SESSION_ID]

SESSION_STATE = {
  "task": "[TASK_DESCRIPTION]",
  "currentPhase": "[CURRENT_PHASE]",
  "completedPhases": ["PHASE_1", "PHASE_2"],
  "artifacts": {
    "components": ["ComponentA", "ComponentB"],
    "interfaces": ["InterfaceA", "InterfaceB"],
    "utils": ["UtilA", "UtilB"]
  },
  "currentFocus": "[SPECIFIC_ELEMENT]",
  "nextSteps": ["STEP_1", "STEP_2"],
  "blockers": ["BLOCKER_1"]
}

Let's continue by addressing [NEXT_FOCUS]...
```

## Tips for Effective Session Management

1. **Unique Identifiers**: Use descriptive session IDs that are easy to reference
2. **Phase Tracking**: Clearly mark transitions between development phases
3. **Completion Log**: Maintain a running log of completed steps
4. **Artifact Registry**: Track created/modified files and components
5. **Next Actions**: Always end with clear next actions
6. **Regular Summaries**: Periodically generate session summaries
7. **State Persistence**: Copy the session state object for your records between sessions 