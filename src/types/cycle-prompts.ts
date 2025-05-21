import { CycleStep } from './auto-prompts';

export interface CyclePromptTemplate {
  title: string;
  description: string;
  promptTemplate: string;
  key: string;
  cycleStep: CycleStep;
  estimatedTime: string;
  order: number;
}

export interface PageCycleConfig {
  pageRoute: string;
  pageName: string;
  promptTemplates: CyclePromptTemplate[];
  currentStep: CycleStep;
  startedAt?: Date;
  completedSteps: CycleStep[];
}

// Frontend development prompt templates
export const FRONTEND_CYCLE_TEMPLATES: Record<CycleStep, CyclePromptTemplate> = {
  // Review step - Analyze existing UI/UX, requirements, and project context
  review: {
    key: 'frontend-review',
    cycleStep: CycleStep.Review,
    title: 'Initial UI/UX Review',
    description: 'Assessment of requirements and existing design patterns',
    estimatedTime: '30-60 minutes',
    order: 1,
    promptTemplate: `
# Initial UI/UX Review for [PAGE_NAME]

## Context
- Page: [PAGE_NAME] ([PAGE_ROUTE])
- Project: [PROJECT_NAME]

## Review Tasks
1. Analyze the existing design system components and patterns
2. Review the requirements document for this page
3. Review similar pages in the application for consistency
4. Identify potential UI/UX challenges and constraints
5. Document existing components that can be reused

## Questions to Answer
- What is the primary purpose of this page?
- Who are the primary users of this page?
- What key actions will users take on this page?
- What design patterns should be consistent with other pages?
- Are there any accessibility considerations for this page?
- What responsive design requirements exist?

## Deliverables
- Summary of existing patterns and components to leverage
- Initial component inventory needed for this page
- List of potential design challenges to address
- Recommendations for design consistency
    `
  },

  // Analysis step - Deep dive into technical requirements
  analysis: {
    key: 'frontend-analysis',
    cycleStep: CycleStep.Analysis,
    title: 'Technical Analysis',
    description: 'Deep dive into technical requirements and constraints',
    estimatedTime: '1-2 hours',
    order: 2,
    promptTemplate: `
# Technical Analysis for [PAGE_NAME]

## Context
- Page: [PAGE_NAME] ([PAGE_ROUTE])
- Previous Step: Initial UI/UX Review
- Project: [PROJECT_NAME]

## Analysis Tasks
1. Identify all required data points and API endpoints
2. Analyze state management requirements
3. Map out component hierarchy and relationships
4. Assess performance considerations
5. Identify reusable components vs. new components
6. Analyze routing and navigation requirements

## Technical Questions
- What API endpoints will this page need to interact with?
- What user interactions need to be handled?
- What state needs to be managed locally vs. globally?
- Are there any complex rendering patterns needed?
- What performance optimizations should be considered?
- How does this page integrate with the rest of the application?

## Deliverables
- Detailed component breakdown
- Data requirements document
- State management plan
- Technical constraints and considerations
- List of dependencies and required libraries
    `
  },

  // Innovation step - Brainstorming and exploring solutions
  innovation: {
    key: 'frontend-innovation',
    cycleStep: CycleStep.Innovation,
    title: 'UI/UX Innovation',
    description: 'Explore creative solutions and improvements',
    estimatedTime: '1-3 hours',
    order: 3,
    promptTemplate: `
# UI/UX Innovation for [PAGE_NAME]

## Context
- Page: [PAGE_NAME] ([PAGE_ROUTE])
- Previous Steps: Initial Review, Technical Analysis
- Project: [PROJECT_NAME]

## Innovation Tasks
1. Brainstorm multiple approaches to the UI/UX
2. Explore innovative interaction patterns
3. Consider cutting-edge design trends applicable to this page
4. Research competitive solutions for inspiration
5. Think beyond requirements to enhance user experience

## Creative Questions
- How could this page exceed user expectations?
- What innovative interactions could improve usability?
- Are there any emerging UI patterns we could leverage?
- How can we make this page more engaging and intuitive?
- What creative solutions exist for the technical constraints?
- How might we improve on competitive solutions?

## Deliverables
- 2-3 creative UI/UX approaches
- Novel interaction patterns to consider
- Visualization of innovative elements
- Pros and cons of each innovative approach
- Recommendations for implementation
    `
  },

  // Planning step - Detailed implementation plan
  planning: {
    key: 'frontend-planning',
    cycleStep: CycleStep.Planning,
    title: 'Implementation Planning',
    description: 'Develop detailed technical implementation plan',
    estimatedTime: '1-2 hours',
    order: 4,
    promptTemplate: `
# Implementation Planning for [PAGE_NAME]

## Context
- Page: [PAGE_NAME] ([PAGE_ROUTE])
- Previous Steps: Review, Analysis, Innovation
- Project: [PROJECT_NAME]

## Planning Tasks
1. Define component structure and hierarchy
2. Map out state management approach
3. Plan API integration points
4. Define responsive design breakpoints
5. Create implementation sequence and milestones
6. Plan testing approach

## Implementation Questions
- What is the optimal component structure?
- How should we organize the codebase for this page?
- What is the sequence of implementation tasks?
- What dependencies and libraries are needed?
- How will we handle loading, error, and empty states?
- What testing strategy should we use?

## Deliverables
- Detailed component tree
- State management diagram
- API integration plan
- Implementation roadmap with milestones
- Testing plan with key test cases
- Resource and time estimates
    `
  },

  // Execution1 step - Core structure implementation
  execution_1: {
    key: 'frontend-execution-1',
    cycleStep: CycleStep.Execution1,
    title: 'Core Implementation',
    description: 'Build the core structure and layout',
    estimatedTime: '2-4 hours',
    order: 5,
    promptTemplate: `
# Core Implementation for [PAGE_NAME]

## Context
- Page: [PAGE_NAME] ([PAGE_ROUTE])
- Previous Steps: Planning completed
- Project: [PROJECT_NAME]

## Execution Tasks (Phase 1)
1. Set up the page component structure
2. Implement the basic layout and responsive grid
3. Create placeholder components
4. Setup routing and navigation
5. Implement the basic state management structure
6. Setup API service functions (without integration)

## Implementation Questions
- How should we organize the component files?
- What layout strategy works best for this page?
- How should we handle responsive breakpoints?
- What placeholder content should we use?
- How will navigation work?

## Deliverables
- Core component structure completed
- Basic layout and responsiveness implemented
- Navigation and routing setup
- Placeholder components created
- State management structure initialized
    `
  },

  // Execution2 step - Data integration and interactions
  execution_2: {
    key: 'frontend-execution-2',
    cycleStep: CycleStep.Execution2,
    title: 'Data Integration',
    description: 'Integrate data and implement interactions',
    estimatedTime: '2-4 hours',
    order: 6,
    promptTemplate: `
# Data Integration for [PAGE_NAME]

## Context
- Page: [PAGE_NAME] ([PAGE_ROUTE])
- Previous Steps: Core Implementation completed
- Project: [PROJECT_NAME]

## Execution Tasks (Phase 2)
1. Connect API endpoints to service functions
2. Implement data fetching with loading states
3. Add error handling for API requests
4. Implement form validation if applicable
5. Connect global state to components
6. Implement data-driven UI elements
7. Handle data mutations and updates

## Implementation Questions
- How should we handle loading and error states?
- What's the best approach for data caching?
- How should we structure the data flow?
- What validation rules should we apply to forms?
- How will we handle optimistic updates?

## Deliverables
- Working API integration
- Complete data flow implementation
- Loading and error states handled
- Form validation implemented
- Data mutations and updates working
    `
  },

  // Execution3 step - Polishing and refinement
  execution_3: {
    key: 'frontend-execution-3',
    cycleStep: CycleStep.Execution3,
    title: 'Refinement & Polish',
    description: 'Refine UI details and optimize performance',
    estimatedTime: '2-4 hours',
    order: 7,
    promptTemplate: `
# Refinement & Polish for [PAGE_NAME]

## Context
- Page: [PAGE_NAME] ([PAGE_ROUTE])
- Previous Steps: Data Integration completed
- Project: [PROJECT_NAME]

## Execution Tasks (Phase 3)
1. Implement detailed styling and animations
2. Add micro-interactions and feedback
3. Optimize performance (lazy loading, memoization)
4. Implement edge cases handling
5. Add accessibility features (ARIA attributes, keyboard navigation)
6. Implement advanced features and enhancements
7. Add final polish and visual refinements

## Implementation Questions
- What animations and transitions would enhance the experience?
- Are there any performance bottlenecks to address?
- What edge cases need special handling?
- How can we enhance accessibility?
- What final polish would elevate the user experience?

## Deliverables
- Fully styled and animated UI
- Performance optimizations implemented
- Edge cases handled
- Accessibility features implemented
- Final visual polish and refinements
    `
  },

  // Final Review step - Testing, documentation, and review
  final_review: {
    key: 'frontend-final-review',
    cycleStep: CycleStep.FinalReview,
    title: 'Final Review',
    description: 'Testing, documentation, and code review',
    estimatedTime: '1-2 hours',
    order: 8,
    promptTemplate: `
# Final Review for [PAGE_NAME]

## Context
- Page: [PAGE_NAME] ([PAGE_ROUTE])
- Implementation Complete
- Project: [PROJECT_NAME]

## Review Tasks
1. Perform comprehensive testing across browsers and devices
2. Review code quality and performance
3. Document the implementation and key decisions
4. Verify accessibility compliance
5. Review against original requirements
6. Create demo or walkthrough of the page

## Review Questions
- Does the implementation meet all requirements?
- Is the code clean, maintainable, and well-documented?
- Does the page perform well on all target devices?
- Are there any accessibility issues to address?
- What lessons learned should we apply to future pages?
- What features could be implemented in the future?

## Deliverables
- Testing summary and results
- Code review feedback and changes
- Documentation of implementation
- Performance metrics and analysis
- Accessibility compliance report
- Future improvement recommendations
    `
  }
};

// Function to generate a new cycle prompt based on a template
export function generateCyclePrompt(
  template: CyclePromptTemplate,
  pageName: string,
  pageRoute: string,
  projectName: string
): string {
  return template.promptTemplate
    .replace(/\[PAGE_NAME\]/g, pageName)
    .replace(/\[PAGE_ROUTE\]/g, pageRoute)
    .replace(/\[PROJECT_NAME\]/g, projectName);
}

// Function to initialize a new page cycle with all templates
export function initializePageCycle(
  pageName: string,
  pageRoute: string
): PageCycleConfig {
  return {
    pageName,
    pageRoute,
    promptTemplates: Object.values(FRONTEND_CYCLE_TEMPLATES),
    currentStep: CycleStep.Review,
    completedSteps: [],
  };
} 