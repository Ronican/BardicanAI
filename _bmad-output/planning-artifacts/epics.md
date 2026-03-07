---
stepsCompleted:
  - "step-01-validate-prerequisites"
  - "step-02-design-epics"
  - "step-03-create-stories"
  - "step-04-final-validation"
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
---

# BardicanAI - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for BardicanAI, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: Creator can interact with the system through a chat interface to describe musical intent in natural language.
- FR2: Creator can view and edit generated Strudel code in a dedicated code workspace.
- FR3: Creator can use a split-pane layout that keeps conversational context and code context visible in the same session.
- FR4: Creator can iteratively submit follow-up prompts that build on prior conversational context.
- FR5: Creator can receive plain-language explanations of generated or modified musical output in chat.
- FR6: Creator can request initial Strudel code generation from a natural-language prompt.
- FR7: Creator can request targeted changes to existing musical output without recreating the session from scratch.
- FR8: System can apply patch-style modifications to existing Strudel code based on user instructions.
- FR9: Creator can provide corrective feedback about incorrect results and request adjusted regeneration.
- FR10: System can incorporate corrective feedback to reduce repetition of prior generation mistakes within the active workflow.
- FR11: Creator can iterate repeatedly between prompting and patched updates until desired output is reached.
- FR12: System can preserve core musical intent markers during iterative modification workflows.
- FR13: Creator can request style, structure, density, and mood-oriented refinements through conversational commands.
- FR14: Creator can play generated Strudel output directly from the workspace.
- FR15: Creator can continue editing after playback and re-run output in successive iteration cycles.
- FR16: Creator can use the product to produce a playable Strudel loop that can be auditioned in-app and retained for continued prototyping within the same session.
- FR17: Creator can export or transfer resulting output into downstream DAW-oriented workflow.
- FR18: System can support a continuous generate-play-refine loop in a single session context.
- FR19: Creator can see what changed after each AI-driven modification cycle.
- FR20: System can provide change narration aligned to generated patches.
- FR21: Creator can recover from unsatisfactory generations by issuing corrective prompts rather than restarting from zero.
- FR22: System can maintain session continuity across multiple iterative turns in the same composition flow.
- FR23: Creator can continue manually refining outcomes after AI-assisted changes are applied.
- FR24: During a single active session, repeated iterative edit requests with retained conversation context shall preserve chat history, current code state, and patch applicability across at least 10 consecutive edit turns without requiring a session reset.
- FR25: Maintainer can tune generation behavior through prompt/configuration adjustments.
- FR26: Maintainer can triage and track reported issues as part of product improvement workflow.
- FR27: Maintainer can manage release iterations that deliver improvements to generation and patch behavior.
- FR28: Maintainer can investigate problematic generation/editing outcomes from user reports.
- FR29: Maintainer can apply fixes based on issue findings and incorporate them into subsequent releases.
- FR30: Maintainer can evolve capability quality without breaking core creator workflow continuity.
- FR31: User can access project setup and usage documentation from public repository distribution.
- FR32: User can report defects and usability issues through a public issue workflow.
- FR33: Maintainer can process issue reports into actionable remediation updates.
- FR34: Product can support post-MVP reference-sound upload and recreation workflows.
- FR35: Product can support post-MVP oscilloscope-style visualization of generated output.
- FR36: Product can support future community sharing of created outputs.
- FR37: Product can support future lightweight audio-reactive visual integration workflows.
- FR38: Product can preserve core conversational code-generation workflow as future capabilities are added.

### NonFunctional Requirements

- NFR1: For standard generation and edit requests, end-to-end response time shall be < 3.0 seconds at the 95th percentile under normal load of 1 active session issuing 1 request at a time, measured from prompt submission to completed response using application timing telemetry.
- NFR2: For active composition sessions, the complete generate-patch-play loop shall complete in <= 5.0 seconds at the 95th percentile under normal load, measured from prompt submission to playback-ready editor state using client-side session instrumentation.
- NFR3: After an AI change is accepted, the updated Strudel code shall render in the editor in <= 500 ms at the 95th percentile, measured from acceptance event to visible editor update using browser performance instrumentation.
- NFR4: During a 30-minute composition session containing at least 20 iterative edits, >= 95% of sessions shall preserve chat history, current code state, and patch continuity without unrecoverable session loss, measured by scenario-based integration tests and session error telemetry.
- NFR5: During the same 30-minute / 20-edit test profile, >= 95% of playback and iterative editing cycles shall complete without requiring a page refresh or manual session reset, measured by end-to-end test runs and runtime error logs.
- NFR6: For failed generation or patch attempts, users shall be able to continue the same session with a corrective prompt in >= 90% of cases without reloading the page, measured by failure-recovery scenario tests and production failure telemetry.
- NFR7: All client-server communication that carries prompts, generated code, or session data shall be transmitted over HTTPS using TLS 1.2 or higher, verified by deployment configuration checks and external transport inspection in staging and production.
- NFR8: 100% of write operations that modify a composition session shall enforce authorization checks against the owning workspace context, verified by automated access-control tests covering authorized and unauthorized session mutation attempts.
- NFR9: Public issue templates, logs, and report workflows shall expose 0 plaintext secrets, API keys, or internal credentials in release builds and issue templates, verified by secret-scanning on release artifacts and manual review of public support surfaces before release.
- NFR10: The core actions required for MVP use -- chat input, submit, play, and editor focus -- shall be fully operable by keyboard alone with 0 keyboard traps in current stable Chrome, Firefox, Safari, and Edge, verified by manual keyboard test scripts before release.
- NFR11: Core interactive elements and essential text shall meet WCAG 2.1 AA contrast requirements and expose a visible focus indicator with at least 3:1 contrast against adjacent colors, verified by automated accessibility checks and manual visual review.
- NFR12: Essential interactive controls shall expose programmatic labels sufficient for screen-reader identification in 100% of MVP-critical controls, verified by accessibility audit tooling and manual screen-reader spot checks.
- NFR13: DAW-oriented export or handoff shall produce output that can be opened or copied into the intended downstream workflow with >= 90% task success in a 10-run acceptance test using representative prototype outputs, measured by manual acceptance testing.
- NFR14: When optional integrations are disabled or unavailable, the core chat-editor generation workflow shall continue to meet NFR1 in >= 95% of standard requests, verified by integration-disabled regression tests.
- NFR15: Failures in optional external integrations shall not terminate the active composition session or corrupt current editor state in 100% of tested failure scenarios, verified by fault-injection tests covering timeout, unavailable-service, and malformed-response cases.
- NFR16: The MVP shall support at least 5 concurrent active sessions performing standard generation/edit requests while maintaining NFR1 compliance, verified by repeatable load tests in a staging environment.
- NFR17: After at least one deployment iteration, the system shall continue to satisfy NFR16 without changes to user-visible functional behavior when session-state handling, generation services, or playback-facing concerns are modified independently, verified by regression testing and successful execution of the NFR16 load profile.

### Additional Requirements

**From Architecture:**

