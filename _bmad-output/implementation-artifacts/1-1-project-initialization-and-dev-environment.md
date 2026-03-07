# Story 1.1: Project Initialization & Dev Environment

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want both the Next.js frontend and FastAPI backend initialized with the architecture-specified starter configuration and verified local connectivity,
so that I have a working foundation to build all product features on.

## Acceptance Criteria

1. **Given** the repository root exists
   **When** the frontend is initialized with `pnpm create next-app@latest bardicanai-web` using TypeScript, Tailwind CSS, App Router, src/ directory, import alias, and Turbopack
   **Then** `pnpm dev` starts the frontend on port 3000 and renders the default Next.js page

2. **Given** the repository root exists
   **When** the backend is initialized with `uv init --app` and dependencies added (`fastapi[standard]`, `pydantic-ai[anthropic,google]`, `pydantic-ai-litellm`, `asyncpg`, `pgvector`, `sqlalchemy[asyncio]`, `pydantic-settings`)
   **Then** `uv run fastapi dev` starts the backend on port 8000

3. **Given** both projects are running locally
   **When** the frontend makes a GET request to the backend health endpoint
   **Then** the response confirms connectivity with a 200 status
   **And** CORS is configured to allow requests from `http://localhost:3000`

4. **Given** the project structure
   **When** environment files are created
   **Then** `.env.example` and `.env.local.example` exist with placeholder values (no real secrets)
   **And** `.gitignore` excludes `.env`, `.env.local`, `node_modules`, `__pycache__`, and `.venv`

## Tasks / Subtasks

