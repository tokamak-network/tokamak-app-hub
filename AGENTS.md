# Agent Instructions for Tokamak App Hub

## Critical Rules

### DO NOT kill user's dev server
- **NEVER** run `pkill -f "next dev"` or similar commands that kill all Next.js processes
- User may have their own dev server running on port 3000
- When testing, use a different port (e.g., `PORT=3099 pnpm dev`)
- Only kill processes you specifically started, using the specific PID if needed

### Testing API endpoints
```bash
# Start test server on different port
PORT=3099 pnpm dev > /dev/null 2>&1 &
TEST_PID=$!
sleep 8

# Run tests...
curl -X POST "http://localhost:3099/api/..." 

# Kill only the test server
kill $TEST_PID 2>/dev/null
```

## Project Context

- Internal marketplace for Tokamak Network team
- Next.js 15 + React 19 + TypeScript
- GitHub OAuth for authentication
- AI description generation via Tokamak AI API

## Environment Variables

Required in `.env.local`:
- `AUTH_SECRET` - NextAuth secret
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - OAuth credentials
- `GITHUB_ADMIN_TOKEN` - For repo creation and API calls
- `ALLOWED_USERS` - Comma-separated GitHub usernames
- `TOKAMAK_AI_API_KEY` - For AI description generation
