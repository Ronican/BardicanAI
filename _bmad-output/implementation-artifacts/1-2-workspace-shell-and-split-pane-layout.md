# Story 1.2: Workspace Shell & Split-Pane Layout

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a creator,
I want to see a split-pane workspace with distinct regions for chat, code editing, and playback controls,
so that I can orient myself in the creative environment and understand where each activity happens.

## Acceptance Criteria

1. **Given** the creator opens the app at localhost:3000
   **When** the page loads
   **Then** an `AppShell` renders with three visible regions: a left `ChatRail` panel, a center `EditorSurface` panel (visually dominant), and a bottom `TransportBar`
   **And** the layout uses the dark experimental creative-tool aesthetic (black/graphite base surfaces)

2. **Given** the workspace is displayed on a standard desktop viewport (≥1280px)
   **When** the creator views the layout
   **Then** the `EditorSurface` occupies the largest visual area
   **And** the `ChatRail` is visible as a left sidebar
   **And** the `TransportBar` spans the full width at the bottom

3. **Given** the workspace is displayed on a narrower viewport (<1024px)
   **When** the layout adapts
   **Then** the `EditorSurface` retains visual priority
   **And** the `ChatRail` compresses or stacks below the editor (chat-below-editor)
   **And** the `TransportBar` remains persistently visible

4. **Given** the workspace shell components
   **When** inspected for accessibility
   **Then** all major regions have appropriate ARIA landmark roles or semantic labels
   **And** keyboard focus can move between the `ChatRail`, `EditorSurface`, and `TransportBar` without traps (NFR10)

5. **Given** the Zustand `editorSlice`
   **When** `setCode(newCode)` is called with any string
   **Then** `store.editor.code` reflects the new value
   **And** no other state location holds a copy (single source of truth enforced by store shape)

## Tasks / Subtasks

