# Story 1.2 Workspace Shell and Split-Pane Layout Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default Next.js starter page with a dark, responsive workspace shell, add the combined Zustand and TanStack Query scaffolding, and prove the shell and store contracts with focused tests.

**Architecture:** Build a shell-only frontend foundation in `bardicanai-web/src/` with one combined Zustand store, thin provider scaffolding, and three focused workspace components. Keep code state canonical in `editor.code`, keep scroll ownership inside shell regions, and avoid any editor runtime or playback behavior that belongs to later stories.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS v4, Zustand 5.0.11, TanStack Query 5.90.21, Vitest, React Testing Library, jsdom

---

## File structure map

### Create
- `bardicanai-web/src/components/Providers.tsx` — client-only TanStack Query provider wrapper
- `bardicanai-web/src/components/workspace/AppShell.tsx` — root shell layout and region composition
- `bardicanai-web/src/components/workspace/ChatRail.tsx` — left/sidebar chat shell placeholder
- `bardicanai-web/src/components/workspace/EditorSurface.tsx` — dominant editor shell placeholder
- `bardicanai-web/src/components/workspace/TransportBar.tsx` — bottom disabled playback control shell
- `bardicanai-web/src/components/workspace/AppShell.test.tsx` — landmark contract tests for shell regions
- `bardicanai-web/src/stores/sessionSlice.ts` — session state and setter
- `bardicanai-web/src/stores/chatSlice.ts` — chat message state and append action
- `bardicanai-web/src/stores/editorSlice.ts` — canonical code state and `setCode`
- `bardicanai-web/src/stores/patchSlice.ts` — patch history state, push, and revert actions
- `bardicanai-web/src/stores/playbackSlice.ts` — playback shell state
- `bardicanai-web/src/stores/uiSlice.ts` — generation and focus shell state
- `bardicanai-web/src/stores/useAppStore.ts` — single combined Zustand store export
- `bardicanai-web/src/stores/useAppStore.test.ts` — single-source-of-truth and patch behavior tests
- `bardicanai-web/src/lib/constants.ts` — `MAX_PATCH_HISTORY`
- `bardicanai-web/src/lib/queryClient.ts` — client-side singleton `QueryClient`
- `bardicanai-web/src/types/store.ts` — shared store/domain types
- `bardicanai-web/src/types/api.ts` — minimal placeholder export plus future bridge comment
- `bardicanai-web/src/test/setup.ts` — Vitest setup imports
- `bardicanai-web/vitest.config.ts` — Vitest config with jsdom and alias setup

### Modify
- `bardicanai-web/package.json` — add runtime/test dependencies and `test` script
- `bardicanai-web/src/app/page.tsx` — replace starter content with `<AppShell />`
- `bardicanai-web/src/app/layout.tsx` — add `suppressHydrationWarning`, viewport body classes, and `Providers`
- `bardicanai-web/src/app/globals.css` — replace starter light/dark defaults with permanent dark workspace tokens
- `bardicanai-web/pnpm-lock.yaml` — dependency lockfile updates after installs

## Chunk 1: Dependencies, test harness, and store foundation

### Task 1: Add runtime and test dependencies, then scaffold directories

**Files:**
- Modify: `bardicanai-web/package.json`
- Modify: `bardicanai-web/pnpm-lock.yaml`
- Create: `bardicanai-web/src/components/workspace/`
- Create: `bardicanai-web/src/stores/`
- Create: `bardicanai-web/src/lib/`
- Create: `bardicanai-web/src/types/`
- Create: `bardicanai-web/src/test/`
- Create: `bardicanai-web/vitest.config.ts`
- Create: `bardicanai-web/src/test/setup.ts`

- [ ] **Step 1: Install runtime dependencies**

Run:

```bash
pnpm --dir bardicanai-web add zustand@5.0.11 @tanstack/react-query@5.90.21
```

Expected: install completes successfully and updates `package.json` and `pnpm-lock.yaml`.

- [ ] **Step 2: Install test dependencies**

Run:

