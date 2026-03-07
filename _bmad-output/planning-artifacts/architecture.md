---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-03-07'
inputDocuments:
  - "/Users/ronican/Documents/HobbieCodes/BardicanAI/_bmad-output/brainstorming/brainstorming-session-2026-03-05-100420.md"
  - "/Users/ronican/Documents/HobbieCodes/BardicanAI/_bmad-output/planning-artifacts/prd-validation-report.md"
  - "/Users/ronican/Documents/HobbieCodes/BardicanAI/_bmad-output/planning-artifacts/prd.md"
  - "/Users/ronican/Documents/HobbieCodes/BardicanAI/_bmad-output/planning-artifacts/ux-design-specification.md"
workflowType: 'architecture'
project_name: 'BardicanAI'
user_name: 'Ronican'
date: '2026-03-07'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
BardicanAI’s functional scope centers on a conversational Strudel composition workflow where users express musical intent in chat, receive generated or patched Strudel code in a live editor, audition results immediately, and continue refining through iterative prompts. Architecturally, the requirements cluster into six major capability areas: (1) conversational workspace, (2) music generation and patch-based editing, (3) playback and prototyping flow, (4) transparency and recovery, (5) maintainer operations, and (6) public release/future extensibility.

The most architecturally significant functional pattern is that the system must support both initial generation and targeted modification of existing code without restarting session context. This implies a model that can preserve current composition state, conversation history, and change intent across repeated edit cycles. The requirements also indicate that manual editing and AI-assisted editing must coexist safely within the same session model.

Another major implication is that recovery and transparency are not secondary UX embellishments; they are part of the product contract. Users must be able to understand what changed, correct bad outputs quickly, and continue without losing flow. That means architectural support for patch traceability, reversible state transitions, and clear session continuity boundaries.

**Non-Functional Requirements:**
The NFRs place strong shaping pressure on the architecture. Performance targets require generation responses under 3 seconds at the 95th percentile, patch-to-editor rendering within 500 ms, and full generate→patch→play loops within 5 seconds. Reliability requirements demand robust session continuity over long iterative use, with high success rates across repeated edits and recovery flows.

Security requirements establish HTTPS transport, authorization on session mutation, and protection against secret leakage in public support/release workflows. Accessibility requirements require keyboard operation, contrast compliance, and programmatic labeling for core controls. Integration requirements emphasize DAW-oriented handoff success while isolating failures in optional integrations from the core creative loop. Scalability requirements are modest in raw scale but important in architectural quality: the MVP must support concurrent sessions while preserving latency and maintain clean enough separation that internal concerns can evolve independently without breaking user-visible behavior.

**Scale & Complexity:**
This is a medium-complexity full-stack web application with a relatively focused product surface but a high density of stateful interaction requirements. The UI is intentionally concentrated into a single workspace, but the product behavior requires multiple coordinated subsystems: conversational input handling, intent interpretation, structured generation/patching, editor state management, playback/runtime coordination, recovery/history support, and maintainer/support workflows.

- Primary domain: full-stack interactive web application for creative music tooling
- Complexity level: medium
- Estimated architectural components: 7–10 major components/subsystems

### Technical Constraints & Dependencies

The project is constrained by the need to preserve fast creative flow while maintaining deterministic enough behavior to hit the patch-accuracy target. The editor must remain the source of truth, while chat serves as intent and narration. Playback must remain persistently available and stable through iterative edits. Session state must preserve conversation context, current Strudel code, and patch continuity over repeated turns.

The UX specification further constrains the architecture by establishing an editor-first responsive hierarchy, persistent transport controls, visible in-editor patch highlighting, and one-click recovery behavior. The PRD and UX together indicate that future integrations (e.g. visualization, reference-sound recreation, TouchDesigner) must remain optional extensions rather than contaminating the MVP core. The validation report also suggests that architectural boundaries should help sharpen ambiguous behavioral areas such as consistency, usability thresholds, and isolation intent.

### Cross-Cutting Concerns Identified

- Intent interpretation quality and ambiguity handling
- Deterministic patch application and preservation of existing musical/code state
- Session continuity across long iterative composition flows
- Playback/runtime stability during repeated edits
- Transparency of AI changes through patch narration and visible editor deltas
- Recoverability through revert/checkpoint-oriented state handling
- Performance under low-latency creative interaction expectations
- Authorization and safe mutation of composition state
- Accessibility of core creative controls
- Extensibility for future optional integrations without destabilizing the MVP core

## Starter Template Evaluation

### Primary Technology Domain

Full-stack interactive web application based on project requirements analysis, with a rich browser workspace frontend and an async backend for generation/orchestration services.

### Starter Options Considered

**Option 1 — Next.js official app starter + FastAPI (uv-managed)**
This combines an official modern React-based frontend starter with an async Python backend foundation. It fits the product shape well: a highly interactive workspace UI on the frontend, with a clean service boundary for music generation, patching, orchestration, and possible future RAG components.

**Option 2 — Vite React frontend + FastAPI backend**
This is lighter-weight than Next.js and can be excellent for purely client-rendered apps. However, BardicanAI’s approved UI direction is a persistent multi-region workspace shell, which benefits from stronger app-structure conventions and long-term composability.

**Option 3 — Monolithic full-stack starter**
A monolithic starter could reduce initial setup decisions, but it would weaken the explicit Python FastAPI preference and introduce complexity around auth/deployment that the current project does not need.

### Selected Starter: Next.js official frontend + uv-managed FastAPI backend

**Rationale for Selection:**
This option best matches the project’s functional scope, UX requirements, and approved visual reference artifacts.

It preserves:
- TypeScript for the workspace UI
- Python async for backend intelligence/orchestration
- clear separation between interface concerns and generation/runtime concerns
- local-first simplicity without auth or deployment complexity
- a natural path to PostgreSQL + pgvector later if retrieval or long-term memory becomes necessary

