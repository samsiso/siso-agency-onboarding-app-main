# Cursor Task Automation System

This directory contains templates and strategies for maximizing productivity with Cursor by creating semi-automated workflows that reduce the need for manual prompt crafting.

## Overview

While full automation without any user interaction isn't currently possible in Cursor, these techniques provide the next best thing: structured templates that let you rapidly chain AI interactions with minimal effort, creating a smooth, continuous development experience.

## Available Techniques

### 1. [Next Steps](./next-steps.md)

Pre-defined tasks that include instructions for the AI to suggest the next logical task, creating a chain of development activities.

- **Best for**: Well-defined, sequential development activities
- **User effort**: Copy-paste task descriptions

### 2. [Chained Prompts](./chained-prompts.md)

Templates that include explicit instructions for the AI to format its next suggested prompt in a copy-paste friendly way.

- **Best for**: Complex workflows with multiple potential paths
- **User effort**: Copy-paste AI-suggested next prompts

### 3. [Session Management](./session-prompts.md)

Techniques for maintaining context across multiple AI interactions through standardized session tracking.

- **Best for**: Long-running development tasks that span multiple interactions
- **User effort**: Maintain session context between interactions

## How to Choose

- **Quick tasks**: Use Next Steps
- **Complex features**: Use Chained Prompts with Session Management
- **Bug fixes**: Use Chained Prompts
- **Refactoring**: Use Session Management

## Getting Started

1. Review the technique documentation files
2. Choose the approach that best fits your current task
3. Copy the relevant template
4. Customize it for your specific needs
5. Use it to initiate your AI interaction

## Integration with Agent Ecosystem

These techniques are designed to work with our established [Agent Ecosystem](./../system-design/agent-ecosystem.md):

- Use Session Management to coordinate activities between different specialized agents
- Create Chained Prompts that explicitly transition between agents for different phases
- Structure Next Steps to align with our agent specialization boundaries

## Contributing

Add your own templates and techniques to this directory as you discover effective patterns. Document what works well and what doesn't to help the team continuously improve our AI workflows. 

This directory contains templates and strategies for maximizing productivity with Cursor by creating semi-automated workflows that reduce the need for manual prompt crafting.

## Overview

While full automation without any user interaction isn't currently possible in Cursor, these techniques provide the next best thing: structured templates that let you rapidly chain AI interactions with minimal effort, creating a smooth, continuous development experience.

## Available Techniques

### 1. [Next Steps](./next-steps.md)

Pre-defined tasks that include instructions for the AI to suggest the next logical task, creating a chain of development activities.

- **Best for**: Well-defined, sequential development activities
- **User effort**: Copy-paste task descriptions

### 2. [Chained Prompts](./chained-prompts.md)

Templates that include explicit instructions for the AI to format its next suggested prompt in a copy-paste friendly way.

- **Best for**: Complex workflows with multiple potential paths
- **User effort**: Copy-paste AI-suggested next prompts

### 3. [Session Management](./session-prompts.md)

Techniques for maintaining context across multiple AI interactions through standardized session tracking.

- **Best for**: Long-running development tasks that span multiple interactions
- **User effort**: Maintain session context between interactions

## How to Choose

- **Quick tasks**: Use Next Steps
- **Complex features**: Use Chained Prompts with Session Management
- **Bug fixes**: Use Chained Prompts
- **Refactoring**: Use Session Management

## Getting Started

1. Review the technique documentation files
2. Choose the approach that best fits your current task
3. Copy the relevant template
4. Customize it for your specific needs
5. Use it to initiate your AI interaction

## Integration with Agent Ecosystem

These techniques are designed to work with our established [Agent Ecosystem](./../system-design/agent-ecosystem.md):

- Use Session Management to coordinate activities between different specialized agents
- Create Chained Prompts that explicitly transition between agents for different phases
- Structure Next Steps to align with our agent specialization boundaries

## Contributing

Add your own templates and techniques to this directory as you discover effective patterns. Document what works well and what doesn't to help the team continuously improve our AI workflows. 