- Starter template specified: Next.js official frontend + uv-managed FastAPI backend (impacts Epic 1, Story 1)
- PostgreSQL + pgvector required locally for RAG knowledge store; `scripts/seed_knowledge_base.py` must run once after first startup
- Multi-agent architecture: OrchestratorAgent, IntentAgent, GenerationAgent, PatchAgent, NarrationAgent (Pydantic AI v1.66.0)
- Per-agent AI provider configuration via environment variables (Claude + Gemini, switchable)
- SSE streaming via FastAPI `EventSourceResponse` for generation; REST for control operations
- Zustand v5 single store with slices (session, chat, editor, patches, playback, ui)
- @strudel/codemirror (v1.2.6) + CodeMirror 6 for editor surface; @strudel/web for browser-based audio playback
- TanStack Query v5 for REST API state; custom EventSource hook for SSE
- snake_case JSON API contract with camelCase transformation in `lib/api.ts`
- Standard REST response envelope `{ data, error }` for all non-SSE endpoints
- SSE event types: `token | done | error` only
- Zustand `editor.code` is the single canonical source of truth for code state
- Pydantic AI streaming-to-SSE bridge pattern must be established in `generation.py` first
- Agent test mocking strategy: use Pydantic AI `TestModel` / `FunctionModel`
- pgvector index type decision needed (HNSW preferred)
- All AI provider calls proxied through backend; frontend never contacts LLM providers directly
- Session context window: rolling 20 turns or ~80K tokens with summarization
- IntentContract schema gates routing to GenerationAgent vs PatchAgent
- Patch stack max depth: 50 entries

**From UX Design:**

- Single adaptive split workspace: chat left, editor center (dominant), transport bottom, optional right rail
- Editor-first responsive hierarchy: chat compresses before editor loses priority; history collapses to drawer
- Patch highlighting colors: added/generated = cool green/cyan glow; modified = violet/blue; removed = subtle amber/red trace
- One-click revert last AI patch as primary recovery action
- Required visible system states: idle/empty, generating, patch applied, playback active, error, recovery/retry, session continuity
- Persistent playback transport bar styled as music-tool transport (not generic toolbar)
- Optional history/checkpoint panel (drawer or rail, not separate screen)
- Dark experimental creative-tool visual aesthetic (black/graphite base, magenta/cyan/green accents)
- Stitch HTML/PNG export approved as visual reference for layout and tone (not behavioral source of truth)
- Empty/first-use state: welcoming prompt, example starter prompts, empty editor placeholder, inactive playback
- Patch understanding through three layers: editor highlights, chat narration, revert availability
- Quick follow-up suggestions in chat (optional)

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Chat interface for musical intent |
| FR2 | Epic 1 | View and edit Strudel code in workspace |
| FR3 | Epic 1 | Split-pane layout |
| FR4 | Epic 2 | Iterative follow-up prompts |
| FR5 | Epic 2 | Plain-language explanations in chat |
| FR6 | Epic 2 | Initial Strudel generation from NL prompt |
| FR7 | Epic 3 | Targeted changes without session restart |
| FR8 | Epic 3 | Patch-style code modifications |
| FR9 | Epic 3 | Corrective feedback on incorrect results |
| FR10 | Epic 3 | Incorporate corrections to reduce repeat mistakes |
| FR11 | Epic 3 | Iterate between prompting and patches |
| FR12 | Epic 3 | Preserve core musical intent markers |
| FR13 | Epic 2 | Style, structure, mood refinements |
| FR14 | Epic 1 | Play generated output from workspace |
| FR15 | Epic 1 | Continue editing after playback |
| FR16 | Epic 4 | Produce playable loop retained in session |
| FR17 | Epic 4 | Export to downstream DAW workflow |
| FR18 | Epic 4 | Continuous generate-play-refine loop |
| FR19 | Epic 4 | See what changed after each AI modification |
| FR20 | Epic 4 | Change narration aligned to patches |
| FR21 | Epic 4 | Recover via corrective prompts, not restart |
| FR22 | Epic 4 | Session continuity across multiple turns |
| FR23 | Epic 1 | Manual refining after AI changes |
| FR24 | Epic 4 | 10+ consecutive turns without session reset |
| FR25 | Epic 5 | Tune generation via prompt/config |
| FR26 | Epic 5 | Triage and track issues |
| FR27 | Epic 5 | Manage release iterations |
| FR28 | Epic 5 | Investigate problematic outcomes |
| FR29 | Epic 5 | Apply fixes from issue findings |
| FR30 | Epic 5 | Evolve quality without breaking workflow |
| FR31 | Epic 6 | Public setup and usage documentation |
| FR32 | Epic 6 | Public issue reporting workflow |
| FR33 | Epic 6 | Process issues into remediation |
| FR34 | Epic 6 | Support future sound upload/recreation |
| FR35 | Epic 6 | Support future oscilloscope visualization |
| FR36 | Epic 6 | Support future community sharing |
| FR37 | Epic 6 | Support future audio-reactive visuals |
| FR38 | Epic 6 | Preserve core workflow as features are added |

## Epic List

### Epic 1: Live Workspace & Playback
After this epic, the creator can open the app, see a split-pane workspace with a Strudel code editor and persistent transport bar, manually write/edit code, play it, and iterate.
**FRs covered:** FR2, FR3, FR14, FR15, FR23

### Epic 2: Conversational Music Generation
After this epic, the creator can describe musical intent in chat, receive AI-generated Strudel code with explanations, and play it immediately -- completing the core idea-to-loop journey.
**FRs covered:** FR1, FR4, FR5, FR6, FR13

### Epic 3: Iterative Patch Editing & Refinement
After this epic, the creator can request targeted changes to existing code, get patch-style updates applied, provide corrective feedback when output misses intent, and iterate until the loop matches what they hear in their head.
**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR12

### Epic 4: Transparency, Recovery & Export
After this epic, the creator can see exactly what changed after each AI edit, revert bad patches with one click, maintain stable long sessions across 10+ turns, and export code for downstream DAW workflows.
**FRs covered:** FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR24

### Epic 5: Maintainer Operations & Quality Evolution
After this epic, the maintainer can tune generation behavior through config, triage issues, manage releases, investigate problem outcomes, and evolve quality without breaking the creator workflow.
**FRs covered:** FR25, FR26, FR27, FR28, FR29, FR30

### Epic 6: Public Release & Future Extensibility
After this epic, the product is publicly available on GitHub with setup docs and issue workflow, and the architecture verifiably supports future expansion (sound upload, visualization, community, TouchDesigner) without breaking the core.
**FRs covered:** FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38

## Epic 1: Live Workspace & Playback

After this epic, the creator can open the app, see a split-pane workspace with a Strudel code editor and persistent transport bar, manually write/edit code, play it, and iterate.

### Story 1.1: Project Initialization & Dev Environment

As a developer,
I want both the Next.js frontend and FastAPI backend initialized with the architecture-specified starter configuration and verified local connectivity,
So that I have a working foundation to build all product features on.

**Acceptance Criteria:**

**Given** the repository root exists
**When** the frontend is initialized with `pnpm create next-app@latest bardicanai-web` using TypeScript, Tailwind CSS, App Router, src/ directory, import alias, and Turbopack
**Then** `pnpm dev` starts the frontend on port 3000 and renders the default Next.js page

**Given** the repository root exists
**When** the backend is initialized with `uv init --app` and dependencies added (`fastapi[standard]`, `pydantic-ai[anthropic,google]`, `pydantic-ai-litellm`, `asyncpg`, `pgvector`, `sqlalchemy[asyncio]`, `pydantic-settings`)
**Then** `uv run fastapi dev` starts the backend on port 8000

**Given** both projects are running locally
**When** the frontend makes a GET request to the backend health endpoint
**Then** the response confirms connectivity with a 200 status
**And** CORS is configured to allow requests from `http://localhost:3000`