It also aligns with the approved Stitch reference direction:
- single immersive workspace shell
- persistent left chat rail
- dominant central editor
- persistent transport bar
- visible in-editor patch highlighting
- dark experimental creative-tool styling

### Initialization Commands

**Frontend (Next.js official starter):**

```bash
pnpm create next-app@latest bardicanai-web
```

Recommended interactive choices:
- TypeScript: Yes
- Linter: Yes
- Tailwind CSS: Yes
- App Router: Yes
- src/ directory: Yes
- Import alias: Yes
- Turbopack: Yes
- React Compiler: optional

**Backend (uv-managed FastAPI app):**

```bash
mkdir bardicanai-api && cd bardicanai-api
uv init --app
uv add "fastapi[standard]"
```

Typical local run command:

```bash
uv run fastapi dev
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- Frontend: TypeScript + React
- Backend: Python async + FastAPI
- clear frontend/backend separation for UI vs orchestration concerns

**Styling Solution:**
- Tailwind is preferred because the approved Stitch reference already maps naturally to utility-first styling and tokenized theme values

**Build Tooling:**
- Next.js provides integrated frontend build/runtime conventions
- uv provides fast, reproducible Python project management

**Code Organization:**
- supports a workspace-shell architecture with distinct UI regions
- supports feature/component segmentation for chat, editor, playback, history, and status systems

**Development Experience:**
- fast local development on both sides
- official, well-documented setup
- minimal unnecessary complexity for a single-user local-first MVP

**Note:** Project initialization using these commands should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- AI/LLM proxy architecture and streaming strategy
- Strudel runtime and editor integration approach
- Frontend session state model
- API communication pattern (REST + SSE)

**Important Decisions (Shape Architecture):**
- Data persistence strategy for MVP
- Patch representation and apply strategy
- Component/region segmentation for the workspace shell
- Claude model selection

**Deferred Decisions (Post-MVP):**
- Session persistence in PostgreSQL (multi-session history, checkpoint storage in DB)
- Long-term conversation memory / retrieval layer
- Export pipeline beyond copy-to-clipboard/DAW handoff

---

### Data Architecture

**Decision: PostgreSQL + pgvector in MVP (RAG knowledge store only). Session state remains in-memory.**

**MVP database scope (narrow and intentional):**
- **One purpose:** store pre-embedded Strudel API docs and music theory snippets for RAG context injection into the GenerationAgent and PatchAgent
- **One table:** `knowledge_chunks` (id, content, embedding vector, source, tags)
- **Seeded once** at startup via `scripts/seed_knowledge_base.py` — not user data, not session data
- No session persistence, no checkpoint storage, no user records in DB for MVP

**Session state remains in-memory:**
- **Backend:** Python in-memory dict keyed by session ID (ephemeral, per-server-process lifetime)
- **Frontend:** Zustand v5 store (authoritative for UI state, chat history, code state, patch stack, playback state)

**Embedding provider:** Google Gemini embeddings API (`text-embedding-004`) as default — configurable via env to swap to Anthropic or another provider.

**Future persistence (deferred post-MVP):**
- **SQLAlchemy async** (non-blocking ORM) for session and checkpoint persistence
- **Alembic** for migrations
- pgvector already in place; simply add more tables when needed

**Rationale:** The multi-agent architecture (GenerationAgent + PatchAgent) requires Strudel domain knowledge in context to meet the 90% patch accuracy NFR. Injecting relevant Strudel API docs and music theory references via RAG meaningfully improves output quality from the first session — making pgvector earn its place in MVP. Session persistence is still deferred; the database scope is deliberately minimal.

---

### Authentication & Security

**Decision: No auth. API-proxy pattern. Pydantic v2 validation.**

- No authentication layer for MVP (single-user local tool)
- CORS configured for local dev origins only (`localhost:3000`)
- **All AI provider keys (Anthropic, Gemini) live exclusively in the backend** (`.env`) — the frontend never touches any LLM provider directly
- All AI calls are proxied through FastAPI: `Frontend → FastAPI → Pydantic AI agents → LLM providers`
- All incoming request bodies validated via **Pydantic v2** models (built into FastAPI)
- No plaintext secrets exposed in logs, issue templates, or release artifacts (NFR9)

**Rationale:** Proxying through the backend keeps all API keys out of the browser, satisfies NFR7/NFR8 structurally, and means auth or provider changes can be made later without touching the frontend call pattern.

---

### API & Communication Patterns

**Decision: REST for control operations + SSE for generation streaming**

| Concern | Pattern | Rationale |
|---|---|---|
| Session create / metadata | REST POST | Simple, stateless, easy to test |
| Prompt submission + generation | SSE via `EventSourceResponse` | Streams tokens progressively, addresses perceived latency NFR1 |
| Patch apply confirmation | REST POST | Explicit transaction, traceable |
| Checkpoint save / revert | REST POST / GET | Predictable, safe |
| Export / handoff | REST GET | Simple file/text response |

**SSE implementation:**
- Backend: FastAPI native `fastapi.sse.EventSourceResponse` with `AsyncGenerator`
- Frontend: native browser `EventSource` API (no extra library needed)
- Response shape: stream of `data:` events carrying token chunks, terminated by a `done` event with the final structured payload

**Structured generation response envelope (final `done` event):**
```json
{
  "code": "<full updated Strudel code>",
  "patch_description": "<plain-language narration of changes>",
  "changes_summary": ["changed X", "added Y", "removed Z"]
}
```

**Rationale:** SSE is simpler than WebSocket for unidirectional server-to-client streaming and is natively supported in FastAPI. Returning full updated code (not a diff) from the backend keeps patch application deterministic on the frontend and avoids complex diff-merge logic in the AI response.

---

### Frontend Architecture

**Decision: Zustand v5 + @strudel/codemirror + @strudel/web + TanStack Query v5**

**State management: Zustand v5 (v5.0.11)**
Single store with slices for:
- `session`: session ID, creation time, name
- `chat`: ordered message history (user + assistant turns)
- `editor`: current Strudel code (source of truth for editing)
- `patches`: ordered stack of past code snapshots for revert/checkpoint
- `playback`: isPlaying, current position, tempo metadata
- `ui`: generating flag, active panel focus, patch highlight range

**Editor surface: `@strudel/codemirror` (v1.2.6) + CodeMirror 6**
- Provides Strudel-aware syntax highlighting, language extensions, and editor theme out of the box
- Controlled component: Zustand `editor.code` is canonical; editor reflects it
- Patch highlight: after each AI update, diff previous vs new code and decorate changed line ranges using CodeMirror decorations

**Audio/playback runtime: `@strudel/web`**
- Runs entirely in the browser via Web Audio API — no backend involvement in playback
- Transport controls (play/pause/stop) call Strudel's runtime directly from React component event handlers

**API state: TanStack Query v5 (v5.90.21)**
- Used for REST endpoints (session init, checkpoint, export)
- SSE generation stream handled separately via `EventSource` in a custom hook, not TanStack Query

**Workspace shell component regions:**
```
┌─ AppShell ─────────────────────────────────────────┐
│ Header (project name, engine status, actions)       │
├─────────────────┬──────────────────────┬───────────┤
│ ChatRail        │ EditorSurface        │ RightRail  │
│ (messages,      │ (CodeMirror 6 +      │ (optional, │
│  composer,      │  patch highlights)   │  deferred) │
│  status)        │                      │            │
├─────────────────┴──────────────────────┴───────────┤
│ TransportBar (play/pause/stop, tempo, project name) │
└─────────────────────────────────────────────────────┘
```

**Routing:** Single Next.js App Router route (`/`) for the workspace. No multi-page routing needed in MVP.

---

### AI/LLM Integration

**Decision: Pydantic AI v1.66.0 — multi-agent orchestration with switchable providers (Claude + Gemini)**

**Framework:** Pydantic AI v1.66.0 (latest stable as of 2026-03-04)
- MIT licensed, 100% open source, zero additional cost
- Native Anthropic Claude support via `AnthropicModel`
- Native Google Gemini support via `GoogleModel` + `GoogleProvider`
- `FallbackModel` for provider resilience — chain providers so failure on one auto-routes to next
- `pydantic-ai-litellm` package available as bridge to 100+ additional future providers
- Full async, FastAPI-compatible, Pydantic v2 throughout — zero friction with existing stack
- First-class multi-agent delegation: agents call other agents as tools, usage tracked across chain
- Built-in streaming via `agent.run_stream()` → direct SSE passthrough to frontend

---

**Multi-Agent Architecture**

Grounded in the brainstorming session goals: *"robust multi-agent orchestration with music-theory-informed generation"* and its four prioritized themes: Intent Intelligence Core, Deterministic Strudel Transformation, Orchestration & Runtime Architecture, and UX Flow & Safety. The brainstorming confirmed: *"single-orchestrator quality core is viable for v1 if critical modules remain deterministic."*

```
User message + current code + history
  │
  ▼