```bash
pnpm --dir bardicanai-web add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Expected: devDependencies and `pnpm-lock.yaml` update successfully.

- [ ] **Step 3: Add the `test` script to `package.json`**

Add:

```json
"test": "vitest"
```

Expected: `package.json` now exposes a frontend test command.

- [ ] **Step 4: Create the required source directories**

Run:

```bash
mkdir -p bardicanai-web/src/components/workspace bardicanai-web/src/stores bardicanai-web/src/lib bardicanai-web/src/types bardicanai-web/src/test
```

Expected: all directories exist. Do not create `src/hooks/` in this story because nothing uses it yet.

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    passWithNoTests: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 6: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 7: Smoke-check the test harness and dev server after setup**

Run:

```bash
pnpm --dir bardicanai-web test -- --run
pnpm --dir bardicanai-web dev
```

Expected:
- `pnpm test -- --run` succeeds because `vitest.config.ts` enables `passWithNoTests: true`
- `pnpm dev` starts without dependency resolution errors. Stop it after confirming startup.

- [ ] **Step 8: Commit the dependency and test harness setup**

```bash
git add bardicanai-web/package.json bardicanai-web/pnpm-lock.yaml bardicanai-web/vitest.config.ts bardicanai-web/src/test/setup.ts
git commit -m "chore: add workspace shell frontend toolchain"
```

### Task 2: Define shared types, constants, and the first failing store tests

**Files:**
- Create: `bardicanai-web/src/types/store.ts`
- Create: `bardicanai-web/src/types/api.ts`
- Create: `bardicanai-web/src/lib/constants.ts`
- Create: `bardicanai-web/src/stores/useAppStore.test.ts`

- [ ] **Step 1: Write the failing store contract tests**

Create `bardicanai-web/src/stores/useAppStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { MAX_PATCH_HISTORY } from "@/lib/constants";
import { useAppStore } from "./useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState({
      session: { sessionId: null, createdAt: null, name: null },
      chat: { messages: [] },
      editor: { code: "" },
      patch: { stack: [] },
      playback: { isPlaying: false, tempo: null },
      ui: { isGenerating: false, activePanelFocus: null, patchHighlightRange: null },
    });
  });

  it("exports the patch history constant", () => {
    expect(MAX_PATCH_HISTORY).toBe(50);
  });

  it("setCode updates editor.code", () => {
    useAppStore.getState().setCode("bd");
    expect(useAppStore.getState().editor.code).toBe("bd");
  });

  it("does not expose code on other slices", () => {
    const state = useAppStore.getState();
    expect("code" in state.chat).toBe(false);
    expect("code" in state.playback).toBe(false);
    expect("code" in state.ui).toBe(false);
  });

  it("pushPatch trims history to the max limit", () => {
    for (let index = 0; index < MAX_PATCH_HISTORY + 1; index += 1) {
      useAppStore.getState().pushPatch(`code-${index}`);
    }

    expect(useAppStore.getState().patch.stack).toHaveLength(MAX_PATCH_HISTORY);
    expect(useAppStore.getState().patch.stack.at(0)?.code).toBe("code-1");
  });

  it("revertToPatch restores editor.code and trims newer patches", () => {
    useAppStore.getState().pushPatch("alpha");
    useAppStore.getState().pushPatch("beta");
    useAppStore.getState().pushPatch("gamma");

    useAppStore.getState().revertToPatch(1);

    expect(useAppStore.getState().editor.code).toBe("beta");
    expect(useAppStore.getState().patch.stack.map((entry) => entry.code)).toEqual(["alpha", "beta"]);
  });
});
```

- [ ] **Step 2: Run the store tests to verify the red state**

Run:

```bash
pnpm --dir bardicanai-web test -- --run src/stores/useAppStore.test.ts
```

Expected: FAIL because the store files do not exist yet.

- [ ] **Step 3: Create `src/lib/constants.ts`**

```ts
export const MAX_PATCH_HISTORY = 50;
```

- [ ] **Step 4: Create `src/types/store.ts`**

```ts
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export interface PatchEntry {
  code: string;
  createdAt: string;
}

export type ActivePanelFocus = "chat" | "editor" | "transport";