**Given** the project structure
**When** environment files are created
**Then** `.env.example` and `.env.local.example` exist with placeholder values (no real secrets)
**And** `.gitignore` excludes `.env`, `.env.local`, `node_modules`, `__pycache__`, and `.venv`

### Story 1.2: Workspace Shell & Split-Pane Layout

As a creator,
I want to see a split-pane workspace with distinct regions for chat, code editing, and playback controls,
So that I can orient myself in the creative environment and understand where each activity happens.

**Acceptance Criteria:**

**Given** the creator opens the app at localhost:3000
**When** the page loads
**Then** an AppShell renders with three visible regions: a left ChatRail panel, a center EditorSurface panel (visually dominant), and a bottom TransportBar
**And** the layout uses the dark experimental creative-tool aesthetic (black/graphite base surfaces)

**Given** the workspace is displayed on a standard desktop viewport (>=1280px)
**When** the creator views the layout
**Then** the EditorSurface occupies the largest visual area
**And** the ChatRail is visible as a left sidebar
**And** the TransportBar spans the full width at the bottom

**Given** the workspace is displayed on a narrower viewport (<1024px)
**When** the layout adapts
**Then** the EditorSurface retains visual priority
**And** the ChatRail compresses or stacks below the editor
**And** the TransportBar remains persistently visible

**Given** the workspace shell components
**When** inspected for accessibility
**Then** all major regions have appropriate landmark roles or semantic labels
**And** keyboard focus can move between regions without traps (NFR10)

### Story 1.3: Strudel Code Editor Integration

As a creator,
I want a syntax-highlighted Strudel code editor in the workspace where I can write and edit code,
So that I can manually create and modify Strudel patterns as part of my creative workflow.

**Acceptance Criteria:**

**Given** the workspace is loaded
**When** the EditorSurface renders
**Then** a CodeMirror 6 editor powered by @strudel/codemirror is displayed with Strudel-aware syntax highlighting

**Given** the editor is active
**When** the creator types or modifies Strudel code
**Then** the Zustand `editor.code` state updates to reflect the current editor content
**And** no other state location holds a copy of the code (single source of truth)

**Given** the editor contains code
**When** the code is updated via a Zustand `setCode` action (simulating future AI updates)
**Then** the editor reflects the new code within 500ms (NFR3)

**Given** the editor is rendered
**When** the creator uses keyboard navigation
**Then** the editor is focusable via keyboard and does not create a keyboard trap (NFR10)
**And** the editor has a programmatic label for screen-reader identification (NFR12)

### Story 1.4: Playback Runtime & Transport Controls

As a creator,
I want to play, stop, and restart my Strudel code directly from the workspace,
So that I can immediately hear what my code sounds like and iterate on it.

**Acceptance Criteria:**

**Given** the workspace is loaded with Strudel code in the editor
**When** the creator clicks the Play button on the TransportBar
**Then** the @strudel/web runtime evaluates the current `editor.code` from Zustand and plays audio through the browser
**And** the TransportBar reflects a "playing" state

**Given** audio is currently playing
**When** the creator clicks the Stop button
**Then** playback stops immediately
**And** the TransportBar returns to an idle state

**Given** audio is currently playing
**When** the creator clicks the Restart button
**Then** playback restarts from the beginning of the pattern

**Given** audio is playing
**When** the creator edits code in the editor
**Then** playback is not interrupted (editor remains independently editable)
**And** the creator can stop and re-play to hear the updated code (FR15)

**Given** the TransportBar is rendered
**When** inspected for accessibility
**Then** Play, Stop, and Restart controls are keyboard-operable (NFR10)
**And** each control has a visible focus indicator meeting 3:1 contrast (NFR11)
**And** each control has a programmatic label (NFR12)

**Given** the TransportBar design
**When** viewed by the creator
**Then** it is styled as a music-tool transport bar (not a generic toolbar) consistent with the dark creative-tool aesthetic

### Story 1.5: Empty & First-Use State

As a creator,
I want to see a welcoming first-use experience when I open the app with no existing session,
So that I understand what the tool does and can quickly start creating.

**Acceptance Criteria:**

**Given** the creator opens the app for the first time (no active session)
**When** the workspace loads
**Then** the ChatRail displays a welcoming message explaining what BardicanAI does
**And** at least 3 example starter prompts are visible as clickable suggestions

**Given** the first-use state is displayed
**When** the creator views the EditorSurface
**Then** the editor shows a placeholder or empty state (not a blank void) indicating where generated code will appear

**Given** the first-use state is displayed
**When** the creator views the TransportBar
**Then** playback controls are visible but inactive/disabled (no code to play yet)

**Given** the first-use state is displayed
**When** the creator clicks an example starter prompt
**Then** the prompt text is placed into the chat composer input ready for submission (actual generation is Epic 2)

### Story 1.6: Epic 1 Validation & Foundation Quality Gate

As a developer,
I want comprehensive validation that the workspace foundation is solid before building AI features on top of it,
So that subsequent epics can rely on a stable, tested base.

**Acceptance Criteria:**

**Automated Tests:**

**Given** the frontend project
**When** `pnpm dev` is executed
**Then** the dev server starts without errors on port 3000
**And** the workspace page loads and renders the AppShell

**Given** the backend project
**When** `uv run fastapi dev` is executed
**Then** the dev server starts without errors on port 8000
**And** the health endpoint returns 200

**Given** the frontend-to-backend connection
**When** the frontend calls the backend health endpoint
**Then** the request succeeds with CORS headers allowing localhost:3000

**Given** the Zustand store
**When** `editorSlice.setCode()` is called with new code
**Then** `editor.code` updates and no other state location holds a copy
**And** the CodeMirror editor reflects the change within 500ms (NFR3)

**Given** the @strudel/web playback runtime
**When** valid Strudel code is in the editor and Play is triggered
**Then** audio plays through the browser without errors
**And** Stop and Restart controls function correctly

**Given** the workspace layout
**When** rendered at viewport widths of 1440px, 1280px, and 1024px
**Then** the split-pane layout adapts correctly with editor retaining visual priority at all widths

**Given** the workspace shell components
**When** tested with an accessibility checker
**Then** all major regions have landmark roles, core controls are keyboard-operable with no traps (NFR10), focus indicators meet 3:1 contrast (NFR11), and controls have programmatic labels (NFR12)

**Manual Tests:**

**Given** a fresh browser load of the workspace
**When** the creator views the page for the first time
**Then** the empty/first-use state is displayed: welcome message in chat, example prompts visible, editor placeholder shown, transport controls inactive

**Given** the editor
**When** the creator manually types valid Strudel code and presses Play
**Then** the audio output matches the code and playback state is correctly reflected in the TransportBar

**Given** the workspace aesthetic
**When** visually reviewed against the approved Stitch reference
**Then** the dark experimental creative-tool tone is present: black/graphite surfaces, appropriate accent colors, music-tool transport bar styling

**Given** the .gitignore and .env.example files
**When** reviewed
**Then** no real secrets are committed, and .env.example contains only placeholder values with descriptive comments

## Epic 2: Conversational Music Generation

After this epic, the creator can describe musical intent in chat, receive AI-generated Strudel code with explanations, and play it immediately -- completing the core idea-to-loop journey.

### Story 2.1: Backend Session & API Foundation

As a developer,
I want session management endpoints and a consistent API contract established,
So that all subsequent features have a reliable backend foundation to build on.

**Acceptance Criteria:**

**Given** the backend is running
**When** a POST request is sent to `/sessions`
**Then** a new session is created with a UUID, stored in the in-memory session_store
**And** the response follows the standard envelope `{ "data": { "session_id": "...", "created_at": "..." }, "error": null }`