OrchestratorAgent          (routes + assembles final response)
  Model: claude-sonnet-4-6 or gemini-2.5-pro
  │
  ├── tool: extract_intent()  ──►  IntentAgent
  │                                 Extracts IntentContract from NL.
  │                                 Confidence scoring + ambiguity detection.
  │                                 Model: gemini-2.5-flash  (fast, cheap)
  │
  ├── tool: generate_code()   ──►  GenerationAgent
  │   [if change_type = generate]   Fresh Strudel code from IntentContract
  │                                 + RAG-injected Strudel docs.
  │                                 Model: claude-sonnet-4-6  (high capability)
  │
  ├── tool: patch_code()      ──►  PatchAgent
  │   [if change_type = patch]      Targeted modification of existing code.
  │                                 Preserve-lock enforcement.
  │                                 Section-targeted diff transforms.
  │                                 Model: claude-sonnet-4-6
  │
  └── tool: narrate_change()  ──►  NarrationAgent
                                    Generates human-readable patch summary
                                    for chat narration (FR19-20).
                                    Model: gemini-2.5-flash  (fast, cheap)
```

**IntentContract schema** (from brainstorming Priority 1 — Intent Intelligence Core):
```python
class IntentContract(BaseModel):
    change_type: Literal["generate", "patch", "adjust"]
    target_elements: list[str]        # which sections/patterns to change
    preserve_elements: list[str]      # locked — must not change (FR12)
    style_hints: list[str]            # e.g. "psytrance", "Anatolian rock"
    mood_hints: list[str]             # e.g. "darker", "more hypnotic"
    confidence: float                 # 0.0–1.0
    unresolved_ambiguities: list[str] # triggers clarification if confidence low
