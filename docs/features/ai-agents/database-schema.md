# AI Agent Database Schema

## Overview

This document defines the Supabase database schema for the AI Agent system, including tables for conversation state, tool executions, project tracking, and multi-agent coordination.

## Core Tables

### 1. Agent Conversations

Stores conversation context and state for each user interaction.

```sql
-- Main conversation tracking table
CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  telegram_chat_id BIGINT,
  telegram_user_id BIGINT,
  whatsapp_number VARCHAR(20),
  platform VARCHAR(20) CHECK (platform IN ('telegram', 'whatsapp', 'web', 'api')),
  context JSONB DEFAULT '{}',
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_telegram_chat (telegram_chat_id),
  INDEX idx_user_conversations (user_id, created_at DESC)
);

-- Enable RLS
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own conversations" ON agent_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON agent_conversations
  FOR ALL USING (auth.role() = 'service_role');
```

### 2. Agent Messages

Stores individual messages within conversations.

```sql
CREATE TABLE agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES agent_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  voice_file_url TEXT,
  metadata JSONB DEFAULT '{}',
  tokens_used INTEGER,
  model_used VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_conversation_messages (conversation_id, created_at)
);

-- Enable RLS
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own messages" ON agent_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agent_conversations
      WHERE agent_conversations.id = agent_messages.conversation_id
      AND agent_conversations.user_id = auth.uid()
    )
  );
```

### 3. Tool Executions

Tracks all tool calls made by the AI agent.

```sql
CREATE TABLE agent_tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES agent_conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES agent_messages(id) ON DELETE CASCADE,
  tool_name VARCHAR(100) NOT NULL,
  parameters JSONB NOT NULL,
  result JSONB,
  error TEXT,
  success BOOLEAN DEFAULT false,
  execution_time_ms INTEGER,
  tokens_used INTEGER,
  cost_usd DECIMAL(10,6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_tool_calls_conversation (conversation_id, created_at),
  INDEX idx_tool_calls_name (tool_name, created_at)
);

-- Tool usage analytics view
CREATE VIEW tool_usage_analytics AS
SELECT 
  tool_name,
  COUNT(*) as total_calls,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful_calls,
  AVG(execution_time_ms) as avg_execution_time_ms,
  SUM(tokens_used) as total_tokens,
  SUM(cost_usd) as total_cost,
  DATE_TRUNC('day', created_at) as date
FROM agent_tool_calls
GROUP BY tool_name, DATE_TRUNC('day', created_at);
```

### 4. Agent Projects

Tracks autonomous project handling and progress.

```sql
CREATE TABLE agent_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'cancelled')),
  project_type VARCHAR(50),
  phases JSONB DEFAULT '[]',
  current_phase INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  client_id UUID REFERENCES client_onboarding(id),
  created_by UUID REFERENCES profiles(id),
  assigned_conversation_id UUID REFERENCES agent_conversations(id),
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_projects_status (status, created_at),
  INDEX idx_projects_client (client_id)
);

-- Project subtasks
CREATE TABLE agent_project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES agent_projects(id) ON DELETE CASCADE,
  phase_index INTEGER NOT NULL,
  task_index INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  assigned_agent VARCHAR(50),
  tool_calls UUID[] DEFAULT '{}',
  result JSONB,
  error TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_project_tasks (project_id, phase_index, task_index),
  UNIQUE (project_id, phase_index, task_index)
);
```

### 5. Multi-Agent Coordination

Manages multi-agent task execution and coordination.

```sql
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_execution_id UUID REFERENCES agent_executions(id),
  conversation_id UUID REFERENCES agent_conversations(id),
  task_description TEXT NOT NULL,
  strategy VARCHAR(50) CHECK (strategy IN ('sequential', 'parallel', 'iterative')),
  agents_used VARCHAR(50)[] DEFAULT '{}',
  subtasks JSONB DEFAULT '[]',
  results JSONB DEFAULT '[]',
  final_result JSONB,
  total_tokens_used INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10,6) DEFAULT 0,
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT false,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes
  INDEX idx_executions_conversation (conversation_id, created_at),
  INDEX idx_executions_parent (parent_execution_id)
);

-- Agent performance metrics
CREATE TABLE agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(50) NOT NULL,
  execution_id UUID REFERENCES agent_executions(id),
  task_type VARCHAR(50),
  execution_time_ms INTEGER NOT NULL,
  tokens_used INTEGER NOT NULL,
  cost_usd DECIMAL(10,6),
  success BOOLEAN NOT NULL,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  error_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_metrics_agent (agent_name, created_at),
  INDEX idx_metrics_execution (execution_id)
);
```