**Given** a session exists
**When** a GET request is sent to `/sessions/{session_id}`
**Then** the session metadata is returned in the standard envelope format

**Given** a request with an invalid or missing session ID
**When** the endpoint is called
**Then** a 400 or 404 response is returned with `{ "data": null, "error": { "code": "...", "message": "..." } }`
**And** the server never returns 200 with an error body

**Given** all API endpoints
**When** JSON request and response bodies are inspected
**Then** all field names use snake_case (not camelCase)

**Given** the frontend lib/api.ts module
**When** it calls any backend endpoint
**Then** it unwraps the `{ data, error }` envelope and transforms snake_case fields to camelCase for Zustand consumption
**And** no component calls fetch directly -- all API calls go through lib/api.ts or hooks

### Story 2.2: RAG Knowledge Store Setup

As a developer,
I want a PostgreSQL database with pgvector storing embedded Strudel API docs and music theory references,
So that generation agents can retrieve relevant domain knowledge to improve output quality.

**Acceptance Criteria:**

**Given** PostgreSQL is running locally with the pgvector extension enabled
**When** the database migration runs
**Then** a `knowledge_chunks` table exists with columns: id, content, embedding (vector), source, tags

**Given** the `knowledge_chunks` table exists
**When** `scripts/seed_knowledge_base.py` is executed
**Then** Strudel API documentation and music theory snippets are embedded using the configured embedding provider (Gemini text-embedding-004 by default)
**And** the embedded chunks are inserted into the `knowledge_chunks` table

**Given** the knowledge store is seeded
**When** `retrieval_service.py` performs a similarity search with a music-related query
**Then** relevant Strudel documentation chunks are returned ranked by vector similarity
**And** search completes in under 100ms for the seeded corpus size

**Given** the embedding provider configuration
**When** the `EMBEDDING_PROVIDER` env var is changed
**Then** the embeddings_service uses the configured provider without code changes

### Story 2.3: Intent Extraction Agent

As a developer,
I want an IntentAgent that extracts structured musical intent from natural language input,
So that downstream agents receive clear, actionable instructions rather than raw text.

**Acceptance Criteria:**

**Given** a user message like "make me a chill lo-fi beat with soft kicks"
**When** the IntentAgent processes it
**Then** an IntentContract is returned with:
- `change_type`: "generate"
- `target_elements`: populated (e.g., ["rhythm", "kick pattern"])
- `style_hints`: populated (e.g., ["lo-fi", "chill"])
- `mood_hints`: populated (e.g., ["soft", "relaxed"])
- `confidence`: a float between 0.0 and 1.0
- `preserve_elements`: empty list (no existing code to preserve)

**Given** an ambiguous user message with low interpretive confidence
**When** the IntentAgent processes it
**Then** the `confidence` field is below a threshold (e.g., < 0.6)
**And** `unresolved_ambiguities` contains specific questions or unclear aspects

**Given** the IntentAgent configuration
**When** the `AI_PROVIDER_INTENT` env var specifies a different model
**Then** the agent uses that model via `core/providers.py` without code changes

**Given** the IntentAgent is called
**When** tested with Pydantic AI's TestModel
**Then** the agent produces a valid IntentContract schema without calling a real LLM provider

### Story 2.4: Strudel Code Generation Agent

As a developer,
I want a GenerationAgent that produces valid Strudel code from an IntentContract using RAG-retrieved domain knowledge,
So that user intent is translated into musically useful, syntactically correct code.

**Acceptance Criteria:**

**Given** a valid IntentContract with `change_type: "generate"` and style/mood hints
**When** the GenerationAgent processes it
**Then** it calls retrieval_service to fetch relevant Strudel docs as context
**And** it generates syntactically valid Strudel code that reflects the requested style and mood

**Given** the GenerationAgent receives RAG context
**When** generating code
**Then** the output uses Strudel API patterns consistent with the retrieved documentation
**And** the generated code is a complete, playable Strudel pattern (not a fragment)

**Given** the GenerationAgent configuration
**When** the `AI_PROVIDER_GENERATION` env var specifies a different model
**Then** the agent uses that model via `core/providers.py` without code changes

**Given** the GenerationAgent is called
**When** tested with Pydantic AI's TestModel and a mock retrieval_service
**Then** the agent produces output matching the expected response schema

### Story 2.5: Orchestrator Agent & SSE Streaming

As a developer,
I want an OrchestratorAgent that chains IntentAgent and GenerationAgent together and streams the result via SSE,
So that the frontend can receive progressive generation output with minimal perceived latency.

**Acceptance Criteria:**

**Given** a POST request to `/sessions/{session_id}/generate` with `{ "message": "...", "code": "" }`
**When** the OrchestratorAgent processes the request
**Then** it calls IntentAgent to extract an IntentContract
**And** routes to GenerationAgent (when `change_type` is "generate")
**And** streams the response via SSE using FastAPI `EventSourceResponse`

**Given** the SSE stream is open
**When** tokens are generated
**Then** `data: {"type": "token", "content": "..."}` events are emitted progressively
**And** a final `data: {"type": "done", "code": "...", "patch_description": "...", "changes_summary": [...]}` event is emitted when complete

**Given** the generation encounters an error
**When** the SSE stream is open
**Then** a `data: {"type": "error", "code": "GENERATION_FAILED", "message": "..."}` event is emitted before the stream closes
**And** the stream never closes silently without a terminal event

**Given** the OrchestratorAgent receives a message with conversation history
**When** processing the request
**Then** session_store provides rolling history (last 20 turns or ~80K tokens)
**And** the conversation context is passed to the IntentAgent for continuity

**Given** the Pydantic AI streaming-to-SSE bridge
**When** implemented in generation.py
**Then** it establishes a reusable pattern that future SSE endpoints can follow

### Story 2.6: Chat Interface & Generation Flow

As a creator,
I want to type a musical description in chat and see Strudel code generated in the editor with an explanation in chat,
So that I can go from an idea in my head to a playable loop through natural conversation.

**Acceptance Criteria:**

**Given** the creator is on the workspace with an empty or existing session
**When** the creator types a musical description in the ChatComposer and submits it
**Then** the message appears in the ChatRail as a user message
**And** a generating indicator is displayed (ui.isGenerating = true)

**Given** the SSE stream is active
**When** token events arrive
**Then** the streaming response is progressively displayed in the ChatRail as an assistant message

**Given** the SSE stream emits a `done` event
**When** the frontend processes it
**Then** the generated Strudel code is set in the editor via `editorSlice.setCode()`
**And** a plain-language explanation of what was generated appears in chat (FR5)
**And** the generating indicator is removed (ui.isGenerating = false)
**And** the creator can immediately press Play to hear the result

**Given** the creator has already submitted a prompt and received a response
**When** the creator submits a follow-up prompt
**Then** the conversation history is sent with the request for contextual continuity (FR4)
**And** the response reflects awareness of the prior exchange

**Given** the creator submits a prompt requesting style or mood refinement (e.g., "make it darker" or "add a psytrance feel")
**When** the IntentAgent processes it
**Then** the style/mood hints are reflected in the generated output (FR13)

**Given** the SSE stream emits an error event
**When** the frontend processes it
**Then** an error message is shown inline in the ChatRail
**And** the editor code is NOT cleared or modified
**And** the creator can submit another prompt to retry