```

**Provider switching — per-agent, via env:**
```bash
AI_PROVIDER_ORCHESTRATOR=anthropic:claude-sonnet-4-6
AI_PROVIDER_INTENT=google-gla:gemini-2.5-flash
AI_PROVIDER_GENERATION=anthropic:claude-sonnet-4-6
AI_PROVIDER_PATCH=anthropic:claude-sonnet-4-6
AI_PROVIDER_NARRATION=google-gla:gemini-2.5-flash
```
Each agent's model is independently configurable. Swap one without touching others. `FallbackModel` can wrap any individual agent for provider resilience.

**Session context window management:**
- OrchestratorAgent receives rolling conversation history from `session_store`
- Rolling window of last 20 turns or ~80K tokens (whichever limit is hit first)
- Older turns summarized or trimmed — never silently dropped mid-sentence
- IntentContract from each turn stored in session history for downstream correction loops

---

### Infrastructure & Development

**Decision: Two-process local dev, env-file config, minimal logging**

- **Frontend:** `pnpm dev` on port `3000` (Next.js Turbopack)
- **Backend:** `uv run fastapi dev` on port `8000` (uvicorn with hot-reload)
- **Process management:** two terminal tabs or `concurrently` — no Docker overhead for local-only MVP
- **Environment config:**
  - Frontend: `.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:8000`
  - Backend: `.env` →
    ```
    ANTHROPIC_API_KEY=sk-ant-...
    GEMINI_API_KEY=AIza...
    AI_PROVIDER_ORCHESTRATOR=anthropic:claude-sonnet-4-6
    AI_PROVIDER_INTENT=google-gla:gemini-2.5-flash
    AI_PROVIDER_GENERATION=anthropic:claude-sonnet-4-6
    AI_PROVIDER_PATCH=anthropic:claude-sonnet-4-6
    AI_PROVIDER_NARRATION=google-gla:gemini-2.5-flash
    DATABASE_URL=postgresql+asyncpg://localhost/bardicanai
    ALLOWED_ORIGINS=http://localhost:3000
    LOG_LEVEL=INFO
    ```
- **Logging:** Python `logging` to stdout for FastAPI; Next.js default console for frontend
- **No CI/CD** in MVP (local-only, single developer)
- **DB setup:** PostgreSQL with pgvector extension required locally; `scripts/seed_knowledge_base.py` must be run once after first startup to populate the RAG knowledge store

---

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize both projects (frontend + backend starters)
2. Wire frontend → backend REST health check (confirms CORS + dev setup)
3. Set up PostgreSQL + pgvector locally; run `seed_knowledge_base.py` to load Strudel docs
4. Integrate `@strudel/web` playback runtime + basic play/stop
5. Integrate `@strudel/codemirror` editor surface with Zustand-controlled code state
6. Implement IntentAgent + IntentContract extraction
7. Implement GenerationAgent with RAG doc retrieval tool
8. Implement PatchAgent with preserve-lock enforcement
9. Implement NarrationAgent for patch summaries
10. Implement OrchestratorAgent wiring all sub-agents together
11. Implement SSE generation endpoint in FastAPI + Pydantic AI streaming integration
12. Wire frontend EventSource → SSE stream → editor code update + chat narration
13. Implement patch highlight layer (diff + CodeMirror decorations)
14. Implement session state (chat history, patch stack, revert)
15. Implement corrective feedback loop (IntentContract constraint injection on next turn)
16. Implement checkpoint save + one-click revert
17. Implement DAW export/handoff (copy/download Strudel code)
18. Defer: session persistence in DB, visualization, right rail

**Cross-Component Dependencies:**
- Editor state (Zustand) is the source of truth for both playback and patch history — nothing mutates editor code except Zustand actions
- AI generation results flow: FastAPI → OrchestratorAgent → sub-agents → SSE → EventSource hook → Zustand action → editor + chat update
- Playback runtime reads Zustand `editor.code` on play trigger — it does not hold its own code copy
- Patch highlight layer is derived state from `patches.previous` vs `editor.code` — it does not store its own data
- IntentAgent output (IntentContract) gates which downstream agent (GenerationAgent or PatchAgent) the OrchestratorAgent calls
- RAG retrieval (retrieval_service) is called within GenerationAgent and PatchAgent as a Pydantic AI tool — not called directly from routers

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

9 areas where AI agents could make different, incompatible choices without explicit rules.

---

### Naming Patterns

**Frontend Code Naming (TypeScript / React):**
- Components: `PascalCase` — `ChatRail`, `EditorSurface`, `TransportBar`
- Files (components): `PascalCase.tsx` — `ChatRail.tsx`, `EditorSurface.tsx`
- Files (hooks, utils, stores): `camelCase.ts` — `useGenerationStream.ts`, `useStrudelRuntime.ts`
- Zustand store slices: `camelCase` noun — `editorSlice`, `chatSlice`, `patchSlice`
- Zustand actions: `verb + noun` camelCase — `setCode`, `pushPatch`, `revertToPatch`, `appendChatMessage`
- React custom hooks: `use` prefix + PascalCase noun — `useGenerationStream`, `useEditorDiff`
- Constants: `SCREAMING_SNAKE_CASE` — `MAX_PATCH_HISTORY`, `SSE_DONE_EVENT`

**Backend Code Naming (Python / FastAPI):**
- Functions: `snake_case` — `create_session`, `stream_generation`, `apply_patch`
- Pydantic models: `PascalCase` — `GenerationRequest`, `SessionResponse`, `PatchRecord`
- Router files: `snake_case.py` — `generation.py`, `session.py`, `export.py`
- Constants: `SCREAMING_SNAKE_CASE` — `MAX_HISTORY_TURNS`, `DEFAULT_MODEL`

**API Endpoint Naming:**
- Plural resource nouns, kebab-case segments: `/sessions`, `/sessions/{session_id}/generate`, `/sessions/{session_id}/checkpoints`
- No trailing slashes
- Path parameters: `snake_case` — `session_id`, `checkpoint_id`
- Query parameters: `snake_case` — `limit`, `before_id`

---

### API Contract: JSON Field Naming

**Rule: snake_case in all JSON bodies (both request and response).**

The Python backend uses snake_case natively (Pydantic). The frontend must serialize/deserialize accordingly. Do NOT use camelCase in JSON payloads even though TypeScript defaults to it.

```typescript
// CORRECT — frontend sending request
{ session_id: "abc123", user_message: "make it more upbeat" }

// WRONG — do not camelCase JSON fields
{ sessionId: "abc123", userMessage: "make it more upbeat" }
```

Frontend Zustand store state uses camelCase internally. The snake_case ↔ camelCase transformation happens in the API layer (fetch hooks / TanStack Query functions), not in components or stores.

---

### API Response Formats

**Standard REST response envelope:**
```json
{
  "data": { ... },
  "error": null
}
```

On error:
```json
{
  "data": null,
  "error": {
    "code": "GENERATION_FAILED",
    "message": "Human-readable message safe to show in UI"
  }
}
```

HTTP status codes:
- `200` success with data
- `400` client validation error
- `422` Pydantic validation error (FastAPI default — keep this)
- `500` unexpected server error
- Never return `200` with an error body

**SSE event stream format:**
```
data: {"type": "token", "content": "...partial token..."}