- [x] Task 1: Install frontend dependencies (AC: #5)
  - [x] 1.1 In `bardicanai-web/`, run: `pnpm add zustand@5.0.11 @tanstack/react-query@5.90.21`
  - [x] 1.2 Verify both packages appear in `package.json` under `dependencies`
  - [x] 1.3 Run `pnpm dev` to confirm no import errors with new dependencies

- [x] Task 2: Scaffold directory structure (AC: all)
  - [x] 2.1 Create `src/components/workspace/` directory
  - [x] 2.2 Create `src/stores/` directory
  - [x] 2.3 Create `src/hooks/` directory
  - [x] 2.4 Create `src/lib/` directory
  - [x] 2.5 Create `src/types/` directory

- [x] Task 3: Set up Zustand store with all 6 slices (AC: #5)
  - [x] 3.1 Create `src/stores/sessionSlice.ts` — slice with `session_id`, `created_at`, `name`
  - [x] 3.2 Create `src/stores/chatSlice.ts` — slice with `messages: ChatMessage[]` and `appendChatMessage` action
  - [x] 3.3 Create `src/stores/editorSlice.ts` — slice with `code: string` (empty string default) and `setCode` action; this is the SINGLE source of truth for all code state
  - [x] 3.4 Create `src/stores/patchSlice.ts` — slice with `stack: string[]` (max `MAX_PATCH_HISTORY = 50`), `pushPatch`, and `revertToPatch` actions
  - [x] 3.5 Create `src/stores/playbackSlice.ts` — slice with `isPlaying: boolean`, `tempo: number | null`
  - [x] 3.6 Create `src/stores/uiSlice.ts` — slice with `isGenerating: boolean`, `activePanelFocus: string | null`, `patchHighlightRange: null`
  - [x] 3.7 Create `src/stores/useAppStore.ts` — combine all slices into a single Zustand store using `create` with `immer` or plain mutate pattern; export `useAppStore`

- [x] Task 4: Create TypeScript types (AC: all)
  - [x] 4.1 Create `src/types/store.ts` — export `ChatMessage`, `PatchEntry`, and other shared store types
  - [x] 4.2 Create `src/types/api.ts` — placeholder file (will be populated by story 2.x) with comment: "// API request/response types for snake_case ↔ camelCase bridge"

- [x] Task 5: Update global theme for dark creative-tool aesthetic (AC: #1, #2)
  - [x] 5.1 Update `src/app/globals.css` to define design tokens: `--color-surface-base` (#0a0a0a), `--color-surface-raised` (#111111), `--color-surface-border` (#2a2a2a), `--color-accent-magenta` (#d946ef), `--color-accent-cyan` (#06b6d4), `--color-accent-green` (#22d3ee), `--color-text-primary` (#f4f4f5), `--color-text-muted` (#71717a)
  - [x] 5.2 Set `body { background: var(--color-surface-base); color: var(--color-text-primary); overflow: hidden; }` — `overflow: hidden` because the workspace shell controls its own scroll regions
  - [x] 5.3 Remove light-mode defaults in globals.css — this app is always dark

- [x] Task 6: Build workspace shell components (AC: #1, #2, #3, #4)
  - [x] 6.1 Create `src/components/workspace/AppShell.tsx`
    - Three-region layout: `<nav>` ChatRail (left, fixed width ~280px desktop), `<main>` EditorSurface (flex-grow, dominant), `<footer role="contentinfo">` TransportBar (full-width, bottom)
    - Use CSS Grid or Flexbox for layout: `grid-template-areas: "chat editor" "transport transport"` at ≥1024px; stacked column at <1024px
    - Full-height viewport: `height: 100dvh` with no overflow on root
  - [x] 6.2 Create `src/components/workspace/ChatRail.tsx`
    - Semantic: `<aside aria-label="Chat">` wrapper
    - Shell only: render a `<div>` with placeholder text "Chat will appear here" and a composer `<input>` placeholder at the bottom
    - Dark surface: `bg-[#111111]` left border with `border-[#2a2a2a]`
    - At narrow viewports: stacks below editor, collapses to minimum height
  - [x] 6.3 Create `src/components/workspace/EditorSurface.tsx`
    - Semantic: `<section aria-label="Code editor">` wrapper
    - Shell only: render a `<div>` with placeholder text "Strudel code editor will appear here (Story 1.3)"
    - Visually dominant: fills all available space, slightly lighter surface `bg-[#0d0d0d]`
    - Receives keyboard focus via `tabIndex={0}` for accessibility
  - [x] 6.4 Create `src/components/workspace/TransportBar.tsx`
    - Semantic: `<footer role="contentinfo" aria-label="Playback controls">` wrapper (or `<nav aria-label="Playback controls">`)
    - Shell only: render three placeholder buttons — Play, Stop, Restart — all `disabled` (no audio yet, Story 1.4)
    - Music-tool style: dark surface `bg-[#111111]`, top border `border-t border-[#2a2a2a]`, full width, fixed height (~56px)
    - Each button has `aria-label` (e.g., `aria-label="Play"`) for NFR12
    - Visible focus indicators on all buttons (NFR11)

- [x] Task 7: Wire `AppShell` into Next.js root page (AC: #1)
  - [x] 7.1 Replace contents of `src/app/page.tsx` with `<AppShell />` (remove all default Next.js content)
  - [x] 7.2 Update `src/app/layout.tsx` to add `suppressHydrationWarning` and ensure body fills viewport (`className="h-screen overflow-hidden"`)
  - [x] 7.3 Verify `pnpm dev` renders the AppShell (three regions visible, dark background)

- [x] Task 8: Add TanStack Query provider (AC: background setup)
  - [x] 8.1 Create `src/lib/queryClient.ts` — `export const queryClient = new QueryClient()`
  - [x] 8.2 Create `src/components/Providers.tsx` — wraps children in `<QueryClientProvider client={queryClient}>`
  - [x] 8.3 Wrap layout `children` in `<Providers>` in `src/app/layout.tsx`

- [x] Task 9: Tests (AC: #4, #5)
  - [x] 9.1 Install test dependencies: `pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`
  - [x] 9.2 Create `vitest.config.ts` at `bardicanai-web/` root
  - [x] 9.3 Add `"test": "vitest"` to `package.json` scripts
  - [x] 9.4 Create `src/stores/useAppStore.test.ts` — test that `setCode("bd")` updates `store.editor.code` to `"bd"`, and that no other slice holds a `code` field
  - [x] 9.5 Create `src/components/workspace/AppShell.test.tsx` — test that AppShell renders all three landmark regions (`aside[aria-label]`, `section[aria-label]`, `footer[aria-label]` or equivalent)
  - [x] 9.6 Run `pnpm test` and confirm all tests pass

- [x] Task 10: Verification (AC: #1, #2, #3, #4)
  - [x] 10.1 Start `pnpm dev` and view at 1440px — confirm three regions visible, editor dominant, dark aesthetic
  - [x] 10.2 Resize to 768px — confirm ChatRail stacks below editor, TransportBar still visible
  - [x] 10.3 Tab through the page — confirm focus moves to ChatRail and EditorSurface without traps; disabled TransportBar buttons remain present but are not focusable by native browser behavior
  - [x] 10.4 Inspect DOM — confirm `<aside>`, `<section>`, `<footer>` or role attributes on all three regions and labeled playback controls are present in the accessibility tree

## Change Log

- Implemented Story 1.2 workspace shell, state scaffolding, provider scaffolding, tests, and verification on main.
- Code review fixes: added `aria-label="Message input"` and focus-visible ring to ChatRail input (AC 4 / NFR12); removed hardcoded `font-family: Arial` from `globals.css` body so Geist fonts apply correctly; corrected TransportBar focus ring from `ring-accent-cyan` → `ring-accent-magenta` per Dev Notes; removed `passWithNoTests: true` from vitest.config.ts.

## Dev Notes

### Architecture Compliance

This story establishes the frontend component shell and state infrastructure that **every subsequent story builds on**. The constraints below are mandatory.

#### Zustand Store — CRITICAL RULES

1. **Single source of truth for code:** `store.editor.code` is the ONLY location where Strudel code lives. No component, no hook, no other slice should hold a copy.
   ```typescript
   // CORRECT — use Zustand action
   useAppStore.getState().setCode(newCode)

   // WRONG — never mutate directly
   useAppStore.getState().editor.code = newCode
   ```

2. **Patch stack rules (for future stories):**
   - `pushPatch(code)` is called BEFORE applying new AI-generated code (saves current state)
   - `revertToPatch(index)` replaces `editor.code` and trims the stack
   - Maximum stack depth: `MAX_PATCH_HISTORY = 50` (define as constant in `src/lib/constants.ts`)

3. **Zustand slice pattern — use combine or spread pattern, NOT separate stores:**
   ```typescript
   // src/stores/useAppStore.ts — ONE store for the whole app
   export const useAppStore = create<AppStore>()((...args) => ({
     ...createEditorSlice(...args),
     ...createChatSlice(...args),
     ...createSessionSlice(...args),
     ...createPatchSlice(...args),
     ...createPlaybackSlice(...args),
     ...createUiSlice(...args),
   }))
   ```

4. **`ui.isGenerating` is the only signal for generation state** — story 2.x onwards sets this via SSE stream open/close. Don't derive it from anything else.

#### Package Manager — MANDATORY

Always use `pnpm`. Never use `npm install` or `yarn add`.

```bash
# Correct
pnpm add zustand@5.0.11

# Wrong — will break lockfile
npm install zustand
```

#### TypeScript Naming Conventions

- Components: `PascalCase.tsx` — `AppShell.tsx`, `ChatRail.tsx`
- Hooks: `camelCase.ts` with `use` prefix — `useAppStore.ts`, `useGenerationStream.ts` (future)
- Store slices: `camelCase.ts` — `editorSlice.ts`, `chatSlice.ts`
- Zustand actions: `verb + noun` camelCase — `setCode`, `pushPatch`, `revertToPatch`, `appendChatMessage`
- Constants: `SCREAMING_SNAKE_CASE` — `MAX_PATCH_HISTORY`

#### Tailwind CSS v4 Notes

This project uses **Tailwind CSS v4** (installed in Story 1.1). Key differences from v3:
- Config is done via CSS (`@theme inline { ... }` in `globals.css`) not `tailwind.config.ts`
- `@import "tailwindcss"` at the top of globals.css (already in place)
- Arbitrary values still work: `bg-[#0a0a0a]`, `border-[#2a2a2a]`
- Do NOT create a `tailwind.config.ts` file for this story

#### Component Accessibility Requirements (NFR10, NFR11, NFR12)

All three shell regions MUST have semantic HTML and ARIA labels:
```tsx
// ChatRail
<aside aria-label="Chat" className="...">

// EditorSurface
<section aria-label="Code editor" className="...">

// TransportBar
<footer aria-label="Playback controls" className="...">
```

Transport buttons require `aria-label` even though they show icons/text:
```tsx
<button aria-label="Play" disabled className="...">Play</button>
<button aria-label="Stop" disabled className="...">Stop</button>
<button aria-label="Restart" disabled className="...">Restart</button>
```

Keyboard focus must visibly pass through all three regions. In Tailwind v4: use `focus-visible:ring-2 focus-visible:ring-[#d946ef]` (magenta focus ring) for interactive elements.

#### Responsive Layout Strategy

**Editor-first priority** (architecture requirement):
- Desktop (≥1024px): ChatRail left sidebar (~280px fixed), EditorSurface fills remaining width, TransportBar full-width bottom
- Tablet/narrow (<1024px): EditorSurface on top (full width), ChatRail below, TransportBar bottom (always)
- The chat compresses BEFORE the editor loses priority — never shrink the editor to accommodate chat

Recommended CSS Grid approach for AppShell:
```css
/* Desktop */
@media (min-width: 1024px) {
  grid-template-columns: 280px 1fr;
  grid-template-rows: 1fr 56px;
  grid-template-areas: "chat editor" "transport transport";
}

/* Narrow */
grid-template-columns: 1fr;
grid-template-rows: 1fr auto 56px;
grid-template-areas: "editor" "chat" "transport";
```

#### What NOT To Do In This Story

- **Do NOT install `@strudel/codemirror` or `@strudel/web`** — that is Story 1.3 and 1.4 respectively
- **Do NOT render actual CodeMirror editor** — EditorSurface is a shell placeholder in this story
- **Do NOT add audio playback logic** — TransportBar buttons are `disabled` placeholders
- **Do NOT scaffold backend files** — this is a frontend-only story
- **Do NOT create `tailwind.config.ts`** — Tailwind v4 is CSS-config-first
- **Do NOT use `npm` or `yarn`** — pnpm only
- **Do NOT create separate Zustand stores per slice** — one combined store via `useAppStore`
- **Do NOT store `editor.code` anywhere other than Zustand `editorSlice`**

### Project Structure Notes

**New directories and files this story creates:**
```
bardicanai-web/
└── src/
    ├── app/
    │   ├── page.tsx              (modified — replace with <AppShell />)
    │   ├── layout.tsx            (modified — add Providers wrapper)
    │   └── globals.css           (modified — dark theme tokens)
    ├── components/
    │   ├── workspace/
    │   │   ├── AppShell.tsx      (new)
    │   │   ├── AppShell.test.tsx (new)
    │   │   ├── ChatRail.tsx      (new)
    │   │   ├── EditorSurface.tsx (new)
    │   │   └── TransportBar.tsx  (new)
    │   └── Providers.tsx         (new)
    ├── stores/
    │   ├── sessionSlice.ts       (new)
    │   ├── chatSlice.ts          (new)
    │   ├── editorSlice.ts        (new)
    │   ├── patchSlice.ts         (new)
    │   ├── playbackSlice.ts      (new)
    │   ├── uiSlice.ts            (new)
    │   ├── useAppStore.ts        (new)
    │   └── useAppStore.test.ts   (new)
    ├── hooks/                    (new directory, empty — hooks added in later stories)
    ├── lib/
    │   ├── constants.ts          (new — MAX_PATCH_HISTORY, etc.)
    │   └── queryClient.ts        (new)
    └── types/
        ├── store.ts              (new — ChatMessage, etc.)
        └── api.ts                (new — placeholder)
```

**Alignment with architecture `src/` structure:**
[Source: architecture.md — "Frontend project structure" section]
- All component files match the PascalCase.tsx convention
- Hooks directory created (empty) to establish the pattern for story 1.3+
- `lib/` created for constants and API client (API client populated in story 2.x)

**Existing files that must NOT be deleted:**
- `bardicanai-web/src/app/favicon.ico`
- `bardicanai-web/public/` — static assets
- `bardicanai-web/.env.local.example`
- `bardicanai-web/README.md`

### Previous Story Intelligence (from Story 1.1)

**Established conventions to follow:**
- **pnpm** is the only package manager (verified: `pnpm-lock.yaml` exists)
- **bardicanai-web/**: `next@16.1.6`, `react@19.2.3`, TypeScript 5, Tailwind CSS v4 (`^4`), App Router, src/ dir, `@/` import alias
- Layout metadata is already set to `title: "BardicanAI"` and `description: "AI-assisted music creation..."`
- **Geist fonts** already configured as CSS variables in `layout.tsx` — keep them
- **globals.css** uses `@import "tailwindcss"` and `@theme inline {}` pattern (Tailwind v4) — preserve this, extend it

**Debug learnings from Story 1.1:**
- Next.js `.gitignore` uses `.env*` which blocks `.env.local.example` — already fixed with `!.env.local.example` exception; do not break this
- pydantic-ai extras: not relevant to this frontend story

**Files created in Story 1.1 that Story 1.2 modifies:**
- `src/app/page.tsx` — replace default content with `<AppShell />`
- `src/app/layout.tsx` — add `<Providers>` wrapper
- `src/app/globals.css` — extend with dark theme tokens

### Git Intelligence (Recent Commits)

Last 3 commits in this repo:
1. `de7e27e refactor: update story 1.1 documentation and resolve review feedback` — review fixes: tests, pyproject.toml, README, layout.tsx metadata, --turbopack script
2. `ffef8a8 feat: initialize project foundation with Next.js frontend and FastAPI backend` — both apps initialized and wired
3. `c6e6d9f chore: initialize git repository with .gitignore`

**Patterns established:**
- Conventional Commits style (`feat:`, `refactor:`, `chore:`, `fix:`)
- For this story, commit should be: `feat: implement workspace shell and split-pane layout`

### Technical Guidance: Zustand v5 Slice Pattern

Zustand v5 with TypeScript — recommended slice composition pattern:

```typescript
// src/stores/editorSlice.ts
import { StateCreator } from 'zustand'
import type { AppStore } from './useAppStore'

export interface EditorSlice {
  editor: {
    code: string
  }
  setCode: (code: string) => void
}

export const createEditorSlice: StateCreator<AppStore, [], [], EditorSlice> = (set) => ({
  editor: {
    code: '',
  },
  setCode: (code) => set((state) => ({ editor: { ...state.editor, code } })),
})
```

```typescript
// src/stores/useAppStore.ts
import { create } from 'zustand'
import { createEditorSlice, EditorSlice } from './editorSlice'
import { createChatSlice, ChatSlice } from './chatSlice'
// ... other slices

export type AppStore = EditorSlice & ChatSlice & /* ... other slices */

export const useAppStore = create<AppStore>()((...args) => ({
  ...createEditorSlice(...args),
  ...createChatSlice(...args),
  // ... other slices
}))
```

### Technical Guidance: Testing Setup (Vitest + React Testing Library)

Next.js 16.x with React 19 can use Vitest for fast co-located tests:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

**Key test to write for setCode:**
```typescript
// src/stores/useAppStore.test.ts
import { useAppStore } from './useAppStore'

describe('editorSlice', () => {
  beforeEach(() => {
    useAppStore.setState({ editor: { code: '' } })
  })

  it('setCode updates editor.code', () => {
    useAppStore.getState().setCode('bd')
    expect(useAppStore.getState().editor.code).toBe('bd')
  })

  it('no other slice holds a code field', () => {
    const state = useAppStore.getState()
    // Only editor.code is the canonical location
    expect('code' in state.chat).toBe(false)
    expect('code' in state.playback).toBe(false)
  })
})
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — "Frontend Architecture" section (Zustand v5 store slices)]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Structure Patterns" section (Frontend project structure `src/`)]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Naming Patterns" section (Component, hook, store naming)]
- [Source: _bmad-output/planning-artifacts/architecture.md — "State Management Patterns" section (Zustand mutation rules, patch stack)]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Code State Rules" section (single source of truth)]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Error Handling Patterns" section (ui.isGenerating signal)]
- [Source: _bmad-output/planning-artifacts/epics.md — "Story 1.2: Workspace Shell & Split-Pane Layout"]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — "Overall Layout" section]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — "Primary Hierarchy" section (editor-first responsive rule)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — "Important UI States" section]
- [Source: _bmad-output/planning-artifacts/prd.md — "NFR10, NFR11, NFR12" (accessibility requirements)]
- [Source: _bmad-output/planning-artifacts/prd.md — "FR2, FR3, FR14, FR15, FR23" (Epic 1 functional requirements)]
- [Source: _bmad-output/implementation-artifacts/1-1-project-initialization-and-dev-environment.md — Dev Notes (conventions, debug learnings)]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (claude-sonnet-4-6[1m])

### Debug Log References

- Manual verification captured semantic shell regions and keyboard focus traversal on localhost:3000.
- Resolved a post-merge local dev-server dependency state issue by reinstalling merged frontend dependencies on main and re-verifying `pnpm dev`.
- Corrected `patchSlice.revertToPatch()` to route code restoration through the canonical `setCode()` action before final review approval.

### Completion Notes List

- Added a shell-only workspace layout with `ChatRail`, dominant `EditorSurface`, and persistent `TransportBar`.
- Added a single combined Zustand store with namespaced slices for session, chat, editor, patch, playback, and UI state.
- Enforced `editor.code` as the canonical code source of truth and covered patch history/revert behavior with tests.
- Added TanStack Query provider scaffolding through `Providers.tsx` and `queryClient.ts`.
- Added Vitest and React Testing Library coverage for the shell landmarks and store contract.
- Verified desktop and narrow viewport shell behavior, semantic landmarks, and keyboard traversal.
- Added the empty `src/hooks/` scaffold to match the story’s requested frontend structure.

### File List

- bardicanai-web/package.json
- bardicanai-web/pnpm-lock.yaml
- bardicanai-web/src/app/globals.css
- bardicanai-web/src/app/layout.tsx
- bardicanai-web/src/app/page.tsx
- bardicanai-web/src/components/Providers.tsx
- bardicanai-web/src/components/workspace/.gitkeep
- bardicanai-web/src/components/workspace/AppShell.test.tsx
- bardicanai-web/src/components/workspace/AppShell.tsx
- bardicanai-web/src/components/workspace/ChatRail.tsx
- bardicanai-web/src/components/workspace/EditorSurface.tsx
- bardicanai-web/src/components/workspace/TransportBar.tsx
- bardicanai-web/src/hooks/.gitkeep
- bardicanai-web/src/lib/.gitkeep
- bardicanai-web/src/lib/constants.ts
- bardicanai-web/src/lib/queryClient.ts
- bardicanai-web/src/stores/.gitkeep
- bardicanai-web/src/stores/chatSlice.ts
- bardicanai-web/src/stores/editorSlice.ts
- bardicanai-web/src/stores/patchSlice.ts
- bardicanai-web/src/stores/playbackSlice.ts
- bardicanai-web/src/stores/sessionSlice.ts
- bardicanai-web/src/stores/uiSlice.ts
- bardicanai-web/src/stores/useAppStore.test.ts
- bardicanai-web/src/stores/useAppStore.ts
- bardicanai-web/src/test/setup.ts
- bardicanai-web/src/types/.gitkeep
- bardicanai-web/src/types/api.ts
- bardicanai-web/src/types/store.ts
- bardicanai-web/vitest.config.ts
- _bmad-output/implementation-artifacts/sprint-status.yaml
- _bmad-output/implementation-artifacts/1-2-workspace-shell-and-split-pane-layout.md