- [x] Task 1: Initialize Git repository (AC: #4)
  - [x] 1.1 Run `git init` at project root
  - [x] 1.2 Create root `.gitignore` with standard exclusions (`.env`, `.env.local`, `node_modules`, `__pycache__`, `.venv`, `.next`, `dist`)
  - [x] 1.3 Create initial commit

- [x] Task 2: Initialize Next.js frontend (AC: #1)
  - [x] 2.1 Run `pnpm create next-app@latest bardicanai-web` with interactive choices: TypeScript=Yes, Linter=Yes, Tailwind CSS=Yes, App Router=Yes, src/ directory=Yes, Import alias=Yes, Turbopack=Yes
  - [x] 2.2 Verify `cd bardicanai-web && pnpm dev` starts on port 3000
  - [x] 2.3 Verify default Next.js page renders in browser at `http://localhost:3000`

- [x] Task 3: Initialize FastAPI backend (AC: #2)
  - [x] 3.1 Run `mkdir bardicanai-api && cd bardicanai-api && uv init --app`
  - [x] 3.2 Add all required dependencies:
    ```bash
    uv add "fastapi[standard]" \
           "pydantic-ai[anthropic,google]" \
           "pydantic-ai-litellm" \
           "asyncpg" "pgvector" "sqlalchemy[asyncio]" \
           "pydantic-settings"
    ```
  - [x] 3.3 Create `app/__init__.py` (empty) and `app/main.py` with FastAPI app instance and health endpoint
  - [x] 3.4 Verify `uv run fastapi dev` starts on port 8000

- [x] Task 4: Wire health check and CORS (AC: #3)
  - [x] 4.1 Add CORS middleware to FastAPI app allowing origin `http://localhost:3000`
  - [x] 4.2 Create `GET /health` endpoint returning `{"status": "ok"}` with 200
  - [x] 4.3 Verify frontend can fetch `http://localhost:8000/health` and receive 200 response
  - [x] 4.4 Verify CORS headers are present in response (`Access-Control-Allow-Origin`)

- [x] Task 5: Environment files and configuration (AC: #4)
  - [x] 5.1 Create `bardicanai-api/.env.example` with all placeholder keys (see Dev Notes)
  - [x] 5.2 Create `bardicanai-web/.env.local.example` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
  - [x] 5.3 Ensure both `.gitignore` files exclude secrets files
  - [x] 5.4 Create root `README.md` with project overview and setup instructions (see README template below)

- [ ] Task 6: Verification (AC: #1, #2, #3, #4)
  - [ ] 6.1 Start both servers simultaneously and confirm no port conflicts
  - [ ] 6.2 Confirm frontend health check fetch succeeds with CORS using: `curl -v http://localhost:8000/health -H "Origin: http://localhost:3000"` (verify `Access-Control-Allow-Origin` header in response)
  - [ ] 6.3 Confirm all `.env*` files are gitignored (run `git status` and verify no `.env` or `.env.local` files appear)
  - [ ] 6.4 Commit verified working foundation

## Dev Notes

### Architecture Compliance

This is the foundation story. Every subsequent story builds on the structure established here. The architecture document (`_bmad-output/planning-artifacts/architecture.md`) is the governing reference.

**Critical architecture decisions that MUST be followed:**

1. **Two-project monorepo structure:**
   ```
   BardicanAI/
   ├── README.md
   ├── bardicanai-web/          # Next.js TypeScript frontend
   └── bardicanai-api/          # FastAPI Python backend
   ```

2. **Package managers are non-negotiable:**
   - Frontend: `pnpm` (NOT npm, NOT yarn)
   - Backend: `uv` (NOT pip, NOT poetry, NOT pipenv)

3. **Frontend initialization choices (all required):**
   - TypeScript: Yes
   - Linter (ESLint): Yes
   - Tailwind CSS: Yes
   - App Router: Yes
   - src/ directory: Yes
   - Import alias: Yes (default `@/`)
   - Turbopack: Yes
   - React Compiler: optional (not required)

4. **Backend dependencies (exact list from architecture):**
   ```
   fastapi[standard]
   pydantic-ai[anthropic,google]
   pydantic-ai-litellm
   asyncpg
   pgvector
   sqlalchemy[asyncio]
   pydantic-settings
   ```

5. **Port assignments:**
   - Frontend: `3000`
   - Backend: `8000`

6. **CORS configuration:** Allow origin `http://localhost:3000` on the backend. Use `ALLOWED_ORIGINS` env variable for configurability.

### Environment File Templates

**Backend `.env.example`:**
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
GEMINI_API_KEY=AIza-your-key-here
AI_PROVIDER_ORCHESTRATOR=anthropic:claude-sonnet-4-6
AI_PROVIDER_INTENT=google-gla:gemini-2.5-flash
AI_PROVIDER_GENERATION=anthropic:claude-sonnet-4-6
AI_PROVIDER_PATCH=anthropic:claude-sonnet-4-6
AI_PROVIDER_NARRATION=google-gla:gemini-2.5-flash
DATABASE_URL=postgresql+asyncpg://localhost/bardicanai
ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

**Frontend `.env.local.example`:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Minimal Backend Entry Point

The `app/main.py` should be minimal for this story — just enough to verify the foundation works:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    allowed_origins: str = "http://localhost:3000"

settings = Settings()

app = FastAPI(title="BardicanAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

**IMPORTANT:** Do NOT scaffold the full backend directory structure yet (agents/, services/, routers/, models/). That comes in later stories. Only create what is needed for the health check to work.

**Backend directory for this story:**
```
bardicanai-api/
├── app/
│   ├── __init__.py          # Empty file (required for Python package)
│   └── main.py              # FastAPI app init, CORS, health endpoint
├── pyproject.toml
├── uv.lock
├── .env.example
└── .gitignore
```

### Naming Conventions (established here, enforced everywhere)

**Backend (Python/FastAPI):**
- Functions: `snake_case` — `health_check`, `create_session`
- Pydantic models: `PascalCase` — `Settings`, `GenerationRequest`
- Files: `snake_case.py` — `main.py`, `session.py`
- Constants: `SCREAMING_SNAKE_CASE`

**Frontend (TypeScript/React):**
- Components: `PascalCase` — `ChatRail.tsx`, `AppShell.tsx`
- Hooks/utils/stores: `camelCase` — `useSession.ts`, `editorSlice.ts`
- Constants: `SCREAMING_SNAKE_CASE`

**API JSON fields:** Always `snake_case` in request/response bodies.

### What NOT To Do

- Do NOT install database (PostgreSQL/pgvector) — that's Story 2.2
- Do NOT create the full backend directory structure (agents/, services/, routers/) — that evolves per story
- Do NOT install Strudel packages — that's Story 1.3
- Do NOT install Zustand or TanStack Query — that's Story 1.2
- Do NOT set up any UI components beyond the default Next.js page — that's Story 1.2
- Do NOT create Docker files — architecture specifies local-only dev with two terminal tabs
- Do NOT use npm or yarn — pnpm only
- Do NOT use pip or poetry — uv only

### Project Structure Notes

- This story establishes the two-project monorepo layout at the root
- The root `BardicanAI/` directory contains both apps plus documentation/planning artifacts
- Existing directories (`_bmad/`, `_bmad-output/`, `docs/`, `stitch-downloads/`, `.claude/`, `.agent/`) should be preserved — they contain planning artifacts and tooling configuration
- The root `.gitignore` should cover both project-specific and general exclusions

### Root README.md Template

The README should include these sections:
```markdown
# BardicanAI

AI-assisted music creation through conversational Strudel code generation.

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 9+ (`npm install -g pnpm`)
- Python 3.11+
- uv (`curl -LsSf https://astral.sh/uv/install.sh | sh`)

## Setup

### Frontend
cd bardicanai-web
cp .env.local.example .env.local
pnpm install
pnpm dev
# Runs on http://localhost:3000

### Backend
cd bardicanai-api
cp .env.example .env
# Edit .env with your API keys
uv run fastapi dev
# Runs on http://localhost:8000

## Verify

curl http://localhost:8000/health
# Should return: {"status": "ok"}
```

### Verification Commands

After setup, run these to confirm everything works:
```bash
# Terminal 1: Start backend
cd bardicanai-api && uv run fastapi dev

# Terminal 2: Start frontend
cd bardicanai-web && pnpm dev

# Terminal 3: Verify CORS and connectivity
curl -v http://localhost:8000/health -H "Origin: http://localhost:3000"
# Look for: Access-Control-Allow-Origin: http://localhost:3000
# Look for: {"status":"ok"}
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — "Starter Template Evaluation" section]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Initialization Commands" section]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Infrastructure & Development" section]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Project Structure & Boundaries" section]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Naming Patterns" section]
- [Source: _bmad-output/planning-artifacts/epics.md — "Story 1.1: Project Initialization & Dev Environment"]
- [Source: _bmad-output/planning-artifacts/prd.md — "Technical Architecture Considerations" section]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
