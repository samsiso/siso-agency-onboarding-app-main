# Portfolio Items Test Data Setup

## Overview
This document provides instructions for adding test data to the `portfolio_items` table in the SISO Agency Onboarding Platform. The test data includes three sample projects to demonstrate the partnership dashboard functionality.

## Test Data Records

### 1. Gritness (Gym Niche)
- **Project**: Gritness
- **Client**: Gritness Gym  
- **URL**: https://gritnessgym.vercel.app
- **Source**: Personal Network
- **Status**: not_contacted
- **Technologies**: React, Next.js, Tailwind CSS

### 2. NM Construction (Construction Niche)
- **Project**: NM Construction
- **Client**: NM Construction
- **URL**: https://nm-construction.vercel.app
- **Source**: Personal Network
- **Status**: contacted
- **Technologies**: React, Next.js, Tailwind CSS

### 3. UbahCryp (Web3 Trading Niche)
- **Project**: UbahCryp
- **Client**: UbahCryp
- **URL**: https://ubahcrypcom.vercel.app
- **Source**: Snapchat
- **Status**: feedback_app
- **Technologies**: React, Web3.js, Tailwind CSS

## Setup Methods

### Method 1: Supabase Dashboard (Recommended)
1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `insert-portfolio-data.sql`
4. Execute the SQL script
5. Verify the data was inserted successfully

### Method 2: Application UI (Manual)
1. Start the development server: `npm run dev`
2. Navigate to the Partnership Dashboard
3. Use the AirtablePartnersTable component to manually add each record
4. The component handles authentication automatically

### Method 3: Migration File
1. Copy `insert-portfolio-data.sql` to `supabase/migrations/`
2. Rename it with a timestamp prefix (e.g., `20240619000001_add_portfolio_test_data.sql`)
3. Run `supabase db reset` to apply the migration

## Important Notes

### Row Level Security (RLS)
The `portfolio_items` table has RLS enabled, which prevents direct insertion without proper authentication. The SQL script temporarily disables RLS for data insertion and re-enables it afterward.

### User ID Fields
The test data uses placeholder UUIDs for the `user_id` field:
- `00000000-0000-0000-0000-000000000001`
- `00000000-0000-0000-0000-000000000002`
- `00000000-0000-0000-0000-000000000003`

### Table Schema Validation
The test data follows the exact schema of the `portfolio_items` table as defined in the Supabase types:

```typescript
portfolio_items: {
  Row: {
    category_id: string | null
    client_name: string | null
    client_source: string | null
    completion_date: string | null
    created_at: string
    description: string | null
    development_status: string | null
    github_url: string | null
    highlights: string[] | null
    id: string
    image_url: string | null
    invoice_status: string | null
    live_url: string | null
    notion_url: string | null
    project_id: string | null
    project_status: string | null
    technologies: string[] | null
    title: string
    user_id: string
  }
}
```

## Verification

After inserting the data, you can verify it was added correctly by:

1. **Via SQL**: Run the verification query at the end of the SQL script
2. **Via UI**: Check the Partnership Dashboard table
3. **Via API**: Query the Supabase client directly

```javascript
const { data, error } = await supabase
  .from('portfolio_items')
  .select('*')
  .in('title', ['Gritness', 'NM Construction', 'UbahCryp']);
```

## Files Included

- `insert-portfolio-data.sql` - Complete SQL script for data insertion
- `PORTFOLIO_TEST_DATA_SETUP.md` - This documentation file

## Troubleshooting

### RLS Policy Error
If you encounter a "new row violates row-level security policy" error:
1. Use Method 1 (Supabase Dashboard) which has admin privileges
2. Or ensure proper authentication is set up in your client code

### Duplicate Key Error
The SQL script uses `ON CONFLICT (title) DO NOTHING` to prevent duplicate entries. If records already exist, they will be skipped.

### Connection Issues
Ensure your Supabase configuration is correct in:
- `.env` file
- `src/integrations/supabase/client.ts`

## Success Confirmation

Once the test data is successfully added, you should see:
- 3 new portfolio items in the Partnership Dashboard
- Various project statuses (not_contacted, contacted, feedback_app)
- Different client sources (Personal Network, Snapchat)
- Working live URLs for each project

The AirtablePartnersTable component will display these records with proper styling, status badges, and edit capabilities.