# UI Component Request Templates

These templates help you effectively communicate with the 21st Magic Component MCP to create high-quality UI components that match your project's style and requirements.

## Basic Component Request Template

```
/ui Create a [COMPONENT_TYPE] component with the following specifications:

CONTEXT:
This component will be used in [SPECIFIC_PAGE/SECTION] of our application. 
Our application uses React with TypeScript, Tailwind CSS, and shadcn/ui components.
The component should follow our dark-themed design with siso-orange accent colors.

REQUIREMENTS:
1. Purpose: [DESCRIBE_PURPOSE]
2. Key functionality: [LIST_FUNCTIONALITY]
3. Props/parameters: [LIST_PROPS]
4. States: [DESCRIBE_STATES] (e.g., loading, error, empty, filled)
5. Responsive behavior: [DESCRIBE_RESPONSIVENESS]
6. Accessibility considerations: [LIST_A11Y_REQUIREMENTS]

DESIGN NOTES:
- Color scheme: Black background with siso-orange accents
- Typography: Follows shadcn/ui typography system
- Border radius: Match existing components (usually rounded-lg)
- Animations: Subtle transitions for state changes

REFERENCE COMPONENTS:
[MENTION_SIMILAR_COMPONENTS] in our codebase for styling reference

Please provide the component with:
- TypeScript types
- Tailwind CSS styling
- Detailed comments explaining complex logic
- Example usage
```

## Form Component Request Template

```
/ui Create a [FORM_TYPE] form component with the following specifications:

CONTEXT:
This form will be used in [SPECIFIC_PAGE/SECTION] for [PURPOSE].
Our application uses React with TypeScript, Tailwind CSS, shadcn/ui form components, and React Hook Form for validation.

REQUIREMENTS:
1. Fields:
   - [FIELD_1_NAME]: [TYPE] [VALIDATION_RULES]
   - [FIELD_2_NAME]: [TYPE] [VALIDATION_RULES]
   - [FIELD_3_NAME]: [TYPE] [VALIDATION_RULES]
   
2. Validation:
   - [DESCRIBE_VALIDATION_REQUIREMENTS]
   - Error messages should appear below each field
   
3. Submission:
   - Form should call an onSubmit callback with the form data
   - Should show loading state during submission
   - Should handle submission errors gracefully
   
4. Layout:
   - [DESCRIBE_LAYOUT_REQUIREMENTS]
   - Form should be responsive and work on mobile devices
   
5. Accessibility:
   - All fields must have appropriate labels and ARIA attributes
   - Tab order should be logical
   - Error states should be announced to screen readers

STYLING:
- Match our dark theme with siso-orange accents for primary actions
- Use shadcn/ui form components for consistent styling
- Error states should use red highlights

REFERENCE COMPONENTS:
See [SIMILAR_FORM] in our codebase for styling reference
```

## Data Display Component Request Template

```
/ui Create a [DATA_DISPLAY_TYPE] component for displaying [DATA_TYPE] with the following specifications:

CONTEXT:
This component will be used in [SPECIFIC_PAGE/SECTION] to display [DATA_DESCRIPTION].
Our application uses React with TypeScript, Tailwind CSS, and shadcn/ui components.

DATA STRUCTURE:
```typescript
type DataItem = {
  [FIELD_1_NAME]: [TYPE],
  [FIELD_2_NAME]: [TYPE],
  [FIELD_3_NAME]: [TYPE],
  // Additional fields...
};
```

REQUIREMENTS:
1. Display requirements:
   - [DESCRIBE_HOW_DATA_SHOULD_BE_DISPLAYED]
   - Handle empty states, loading states, and error states
   
2. Interaction:
   - [DESCRIBE_ANY_INTERACTIONS] (sorting, filtering, pagination, etc.)
   - How users can select, expand, or interact with items
   
3. Performance considerations:
   - Handle large datasets efficiently
   - Consider virtualization for long lists
   
4. Responsiveness:
   - [DESCRIBE_RESPONSIVE_BEHAVIOR]
   - How the display adapts to different screen sizes

STYLING:
- Match our dark theme with siso-orange accents
- Use subtle borders and background variations for item separation
- Consider using opacity and hover effects for interactive elements

REFERENCE COMPONENTS:
See [SIMILAR_COMPONENT] in our codebase for styling reference
```

## Modal or Dialog Request Template

```
/ui Create a [MODAL_TYPE] modal/dialog component with the following specifications:

CONTEXT:
This modal will be used in [SPECIFIC_PAGE/SECTION] for [PURPOSE].
Our application uses React with TypeScript, Tailwind CSS, and shadcn/ui dialog components.

REQUIREMENTS:
1. Content structure:
   - [DESCRIBE_CONTENT_STRUCTURE] (header, body, footer)
   - [LIST_SPECIFIC_SECTIONS_OR_COMPONENTS] to include
   
2. Interaction:
   - How the modal is triggered/opened
   - Close behavior (click away, escape key, explicit close button)
   - Any confirmation or multi-step processes
   
3. Sizing and positioning:
   - [DESCRIBE_SIZE_REQUIREMENTS]
   - How it should be positioned on different screen sizes
   
4. Accessibility:
   - Focus management (trap focus within modal when open)
   - Keyboard navigation
   - Screen reader announcements

STYLING:
- Match our dark theme with appropriate contrast for modal content
- Consider backdrop blur effect for depth
- Use subtle animations for opening/closing

REFERENCE COMPONENTS:
See [SIMILAR_MODAL] in our codebase for styling reference
```