**Given** the ChatRail and ChatComposer
**When** inspected for accessibility
**Then** the chat input is keyboard-focusable and submittable via Enter key (NFR10)
**And** message content meets WCAG 2.1 AA contrast requirements (NFR11)

### Story 2.7: Epic 2 Validation & Generation Quality Gate

As a creator,
I want comprehensive validation that conversational generation works end-to-end reliably,
So that I can trust the tool to consistently turn my musical ideas into playable Strudel code.

**Acceptance Criteria:**

**Automated Tests:**

**Given** the session API endpoints
**When** tested with valid and invalid requests
**Then** POST /sessions creates sessions correctly, GET returns them, invalid IDs return proper error envelopes, and all JSON fields use snake_case

**Given** the RAG knowledge store
**When** the seed script has run and retrieval_service is tested
**Then** similarity search returns relevant Strudel docs ranked by relevance with latency under 100ms

**Given** the IntentAgent
**When** tested with a suite of natural language inputs via TestModel (clear intent, ambiguous intent, style-heavy, mood-heavy)
**Then** all produce valid IntentContract schemas with appropriate confidence scores and change_type values

**Given** the GenerationAgent
**When** tested with various IntentContracts and mock RAG context via TestModel
**Then** all produce complete, syntactically plausible Strudel code matching the requested style/mood

**Given** the OrchestratorAgent SSE endpoint
**When** tested end-to-end
**Then** the stream emits progressive token events followed by a terminal done event with valid code and patch_description
**And** error scenarios emit an error event before stream close (never silent close)

**Given** the frontend EventSource hook
**When** tested against mock SSE streams
**Then** token events update streaming content, done events trigger setCode + appendAssistantMessage + isGenerating=false, and error events show inline error without clearing editor code

**Given** the lib/api.ts module
**When** tested against all endpoint contracts
**Then** snake_case to camelCase transformation works correctly in both directions
**And** the { data, error } envelope is properly unwrapped

**Given** the generation latency
**When** measured across 10 standard generation requests
**Then** 95th percentile is under 3 seconds (NFR1)

**Manual Tests:**

**Given** the full idea-to-loop journey
**When** a creator types a musical description (e.g., "create a dark minimal techno loop with a driving kick and metallic hi-hats"), submits it, and presses Play
**Then** code appears in the editor, explanation appears in chat, and the audio plays correctly

**Given** a follow-up prompt after initial generation
**When** the creator submits a contextual refinement (e.g., "make it faster and add a sub bass")
**Then** the response demonstrates awareness of the prior exchange and the existing code

**Given** the full product through Epic 2
**When** a regression test of Epic 1 functionality is performed (workspace layout, manual editing, playback, first-use state)
**Then** all Epic 1 features continue to work correctly with no regressions

**Given** the workspace with chat and editor
**When** tested for accessibility
**Then** all core controls (chat input, submit, play, stop, editor focus) are keyboard-operable with no traps (NFR10)

## Epic 3: Iterative Patch Editing & Refinement

After this epic, the creator can request targeted changes to existing code, get patch-style updates applied, provide corrective feedback when output misses intent, and iterate until the loop matches what they hear in their head.

### Story 3.1: Patch Agent with Preserve-Lock

As a developer,
I want a PatchAgent that applies targeted modifications to existing Strudel code while preserving specified elements,
So that iterative edits change only what the creator asked for without destroying the rest of their composition.

**Acceptance Criteria:**

**Given** an IntentContract with `change_type: "patch"`, `target_elements` specifying what to change, and `preserve_elements` specifying what to keep
**When** the PatchAgent processes it along with the current Strudel code
**Then** it returns the full updated Strudel code with targeted modifications applied
**And** all elements listed in `preserve_elements` remain unchanged in the output (FR12)

**Given** the PatchAgent receives RAG context from retrieval_service
**When** applying a patch
**Then** the modifications use Strudel API patterns consistent with the retrieved documentation

**Given** the PatchAgent output
**When** compared to the input code
**Then** only sections related to `target_elements` are modified
**And** the returned code is a complete, playable Strudel pattern (not a fragment or diff)

**Given** the PatchAgent configuration
**When** the `AI_PROVIDER_PATCH` env var specifies a different model
**Then** the agent uses that model via `core/providers.py` without code changes

**Given** the PatchAgent is called
**When** tested with Pydantic AI's TestModel and mock retrieval_service
**Then** the agent produces valid output matching the expected response schema

### Story 3.2: Orchestrator Patch Routing

As a creator,
I want to request targeted changes to my existing Strudel code without starting over,
So that I can refine my composition incrementally through conversation.

**Acceptance Criteria:**

**Given** a session with existing Strudel code in the editor
**When** the creator submits a modification prompt (e.g., "change the hi-hats to a triplet pattern")
**Then** the IntentAgent extracts an IntentContract with `change_type: "patch"` (not "generate")
**And** `target_elements` identifies the elements to modify
**And** `preserve_elements` identifies elements to keep intact

**Given** the OrchestratorAgent receives an IntentContract with `change_type: "patch"`
**When** routing the request
**Then** it calls PatchAgent (not GenerationAgent) with the current code and IntentContract
**And** streams the result via SSE following the established bridge pattern

**Given** the OrchestratorAgent receives an IntentContract with `change_type: "adjust"`
**When** routing the request
**Then** it routes to PatchAgent (adjust is a variant of patch, not a full regeneration)

**Given** the frontend receives a `done` event from a patch request
**When** processing the response
**Then** the editor code is updated via `editorSlice.setCode()` with the patched output (FR7, FR8)
**And** the patch description appears in chat

### Story 3.3: Narration Agent

As a developer,
I want a NarrationAgent that generates concise human-readable summaries of code changes,
So that every AI edit is accompanied by a clear explanation of what changed and why.

**Acceptance Criteria:**

**Given** the OrchestratorAgent has completed a generation or patch operation
**When** the NarrationAgent receives the previous code, new code, and IntentContract
**Then** it produces a `patch_description` (plain-language summary) and `changes_summary` (list of specific changes)

**Given** the NarrationAgent output
**When** included in the SSE `done` event
**Then** the `patch_description` is human-readable and suitable for display in the ChatRail
**And** the `changes_summary` is a list of concise change descriptions (e.g., ["changed hi-hat pattern to triplets", "preserved kick and bass lines"])

**Given** the NarrationAgent configuration
**When** the `AI_PROVIDER_NARRATION` env var specifies a different model
**Then** the agent uses that model via `core/providers.py` without code changes

**Given** the NarrationAgent is integrated into the OrchestratorAgent chain
**When** any generation or patch operation completes
**Then** the NarrationAgent is always called before the final `done` event is emitted

### Story 3.4: Iterative Editing & Corrective Feedback Loop

As a creator,
I want to provide corrective feedback when the AI output misses my intent and have subsequent generations avoid repeating the same mistakes,
So that I can efficiently converge on the sound I want through iterative conversation.

**Acceptance Criteria:**

**Given** the creator has received a generation or patch result
**When** the creator submits a corrective prompt (e.g., "no, that's too fast -- I wanted something slower and more ambient")
**Then** the OrchestratorAgent injects constraints from the corrective feedback into the IntentContract for the next agent call (FR9, FR10)
**And** the corrective context is stored in the session history

**Given** corrective feedback was provided in a previous turn
**When** the next generation or patch operation runs
**Then** the output avoids repeating the specific mistake identified in the correction
**And** the IntentContract reflects the constraint (e.g., `preserve_elements` or `style_hints` updated)

