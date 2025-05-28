# Playwright Testing Templates

These templates provide a structured approach to using the Playwright MCP for comprehensive test automation in your React project.

## Component Test Template

```typescript
/**
 * Test plan for [COMPONENT_NAME] component
 * 
 * Purpose: This test suite verifies the functionality, rendering, and interactions of
 * the [COMPONENT_NAME] component under various conditions.
 * 
 * Component location: [FILE_PATH]
 */

// Basic rendering tests
await browser_navigate('http://localhost:8080/[TEST_PATH]');
await browser_snapshot();

// Test default state 
// Verify initial rendering matches expected default state
const defaultStateElement = '[DEFAULT_STATE_SELECTOR]';
await browser_click({
  element: "Default state element",
  ref: defaultStateElement
});

// Test interactive behavior
// E.g., clicking, hovering, form interactions
const interactiveElement = '[INTERACTIVE_ELEMENT_SELECTOR]';
await browser_click({
  element: "Interactive element",
  ref: interactiveElement
});
await browser_snapshot(); // Capture state after interaction

// Test form inputs (if applicable)
const inputElement = '[INPUT_ELEMENT_SELECTOR]';
await browser_type({
  element: "Input field",
  ref: inputElement,
  text: "[TEST_INPUT_VALUE]"
});
await browser_snapshot(); // Capture state after input

// Test error states (if applicable)
const errorTrigger = '[ERROR_TRIGGER_SELECTOR]';
await browser_click({
  element: "Error trigger",
  ref: errorTrigger
});
await browser_snapshot(); // Capture error state

// Test responsive behavior (if needed)
await browser_resize({ width: 375, height: 667 }); // Mobile size
await browser_snapshot(); // Capture mobile view

// Test accessibility (using snapshot which includes accessibility tree)
await browser_snapshot();

// Generate a complete Playwright test for future automation
await browser_generate_playwright_test({
  name: "[COMPONENT_NAME] Tests",
  description: "Tests for the [COMPONENT_NAME] component functionality and behavior",
  steps: [
    "Navigate to the component page",
    "Verify default rendering",
    "Interact with the component",
    "Verify component state changes",
    "Test responsive behavior",
    "Verify accessibility compliance"
  ]
});
```

## User Flow Test Template

```typescript
/**
 * Test plan for [USER_FLOW_NAME] user flow
 * 
 * Purpose: This test suite verifies the end-to-end flow of [USER_FLOW_DESCRIPTION],
 * ensuring all steps work correctly and the final state is as expected.
 * 
 * Flow summary: [BRIEF_DESCRIPTION_OF_FLOW_STEPS]
 */

// Step 1: Start flow by navigating to the beginning page
await browser_navigate('http://localhost:8080/[START_PAGE]');
await browser_snapshot();

// Step 2: Perform initial action
const initialElement = '[INITIAL_ELEMENT_SELECTOR]';
await browser_click({
  element: "Initial interactive element",
  ref: initialElement
});
await browser_snapshot();

// Step 3: Fill out form or perform key interactions
const formElement1 = '[FORM_ELEMENT_1_SELECTOR]';
await browser_type({
  element: "Form field 1",
  ref: formElement1,
  text: "[TEST_VALUE_1]"
});

const formElement2 = '[FORM_ELEMENT_2_SELECTOR]';
await browser_type({
  element: "Form field 2",
  ref: formElement2,
  text: "[TEST_VALUE_2]"
});

// Step 4: Submit or proceed to next step
const submitButton = '[SUBMIT_BUTTON_SELECTOR]';
await browser_click({
  element: "Submit button",
  ref: submitButton
});
await browser_wait({ time: 2 }); // Wait for navigation/processing
await browser_snapshot();

// Step 5: Verify redirect/next page loaded correctly
// Check URL or page elements to confirm correct navigation
const confirmationElement = '[CONFIRMATION_ELEMENT_SELECTOR]';
await browser_click({
  element: "Confirmation element",
  ref: confirmationElement
});
await browser_snapshot();

// Step 6: Complete any final actions needed for the flow
const finalElement = '[FINAL_ELEMENT_SELECTOR]';
await browser_click({
  element: "Final element",
  ref: finalElement
});
await browser_snapshot();

// Generate complete Playwright test for this flow
await browser_generate_playwright_test({
  name: "[USER_FLOW_NAME] E2E Test",
  description: "End-to-end test for the [USER_FLOW_NAME] user flow",
  steps: [
    "Navigate to starting page",
    "Perform initial interaction",
    "Fill out required information",
    "Submit form/proceed to next step",
    "Verify successful navigation to next stage",
    "Complete final actions",
    "Verify successful completion of flow"
  ]
});
```

## API Integration Test Template