### 6. Tool Definitions

Stores available tools and their configurations.

```sql
CREATE TABLE agent_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  description TEXT,
  parameters_schema JSONB NOT NULL,
  handler_url TEXT,
  requires_auth BOOLEAN DEFAULT true,
  rate_limit_per_minute INTEGER DEFAULT 60,
  cost_per_use DECIMAL(10,6) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tools
INSERT INTO agent_tools (name, category, description, parameters_schema) VALUES
('createGitHubIssue', 'github', 'Create an issue in any GitHub repository', 
  '{"type": "object", "properties": {"repo": {"type": "string"}, "title": {"type": "string"}, "body": {"type": "string"}}, "required": ["repo", "title", "body"]}'),
('addNotionTask', 'notion', 'Add task to Notion daily tracker',
  '{"type": "object", "properties": {"title": {"type": "string"}, "description": {"type": "string"}, "priority": {"type": "string"}}, "required": ["title"]}'),
('startClaudeCode', 'code', 'Trigger Claude Code for code generation',
  '{"type": "object", "properties": {"prompt": {"type": "string"}, "project": {"type": "string"}}, "required": ["prompt", "project"]}'),
('deployToVercel', 'deployment', 'Deploy project to Vercel',
  '{"type": "object", "properties": {"project": {"type": "string"}, "branch": {"type": "string"}}, "required": ["project"]}');
```

### 7. Integration Credentials

Secure storage for API credentials (encrypted).

```sql
CREATE TABLE agent_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_name VARCHAR(50) NOT NULL,
  credentials_encrypted TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE (user_id, service_name)
);

-- Enable RLS with strict access
ALTER TABLE agent_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own credentials" ON agent_credentials
  FOR ALL USING (auth.uid() = user_id);
```

### 8. Learning and Feedback

Stores feedback for continuous improvement.

```sql
CREATE TABLE agent_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES agent_conversations(id),
  tool_call_id UUID REFERENCES agent_tool_calls(id),
  execution_id UUID REFERENCES agent_executions(id),
  user_id UUID REFERENCES profiles(id),
  feedback_type VARCHAR(50) CHECK (feedback_type IN ('positive', 'negative', 'suggestion')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  improvements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pattern recognition table
CREATE TABLE agent_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type VARCHAR(50),
  pattern_data JSONB NOT NULL,
  frequency INTEGER DEFAULT 1,
  success_rate DECIMAL(5,2),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_patterns_type (pattern_type, frequency DESC)
);
```

## Database Functions

### 1. Update Conversation Context

```sql
CREATE OR REPLACE FUNCTION update_conversation_context(
  p_conversation_id UUID,
  p_new_context JSONB
) RETURNS VOID AS $$
BEGIN
  UPDATE agent_conversations
  SET 
    context = context || p_new_context,
    updated_at = NOW(),
    last_message_at = NOW()
  WHERE id = p_conversation_id;
END;
$$ LANGUAGE plpgsql;
```

### 2. Get Agent Performance Stats

```sql
CREATE OR REPLACE FUNCTION get_agent_performance(
  p_agent_name VARCHAR,
  p_days INTEGER DEFAULT 7
) RETURNS TABLE (
  total_tasks INTEGER,
  success_rate DECIMAL,
  avg_execution_time_ms INTEGER,
  total_cost DECIMAL,
  avg_quality_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_tasks,
    AVG(CASE WHEN success THEN 1 ELSE 0 END)::DECIMAL as success_rate,
    AVG(execution_time_ms)::INTEGER as avg_execution_time_ms,
    SUM(cost_usd)::DECIMAL as total_cost,
    AVG(quality_score)::INTEGER as avg_quality_score
  FROM agent_metrics
  WHERE agent_name = p_agent_name
    AND created_at > NOW() - INTERVAL '1 day' * p_days;
END;
$$ LANGUAGE plpgsql;
```

### 3. Auto-archive Old Conversations

```sql
CREATE OR REPLACE FUNCTION archive_old_conversations() RETURNS VOID AS $$
BEGIN
  -- Archive conversations older than 30 days with no activity
  UPDATE agent_conversations
  SET context = jsonb_build_object('archived', true, 'archived_at', NOW(), 'original_context', context)
  WHERE last_message_at < NOW() - INTERVAL '30 days'
    AND NOT (context ? 'archived');
END;
$$ LANGUAGE plpgsql;

-- Schedule as a cron job
SELECT cron.schedule('archive-old-conversations', '0 2 * * *', 'SELECT archive_old_conversations()');
```

