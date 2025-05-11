# Iterative Page Development Workflow

This template provides a structured approach for developing multiple pages from a specification and then systematically improving them with inspiration from 21st.dev components and visual testing.

## Workflow Overview

1. Parse specification and create list of required pages
2. Implement basic version of each page
3. Iteratively improve each page using:
   - 21st.dev component inspiration
   - Playwright visual testing
   - Refinement cycles
4. Move to next page when current page meets quality standards

## Initial Specification Analysis

```
Let's start a page development session for our application.

Session ID: PAGES-[DATE]
Focus: Create and iteratively improve pages from specification
Current Phase: Specification Analysis

Specification:
[PASTE YOUR SPECIFICATION HERE]

Please analyze this specification and:
1. Extract a list of all pages that need to be implemented
2. For each page, identify key components, features, and data requirements
3. Prioritize pages in order of implementation
4. Outline a development plan for the first page

Once complete, suggest the next prompt for implementing the first page.
```

## Page Implementation Template

```
Continuing Session PAGES-[DATE]
Previous Phase: [PREVIOUS_PHASE]
Current Phase: Implementation - [PAGE_NAME]
Completed Steps:
- [LIST_COMPLETED_STEPS]

Let's implement a basic version of the [PAGE_NAME] page:

1. Create the base component structure
2. Implement the layout using our standard patterns with Tailwind CSS
3. Add placeholder components for all required features
4. Ensure TypeScript typing is complete
5. Implement basic responsive behavior

Refer to these features from our specification:
[RELEVANT_SPECIFICATION_DETAILS]

I'll need:
- Page component file structure
- Key UI elements
- Routing integration
- Basic styling

Please implement this initial version of the page.
```

## 21st.dev Inspiration Cycle

```
Continuing Session PAGES-[DATE]
Previous Phase: Basic Implementation - [PAGE_NAME]
Current Phase: UI Enhancement - [PAGE_NAME]
Completed Steps:
- [LIST_COMPLETED_STEPS]

Now I want to improve the [PAGE_NAME] page using inspiration from 21st.dev.

For this page, we need enhanced versions of these components:
1. [COMPONENT_1]
2. [COMPONENT_2]
3. [COMPONENT_3]

For each component:
1. Search for inspiration using the 21st Magic Component MCP
2. Suggest improved implementation that maintains our design system
3. Show before/after comparison

Once you've gathered inspiration, implement the improvements to the page.
```

## Visual Testing Cycle

```
Continuing Session PAGES-[DATE]
Previous Phase: UI Enhancement - [PAGE_NAME]
Current Phase: Visual Testing - [PAGE_NAME]
Completed Steps:
- [LIST_COMPLETED_STEPS]

Now let's use Playwright to visually test the [PAGE_NAME] page and identify further improvements.

Please:
1. Create a Playwright test script that will navigate to the page
2. Take screenshots at different viewport sizes
3. Analyze the screenshots for UI issues:
   - Layout problems
   - Responsive design issues
   - Visual consistency
   - Accessibility concerns
4. Generate a list of improvements based on the analysis

Focus particularly on:
- Mobile responsiveness
- Visual hierarchy
- Component spacing and alignment
- Color contrast and accessibility
```

## Refinement Cycle

```
Continuing Session PAGES-[DATE]
Previous Phase: Visual Testing - [PAGE_NAME]
Current Phase: Refinement - [PAGE_NAME]
Completed Steps:
- [LIST_COMPLETED_STEPS]

Based on our visual testing, let's refine the [PAGE_NAME] page with these improvements:
[LIST_IDENTIFIED_IMPROVEMENTS]

For each improvement:
1. Implement the necessary changes
2. Explain the reasoning behind the change
3. Show before/after code if applicable

Once these refinements are complete, we'll evaluate if the page meets our quality standards or needs another refinement cycle.
```

## Quality Assessment Cycle

```
Continuing Session PAGES-[DATE]
Previous Phase: Refinement - [PAGE_NAME] (Cycle [CYCLE_NUMBER])
Current Phase: Quality Assessment - [PAGE_NAME]
Completed Steps:
- [LIST_COMPLETED_STEPS]

Let's assess the quality of our [PAGE_NAME] page against these criteria:
1. Visual design (1-10)
2. Responsiveness (1-10)
3. Component organization (1-10)
4. TypeScript quality (1-10)
5. Accessibility (1-10)
6. Performance (1-10)

For each criterion:
- Provide a score
- Explain the rationale
- Suggest further improvements if score is below 8

If all scores are 8 or above, we'll move to the next page.
If any score is below 8, we'll do another refinement cycle focusing on the lowest-scoring areas.
```

## Page Transition Template

```
Continuing Session PAGES-[DATE]
Previous Phase: Quality Assessment - [PAGE_NAME]
Current Phase: Transition to Next Page
Completed Steps:
- [LIST_COMPLETED_STEPS]

The [PAGE_NAME] page has met our quality standards:
[SHOW_FINAL_SCORES]

Let's proceed to the next page: [NEXT_PAGE_NAME]

Brief specification for [NEXT_PAGE_NAME]:
[RELEVANT_SPECIFICATION_DETAILS]

Suggest the next prompt to begin implementation of [NEXT_PAGE_NAME].
```

## Session State Tracking

To keep track of progress across the entire session, maintain this state object:

```
SESSION_STATE = {
  "allPages": ["Page1", "Page2", "Page3"], // From initial analysis
  "completedPages": ["Page1"], // Pages that have reached quality standards
  "currentPage": "Page2", // Current page being worked on
  "currentPhase": "Implementation", // Current phase for this page
  "pageHistory": {
    "Page1": {
      "implementationCycles": 1,
      "enhancementCycles": 2,
      "visualTestingCycles": 1,
      "refinementCycles": 2,
      "finalScores": {
        "visualDesign": 9,
        "responsiveness": 8,
        "componentOrganization": 9,
        "typescriptQuality": 8,
        "accessibility": 8,
        "performance": 9
      }
    }
  }
}
```

## Tips for Maximum Efficiency

1. **Detailed Specification**: Provide as much detail as possible in the initial specification
2. **Reference Existing Pages**: Point to similar pages in the codebase for styling consistency
3. **Visual Examples**: Include links to design mockups or similar pages during enhancement phases
4. **Incremental Improvements**: Don't try to perfect everything at once; allow multiple refinement cycles
5. **Track Time Per Page**: Set a maximum number of refinement cycles per page to ensure progress
6. **Be Specific About Priorities**: During refinement, specify which aspects are most important to improve 