export interface PatchHighlightRange {
  from: number;
  to: number;
}
```

- [ ] **Step 5: Create `src/types/api.ts` as valid TypeScript**

```ts
// API request/response types for snake_case ↔ camelCase bridge
export type ApiPlaceholder = never;
```

- [ ] **Step 6: Re-run the store tests**

Run:

```bash
pnpm --dir bardicanai-web test -- --run src/stores/useAppStore.test.ts
```

Expected: still FAIL, but now only because `useAppStore` and slices do not exist yet.

- [ ] **Step 7: Commit the shared contracts and red tests**

```bash
git add bardicanai-web/src/lib/constants.ts bardicanai-web/src/types/store.ts bardicanai-web/src/types/api.ts bardicanai-web/src/stores/useAppStore.test.ts
git commit -m "test: add workspace shell store contracts"
```

### Task 3: Build the combined Zustand store with six slices

**Files:**
- Create: `bardicanai-web/src/stores/sessionSlice.ts`
- Create: `bardicanai-web/src/stores/chatSlice.ts`
- Create: `bardicanai-web/src/stores/editorSlice.ts`
- Create: `bardicanai-web/src/stores/patchSlice.ts`
- Create: `bardicanai-web/src/stores/playbackSlice.ts`
- Create: `bardicanai-web/src/stores/uiSlice.ts`
- Create: `bardicanai-web/src/stores/useAppStore.ts`
- Test: `bardicanai-web/src/stores/useAppStore.test.ts`

- [ ] **Step 1: Implement `sessionSlice.ts`**

```ts
export interface SessionSlice {
  session: {
    sessionId: string | null;
    createdAt: string | null;
    name: string | null;
  };
  setSession: (session: SessionSlice["session"]) => void;
}
```

- [ ] **Step 2: Implement `chatSlice.ts`**

```ts
export interface ChatSlice {
  chat: { messages: ChatMessage[] };
  appendChatMessage: (message: ChatMessage) => void;
}
```

Action behavior: append to `chat.messages` only.

- [ ] **Step 3: Implement `editorSlice.ts`**

```ts
export interface EditorSlice {
  editor: { code: string };
  setCode: (code: string) => void;
}
```

Action behavior: replace `editor.code` directly via Zustand `set`.

- [ ] **Step 4: Implement `patchSlice.ts`**

Use `PatchEntry[]`, `MAX_PATCH_HISTORY`, and actions with explicit behavior:
- `pushPatch(code)` appends `{ code, createdAt: new Date().toISOString() }` and trims older entries when length exceeds `MAX_PATCH_HISTORY`
- `revertToPatch(index)` sets `editor.code` to the chosen entry’s `code` and trims newer history entries after `index`
- if `index` is out of range, leave store state unchanged

- [ ] **Step 5: Implement `playbackSlice.ts`**

```ts
export interface PlaybackSlice {
  playback: { isPlaying: boolean; tempo: number | null };
}
```

Initialize runtime state only. Do not add transport actions yet.

- [ ] **Step 6: Implement `uiSlice.ts`**

```ts
export interface UiSlice {
  ui: {
    isGenerating: boolean;
    activePanelFocus: ActivePanelFocus | null;
    patchHighlightRange: PatchHighlightRange | null;
  };
}
```

Initialize only `false` and `null` defaults. Do not add future-story actions.

- [ ] **Step 7: Implement `useAppStore.ts` by composing all slices into one store**

```ts
export type AppStore = SessionSlice & ChatSlice & EditorSlice & PatchSlice & PlaybackSlice & UiSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createSessionSlice(...args),
  ...createChatSlice(...args),
  ...createEditorSlice(...args),
  ...createPatchSlice(...args),
  ...createPlaybackSlice(...args),
  ...createUiSlice(...args),
}));
```

- [ ] **Step 8: Run the store tests again to verify the green state**

Run:

```bash
pnpm --dir bardicanai-web test -- --run src/stores/useAppStore.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit the store implementation**

```bash
git add bardicanai-web/src/stores bardicanai-web/src/lib/constants.ts bardicanai-web/src/types/store.ts bardicanai-web/src/types/api.ts
git commit -m "feat: add workspace shell app store"
```

## Chunk 2: Providers, theme, components, tests, and verification

