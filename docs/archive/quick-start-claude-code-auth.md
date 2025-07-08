# 🔐 Claude Code Authentication & Setup Guide

## Understanding Claude Code Authentication

**Important**: Claude Code does NOT use API keys. Instead, it uses account-based authentication through your Pro/Max plan subscription.

## Authentication Process

### 1. Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Login with Your Account
```bash
claude login
```

This will:
- Open a web browser 
- Ask you to authenticate with your Claude Pro/Max account
- Link your terminal to your subscription plan

### 3. Verify Authentication
```bash
claude --version
claude /status
```

## Usage Limits by Plan

### Pro Plan ($20/month)
- **Claude Web**: ~45 messages every 5 hours
- **Claude Code**: ~10-40 prompts every 5 hours
- **Model Access**: Sonnet 4 only
- **Best For**: Light work on small repositories (<1,000 lines)

### Max Plan 5x ($100/month)  
- **Claude Web**: ~225 messages every 5 hours
- **Claude Code**: ~50-200 prompts every 5 hours
- **Model Access**: Sonnet 4 + Opus 4
- **Auto-switch**: Opus→Sonnet at 20% usage

### Max Plan 20x ($200/month)
- **Claude Web**: ~900 messages every 5 hours  
- **Claude Code**: ~200-800 prompts every 5 hours
- **Model Access**: Sonnet 4 + Opus 4
- **Auto-switch**: Opus→Sonnet at 50% usage

## Automation Considerations

### 1. No API Key Required
- Remove `ANTHROPIC_API_KEY` from `.env` files
- Authentication is handled through account login
- Usage counts against your plan limits

### 2. Rate Limiting Strategy
- Shared limits between Claude web and Claude Code
- Monitor usage with `claude /status`
- Plan around 5-hour reset cycles

### 3. Headless Automation
```bash
# Non-interactive execution
claude -p "Your prompt here" --allowedTools "ReadFile,WriteFile"

# With output formatting
claude -p "Your prompt" --output-format json

# Skip permission prompts (use carefully)
claude -p "Your prompt" --dangerously-skip-permissions
```

### 4. Session Management
```bash
# Check current status
claude /status

# Switch models (Max plan only)
claude /model opus
claude /model sonnet

# Logout completely
claude /logout
```

## Automation System Updates

### Modified Architecture
1. **Remove API Key Dependencies**: No environment variables needed
2. **Account-Based Limits**: Track usage against plan limits, not API quotas
3. **Session Management**: Handle login state and model switching
4. **Graceful Degradation**: Fall back when limits reached

### Example Automation Commands

```bash
# Basic task execution
claude -p "Analyze this codebase and provide recommendations" --allowedTools "ReadFile,SearchFiles"

# Complex analysis with file operations
claude -p "$(cat automation-tasks/app-ecosystem-analysis-prompt.txt)" \
  --allowedTools "ReadFile,WriteFile,SearchCode,ListDirectory" \
  --output-format json

# Progress monitoring
claude -p "Your task" --progress-callback | tee progress.log
```

## Best Practices for Automation

### 1. Batch Operations
- Group related tasks to maximize prompt efficiency
- Use comprehensive prompts rather than many small ones
- Leverage file operations within single sessions

### 2. Usage Monitoring
- Check `claude /status` before starting large operations
- Plan intensive work around 5-hour reset cycles
- Consider upgrading plans for consistent heavy usage

### 3. Error Handling
- Implement graceful fallbacks when limits reached
- Save work frequently during long operations
- Use session persistence for complex workflows

## Troubleshooting

### Authentication Issues
```bash
# Logout completely
claude /logout

# Update Claude Code
claude update

# Restart terminal and re-login
claude login
```

### Usage Limit Reached
- **Option 1**: Wait for 5-hour reset
- **Option 2**: Upgrade plan (Pro → Max 5x → Max 20x)
- **Option 3**: Use API Console credits (separate billing)

### Model Switching
```bash
# Check current model
claude /status

# Switch to Opus (Max plan only)
claude /model opus

# Switch back to Sonnet
claude /model sonnet
```

---

## Next Steps

1. **Authenticate**: Run `claude login` to connect your account
2. **Verify**: Check `claude /status` to confirm plan access
3. **Test**: Try a simple automation task
4. **Monitor**: Track usage and adjust workflow accordingly

This authentication model makes Claude Code more secure but requires planning around usage limits rather than just API costs.