data: {"type": "done", "code": "...", "patch_description": "...", "changes_summary": [...]}

data: {"type": "error", "code": "GENERATION_FAILED", "message": "..."}
```

SSE event types: `token` | `done` | `error` — these are the only valid values.

---

### Code State Rules

**The `code` field is always a plain, unescaped Strudel string.**

- Never JSON-encode the code a second time inside the payload
- Never HTML-escape it
- Never trim or modify whitespace unless the AI explicitly changed it
- In Zustand: `state.editor.code` is the single canonical source — no copies elsewhere
- In API requests: `{ "code": "stack(\n  s(\"bd\")\n)" }` — raw string, not double-encoded

---

### Structure Patterns

**Frontend project structure (`src/`):**
```
src/
  app/                    # Next.js App Router
    page.tsx              # Single workspace route
    layout.tsx            # Root layout (fonts, providers)
  components/
    workspace/            # Major shell regions
      AppShell.tsx
      ChatRail.tsx
      EditorSurface.tsx
      TransportBar.tsx
      RightRail.tsx       # Deferred / optional
    chat/                 # Chat sub-components
    editor/               # Editor sub-components
    ui/                   # Generic reusable UI primitives
  hooks/                  # Custom React hooks
  stores/                 # Zustand store slices
  lib/                    # API client, utilities, constants
  types/                  # Shared TypeScript types (API contracts, store types)
```

**Backend project structure:**
```
app/
  main.py                     # FastAPI app init, lifespan, CORS
  routers/
    session.py                # Session CRUD endpoints
    generation.py             # SSE generation stream endpoint → calls orchestrator_agent
    export.py                 # DAW export endpoint
    checkpoints.py            # Checkpoint save/revert endpoints
  agents/                     # Pydantic AI agent definitions
    orchestrator_agent.py     # Master: routes to sub-agents, assembles response
    intent_agent.py           # IntentContract extraction from NL input
    generation_agent.py       # Fresh Strudel generation + RAG tool
    patch_agent.py            # Targeted code modification + preserve-lock
    narration_agent.py        # Patch summary for chat narration
  services/
    retrieval_service.py      # pgvector similarity search (RAG)
    embeddings_service.py     # Text → vector embeddings (Gemini/Anthropic)
    validator_service.py      # Strudel syntax validation tool
    session_store.py          # In-memory session state management
  models/
    requests.py               # Pydantic request models
    responses.py              # Pydantic response models
    session.py                # Internal session data models
    intent.py                 # IntentContract model
  core/
    config.py                 # pydantic-settings: all keys + per-agent provider names
    providers.py              # model factory: get_model_for_agent(agent_name)
    logging.py                # Logger setup
  scripts/
    seed_knowledge_base.py    # One-time: embed + load Strudel docs into pgvector
```

**Tests:**
- Frontend: co-located `*.test.ts` / `*.test.tsx` next to source files
- Backend: `tests/` directory at project root, mirroring `app/` structure

---

### State Management Patterns

**Zustand: one store, multiple slices, no direct state mutation outside actions.**

```typescript
// CORRECT — use Zustand actions
useEditorStore.getState().setCode(newCode)