```typescript
/**
 * Test plan for [API_FEATURE_NAME] API integration
 * 
 * Purpose: This test suite verifies the frontend integration with the [API_NAME] API,
 * ensuring data is correctly fetched, displayed, and processed.
 * 
 * Integration points: [LIST_OF_INTEGRATION_POINTS]
 */

// Step 1: Navigate to page with API integration
await browser_navigate('http://localhost:8080/[API_TEST_PAGE]');
await browser_snapshot();

// Step 2: Trigger API request (if not automatic)
const apiTrigger = '[API_TRIGGER_SELECTOR]';
await browser_click({
  element: "API trigger element",
  ref: apiTrigger
});

// Step 3: Verify loading state is shown
await browser_wait({ time: 1 }); // Brief wait to ensure loading state appears
await browser_snapshot(); // Should capture loading indicators

// Step 4: Wait for API response to load
await browser_wait({ time: 3 }); // Adjust time based on expected API response time
await browser_snapshot();

// Step 5: Verify data is displayed correctly
const dataElement = '[DATA_ELEMENT_SELECTOR]';
await browser_click({
  element: "Data display element",
  ref: dataElement
});
await browser_snapshot();

// Step 6: Test interactions with loaded data (if applicable)
const dataInteraction = '[DATA_INTERACTION_SELECTOR]';
await browser_click({
  element: "Interactive element with data",
  ref: dataInteraction
});
await browser_snapshot();

// Step 7: Test error handling (if possible)
// This could be done by using network conditions or mocking
// For some tests, you might need code changes to trigger error states
const errorTrigger = '[ERROR_TRIGGER_SELECTOR]';
await browser_click({
  element: "Error state trigger",
  ref: errorTrigger
});
await browser_wait({ time: 2 });
await browser_snapshot();

// Generate complete Playwright test
await browser_generate_playwright_test({
  name: "[API_FEATURE_NAME] Integration Test",
  description: "Test integration with [API_NAME] API for [API_FEATURE_NAME] feature",
  steps: [
    "Navigate to page with API integration",
    "Trigger API request if needed",
    "Verify loading state is displayed",
    "Wait for API response",
    "Verify data is displayed correctly",
    "Test interactions with the loaded data",
    "Verify error handling works correctly"
  ]
});
```

## Authentication Test Template

```typescript
/**
 * Test plan for Authentication workflows
 * 
 * Purpose: This test suite verifies the authentication flows including login,
 * logout, and handling invalid credentials.
 * 
 * Authentication methods: [LIST_AUTH_METHODS]
 */

// Test 1: Successful login flow
await browser_navigate('http://localhost:8080/login');
await browser_snapshot();

const usernameField = '[USERNAME_FIELD_SELECTOR]';
await browser_type({
  element: "Username field",
  ref: usernameField,
  text: "[TEST_USERNAME]"
});

const passwordField = '[PASSWORD_FIELD_SELECTOR]';
await browser_type({
  element: "Password field",
  ref: passwordField,
  text: "[TEST_PASSWORD]"
});

const loginButton = '[LOGIN_BUTTON_SELECTOR]';
await browser_click({
  element: "Login button",
  ref: loginButton
});

await browser_wait({ time: 3 }); // Wait for authentication and redirect
await browser_snapshot(); // Should show logged in state

// Test 2: Verify authenticated state persists
await browser_navigate('http://localhost:8080/[PROTECTED_PAGE]');
await browser_wait({ time: 2 });
await browser_snapshot(); // Should show protected content, not login redirect

// Test 3: Logout flow
const userMenu = '[USER_MENU_SELECTOR]';
await browser_click({
  element: "User menu",
  ref: userMenu
});

const logoutButton = '[LOGOUT_BUTTON_SELECTOR]';
await browser_click({
  element: "Logout button",
  ref: logoutButton
});

await browser_wait({ time: 2 });
await browser_snapshot(); // Should show logged out state

// Test 4: Invalid credentials
await browser_navigate('http://localhost:8080/login');

await browser_type({
  element: "Username field",
  ref: usernameField,
  text: "[TEST_USERNAME]"
});

await browser_type({
  element: "Password field",
  ref: passwordField,
  text: "[INVALID_PASSWORD]"
});

await browser_click({
  element: "Login button",
  ref: loginButton
});

await browser_wait({ time: 2 });
await browser_snapshot(); // Should show error message

// Generate complete Playwright test
await browser_generate_playwright_test({
  name: "Authentication Flow Tests",
  description: "Tests for login, logout, and invalid credentials handling",
  steps: [
    "Test successful login with valid credentials",
    "Verify authenticated state persists across navigation",
    "Test logout functionality",
    "Test error handling with invalid credentials"
  ]
});
```

## Performance Test Template