### Task 4: Add the TanStack Query provider layer and layout wiring

**Files:**
- Create: `bardicanai-web/src/lib/queryClient.ts`
- Create: `bardicanai-web/src/components/Providers.tsx`
- Modify: `bardicanai-web/src/app/layout.tsx`

- [ ] **Step 1: Create `src/lib/queryClient.ts`**

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

- [ ] **Step 2: Create `src/components/Providers.tsx` as a client component**

```tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

- [ ] **Step 3: Update `src/app/layout.tsx`**

Required changes:
- add `suppressHydrationWarning` to `<html>`
- update `<body>` to include `h-screen overflow-hidden`
- wrap `{children}` with `<Providers>`
- preserve metadata and Geist font variables

- [ ] **Step 4: Run lint to verify the provider layer integrates cleanly**

Run:

```bash
pnpm --dir bardicanai-web lint
```

Expected: PASS.

- [ ] **Step 5: Commit the provider layer**

```bash
git add bardicanai-web/src/lib/queryClient.ts bardicanai-web/src/components/Providers.tsx bardicanai-web/src/app/layout.tsx
git commit -m "feat: add workspace shell provider scaffolding"
```

### Task 5: Apply the permanent dark workspace theme

**Files:**
- Modify: `bardicanai-web/src/app/globals.css`

- [ ] **Step 1: Replace the starter light and dark defaults with permanent dark tokens**

```css
:root {
  --color-surface-base: #0a0a0a;
  --color-surface-raised: #111111;
  --color-surface-border: #2a2a2a;
  --color-accent-magenta: #d946ef;
  --color-accent-cyan: #06b6d4;
  --color-accent-green: #22d3ee;
  --color-text-primary: #f4f4f5;
  --color-text-muted: #71717a;
}
```

- [ ] **Step 2: Update the body rules for the shell app**

```css
body {
  background: var(--color-surface-base);
  color: var(--color-text-primary);
  overflow: hidden;
}
```

Also remove the starter `prefers-color-scheme` logic.

- [ ] **Step 3: Run lint to catch CSS regressions**

Run:

```bash
pnpm --dir bardicanai-web lint
```

Expected: PASS.

- [ ] **Step 4: Commit the theme token update**

```bash
git add bardicanai-web/src/app/globals.css
git commit -m "feat: add workspace shell dark theme tokens"
```

### Task 6: Implement the shell landmark tests, components, and route wiring

**Files:**
- Create: `bardicanai-web/src/components/workspace/AppShell.test.tsx`
- Create: `bardicanai-web/src/components/workspace/AppShell.tsx`
- Create: `bardicanai-web/src/components/workspace/ChatRail.tsx`
- Create: `bardicanai-web/src/components/workspace/EditorSurface.tsx`
- Create: `bardicanai-web/src/components/workspace/TransportBar.tsx`
- Modify: `bardicanai-web/src/app/page.tsx`

- [ ] **Step 1: Write the failing shell landmark test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppShell from "./AppShell";

describe("AppShell", () => {
  it("renders chat, editor, and playback regions", () => {
    render(<AppShell />);

    expect(screen.getByLabelText("Chat")).toBeInTheDocument();
    expect(screen.getByLabelText("Code editor")).toBeInTheDocument();
    expect(screen.getByLabelText("Playback controls")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the shell landmark test to verify it fails**

Run:

```bash
pnpm --dir bardicanai-web test -- --run src/components/workspace/AppShell.test.tsx
```

Expected: FAIL because the shell components do not exist yet.

- [ ] **Step 3: Implement `ChatRail.tsx`**

Requirements:
- `<aside aria-label="Chat">`
- placeholder text `Chat will appear here`
- composer `<input placeholder="Type a message..." />` near the bottom
- dark raised surface, border, and internal overflow support

- [ ] **Step 4: Implement `EditorSurface.tsx`**

Requirements:
- `<section aria-label="Code editor" tabIndex={0}>`
- placeholder text `Strudel code editor will appear here (Story 1.3)`
- dominant fill region
- primary internal scroll ownership

- [ ] **Step 5: Implement `TransportBar.tsx`**

Requirements:
- `<footer role="contentinfo" aria-label="Playback controls">`
- three native disabled buttons: `Play`, `Stop`, `Restart`
- explicit `aria-label`s
- focus-visible classes ready for later enabled state
- fixed shell height around `56px`

- [ ] **Step 6: Implement `AppShell.tsx` with responsive grid areas**

Requirements:
- desktop grid: `"chat editor" "transport transport"`
- narrow grid: `"editor" "chat" "transport"`
- `h-[100dvh]`
- root non-scrolling shell
- editor visually dominant
- region composition only, no business logic

- [ ] **Step 7: Replace the starter page with `AppShell`**

```tsx
import AppShell from "@/components/workspace/AppShell";

