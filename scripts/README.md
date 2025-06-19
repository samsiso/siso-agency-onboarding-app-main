# Brain Commit Processor

This script automatically processes Git commits to generate summaries and embeddings for the Self-Updating Context Engine.

## Features

- 🧠 **AI-Powered Summaries**: Uses OpenAI GPT-4o-mini to generate concise technical summaries
- 🔍 **Semantic Search**: Creates embeddings using text-embedding-3-small for similarity search
- 🗄️ **Supabase Integration**: Stores data in `brain_commits` table with pgvector support
- 🔄 **Duplicate Prevention**: Handles already-processed commits gracefully

## Usage

### Basic Usage
```bash
# Process the latest commit (HEAD)
node scripts/brain-commit-processor.js

# Process a specific commit
node scripts/brain-commit-processor.js abc123f

# Process a commit by relative reference
node scripts/brain-commit-processor.js HEAD~1
```

### Environment Variables Required
```bash
OPENAI_API_KEY=sk-...                    # OpenAI API key
VITE_SUPABASE_URL=https://...            # Supabase project URL
VITE_SUPABASE_ANON_KEY=eyJ...            # Supabase anon key
```

## How It Works

1. **Git Analysis**: Extracts commit hash, message, file changes, and diff
2. **AI Processing**: 
   - Generates technical summary (2-3 sentences)
   - Creates embedding vector (1536 dimensions)
3. **Database Storage**: Inserts into `brain_commits` table
4. **Error Handling**: Graceful handling of duplicates and API errors

## Output

The script stores the following in Supabase:
- `commit_hash`: Full Git commit hash
- `commit_message`: Original commit message
- `summary`: AI-generated technical summary
- `embedding`: Vector embedding for semantic search
- `committed_at`: Timestamp (auto-generated)

## Integration

This script is used by:
- Git pre-push hooks (automatic processing)
- CI/CD pipelines (fallback processing)
- Manual commit analysis

## Error Handling

- **Missing env vars**: Script exits with clear error message
- **Invalid commit**: Git command failures are caught and reported
- **API failures**: OpenAI/Supabase errors are logged with context
- **Duplicates**: Already-processed commits are skipped gracefully 