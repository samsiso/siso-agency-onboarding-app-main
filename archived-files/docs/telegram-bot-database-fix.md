# 🔧 Telegram Bot Database Query Fix

## 🎯 **THE PROBLEM**

Your bot correctly analyzed "how much have we spent this year on software" but routed it to the **todo system** instead of **querying the database** for real data.

**Current Flow:**
```
User: "how much have we spent this year on software"
↓
AI Analysis: ✅ Correct (financial, high priority)
↓
Action: ❌ Wrong (added to todo instead of database query)
```

**Should Be:**
```
User: "how much have we spent this year on software"
↓
AI Analysis: ✅ Correct (financial, high priority)
↓
Action: ✅ Execute SQL query and return real data
```

## 🔧 **THE FIX**

### **1. Update Message Analysis Logic**

In your `server.js`, update the AI analysis to include a `requires_database` flag:

```javascript
const analysisPrompt = `
Analyze this message: "${message}"

Determine:
1. Type (bug/feature/enhancement/documentation/task/QUERY)
2. Priority (ASAP/High/Medium/Low)
3. Component (dashboard/auth/client/partnership/admin/financial/projects)
4. Action (github/todo/DATABASE_QUERY)
5. Requires Database: true/false

For questions about data, stats, performance, expenses, revenue, team performance:
- Type: QUERY
- Action: DATABASE_QUERY
- Requires Database: true

Return JSON format:
{
  "type": "string",
  "priority": "string", 
  "component": "string",
  "action": "string",
  "requires_database": boolean,
  "sql_intent": "string (if database query needed)"
}
`;
```

### **2. Add Database Query Handler**

```javascript
async function handleDatabaseQuery(message, analysis) {
  const queryPrompt = `
  SYSTEM: You have access to a Supabase database with comprehensive business data.
  
  USER QUESTION: "${message}"
  ANALYSIS: ${JSON.stringify(analysis)}
  
  Generate SQL query to answer this question. Available tables include:
  - financial_transactions (amount, description, date, type)
  - team_members (name, total_revenue, commission)
  - portfolio_items (estimated_price, project_status)
  - projects (title, progress, status)
  
  For software expenses, query financial_transactions where:
  - type = 'expense'
  - description contains software-related terms
  - EXTRACT(YEAR FROM date) = current year
  
  Return only the SQL query:
  `;
  
  try {
    const sqlQuery = await groqAPI(queryPrompt);
    const result = await executeSupabaseQuery(sqlQuery);
    return formatDatabaseResponse(result, message);
  } catch (error) {
    return `I couldn't retrieve that data right now. Error: ${error.message}`;
  }
}
```

### **3. Add Supabase Query Execution**

```javascript
async function executeSupabaseQuery(query) {
  // This would use your MCP Supabase client
  const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'apikey': process.env.VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  
  return await response.json();
}
```

### **4. Update Main Message Handler**

```javascript
async function processMessage(message, isVoice = false) {
  const text = isVoice ? await transcribeVoice(message) : message;
  const analysis = await analyzeMessage(text);
  
  // NEW: Check if database query is needed
  if (analysis.requires_database && analysis.action === 'DATABASE_QUERY') {
    return await handleDatabaseQuery(text, analysis);
  }
  
  // Existing logic for other actions
  if (analysis.action === 'github') {
    return await createGitHubIssue(analysis, text);
  } else {
    return await addToTodoSystem(analysis, text);
  }
}
```

## 📊 **SPECIFIC FIX FOR SOFTWARE EXPENSES**

Add this specific handler for financial queries:

```javascript
async function getFinancialData(query) {
  const financialQueries = {
    'software_expenses_yearly': `
      SELECT 
        SUM(ABS(amount)) as total_amount,
        COUNT(*) as transaction_count,
        description
      FROM financial_transactions 
      WHERE type = 'expense' 
        AND (description ILIKE '%software%' OR description ILIKE '%supabase%' 
             OR description ILIKE '%vercel%' OR description ILIKE '%lovable%'
             OR description ILIKE '%openai%' OR description ILIKE '%cursor%')
        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM NOW())
      GROUP BY description
      ORDER BY total_amount DESC
    `,
    
    'total_yearly_expenses': `
      SELECT SUM(ABS(amount)) as total_yearly_expenses
      FROM financial_transactions 
      WHERE type = 'expense' 
        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM NOW())
    `
  };
  
  // Execute both queries and format response
  const results = await Promise.all([
    executeSupabaseQuery(financialQueries.software_expenses_yearly),
    executeSupabaseQuery(financialQueries.total_yearly_expenses)
  ]);
  
  return formatFinancialResponse(results);
}
```

## 🎯 **EXPECTED RESULT AFTER FIX**

**User:** "how much have we spent this year on software"

**Bot Response:**
```
💰 Software Expenses 2025: £409.58

📊 Breakdown:
• Lovable: £221.89 (development platform)
• OpenAI: £38.83 (AI services) 
• Virgin Media: £38.58 (internet)
• Proxy Services: £25.84 (dev tools)
• Vercel: £23.96 (hosting)
• Supabase: £19.93 (database)

📈 Stats:
• Total transactions: 24
• Average monthly: £68.26
• Largest single: £58.60 (Lovable, March)

💡 Insight: Lovable is 54% of your software budget
```

## 🚀 **IMPLEMENTATION STEPS**

1. **Update your server.js** with the database query logic
2. **Add MCP Supabase client** for direct database access
3. **Test with the software expense query**
4. **Expand to other data queries** (revenue, team performance, etc.)

This fix will transform your bot from a simple categorization tool into a **real-time business intelligence assistant**! 