export default function Home() {
  return <AppShell />;
}
```

- [ ] **Step 8: Run the shell landmark test again**

Run:

```bash
pnpm --dir bardicanai-web test -- --run src/components/workspace/AppShell.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Commit the shell components and route wiring**

```bash
git add bardicanai-web/src/components/workspace bardicanai-web/src/app/page.tsx
git commit -m "feat: add workspace shell layout"
```

### Task 7: Run full verification and finish the story branch

**Files:**
- Test: `bardicanai-web/src/stores/useAppStore.test.ts`
- Test: `bardicanai-web/src/components/workspace/AppShell.test.tsx`

- [ ] **Step 1: Run the targeted test files**

Run:

```bash
pnpm --dir bardicanai-web test -- --run src/stores/useAppStore.test.ts src/components/workspace/AppShell.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run the full frontend test suite**

Run:

```bash
pnpm --dir bardicanai-web test -- --run
```

Expected: PASS.

- [ ] **Step 3: Run lint**

Run:

```bash
pnpm --dir bardicanai-web lint
```

Expected: PASS.

- [ ] **Step 4: Verify the browser shell manually**

Run:

```bash
pnpm --dir bardicanai-web dev
```

Manual checks:
- at ~1440px: chat left, editor dominant, transport full width bottom
- at ~768px: editor first, chat below, transport still visible
- tab order reaches the chat input and editor region without traps
- shell uses dark background and raised panels

- [ ] **Step 5: Commit the verification-backed implementation**

```bash
git add bardicanai-web/package.json bardicanai-web/pnpm-lock.yaml bardicanai-web/vitest.config.ts bardicanai-web/src/test/setup.ts bardicanai-web/src/stores/useAppStore.test.ts bardicanai-web/src/components/workspace/AppShell.test.tsx bardicanai-web/src/app/layout.tsx bardicanai-web/src/app/page.tsx bardicanai-web/src/app/globals.css bardicanai-web/src/components/Providers.tsx bardicanai-web/src/components/workspace bardicanai-web/src/lib bardicanai-web/src/stores bardicanai-web/src/types
git commit -m "feat: implement workspace shell and split-pane layout"
```

## Final verification checklist

- [ ] `bardicanai-web/package.json` contains Zustand, TanStack Query, and Vitest dependencies
- [ ] `src/app/page.tsx` renders only `<AppShell />`
- [ ] `src/app/layout.tsx` preserves metadata/fonts and wraps children in `Providers`
- [ ] `src/app/globals.css` defines the permanent dark workspace tokens and body overflow rule
- [ ] `src/stores/useAppStore.ts` composes all six slices into one store
- [ ] `editor.code` is the only code state location
- [ ] patch history trimming and revert behavior are covered by tests
- [ ] `src/components/workspace/AppShell.tsx` renders three semantic regions with responsive layout
- [ ] `src/components/workspace/AppShell.test.tsx` passes
- [ ] `src/stores/useAppStore.test.ts` passes
- [ ] `pnpm --dir bardicanai-web lint` passes
- [ ] `pnpm --dir bardicanai-web test -- --run` passes
- [ ] manual browser verification passes at desktop and narrow widths
- [ ] no real editor, playback, backend, or future-story behavior was added

## Chunk review notes

- Review Chunk 1 after writing Tasks 1-3.
- Review Chunk 2 after writing Tasks 4-7.
- If a reviewer finds issues, fix the plan chunk before execution handoff.