```typescript
/**
 * Test plan for [FEATURE_NAME] performance testing
 * 
 * Purpose: This test suite measures and verifies the performance characteristics
 * of the [FEATURE_NAME] feature, including load times, animations, and responsiveness.
 * 
 * Performance metrics to capture:
 * - Initial load time
 * - Time to interactive
 * - Animation smoothness
 * - Response time to user interactions
 */

// Measure initial load performance
await browser_navigate('http://localhost:8080/[TEST_PAGE]');
const networkRequests = await browser_network_requests();
console.log('Initial page load requests:', networkRequests);
await browser_wait({ time: 2 }); // Ensure page is fully loaded
await browser_snapshot();

// Measure component rendering performance
const heavyComponent = '[HEAVY_COMPONENT_SELECTOR]';
await browser_click({
  element: "Heavy component trigger",
  ref: heavyComponent
});
await browser_wait({ time: 1 });
await browser_snapshot();

// Test scroll performance (if applicable)
await browser_evaluate({
  script: `
    // Create a marker for when scrolling starts
    console.time('scrollPerformance');
    
    // Scroll smoothly through the page
    let totalHeight = Math.max(
      document.body.scrollHeight, 
      document.documentElement.scrollHeight
    );
    
    let currentPosition = 0;
    let scrollInterval = setInterval(() => {
      window.scrollTo(0, currentPosition);
      currentPosition += 100;
      if (currentPosition >= totalHeight) {
        clearInterval(scrollInterval);
        console.timeEnd('scrollPerformance');
      }
    }, 100);
  `
});
await browser_wait({ time: 5 }); // Wait for scroll to complete
const consoleMessages = await browser_console_messages();
console.log('Performance metrics:', consoleMessages);

// Reset scroll position
await browser_evaluate({
  script: 'window.scrollTo(0, 0);'
});
await browser_wait({ time: 1 });

// Test interaction performance
const interactiveElement = '[INTERACTIVE_ELEMENT_SELECTOR]';
await browser_evaluate({
  script: `
    // Add a performance marker
    performance.mark('interactionStart');
  `
});
await browser_click({
  element: "Interactive element",
  ref: interactiveElement
});
await browser_evaluate({
  script: `
    // End performance measurement
    performance.mark('interactionEnd');
    performance.measure('interactionTime', 'interactionStart', 'interactionEnd');
    console.log(performance.getEntriesByName('interactionTime')[0].duration + 'ms for interaction');
  `
});
await browser_wait({ time: 1 });
const interactionMessages = await browser_console_messages();
console.log('Interaction performance:', interactionMessages);
await browser_snapshot();

// Generate complete Playwright test with performance measurements
await browser_generate_playwright_test({
  name: "[FEATURE_NAME] Performance Test",
  description: "Performance tests for [FEATURE_NAME] feature",
  steps: [
    "Measure initial page load performance",
    "Test heavy component rendering performance",
    "Measure scroll performance",
    "Test interaction response times"
  ]
});
```

## Accessibility Test Template

```typescript
/**
 * Test plan for [FEATURE_NAME] accessibility testing
 * 
 * Purpose: This test suite verifies that the [FEATURE_NAME] feature meets
 * accessibility requirements and WCAG guidelines.
 * 
 * Accessibility requirements to test:
 * - Keyboard navigation
 * - Screen reader compatibility
 * - Color contrast
 * - Focus management
 * - ARIA attributes
 */

// Navigate to the feature page
await browser_navigate('http://localhost:8080/[TEST_PAGE]');
await browser_wait({ time: 2 });

// Take accessibility snapshot (includes accessibility tree)
await browser_snapshot();

// Test keyboard navigation
await browser_press_key({ key: 'Tab' }); // First focusable element
await browser_snapshot();

await browser_press_key({ key: 'Tab' }); // Second focusable element
await browser_snapshot();

await browser_press_key({ key: 'Tab' }); // Third focusable element
await browser_snapshot();

// Test interactive elements with keyboard
await browser_press_key({ key: 'Enter' }); // Activate current element
await browser_wait({ time: 1 });
await browser_snapshot();

// Reset and test more complex interactions
await browser_navigate('http://localhost:8080/[TEST_PAGE]');
await browser_wait({ time: 2 });

// Test form inputs with keyboard
const formElement = '[FORM_ELEMENT_SELECTOR]';
await browser_click({
  element: "Form element",
  ref: formElement
});
await browser_type({
  element: "Form input",
  ref: formElement,
  text: "[TEST_INPUT]"
});
await browser_snapshot();

// Test focus trapping in modals (if applicable)
const modalTrigger = '[MODAL_TRIGGER_SELECTOR]';
await browser_click({
  element: "Modal trigger",
  ref: modalTrigger
});
await browser_wait({ time: 1 });
await browser_snapshot();

// Test Tab key in modal - should stay within modal
await browser_press_key({ key: 'Tab' });
await browser_snapshot();
await browser_press_key({ key: 'Tab' });
await browser_snapshot();
await browser_press_key({ key: 'Tab' });
await browser_snapshot();

// Close modal with keyboard
await browser_press_key({ key: 'Escape' });
await browser_wait({ time: 1 });
await browser_snapshot();

// Generate complete Playwright test
await browser_generate_playwright_test({
  name: "[FEATURE_NAME] Accessibility Test",
  description: "Accessibility tests for [FEATURE_NAME] feature",
  steps: [
    "Test keyboard navigation through the page",
    "Verify interactive elements can be activated with keyboard",
    "Test form inputs with keyboard only",
    "Verify focus trapping in modal dialogs",
    "Test screen reader compatibility with accessibility snapshots"
  ]
});
``` 