// WRONG — never mutate state directly
useEditorStore.getState().editor.code = newCode
```

**Patch stack rules:**
- `pushPatch(code)` is called BEFORE applying new AI-generated code, saving the current state
- `revertToPatch(index)` replaces `editor.code` with the saved snapshot and trims the stack
- Maximum stack depth: `MAX_PATCH_HISTORY` (default 50)
- Stack entries are immutable once pushed

**Loading/generating state:**
- `ui.isGenerating` is set to `true` when SSE stream opens, `false` when `done` or `error` event is received
- No other component should infer generating state from any other signal

---

### Error Handling Patterns

**Frontend:**
- SSE `error` events → show inline error in chat rail, set `ui.isGenerating = false`, do NOT clear editor code
- REST errors → catch in TanStack Query, surface via toast or inline message, never crash the workspace
- Unhandled React errors → `ErrorBoundary` wrapping `AppShell`, fallback shows reload prompt

**Backend:**
- All route handlers wrapped in try/except — never let unhandled exceptions return non-JSON 500s
- `orchestrator_agent.py` catches Pydantic AI / provider errors and maps them to internal error codes
- SSE streams always send a `{"type": "error", ...}` event before closing on failure — never close silently
- Logging: `ERROR` for unexpected failures, `WARNING` for recoverable issues, `INFO` for normal flow events

---

### Enforcement Guidelines

**All AI agents MUST:**
- Use snake_case for all JSON API field names in both request and response bodies
- Never mutate Zustand state outside of defined store actions
- Always emit an SSE `error` event before closing a failed stream — never close silently
- Always push to `patches` stack before applying new AI code to the editor
- Always proxy all LLM provider calls (Anthropic, Gemini) through the backend — never call any provider directly from the frontend
- Use the standard REST response envelope `{ data, error }` for all non-SSE endpoints
- Store `code` as a raw plain string — never double-encode or escape it

**Pattern violations to flag in code review:**
- camelCase JSON field in API body
- Direct Zustand state mutation without action
- Frontend importing `anthropic`, `pydantic_ai`, or calling any LLM provider URL directly
- SSE endpoint that closes without emitting a terminal `done` or `error` event
- Editor code stored in more than one place (Zustand `editor.code` is the only valid home)

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are compatible and actively designed to work together:
- **Pydantic AI v1.66.0 + FastAPI + Pydantic v2**: designed as a unified ecosystem — built with FastAPI integration as a primary goal, same async model, same validation layer
- **Pydantic AI multi-agent + SSE**: `agent.run_stream()` produces an async generator that maps cleanly to FastAPI `EventSourceResponse` — no impedance mismatch
- **Next.js App Router + Zustand v5 + TanStack Query v5**: stable, production-compatible, well-documented combination
- **`@strudel/codemirror` + CodeMirror 6**: designed together, Strudel's own editor tooling
- **PostgreSQL + pgvector + SQLAlchemy async**: standard production pattern, no conflicts
- **Gemini embeddings + pgvector**: standard RAG pattern

**Pattern Consistency:**
- snake_case JSON ↔ camelCase Zustand transformation is localized to `lib/api.ts` — consistent and enforceable
- REST `{ data, error }` envelope applies to all non-SSE endpoints without exception
- SSE event types `token | done | error` are exhaustive and match the frontend handler
- Zustand action naming (`verb + noun` camelCase) is consistent across all slices
- Agent file naming in `agents/` mirrors service naming in `services/`

**Structure Alignment:**
- `agents/` boundary clearly separated from `routers/` and `services/`: routers call agents → agents call services → services call external APIs — no layer skipping
- Frontend hooks → `lib/api.ts` is the only call boundary — no component calls fetch directly
- `core/providers.py` is the single model construction point — agents never hardcode provider strings

**Watch item:** The Pydantic AI streaming → SSE bridge (`agent.run_stream()` → `EventSourceResponse`) should be established as a reusable pattern in `generation.py` as the first SSE story, before other streaming endpoints try to replicate it.

---

### Requirements Coverage Validation ✅

**Functional Requirements — all 38 covered:**

| FR Group | Coverage | Notes |
|---|---|---|
| FR1–5: Conversational workspace | ✅ | ChatRail, ChatComposer, NarrationAgent, chatSlice |
| FR6–7: Initial generation | ✅ | IntentAgent → GenerationAgent + RAG |
| FR8–13: Patch-based editing | ✅ | IntentAgent → PatchAgent, preserve-lock via IntentContract |
| FR9–10: Corrective feedback | ✅ | OrchestratorAgent injects constraints from prior IntentContract |
| FR12: Preserve-lock | ✅ | `preserve_elements` in IntentContract, enforced in PatchAgent |
| FR14–18: Playback + prototyping | ✅ | useStrudelRuntime, TransportBar, export.py |
| FR19–20: Transparency + narration | ✅ | NarrationAgent, PatchHighlight, chat narration |
| FR21–24: Recovery + continuity | ✅ | patchSlice (50-deep), RevertButton, checkpoints.py, session_store |
| FR25–30: Maintainer ops | ✅ | config.py, logging.py, per-agent provider config |
| FR31–33: Public release | ✅ | README, .env.example, .gitignore |
| FR34–38: Future extensibility | ✅ | Clean agent/service boundaries support future additions without core rework |

**Non-Functional Requirements — all 17 covered:**

| NFR | Coverage |
|---|---|
| NFR1 (<3s generation) | SSE streaming surfaces first tokens immediately; IntentAgent on gemini-2.5-flash is fast; pgvector search is sub-100ms |
| NFR2 (≤5s full loop) | Streaming + async agent chain keeps wall-clock time bounded |
| NFR3 (≤500ms editor render) | Zustand-controlled editor — no round-trip on render; CodeMirror updates synchronously |
| NFR4–5 (session reliability) | in-memory session_store + patchSlice + SSE error handling; no silent failures |
| NFR6 (recovery without reload) | SSE error events preserve editor code; corrective prompt reuses same session |
| NFR7 (HTTPS TLS) | Local dev runs HTTP — acceptable for single-user local tool |
| NFR8 (session authorization) | Sessions keyed by UUID; no cross-session access surface in MVP |
| NFR9 (no secret leakage) | All keys in `.env` (gitignored); `.env.example` has no real values |
| NFR10–12 (accessibility) | Keyboard-operable controls; WCAG contrast via Tailwind tokens; labels on core controls |
| NFR13 (DAW handoff) | export.py returns plain Strudel code for copy/download |
| NFR14–15 (integration isolation) | Agent errors emit SSE error event; session continues; no provider failure terminates session |
| NFR16 (5 concurrent sessions) | FastAPI async + uvicorn handles concurrent requests natively |
| NFR17 (evolution without breaking) | Agent/service layer separation means provider swaps or model upgrades don't touch routing or frontend |

---

### Implementation Readiness Validation ✅

**Decision Completeness:** All critical decisions documented with verified library versions. Per-agent provider configuration explicitly specified. IntentContract schema defined with field-level rationale. Data flow documented end-to-end.

**Structure Completeness:** Both project trees specified to individual file level. Agent delegation chain explicit. Test directories mirror source directories.

**Pattern Completeness:** 9 conflict categories addressed with examples and anti-patterns. Enforcement guidelines include code-review checklist items. All Zustand mutation and error handling patterns documented.

---

### Gap Analysis

**Critical gaps: None.**

**Important gaps (address in early implementation stories):**
1. **Pydantic AI → SSE bridge pattern** — establish in `generation.py` as story 1 of the streaming work; all other SSE endpoints should replicate this pattern, not reinvent it
2. **pgvector index type** — HNSW preferred for this corpus size; decide in first DB migration story
3. **Agent test mocking strategy** — use Pydantic AI's `TestModel` / `FunctionModel` in `tests/conftest.py`; establish pattern before writing agent tests

**Nice-to-have gaps:**
- Prompt versioning strategy for maintainer quality improvement workflow
- Strudel knowledge corpus curation and refresh plan

---

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context analyzed from brainstorming, PRD, validation report, and UX spec
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with verified versions
- [x] Multi-provider AI strategy defined (Claude + Gemini, per-agent config)
- [x] Multi-agent architecture derived from brainstorming goals
- [x] Data architecture defined (pgvector MVP for RAG; sessions in-memory)
- [x] API communication patterns defined (REST + SSE)
- [x] Integration patterns and boundaries defined

**✅ Implementation Patterns**
- [x] Naming conventions (frontend + backend)
- [x] JSON field contract (snake_case boundary at api.ts)
- [x] API response envelope and SSE event type contract
- [x] Code state rules (plain string, single Zustand source)
- [x] Zustand mutation rules and patch stack rules
- [x] Error handling (frontend + backend)
- [x] Enforcement guidelines with review checklist

**✅ Project Structure**
- [x] Full directory tree for both apps to individual file level
- [x] Agent layer separated from service and routing layers
- [x] FR-to-file mapping table
- [x] Data flow documented end-to-end
- [x] External and internal integration points mapped

---

### Architecture Readiness Assessment

**Overall Status: READY FOR IMPLEMENTATION**

**Confidence Level: High**

**Key Strengths:**
- Multi-agent architecture is directly traceable to brainstorming session goals — no architectural invention without product justification
- Provider independence is structural: swapping Claude for Gemini on any agent requires one env change, zero code changes
- pgvector RAG in MVP directly targets the 90% patch accuracy NFR with Strudel domain knowledge injection
- Clean layer separation (router → agent → service → external) makes each layer independently testable and evolvable
- Zustand single source of truth for editor code eliminates an entire class of synchronization bugs

**Areas for Future Enhancement:**
- Session persistence in PostgreSQL when multi-session history becomes valuable
- Prompt versioning and evaluation tooling for maintainer quality improvement
- Strudel knowledge corpus refresh strategy as the Strudel API evolves
- Right-rail panel when UX semantics are formally specified

**Implementation Handoff — AI Agent Guidelines:**
- Read `architecture.md` before starting any implementation story
- Respect the agent layer boundary: no LLM calls outside `agents/`
- Respect the code state boundary: no `editor.code` mutations outside Zustand `setCode` action
- Establish the Pydantic AI → SSE bridge pattern in `generation.py` first
- Use `core/providers.py` factory for all model construction — never hardcode provider strings in agent files

**First Implementation Story:**
```bash
# Story 1: Initialize both projects
pnpm create next-app@latest bardicanai-web
# (TypeScript, Tailwind, App Router, src/, import alias, Turbopack)

