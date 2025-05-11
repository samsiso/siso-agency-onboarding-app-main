# Optimized Prompts for Shrimp Task Manager

These prompts are designed to enhance the Shrimp Task Manager's effectiveness in planning, organizing, and tracking development tasks.

## Project Planning Prompts

### Project Breakdown

```
Analyze the project requirements for our [PROJECT_NAME] and break it down into:
1. Core functional modules
2. Technical architecture layers
3. UI/UX components
4. Data models and storage requirements
5. Integration touchpoints

For each component, define:
- Estimated complexity (1-5)
- Dependencies on other components
- Logical sequencing for development
- Required expertise

Present this as a structured breakdown with clear relationships between components.
```

### Sprint Planning

```
Based on our current project status for [PROJECT_NAME], help me plan the next 2-week sprint by:

1. Reviewing our backlog and identifying the highest priority items
2. Grouping related tasks for efficient development
3. Balancing technical debt against new features
4. Accounting for dependencies between tasks
5. Considering team member strengths and availability
6. Creating a realistic timeline with buffer for unexpected issues

Structure this as a day-by-day plan with clear outcomes for each milestone.
```

## Task Management Prompts

### Task Refinement

```
For the following task:
[TASK_DESCRIPTION]

Help me refine it by:
1. Breaking it into atomic sub-tasks (no more than 2-4 hours each)
2. Identifying potential blockers or dependencies
3. Listing required resources, libraries, or references
4. Adding acceptance criteria for completion verification
5. Suggesting any optimizations or alternatives

Present this as a comprehensive task card ready for implementation.
```

### Technical Design Prompt

```
For the feature we're building: [FEATURE_NAME]

Create a detailed technical design considering:
1. Component architecture and relationships
2. Data flow between components
3. State management strategy
4. API contracts and interfaces
5. Error handling approach
6. Testing strategy
7. Performance considerations

Include diagrams or pseudocode where helpful. This design should bridge the gap between requirements and implementation.
```

## Progress Tracking Prompts

### Daily Standup Facilitation

```
Help me conduct an effective standup by analyzing:
1. Yesterday's tasks - what was completed and what wasn't
2. Today's priorities based on our sprint goals
3. Potential blockers that need addressing
4. Dependencies that might affect other team members
5. Any scope adjustments needed to stay on track

For each team member, generate questions that will elicit useful status updates rather than general progress reports.
```

### Sprint Review

```
Analyze our sprint performance with:
1. Completion rate of planned tasks
2. Quality metrics from testing/reviews
3. Blockers that emerged and their resolution
4. Knowledge gained and lessons learned
5. Recommendations for process improvements

Compare this sprint to previous ones to identify trends and suggest specific adjustments for our next sprint planning session.
```

## Integration Prompts for Multi-Agent Workflow

### Handoff to Code Architect

```
Based on the task breakdown for [FEATURE_NAME], prepare a briefing for the Code Architect agent that includes:
1. Business context and user requirements
2. Technical constraints and dependencies
3. Performance and security considerations
4. Existing patterns to follow
5. Key questions that need architectural decisions

Structure this to maximize the effectiveness of the architectural design phase.
```

### UI Component Requirements

```
For the [UI_FEATURE] we're developing, prepare detailed requirements for our UI Specialist agent including:
1. User journey and interaction flows
2. Core functionality requirements
3. Responsive behavior expectations
4. Accessibility needs
5. State management requirements
6. Visual style guidelines to follow

Include any existing components that should be referenced for consistency.
```

### Test Planning

```
For the feature [FEATURE_NAME] that's nearing completion, prepare a test planning brief for our Testing agent that includes:
1. Core functionality to verify
2. Edge cases and failure scenarios to test
3. Performance aspects to measure
4. Security considerations to validate
5. Integration points to verify

Structure this to ensure comprehensive test coverage while focusing on the highest-risk areas.
```

## Continuous Improvement Prompts

### Agent Performance Optimization

```
Review our agent ecosystem performance over the past [TIME_PERIOD] and identify:
1. Areas where agents are providing the most value
2. Gaps or inefficiencies in our current process
3. Communication breakdowns between agents
4. Opportunities to refine agent prompts
5. New capabilities to explore

Provide specific recommendations for improving our multi-agent workflow.
```

### Knowledge Management

```
Based on our recent development work on [FEATURE_NAME], help me capture and organize:
1. Technical decisions made and their rationale
2. Useful patterns discovered or applied
3. Challenges encountered and how they were solved
4. External resources that proved valuable
5. Areas for future optimization

Structure this knowledge in a way that makes it easily retrievable and applicable to future work.
``` 