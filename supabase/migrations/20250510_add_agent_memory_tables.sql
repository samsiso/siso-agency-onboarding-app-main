-- supabase/migrations/20250510_add_agent_memory_tables.sql

-- 1. Create agent_conversations table
-- This table stores the history of conversations between a user and the AI agent.
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  telegram_chat_id BIGINT NOT NULL,
  conversation_history JSONB NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster lookups on telegram_chat_id
CREATE INDEX IF NOT EXISTS idx_agent_conversations_telegram_chat_id ON agent_conversations(telegram_chat_id);

-- Add comments for clarity
COMMENT ON TABLE agent_conversations IS 'Stores the conversation history for the AI agent to maintain context.';

-- 2. Create agent_tool_calls table
-- This table logs every tool execution by the agent for debugging and analysis.
CREATE TABLE IF NOT EXISTS agent_tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES agent_conversations(id),
  tool_name VARCHAR(255) NOT NULL,
  parameters JSONB,
  result JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMTz NOT NULL DEFAULT NOW()
);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_agent_tool_calls_conversation_id ON agent_tool_calls(conversation_id);

-- Add comments
COMMENT ON TABLE agent_tool_calls IS 'Logs every tool executed by the AI agent.';

-- 3. Create agent_github_issues table if it doesn't exist
-- This was part of the original tool handler but is better placed in a migration.
CREATE TABLE IF NOT EXISTS agent_github_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_number INTEGER NOT NULL,
  repo VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE agent_github_issues IS 'Stores references to GitHub issues created by the AI agent.'; 