mkdir bardicanai-api && cd bardicanai-api
uv init --app
uv add "fastapi[standard]" \
       "pydantic-ai[anthropic,google]" \
       "pydantic-ai-litellm" \
       "asyncpg" "pgvector" "sqlalchemy[asyncio]" \
       "pydantic-settings"
```

## Project Structure & Boundaries

### Repository Layout

```
BardicanAI/
├── README.md                       # Project overview, setup instructions for both apps
├── bardicanai-web/                 # Next.js TypeScript frontend
└── bardicanai-api/                 # FastAPI Python backend
```

---

### Complete Frontend Tree: `bardicanai-web/`

```
bardicanai-web/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                      # NEXT_PUBLIC_API_URL=http://localhost:8000
├── .env.local.example
├── .gitignore
├── public/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── globals.css             # Tailwind base, CSS custom properties / theme tokens
    │   ├── layout.tsx              # Root layout: fonts, QueryClientProvider, global providers
    │   └── page.tsx                # Single workspace route — renders AppShell
    ├── components/
    │   ├── workspace/              # Major shell regions (FR3, FR14)
    │   │   ├── AppShell.tsx        # Root layout shell: header + regions + transport
    │   │   ├── ChatRail.tsx        # Chat panel container (FR1, FR3, FR5)
    │   │   ├── EditorSurface.tsx   # Editor panel container (FR2, FR3, FR19)
    │   │   └── TransportBar.tsx    # Play/pause/stop + tempo + project name (FR14, FR15)
    │   ├── chat/                   # Chat sub-components (FR1, FR4, FR5, FR9, FR20, FR21)
    │   │   ├── MessageList.tsx
    │   │   ├── MessageItem.tsx
    │   │   ├── ChatComposer.tsx
    │   │   └── GeneratingIndicator.tsx
    │   ├── editor/                 # Editor sub-components (FR2, FR8, FR19, FR21, FR23)
    │   │   ├── StrudelEditor.tsx   # CodeMirror 6 + @strudel/codemirror
    │   │   ├── PatchHighlight.tsx  # Decorates changed lines after AI patch
    │   │   └── RevertButton.tsx    # One-click revert to previous checkpoint (FR21)
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Badge.tsx
    │       ├── Toast.tsx
    │       └── ErrorBoundary.tsx
    ├── hooks/
    │   ├── useGenerationStream.ts  # EventSource SSE hook: open → token → done/error
    │   ├── useStrudelRuntime.ts    # @strudel/web playback runtime hook
    │   ├── useEditorDiff.ts        # Diff computation for patch highlight decoration
    │   └── useSession.ts           # Session init + TanStack Query wrapper
    ├── stores/
    │   ├── index.ts                # Combined store export (single Zustand store)
    │   ├── sessionSlice.ts         # { sessionId, name, createdAt }
    │   ├── chatSlice.ts            # { messages: Message[] }
    │   ├── editorSlice.ts          # { code: string } — ONLY mutation point for code
    │   ├── patchSlice.ts           # { stack: string[], maxDepth }
    │   ├── playbackSlice.ts        # { isPlaying, tempo }
    │   └── uiSlice.ts              # { isGenerating, highlightRange, activePanel }
    ├── lib/
    │   ├── api.ts                  # Base fetch wrapper: envelope unwrap, snake_case handling
    │   ├── constants.ts            # MAX_PATCH_HISTORY=50, SSE event types, API_BASE_URL
    │   └── utils.ts
    └── types/
        ├── api.ts                  # API request/response types (snake_case)
        ├── store.ts                # Zustand slice state and action types
        └── strudel.ts              # Strudel-specific types