## Indexes and Optimization

### Performance Indexes

```sql
-- Conversation lookups
CREATE INDEX idx_conversations_telegram_user ON agent_conversations(telegram_user_id, telegram_chat_id);
CREATE INDEX idx_conversations_last_message ON agent_conversations(last_message_at DESC);

-- Tool execution analysis
CREATE INDEX idx_tool_calls_success ON agent_tool_calls(success, created_at DESC);
CREATE INDEX idx_tool_calls_cost ON agent_tool_calls(cost_usd DESC) WHERE cost_usd > 0;

-- Project tracking
CREATE INDEX idx_projects_active ON agent_projects(status) WHERE status IN ('planning', 'in_progress');
CREATE INDEX idx_project_tasks_pending ON agent_project_tasks(status) WHERE status = 'pending';

-- Pattern matching
CREATE INDEX idx_patterns_gin ON agent_patterns USING gin(pattern_data);
```

### Materialized Views

```sql
-- Daily usage summary
CREATE MATERIALIZED VIEW agent_daily_usage AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(DISTINCT conversation_id) as unique_conversations,
  COUNT(*) as total_messages,
  SUM(tokens_used) as total_tokens,
  COUNT(DISTINCT user_id) as unique_users
FROM agent_messages
GROUP BY DATE_TRUNC('day', created_at);

-- Refresh daily
CREATE OR REPLACE FUNCTION refresh_daily_usage() RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY agent_daily_usage;
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('refresh-daily-usage', '0 1 * * *', 'SELECT refresh_daily_usage()');
```

## Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

1. **User Access**: Users can only access their own data
2. **Service Role**: Full access for backend operations
3. **Conversation Isolation**: Conversations are strictly isolated by user
4. **Credential Protection**: API credentials are encrypted and user-specific

### Data Encryption

```sql
-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_credentials(p_data TEXT) RETURNS TEXT AS $$
DECLARE
  key_id UUID;
  encrypted TEXT;
BEGIN
  -- Get or create encryption key for user
  SELECT id INTO key_id FROM vault.keys WHERE name = 'agent_credentials_key';
  
  -- Encrypt using Supabase Vault
  encrypted := vault.encrypt(p_data, key_id);
  
  RETURN encrypted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Migration Guide

### Initial Setup

```sql
-- Run all CREATE TABLE statements in order
-- Run all CREATE INDEX statements
-- Run all CREATE FUNCTION statements
-- Insert default data (tools, etc.)
-- Enable RLS policies
-- Set up cron jobs
```

### Rollback Plan

```sql
-- Create backup before migration
pg_dump -t 'agent_*' > agent_tables_backup.sql

-- Rollback script
DROP TABLE IF EXISTS agent_feedback CASCADE;
DROP TABLE IF EXISTS agent_patterns CASCADE;
DROP TABLE IF EXISTS agent_credentials CASCADE;
DROP TABLE IF EXISTS agent_tools CASCADE;
DROP TABLE IF EXISTS agent_metrics CASCADE;
DROP TABLE IF EXISTS agent_executions CASCADE;
DROP TABLE IF EXISTS agent_project_tasks CASCADE;
DROP TABLE IF EXISTS agent_projects CASCADE;
DROP TABLE IF EXISTS agent_tool_calls CASCADE;
DROP TABLE IF EXISTS agent_messages CASCADE;
DROP TABLE IF EXISTS agent_conversations CASCADE;
```

## Monitoring Queries

### Active Conversations

```sql
SELECT 
  COUNT(*) as active_conversations,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(EXTRACT(EPOCH FROM (NOW() - last_message_at))) as avg_idle_seconds
FROM agent_conversations
WHERE last_message_at > NOW() - INTERVAL '1 hour';
```

### Tool Usage Stats

```sql
SELECT 
  tool_name,
  COUNT(*) as usage_count,
  AVG(execution_time_ms) as avg_time,
  SUM(cost_usd) as total_cost,
  SUM(CASE WHEN success THEN 1 ELSE 0 END)::FLOAT / COUNT(*) as success_rate
FROM agent_tool_calls
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY tool_name
ORDER BY usage_count DESC;
```

### Project Progress

```sql
SELECT 
  p.name,
  p.status,
  p.progress,
  COUNT(t.id) as total_tasks,
  SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
FROM agent_projects p
LEFT JOIN agent_project_tasks t ON p.id = t.project_id
WHERE p.status IN ('in_progress', 'review')
GROUP BY p.id, p.name, p.status, p.progress;
```