**Given** the creator has been iterating on a composition
**When** the creator submits successive edit prompts (3+ turns of refinement)
**Then** each turn builds on the accumulated conversation context (FR11)
**And** the session maintains coherent musical direction across turns

**Given** a failed generation or patch attempt
**When** the creator submits a corrective prompt
**Then** the session continues without requiring a page reload (NFR6)
**And** the previous editor code is preserved

### Story 3.5: Epic 3 Validation & Patch Quality Gate

As a creator,
I want comprehensive validation that patch editing, corrective feedback, and the full iterative refinement loop work reliably,
So that I can trust the tool to make targeted changes without breaking my composition.

**Acceptance Criteria:**

**Automated Tests:**

**Given** the PatchAgent
**When** tested with a variety of IntentContracts and existing code samples via TestModel
**Then** all tests confirm: target_elements are modified, preserve_elements are untouched, and output is complete playable Strudel code

**Given** the OrchestratorAgent routing logic
**When** tested with IntentContracts of change_type "generate", "patch", and "adjust"
**Then** routing is correct: "generate" -> GenerationAgent, "patch"/"adjust" -> PatchAgent

**Given** the NarrationAgent
**When** tested with before/after code pairs via TestModel
**Then** it produces a valid patch_description and changes_summary matching the expected schema

**Given** the corrective feedback loop
**When** a sequence of [initial prompt -> bad result -> corrective prompt] is run
**Then** the IntentContract on the corrective turn includes constraints from the prior correction
**And** the corrected output avoids the previously identified mistake

**Given** the full agent chain (Intent -> Generation/Patch -> Narration)
**When** an end-to-end integration test runs via the SSE endpoint
**Then** the stream emits valid token events followed by a done event with code, patch_description, and changes_summary

**Manual Tests:**

**Given** the complete generation and patch flow
**When** a creator performs 3+ iterative refinement turns on a single composition
**Then** each turn produces musically coherent changes that build on the previous state

**Given** a deliberate bad-output scenario
**When** the creator provides corrective feedback (e.g., "no, that's completely wrong, I wanted X not Y")
**Then** the next generation avoids the mistake and moves closer to the stated intent

**Given** the full product through Epic 3
**When** a regression test of Epic 1 and Epic 2 functionality is performed
**Then** workspace, playback, initial generation, and chat all continue to work correctly with no regressions

## Epic 4: Transparency, Recovery & Export

After this epic, the creator can see exactly what changed after each AI edit, revert bad patches with one click, maintain stable long sessions across 10+ turns, and export code for downstream DAW workflows.

### Story 4.1: Patch Highlighting in Editor

As a creator,
I want to see exactly which lines of code the AI changed after each edit,
So that I understand what was modified and can make informed decisions about keeping or reverting changes.

**Acceptance Criteria:**

**Given** the AI has applied a generation or patch update to the editor
**When** the new code replaces the previous code via `editorSlice.setCode()`
**Then** the `useEditorDiff` hook computes a diff between the previous and new code
**And** changed line ranges are decorated in the CodeMirror editor using CodeMirror decorations (FR19)

**Given** new lines were added or generated
**When** the patch highlight renders
**Then** those lines are highlighted with a cool green/cyan glow

**Given** existing lines were modified
**When** the patch highlight renders
**Then** those lines are highlighted with a violet/blue highlight

**Given** the patch highlights are displayed
**When** the creator makes a manual edit to the code
**Then** the patch highlights are cleared (they represent the last AI change only, not permanent markers)

**Given** the patch highlight decorations
**When** the editor re-renders
**Then** the highlight rendering completes within 500ms of the code update (NFR3)

### Story 4.2: Patch Stack & One-Click Revert

As a creator,
I want to undo the last AI change with one click and optionally revert to earlier checkpoints,
So that I can recover quickly from bad edits without losing my creative flow.

**Acceptance Criteria:**

**Given** the AI applies a new code update
**When** `editorSlice.setCode()` is called with the new code
**Then** `patchSlice.pushPatch()` is called first, saving the current code to the patch stack
**And** the stack maintains a maximum depth of 50 entries

**Given** the patch stack has at least one entry
**When** the creator clicks the Revert button
**Then** `patchSlice.revertToPatch(latestIndex)` replaces `editor.code` with the most recent saved snapshot
**And** the patch stack is trimmed to remove the reverted entry
**And** the editor immediately reflects the reverted code (FR21)

**Given** the patch stack has multiple entries
**When** the creator accesses the checkpoint/history panel
**Then** previous code states are listed with their associated patch descriptions
**And** the creator can revert to any earlier checkpoint

**Given** a POST request to `/sessions/{session_id}/checkpoints`
**When** the creator saves a named checkpoint
**Then** the current code state and conversation position are saved in session_store

**Given** the Revert button
**When** the patch stack is empty (no AI changes yet)
**Then** the Revert button is disabled or hidden

**Given** the Revert button
**When** inspected for accessibility
**Then** it is keyboard-operable with a visible focus indicator and programmatic label

### Story 4.3: Change Narration Display & Patch-Applied State

As a creator,
I want to see a clear summary of what the AI changed in chat and a visible confirmation that a patch was applied,
So that I understand every edit through narration, highlights, and recovery availability.

**Acceptance Criteria:**

**Given** the SSE `done` event includes `patch_description` and `changes_summary` from the NarrationAgent
**When** the frontend processes the event
**Then** the `patch_description` is displayed as a structured patch summary in the ChatRail (FR20)
**And** the `changes_summary` items are displayed as a list of specific changes

**Given** a patch has just been applied
**When** the workspace is in the patch-applied state
**Then** a visible status indicator confirms "Patch Applied"
**And** the Revert button is prominently available
**And** the patch highlights are visible in the editor
**And** the three-layer understanding model is complete: editor highlights + chat narration + revert availability

**Given** the creator reverts a patch
**When** the revert completes
**Then** the status indicator updates to reflect the revert
**And** the patch highlights are cleared from the editor

**Given** the patch narration in chat
**When** reviewed by the creator
**Then** it clearly explains what changed in plain language (not code diffs)
**And** it references the creator's original request to show the connection between intent and result

### Story 4.4: Session Continuity & Stability

As a creator,
I want my session to remain stable and responsive across long creative sessions with many iterative edits,
So that I can stay in creative flow without worrying about losing work or needing to refresh.

**Acceptance Criteria:**

**Given** an active composition session
**When** the creator performs 10 consecutive edit turns with retained conversation context
**Then** chat history, current code state, and patch applicability are preserved across all turns without requiring a session reset (FR24)

**Given** an active session lasting 30 minutes with 20+ iterative edits
**When** measured by integration tests
**Then** >= 95% of sessions preserve full state without unrecoverable loss (NFR4)
**And** >= 95% of playback and editing cycles complete without requiring page refresh (NFR5)

**Given** the session context window
**When** conversation history exceeds 20 turns or ~80K tokens
**Then** the OrchestratorAgent's rolling window summarizes or trims older turns
**And** the trimming never silently drops a turn mid-sentence
**And** recent corrective feedback constraints are preserved in the window

**Given** the continuous generate-play-refine loop
**When** the creator cycles through prompt -> generate/patch -> play -> refine multiple times
**Then** each cycle completes without degradation in responsiveness (FR16, FR18)
**And** playback stability is maintained across iterative code updates

**Given** a failed generation or patch attempt mid-session
**When** the creator submits a corrective or retry prompt
**Then** the session continues from the current state in >= 90% of cases without page reload (NFR6, FR22)

