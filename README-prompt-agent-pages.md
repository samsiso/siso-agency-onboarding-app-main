# Prompt Agent Pages Documentation

## Overview

The Prompt Agent now supports organization of prompts by development domains (Frontend, Backend, Research) and pages, with each page containing multiple prompts organized by prompt type (analyze, plan, code, etc.). This feature makes it easier to work on one domain or page at a time during the development process.

## Key Features

1. **Domain-Based Organization**: Group prompts by their development domain (Frontend, Backend, Research)
2. **Page-Based Organization**: Group prompts by page name for focused development
3. **Prompt Types**: Organize prompts within each page by their type (analyze, plan, code, review, improve)
4. **Multiple Views**: Switch between different views:
   - Pages View: Groups prompts by domain, page and type
   - List View: Traditional flat list of all prompts
   - Stretches View: Organization by stretches across pages

## Database Schema

The auto_prompts table now includes:

- `domain`: The domain this prompt belongs to (Frontend, Backend, Research)
- `page_name`: The name of the page this prompt belongs to
- `page_route`: The route of the page in the application
- `prompt_type`: The type of the prompt (analyze, plan, code, review, improve, other)

## UbahCrypt Pages

The UbahCrypt MVP includes 25 pages:

1. Login/Signup Page (`/auth`)
2. Onboarding/Tutorial Page (`/onboarding`)
3. Dashboard (`/dashboard`)
4. Markets Page (`/markets`)
5. News Page (`/news`)
6. Wallet Page (`/wallet`)
7. Portfolio Page (`/portfolio`)
8. Trading Page (`/trade`)
9. Open Orders Page (`/orders`)
10. Transaction History Page (`/transactions`)
11. Transaction Fee Estimator Page (`/fee-estimator`)
12. Staking Page (`/stake`)
13. Staking Comparison Page (`/stake-compare`)
14. Security Settings Page (`/security-center`)
15. KYC Management Page (`/kyc`)
16. Security Information Page (`/security-info`)
17. Educational Content Page (`/education`)
18. Educational Search/Categories Page (`/education/search`)
19. Community Forum Page (`/community`)
20. Affiliate Page (`/affiliate`)
21. Referral Leaderboard Page (`/leaderboard`)
22. Notifications Page (`/notifications`)
23. API Management Page (`/api-management`)
24. Settings Page (`/settings`)
25. Support/Help Page (`/support`)

## Usage Guide

### Domain Cards View

1. Navigate to the Prompt Agent
2. Select a project
3. The default "Pages" view shows three domain cards (Frontend, Backend, Research)
4. Each card displays the total number of prompts and a breakdown of their status
5. Click on a domain card to see its pages and prompts

### Adding Prompts to a Domain/Page

1. Navigate to the Prompt Agent
2. Select a project
3. Click "New Prompt" or click on a domain card and then "New Domain Prompt"
4. Select the domain, enter the page name, and select the page route from the dropdown
5. Select the prompt type (analyze, plan, code, etc.)
6. Fill in the prompt details and submit

### Viewing Prompts by Domain

1. Navigate to the Prompt Agent
2. Select a project
3. Ensure "Pages" view is selected (default)
4. Click on a domain card (Frontend, Backend, Research)
5. See pages within that domain
6. Click on a page to see prompts grouped by type

## Implementation Details

- Each page expands to show prompt types
- Each prompt type contains a table of prompts for that type
- Pages can be searched for quick access
- Each page shows a count of prompts it contains

## Future Improvements

1. Domain and page status tracking (not started, in progress, completed)
2. Dependencies between pages
3. Page templates for common page types (login, dashboard, settings)
4. Progress visualization across domains and pages
5. Completion metrics for projects based on domain/page completion
6. Domain/page snapshots to save the state at various points in development 