## Card Component Request Template

```
/ui Create a [CARD_TYPE] card component with the following specifications:

CONTEXT:
This card will be used in [SPECIFIC_PAGE/SECTION] to display [CONTENT_TYPE].
Our application uses React with TypeScript, Tailwind CSS, and shadcn/ui components.

CONTENT STRUCTURE:
1. [DESCRIBE_HEADER] (title, subtitle, icon, etc.)
2. [DESCRIBE_BODY] (text, data, visualizations, etc.)
3. [DESCRIBE_FOOTER] (actions, metadata, etc.)

REQUIREMENTS:
1. Layout and sizing:
   - [DESCRIBE_LAYOUT_REQUIREMENTS]
   - How the card should adapt to different screen sizes
   
2. Interaction:
   - [DESCRIBE_INTERACTIONS] (clickable, expandable, hoverable)
   - Any state changes based on user interaction
   
3. Variations:
   - [DESCRIBE_VARIATIONS] (different styles, emphasis levels)
   - How to handle different content types
   
4. Animations:
   - [DESCRIBE_ANIMATIONS] for interactions or state changes

STYLING:
- Match our dark theme with appropriate gradients or accents
- Consider subtle border effects or shadows for depth
- Use consistent spacing and typography

REFERENCE COMPONENTS:
See [SIMILAR_CARD] in our codebase for styling reference
```

## Navigation Component Request Template

```
/ui Create a [NAVIGATION_TYPE] navigation component with the following specifications:

CONTEXT:
This navigation component will be used in [SPECIFIC_AREA] of our application.
Our application uses React with TypeScript, Tailwind CSS, and shadcn/ui components.

NAVIGATION STRUCTURE:
```typescript
type NavigationItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  active?: boolean;
};
```

REQUIREMENTS:
1. Navigation behavior:
   - [DESCRIBE_BEHAVIOR] (dropdown, expansion, hover effects)
   - Active state indication
   - Mobile vs. desktop behavior
   
2. Layout and positioning:
   - [DESCRIBE_LAYOUT] (horizontal, vertical, nested)
   - Space constraints and overflow handling
   
3. Responsiveness:
   - [DESCRIBE_RESPONSIVE_BEHAVIOR]
   - Breakpoints for layout changes
   
4. Accessibility:
   - Keyboard navigation
   - ARIA roles and attributes
   - Focus management

STYLING:
- Match our dark theme with appropriate hover and active states
- Consider subtle animations for transitions
- Use consistent spacing and typography

REFERENCE COMPONENTS:
See [SIMILAR_NAVIGATION] in our codebase for styling reference
```

## Data Input Component Request Template

```
/ui Create a [INPUT_TYPE] input component with the following specifications:

CONTEXT:
This input component will be used in [SPECIFIC_PAGE/SECTION] for collecting [DATA_TYPE].
Our application uses React with TypeScript, Tailwind CSS, and shadcn/ui form components.

REQUIREMENTS:
1. Input behavior:
   - [DESCRIBE_BEHAVIOR] (validation, formatting, masking)
   - Real-time feedback and error states
   
2. Variants:
   - [DESCRIBE_VARIANTS] (sizes, emphasis levels, states)
   - How variants affect appearance and behavior
   
3. Features:
   - [LIST_FEATURES] (clear button, copy button, etc.)
   - Any additional helper components or functionality
   
4. Accessibility:
   - Proper labeling and ARIA attributes
   - Keyboard interaction patterns
   - Error announcements

STYLING:
- Match our dark theme with appropriate focus and hover states
- Use consistent border styles and input padding
- Error states should use red highlights

REFERENCE COMPONENTS:
See [SIMILAR_INPUT] in our codebase for styling reference
```

## Dashboard Widget Request Template

```
/ui Create a [WIDGET_TYPE] dashboard widget component with the following specifications:

CONTEXT:
This widget will be used in [DASHBOARD_SECTION] to display [DATA_TYPE].
Our application uses React with TypeScript, Tailwind CSS, and shadcn/ui components.

DATA STRUCTURE:
```typescript
type WidgetData = {
  // Define the data structure here
};
```

REQUIREMENTS:
1. Content display:
   - [DESCRIBE_CONTENT] (numbers, charts, status indicators)
   - How to handle different data states
   
2. Layout and sizing:
   - [DESCRIBE_LAYOUT] (fixed or responsive sizing)
   - Grid placement considerations
   
3. Interactivity:
   - [DESCRIBE_INTERACTIONS] (clickable areas, tooltips)
   - Any drill-down or detail views
   
4. Refresh behavior:
   - [DESCRIBE_REFRESH] (manual, automatic, loading indicators)
   - How to handle loading and error states

STYLING:
- Match our dark theme with appropriate data visualization colors
- Consider subtle animations for data updates
- Use consistent spacing and typography

REFERENCE COMPONENTS:
See [SIMILAR_WIDGET] in our codebase for styling reference
``` 