### Story 4.5: DAW Export & Code Handoff

As a creator,
I want to export my Strudel code so I can use it in my DAW workflow,
So that the music I create in BardicanAI can continue into my broader production process.

**Acceptance Criteria:**

**Given** the creator has Strudel code in the editor
**When** the creator triggers the export action
**Then** the current `editor.code` is made available for copy-to-clipboard and/or file download

**Given** a GET request to `/sessions/{session_id}/export`
**When** the session has current code
**Then** the endpoint returns the plain Strudel code as a text response
**And** the code is a raw, unescaped string (not JSON-encoded or HTML-escaped)

**Given** the exported Strudel code
**When** used in a downstream DAW-oriented workflow
**Then** the code can be opened or copied into the intended workflow with >= 90% task success in a 10-run acceptance test (NFR13)

**Given** the export action
**When** triggered from the workspace
**Then** it does not interrupt the current session or playback state
**And** the creator can continue working immediately after export (FR17)

### Story 4.6: Epic 4 Validation & Stability Quality Gate

As a creator,
I want comprehensive validation that transparency, recovery, session stability, and export all work reliably,
So that I can trust the tool during long creative sessions without fear of losing work.

**Acceptance Criteria:**

**Automated Tests:**

**Given** an AI patch is applied to existing code
**When** the patch highlight hook runs
**Then** automated tests confirm changed line ranges are correctly identified via diff
**And** highlights render within 500ms of the code update (NFR3)

**Given** the patch stack
**When** automated tests push 50+ patches
**Then** the stack correctly enforces the max depth of 50
**And** revertToPatch correctly restores any previous snapshot and trims the stack

**Given** the checkpoint endpoints
**When** POST and GET requests are made to `/sessions/{session_id}/checkpoints`
**Then** checkpoints are saved and restored correctly with matching code and conversation state

**Given** the export endpoint
**When** GET `/sessions/{session_id}/export` is called
**Then** it returns raw unescaped Strudel code with correct content type

**Given** a session stability test harness
**When** 10 consecutive edit turns are simulated programmatically
**Then** chat history, code state, and patch applicability are preserved across all turns (FR24)

**Given** the 30-minute / 20-edit reliability profile (NFR4, NFR5)
**When** run as an integration test
**Then** >= 95% of sessions complete without unrecoverable loss
**And** >= 95% of playback/editing cycles complete without page refresh

**Given** simulated generation failures mid-session
**When** a corrective prompt is submitted after failure
**Then** >= 90% of cases recover without page reload (NFR6)

**Manual Tests:**

**Given** the complete transparency stack (patch highlights + chat narration + revert button)
**When** a creator performs a patch operation
**Then** all three layers are visible and consistent: editor shows highlighted changes, chat shows narration, revert button is available

**Given** a real 10+ turn creative session
**When** the creator iterates through generate -> play -> refine -> patch -> revert -> re-patch
**Then** the session remains stable, responsive, and all state is preserved throughout

**Given** the export flow
**When** the creator exports code and pastes it into a Strudel-compatible environment
**Then** the code runs correctly without modification

**Given** the full product through Epic 4
**When** tested across Chrome, Firefox, Safari, and Edge
**Then** patch highlights, revert, playback, and export all function consistently

## Epic 5: Maintainer Operations & Quality Evolution

After this epic, the maintainer can tune generation behavior through config, triage issues, manage releases, investigate problem outcomes, and evolve quality without breaking the creator workflow.

### Story 5.1: Generation Configuration & Prompt Tuning

As a maintainer,
I want to adjust generation behavior through configuration and environment variables without modifying application code,
So that I can tune output quality, switch AI providers, and experiment with prompt strategies as part of ongoing product improvement.

**Acceptance Criteria:**

**Given** the backend is running with per-agent provider configuration in `.env`
**When** the maintainer changes `AI_PROVIDER_GENERATION` from `anthropic:claude-sonnet-4-6` to `google-gla:gemini-2.5-pro`
**Then** the GenerationAgent uses the new provider on the next request without code changes or redeployment (FR25)

**Given** the `core/config.py` pydantic-settings configuration
**When** the maintainer reviews available settings
**Then** all configurable parameters are documented with defaults: per-agent provider names, model identifiers, rolling history window size, max patch stack depth, and log level

**Given** the maintainer wants to adjust system prompts for an agent
**When** the maintainer modifies the agent's system prompt text in the agent file
**Then** the change takes effect on the next server restart
**And** the core creator workflow (chat -> generate/patch -> play) continues to function correctly (FR30)

**Given** the provider configuration
**When** `FallbackModel` is configured for an agent (e.g., Anthropic primary, Gemini fallback)
**Then** provider failures on the primary automatically route to the fallback without user-visible interruption

### Story 5.2: Logging & Issue Investigation

As a maintainer,
I want structured logging of generation and patch operations so I can investigate problematic outcomes,
So that I can diagnose quality issues, identify patterns in failures, and apply targeted fixes.

**Acceptance Criteria:**

**Given** the backend processes a generation or patch request
**When** the operation completes (success or failure)
**Then** a structured log entry is written to stdout with: session_id, agent name, model used, change_type, confidence score, latency_ms, and success/error status

**Given** a generation or patch operation fails
**When** the error is logged
**Then** the log entry includes the error code, error message, and the IntentContract that was being processed
**And** no API keys, secrets, or raw user prompts beyond the IntentContract are included in the log (NFR9)

**Given** the maintainer wants to investigate a reported issue
**When** they review the logs for a specific session_id
**Then** they can trace the full sequence: user message -> IntentContract -> agent routing -> generation/patch result -> narration (FR28)

**Given** the logging configuration
**When** the `LOG_LEVEL` env var is set to `DEBUG`
**Then** additional detail is logged including RAG retrieval results and token counts
**And** switching back to `INFO` suppresses the verbose output

**Given** the maintainer identifies a fix based on log investigation
**When** the fix is applied (prompt adjustment, config change, or code fix)
**Then** the fix can be verified by reproducing the original scenario and checking logs for the corrected behavior (FR29)

### Story 5.3: Release Management & Quality Safeguards

As a maintainer,
I want a release process with quality safeguards that prevents regressions and secret leakage,
So that I can ship improvements confidently and evolve the product without breaking creator workflows.

**Acceptance Criteria:**

**Given** the maintainer prepares a release
**When** release artifacts are inspected
**Then** 0 plaintext secrets, API keys, or internal credentials are present in any committed file, `.env.example`, issue template, or build output (NFR9)
**And** `.env.example` contains only placeholder values with descriptive comments

**Given** the maintainer has made changes to generation services or session-state handling
**When** regression tests are run
**Then** the system continues to satisfy NFR16 (5 concurrent sessions with <3s latency)
**And** no changes to user-visible functional behavior are introduced unintentionally (NFR17, FR30)

**Given** the maintainer wants to triage reported issues
**When** reviewing the issue tracker
**Then** issue templates exist for bug reports and feature requests with structured fields for reproduction steps, expected behavior, and session context (FR26)
**And** issue templates do not prompt users to paste API keys or secrets

**Given** the maintainer ships a release with generation or patch improvements
**When** the release is deployed
**Then** the release includes a changelog entry describing what changed
**And** the core creator workflow (chat -> generate/patch -> play -> iterate) passes smoke tests (FR27)

### Story 5.4: Epic 5 Validation & Operations Quality Gate

