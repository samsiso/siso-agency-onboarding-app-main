# Sequential Thinking Templates for Architecture & Design

These templates are optimized for using the Sequential Thinking MCP to solve complex architectural challenges through a step-by-step approach.

## Architecture Design Template

```
I need to design the architecture for [COMPONENT/SYSTEM]. Let me think through this:

thoughtNumber: 1
totalThoughts: 10
thought: First, I'll identify the core requirements and constraints for this [COMPONENT/SYSTEM].
[LIST REQUIREMENTS AND CONSTRAINTS]
nextThoughtNeeded: true

thoughtNumber: 2
totalThoughts: 10
thought: Now I'll analyze existing patterns in our codebase that might inform this design.
[EXAMINE EXISTING PATTERNS]
nextThoughtNeeded: true

thoughtNumber: 3
totalThoughts: 10
thought: Let me identify the key data entities and their relationships.
[MAP OUT DATA MODELS]
nextThoughtNeeded: true

thoughtNumber: 4
totalThoughts: 10
thought: Next, I'll define the component boundaries and interfaces.
[DEFINE COMPONENT INTERFACES]
nextThoughtNeeded: true

thoughtNumber: 5
totalThoughts: 10
thought: Now I'll consider the communication patterns between components.
[ANALYZE COMMUNICATION PATTERNS]
nextThoughtNeeded: true

thoughtNumber: 6
totalThoughts: 10
thought: I need to evaluate state management options for these components.
[EVALUATE STATE MANAGEMENT]
nextThoughtNeeded: true

thoughtNumber: 7
totalThoughts: 10
thought: Let me think through potential failure modes and error handling strategies.
[DESIGN ERROR HANDLING]
nextThoughtNeeded: true

thoughtNumber: 8
totalThoughts: 10
thought: I should consider performance implications of this design.
[ANALYZE PERFORMANCE CHARACTERISTICS]
nextThoughtNeeded: true

thoughtNumber: 9
totalThoughts: 10
thought: Now I'll verify the design against the original requirements.
[VERIFY AGAINST REQUIREMENTS]
nextThoughtNeeded: true

thoughtNumber: 10
totalThoughts: 10
thought: Time to summarize the architecture in a clear, communicable format.
[SUMMARIZE ARCHITECTURE]
nextThoughtNeeded: false
```

## Component Design Template

```
I need to design the implementation approach for [COMPONENT]. Let me think step-by-step:

thoughtNumber: 1
totalThoughts: 8
thought: First, I'll clarify the purpose and responsibilities of this component.
[DEFINE PURPOSE AND RESPONSIBILITIES]
nextThoughtNeeded: true

thoughtNumber: 2
totalThoughts: 8
thought: Next, I'll identify the technical interfaces this component needs to implement.
[DEFINE INTERFACES]
nextThoughtNeeded: true

thoughtNumber: 3
totalThoughts: 8
thought: Let me define the internal structure and key classes/functions.
[OUTLINE STRUCTURE]
nextThoughtNeeded: true

thoughtNumber: 4
totalThoughts: 8
thought: Now I'll consider the data flow within this component.
[MAP DATA FLOW]
nextThoughtNeeded: true

thoughtNumber: 5
totalThoughts: 8
thought: I need to identify external dependencies and integrations.
[LIST DEPENDENCIES]
nextThoughtNeeded: true

thoughtNumber: 6
totalThoughts: 8
thought: Let me define the testing strategy for this component.
[OUTLINE TESTING APPROACH]
nextThoughtNeeded: true

thoughtNumber: 7
totalThoughts: 8
thought: I should consider edge cases and error scenarios.
[ANALYZE EDGE CASES]
nextThoughtNeeded: true

thoughtNumber: 8
totalThoughts: 8
thought: Time to summarize the component design with example code snippets.
[PROVIDE IMPLEMENTATION EXAMPLES]
nextThoughtNeeded: false
```

## API Contract Design Template

```
I need to design the API contract for [FEATURE/SERVICE]. Let me think methodically:

thoughtNumber: 1
totalThoughts: 7
thought: First, I'll identify the primary use cases this API needs to support.
[LIST USE CASES]
nextThoughtNeeded: true

thoughtNumber: 2
totalThoughts: 7
thought: Now I'll define the resource models and their relationships.
[DEFINE RESOURCES]
nextThoughtNeeded: true

thoughtNumber: 3
totalThoughts: 7
thought: Let me design the endpoints structure and naming conventions.
[DESIGN ENDPOINTS]
nextThoughtNeeded: true

thoughtNumber: 4
totalThoughts: 7
thought: I need to define request/response formats and status codes.
[DEFINE FORMATS]
nextThoughtNeeded: true

thoughtNumber: 5
totalThoughts: 7
thought: Now I'll consider authentication, authorization, and security considerations.
[ADDRESS SECURITY]
nextThoughtNeeded: true

thoughtNumber: 6
totalThoughts: 7
thought: Let me think about versioning, deprecation, and evolution strategies.
[PLAN FOR EVOLUTION]
nextThoughtNeeded: true

thoughtNumber: 7
totalThoughts: 7
thought: Time to document the complete API contract with examples.
[DOCUMENT CONTRACT]
nextThoughtNeeded: false
```

