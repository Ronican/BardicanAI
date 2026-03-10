# BardicanAI

AI-assisted music creation through conversational Strudel code generation.

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 9+ (`npm install -g pnpm`)
- Python 3.12+
- uv (`curl -LsSf https://astral.sh/uv/install.sh | sh`)

## Setup

### Frontend

```bash
cd bardicanai-web
cp .env.local.example .env.local
pnpm install
pnpm dev
# Runs on http://localhost:3000
```

### Backend

```bash
cd bardicanai-api
cp .env.example .env
# Edit .env with your API keys
uv run fastapi dev
# Runs on http://localhost:8000
```

## Verify

```bash
curl http://localhost:8000/health
# Should return: {"status": "ok"}
```