As a maintainer,
I want comprehensive validation that all operational capabilities work correctly and safely,
So that I can confidently manage, tune, and evolve the product going forward.

**Acceptance Criteria:**

**Automated Tests:**

**Given** all per-agent provider environment variables
**When** each agent's provider is switched to an alternative (e.g., Anthropic to Gemini or vice versa)
**Then** automated tests confirm each agent initializes and produces valid output with the swapped provider

**Given** the FallbackModel configuration
**When** the primary provider is simulated as unavailable
**Then** the fallback provider handles the request without user-visible interruption

**Given** the logging infrastructure
**When** generation and patch operations are executed at LOG_LEVEL=INFO and LOG_LEVEL=DEBUG
**Then** INFO produces structured entries without secrets; DEBUG adds retrieval and token detail; neither level exposes API keys (NFR9)

**Given** the release artifact scanning
**When** a secret-scanning tool runs against all committed files, .env.example, and issue templates
**Then** 0 plaintext secrets are detected

**Given** the regression test suite
**When** run after config or prompt changes
**Then** the NFR16 load profile (5 concurrent sessions, <3s latency) passes
**And** no user-visible functional behavior changes are introduced (NFR17)

**Manual Tests:**

**Given** a simulated issue report with a problematic session_id
**When** the maintainer traces through logs
**Then** the full request chain (message -> IntentContract -> routing -> result -> narration) is reconstructable

**Given** the complete product after Epic 5
**When** a full regression of the creator workflow is performed (prompt -> generate -> patch -> iterate -> revert -> export)
**Then** all steps pass with no regressions from Epic 4

## Epic 6: Public Release & Future Extensibility

After this epic, the product is publicly available on GitHub with setup docs and issue workflow, and the architecture verifiably supports future expansion (sound upload, visualization, community, TouchDesigner) without breaking the core.

### Story 6.1: Public Documentation & Setup Guide

As a user,
I want clear setup instructions and project documentation in the public repository,
So that I can get BardicanAI running locally and understand how to use it.

**Acceptance Criteria:**

**Given** the public GitHub repository
**When** a new user reads the root README.md
**Then** it contains a project overview explaining what BardicanAI does and its core value proposition
**And** it includes a prerequisites section listing required tools (Node.js, pnpm, Python, uv, PostgreSQL with pgvector)

**Given** the README setup instructions
**When** a new user follows them step by step
**Then** they can successfully:
1. Clone the repository
2. Install frontend dependencies (`pnpm install`)
3. Install backend dependencies (`uv sync`)
4. Set up PostgreSQL with pgvector locally
5. Copy `.env.example` / `.env.local.example` and configure API keys
6. Run `seed_knowledge_base.py` to populate the RAG knowledge store
7. Start both frontend and backend
8. Open the workspace in their browser and reach the first-use state (FR31)

**Given** the README
**When** reviewed for security
**Then** no real API keys, secrets, or credentials appear anywhere in the documentation
**And** all example values are clearly marked as placeholders

**Given** the documentation
**When** a new user wants to understand the product
**Then** a runnable demo path is described: open app -> type a prompt -> see generated code -> play it

### Story 6.2: Public Issue Workflow & Support Process

As a user,
I want to report bugs and suggest improvements through a structured issue workflow,
So that problems I encounter can be tracked and resolved.

**Acceptance Criteria:**

**Given** the public GitHub repository
**When** a user creates a new issue
**Then** they can choose from structured templates: Bug Report and Feature Request
**And** each template includes guided fields for clear, actionable reports (FR32)

**Given** the Bug Report template
**When** a user fills it out
**Then** it prompts for: description, steps to reproduce, expected behavior, actual behavior, browser/OS info, and optional session context
**And** it does not prompt for API keys, secrets, or sensitive configuration values

**Given** the Feature Request template
**When** a user fills it out
**Then** it prompts for: feature description, use case, expected benefit, and any relevant context

**Given** a submitted issue
**When** the maintainer triages it
**Then** they can label, prioritize, and assign the issue
**And** they can link the issue to relevant code changes or releases as part of the remediation workflow (FR33)

### Story 6.3: Extensibility Verification & Future-Proofing

As a maintainer,
I want verified confirmation that the architecture supports planned future capabilities without requiring core rework,
So that post-MVP features can be added confidently when the time comes.

**Acceptance Criteria:**

**Given** the current agent/service architecture
**When** evaluated for reference-sound upload and recreation (FR34)
**Then** a documented extension point exists: a new agent (e.g., RecreationAgent) can be added to `agents/` and registered as an OrchestratorAgent tool without modifying existing agents or services

**Given** the current frontend architecture
**When** evaluated for oscilloscope-style visualization (FR35)
**Then** a documented extension point exists: a new component can be added to the workspace (e.g., in the optional RightRail) that reads `editor.code` or playback state from Zustand without modifying existing components

**Given** the current data architecture
**When** evaluated for community sharing of created outputs (FR36)
**Then** a documented extension path exists: session persistence can be added to PostgreSQL (via new tables and Alembic migrations) without modifying the in-memory session_store interface

**Given** the current integration architecture
**When** evaluated for audio-reactive visual integration (FR37)
**Then** a documented extension point exists: a new optional service can subscribe to playback state without coupling to the core generation chain

**Given** all future extension points
**When** optional integrations are disabled or unavailable
**Then** the core chat-editor generation workflow continues to meet NFR1 in >= 95% of standard requests (NFR14)
**And** failures in optional integrations do not terminate the active session or corrupt editor state (NFR15)

**Given** the core conversational code-generation workflow
**When** future capabilities are added via the documented extension points
**Then** the core workflow is preserved without degradation (FR38)
**And** extension points are documented in a CONTRIBUTING.md or architecture guide for future developers

### Story 6.4: Epic 6 Validation & Full Product Acceptance

As a maintainer,
I want comprehensive validation that the product is release-ready with documentation, support workflow, and extensibility all verified,
So that I can confidently publish the project knowing everything works end-to-end.

**Acceptance Criteria:**

**Automated Tests:**

**Given** the README setup instructions
**When** a fresh-clone setup script is run (or simulated in CI)
**Then** all prerequisite checks pass, both apps start, and the workspace loads without errors

**Given** the issue templates
**When** validated by a linting tool or manual check
**Then** all templates render correctly in GitHub's issue creation UI and contain no secret-prompting fields

**Given** the extensibility extension points
**When** integration-disabled regression tests run (NFR14)
**Then** the core chat-editor generation workflow meets NFR1 in >= 95% of requests with optional integrations disabled

**Given** fault-injection tests for optional integrations (NFR15)
**When** timeout, unavailable-service, and malformed-response scenarios are simulated
**Then** 100% of tested failure scenarios preserve the active session and editor state

**Manual Tests:**

**Given** a new user with no prior context
**When** they follow the README from clone to first playable loop
**Then** they can complete the full setup and reach the first-use state within a reasonable time and without undocumented steps

**Given** the complete product (Epics 1-6)
**When** a full acceptance test is performed covering: first-use -> prompt -> generate -> play -> iterate -> patch -> revert -> export -> corrective feedback -> 10+ turn session
**Then** every step in the journey completes successfully without errors, crashes, or workflow interruptions

**Given** the full product
**When** tested across Chrome, Firefox, Safari, and Edge (current stable versions)
**Then** core functionality works consistently across all browsers with no browser-specific failures

**Given** all public-facing surfaces (README, issue templates, .env.example, logs)
**When** reviewed for security
**Then** zero secrets, API keys, or internal credentials are exposed