```

---

### Complete Backend Tree: `bardicanai-api/`

```
bardicanai-api/
├── README.md
├── pyproject.toml                  # uv project config, dependencies
├── uv.lock
├── .env                            # All API keys + provider config + DATABASE_URL
├── .env.example
├── .gitignore
├── scripts/
│   └── seed_knowledge_base.py      # One-time: embed + load Strudel docs into pgvector
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI app init, lifespan, CORS, router mounts
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── session.py              # POST /sessions, GET /sessions/{session_id}
│   │   ├── generation.py           # POST /sessions/{session_id}/generate → SSE
│   │   ├── checkpoints.py          # POST + revert for /sessions/{session_id}/checkpoints
│   │   └── export.py               # GET /sessions/{session_id}/export
│   ├── agents/                     # Pydantic AI v1.66.0 agent definitions
│   │   ├── __init__.py
│   │   ├── orchestrator_agent.py   # Master agent: routes to sub-agents, assembles response
│   │   ├── intent_agent.py         # IntentContract extraction — model: gemini-2.5-flash
│   │   ├── generation_agent.py     # Fresh Strudel generation + RAG — model: claude-sonnet-4-6
│   │   ├── patch_agent.py          # Targeted patch + preserve-lock — model: claude-sonnet-4-6
│   │   └── narration_agent.py      # Patch summary narration — model: gemini-2.5-flash
│   ├── services/
│   │   ├── __init__.py
│   │   ├── retrieval_service.py    # pgvector similarity search (RAG)
│   │   ├── embeddings_service.py   # Text → vector embeddings (Gemini/Anthropic)
│   │   ├── validator_service.py    # Strudel syntax validation tool
│   │   └── session_store.py        # In-memory session dict: CRUD, history window
│   ├── models/
│   │   ├── __init__.py
│   │   ├── requests.py
│   │   ├── responses.py
│   │   ├── session.py
│   │   └── intent.py               # IntentContract Pydantic model
│   └── core/
│       ├── __init__.py
│       ├── config.py               # pydantic-settings Settings
│       ├── providers.py            # get_model_for_agent(agent_name) factory
│       └── logging.py
└── tests/
    ├── conftest.py
    ├── agents/
    │   ├── test_orchestrator_agent.py
    │   ├── test_intent_agent.py
    │   ├── test_generation_agent.py
    │   ├── test_patch_agent.py
    │   └── test_narration_agent.py
    ├── routers/
    │   ├── test_session.py
    │   ├── test_generation.py
    │   ├── test_checkpoints.py
    │   └── test_export.py
    └── services/
        ├── test_retrieval_service.py
        ├── test_embeddings_service.py
        ├── test_validator_service.py
        └── test_session_store.py
```

---

### Architectural Boundaries

**API Boundary (Frontend → Backend):**
- All backend calls originate from `src/lib/api.ts` (REST) or `hooks/useGenerationStream.ts` (SSE)
- No component calls the API layer directly — components call hooks, hooks call the API layer

**AI Agent Boundary (Backend-only):**
- `agents/` is the only directory that imports `pydantic_ai`
- `core/providers.py` is the only place that constructs model instances — no agent hardcodes a model string
- Routers call agent functions; agents call services as tools; services call external APIs

**Strudel Boundary (Browser-only):**
- `@strudel/web` runtime initialized and managed exclusively in `useStrudelRuntime.ts`
- Playback never involves the backend

**Code State Boundary:**
- `editorSlice.setCode()` is the only function that may update `state.editor.code`
- `StrudelEditor.tsx` reads Zustand — it does not own state
- Manual user edits in the editor dispatch `setCode` — they do not bypass Zustand

---

### Requirements to Structure Mapping

| FR Category | Primary Agent(s) | Primary Files |
|---|---|---|
| FR1–5: Conversational workspace | OrchestratorAgent, NarrationAgent | `ChatRail.tsx`, `chatSlice.ts`, `session_store.py` |
| FR6–7: Initial generation | IntentAgent → GenerationAgent | `intent_agent.py`, `generation_agent.py`, `retrieval_service.py` |
| FR8–13: Patch-based editing | IntentAgent → PatchAgent | `intent_agent.py`, `patch_agent.py`, `validator_service.py` |
| FR9–10: Corrective feedback | OrchestratorAgent (constraint injection) | `orchestrator_agent.py`, `session_store.py` |
| FR12: Preserve-lock enforcement | PatchAgent | `patch_agent.py`, `intent.py` |
| FR14–18: Playback + export | Frontend only + export router | `useStrudelRuntime.ts`, `TransportBar.tsx`, `export.py` |
| FR19–20: Transparency + narration | NarrationAgent | `narration_agent.py`, `PatchHighlight.tsx` |
| FR21–24: Recovery + continuity | session_store + checkpoints router | `patchSlice.ts`, `RevertButton.tsx`, `checkpoints.py` |
| FR25–30: Maintainer ops | — | `core/config.py`, `core/logging.py`, README.md |

---

### Data Flow: Core Generation Loop

```
User submits prompt in ChatComposer
  → chatSlice.appendUserMessage(text)
  → useGenerationStream.start({ message, code: editor.code, history })
    → ui.isGenerating = true
    → Opens EventSource to POST /sessions/{id}/generate

  Backend (generation.py → orchestrator_agent):
    → IntentAgent extracts IntentContract from message + history
    → [generate] GenerationAgent: RAG retrieval + fresh code generation
    → [patch]    PatchAgent: targeted transform + preserve-lock enforcement
    → NarrationAgent: human-readable patch summary
    → Streams SSE token events + final done event

  Frontend (useGenerationStream.ts):
    token event  → ui.streamingContent appended
    done event   → patchSlice.pushPatch(previousCode)
                 → editorSlice.setCode(newCode)
                 → chatSlice.appendAssistantMessage(patch_description)
                 → ui.isGenerating = false
    error event  → chatSlice.appendErrorMessage(message)
                 → ui.isGenerating = false  (editor code unchanged)
```

---

### Integration Points

**External services:**
- Anthropic Claude API — called via Pydantic AI `AnthropicModel` in `agents/`
- Google Gemini API — called via Pydantic AI `GoogleModel` in `agents/`
- `@strudel/web` npm package — initialized in `useStrudelRuntime.ts` (browser only)
- `@strudel/codemirror` npm package — used in `StrudelEditor.tsx`

**Internal service communication:**
- `generation.py` router → `orchestrator_agent` → sub-agents → `retrieval_service` / `validator_service` / `session_store`
- `checkpoints.py` router → `session_store` (checkpoint save/restore)
- `session.py` router → `session_store` (create/read session)