## Refactoring Analysis Template

```
I need to analyze how to refactor [CODE AREA] for improved maintainability. Let me think through this:

thoughtNumber: 1
totalThoughts: 6
thought: First, I'll identify the pain points and issues in the current implementation.
[LIST ISSUES]
nextThoughtNeeded: true

thoughtNumber: 2
totalThoughts: 6
thought: Let me analyze patterns and anti-patterns in the current code.
[ANALYZE PATTERNS]
nextThoughtNeeded: true

thoughtNumber: 3
totalThoughts: 6
thought: Now I'll identify potential refactoring strategies and their trade-offs.
[EXPLORE STRATEGIES]
nextThoughtNeeded: true

thoughtNumber: 4
totalThoughts: 6
thought: I need to consider the impact and risks of refactoring.
[ASSESS RISKS]
nextThoughtNeeded: true

thoughtNumber: 5
totalThoughts: 6
thought: Let me plan incremental steps for this refactoring to ensure safety.
[PLAN STEPS]
nextThoughtNeeded: true

thoughtNumber: 6
totalThoughts: 6
thought: Time to summarize the refactoring approach with before/after examples.
[PROVIDE EXAMPLES]
nextThoughtNeeded: false
```

## Performance Optimization Template

```
I need to analyze performance issues in [COMPONENT/FEATURE] and recommend optimizations. Let me think step-by-step:

thoughtNumber: 1
totalThoughts: 7
thought: First, I'll define the performance metrics and goals for this component.
[DEFINE METRICS AND GOALS]
nextThoughtNeeded: true

thoughtNumber: 2
totalThoughts: 7
thought: Let me identify potential bottlenecks in the current implementation.
[IDENTIFY BOTTLENECKS]
nextThoughtNeeded: true

thoughtNumber: 3
totalThoughts: 7
thought: Now I'll analyze algorithmic complexity and efficiency.
[ANALYZE COMPLEXITY]
nextThoughtNeeded: true

thoughtNumber: 4
totalThoughts: 7
thought: I need to consider data structures and memory usage patterns.
[EVALUATE DATA STRUCTURES]
nextThoughtNeeded: true

thoughtNumber: 5
totalThoughts: 7
thought: Let me explore caching, memoization, and other optimization techniques.
[EXPLORE TECHNIQUES]
nextThoughtNeeded: true

thoughtNumber: 6
totalThoughts: 7
thought: I should consider trade-offs between performance and code clarity.
[ANALYZE TRADE-OFFS]
nextThoughtNeeded: true

thoughtNumber: 7
totalThoughts: 7
thought: Time to provide specific optimization recommendations with examples.
[PROVIDE RECOMMENDATIONS]
nextThoughtNeeded: false
```

## Integration Design Template

```
I need to design the integration between [SYSTEM A] and [SYSTEM B]. Let me think through this systematically:

thoughtNumber: 1
totalThoughts: 8
thought: First, I'll clarify the purpose and requirements for this integration.
[DEFINE REQUIREMENTS]
nextThoughtNeeded: true

thoughtNumber: 2
totalThoughts: 8
thought: Let me analyze the interfaces and data models of both systems.
[ANALYZE INTERFACES]
nextThoughtNeeded: true

thoughtNumber: 3
totalThoughts: 8
thought: I need to identify data transformation and mapping requirements.
[DEFINE TRANSFORMATIONS]
nextThoughtNeeded: true

thoughtNumber: 4
totalThoughts: 8
thought: Now I'll consider synchronization patterns and consistency requirements.
[CONSIDER SYNCHRONIZATION]
nextThoughtNeeded: true

thoughtNumber: 5
totalThoughts: 8
thought: Let me think about error handling and recovery mechanisms.
[DESIGN ERROR HANDLING]
nextThoughtNeeded: true

thoughtNumber: 6
totalThoughts: 8
thought: I should consider security and authentication between the systems.
[ADDRESS SECURITY]
nextThoughtNeeded: true

thoughtNumber: 7
totalThoughts: 8
thought: Let me evaluate performance and scalability considerations.
[EVALUATE PERFORMANCE]
nextThoughtNeeded: true

thoughtNumber: 8
totalThoughts: 8
thought: Time to summarize the integration approach with sequence diagrams.
[PROVIDE DIAGRAMS]
nextThoughtNeeded: false
``` 