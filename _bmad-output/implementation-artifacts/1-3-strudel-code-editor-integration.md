# Story 1.3: Strudel Code Editor Integration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a creator,
I want a syntax-highlighted Strudel code editor in the workspace where I can write and edit code,
so that I can manually create and modify Strudel patterns as part of my creative workflow.

## Acceptance Criteria

1. **Given** the workspace is loaded
   **When** the EditorSurface renders
   **Then** a CodeMirror 6 editor powered by @strudel/codemirror is displayed with Strudel-aware syntax highlighting

2. **Given** the editor is active
   **When** the creator types or modifies Strudel code
   **Then** the Zustand `editor.code` state updates to reflect the current editor content
   **And** no other state location holds a copy of the code (single source of truth)

3. **Given** the editor contains code
   **When** the code is updated via a Zustand `setCode` action (simulating future AI updates)
   **Then** the editor reflects the new code within 500ms (NFR3)

4. **Given** the editor is rendered
   **When** the creator uses keyboard navigation
   **Then** the editor is focusable via keyboard and does not create a keyboard trap (NFR10)
   **And** the editor has a programmatic label for screen-reader identification (NFR12)

## Tasks / Subtasks

- [x] Task 1: Install editor dependencies (AC: #1)
  - [x] 1.1 In `bardicanai-web/`, run: `pnpm add @strudel/codemirror@1.3.0 @uiw/react-codemirror @uiw/codemirror-themes @codemirror/lang-javascript`
  - [x] 1.2 Verify packages resolve and appear in `package.json` under `dependencies`
  - [x] 1.3 Run `pnpm dev` to confirm no import errors with new dependencies (CodeMirror may require `"use client"` directive)

- [x] Task 2: Create the `StrudelEditor` component (AC: #1, #2, #3)
  - [x] 2.1 Create `src/components/editor/StrudelEditor.tsx`
    - Import `CodeMirror` from `@uiw/react-codemirror` as the React wrapper
    - Import Strudel extensions from `@strudel/codemirror` (verify exact exports at install time — expect `strudelTheme` and/or highlighting extensions)
    - Import `@codemirror/lang-javascript` as fallback language if `@strudel/codemirror` does not provide a standalone language extension
    - Mark as `"use client"` — CodeMirror requires browser DOM APIs
  - [x] 2.2 Wire controlled value from Zustand:
    - Read `code` via `useAppStore((s) => s.editor.code)`
    - Pass `value={code}` to `<CodeMirror />`
    - On `onChange` callback, call `useAppStore.getState().setCode(newValue)` — use `.getState()` to avoid re-render loops
  - [x] 2.3 Create a dark custom theme using `createTheme` from `@uiw/codemirror-themes`:
    - Background: `#0d0d0d` (matches EditorSurface current bg)
    - Foreground: `var(--color-text-primary)` / `#f4f4f5`
    - Caret: `#d946ef` (accent magenta)
    - Selection: `rgba(217, 70, 239, 0.15)` (magenta translucent)
    - Gutter background: `#0a0a0a`
    - Gutter foreground: `#71717a` (text-muted)
    - Line highlight: `rgba(255, 255, 255, 0.03)`
    - If `@strudel/codemirror` exports its own `strudelTheme`, evaluate whether to use it directly or layer the custom dark theme on top — prefer the Strudel theme if it fits the dark aesthetic
  - [x] 2.4 Configure editor props:
    - `height="100%"` to fill EditorSurface container
    - `basicSetup` with line numbers enabled, bracket matching on, fold gutter off (music code tends to be short)
    - `extensions` array: Strudel language/highlighting + JavaScript fallback
    - `className` for any Tailwind overrides needed

- [x] Task 3: Update `EditorSurface.tsx` to render `StrudelEditor` (AC: #1, #4)
  - [x] 3.1 Replace the placeholder text `"Strudel code editor will appear here (Story 1.3)"` with `<StrudelEditor />`
  - [x] 3.2 Keep the `<section aria-label="Code editor">` wrapper and its existing classes
  - [x] 3.3 Ensure the section has `tabIndex={-1}` (not `{0}`) since the CodeMirror editor provides its own focusable surface — the section wrapper should not compete for tab focus
  - [x] 3.4 Add an `aria-describedby` or ensure the CodeMirror editor inherits the section's label context for screen readers (NFR12)
  - [x] 3.5 Adjust CSS: the container needs `display: flex; flex-direction: column; overflow: hidden` to let CodeMirror fill the available space without double scrollbars

- [x] Task 4: Handle bidirectional sync edge cases (AC: #2, #3)
  - [x] 4.1 Prevent infinite update loops: the `onChange` handler must NOT call `setCode` if the new value equals the current `editor.code` (CodeMirror fires onChange even on programmatic value changes in some cases)
  - [x] 4.2 Verify external updates: in the browser console or via a test, call `useAppStore.getState().setCode("s('bd sd')\\n")` and confirm the editor content updates within 500ms
  - [x] 4.3 Verify user edits: type in the editor and confirm `useAppStore.getState().editor.code` reflects the typed content

- [x] Task 5: Tests (AC: #1, #2, #3, #4)
  - [x] 5.1 Create `src/components/editor/StrudelEditor.test.tsx`
    - Test that `StrudelEditor` renders without crashing (smoke test)
    - Test that the component reads initial value from Zustand store
    - Test that calling `setCode(newValue)` on the store updates the rendered value
    - NOTE: CodeMirror DOM integration may require special Vitest/jsdom handling — if CodeMirror doesn't render in jsdom, mock the `@uiw/react-codemirror` module and test the wiring logic (onChange calls setCode, value reads from store)
  - [x] 5.2 Update `src/components/workspace/AppShell.test.tsx`
    - If the existing test checks for the placeholder text "Strudel code editor will appear here", update it to check for the CodeMirror editor presence instead (e.g., check for the `cm-editor` class or the StrudelEditor component)
  - [x] 5.3 Run `pnpm test` and confirm all tests pass

- [x] Task 6: Verification (AC: #1, #2, #3, #4) — manual browser verification complete
  - [x] 6.1 Start `pnpm dev` and view at localhost:3000 — confirmed CodeMirror editor renders in the EditorSurface region with Strudel theme syntax highlighting
  - [x] 6.2 Type Strudel code (e.g., `s("bd sd hh sd")`) — confirmed typed code appears in the editor and remains editable
  - [x] 6.3 Open browser DevTools console, run `useAppStore.getState().setCode("note('c3 e3 g3')")` — confirmed live editor updates after exposing `window.useAppStore` in development only
  - [x] 6.4 Tab through the page — confirmed the editor is reachable via keyboard and does not trap focus; `Escape` then `Tab` moves focus out to the chat message input
  - [x] 6.5 Inspect accessibility tree — confirmed labeled `Code editor`, `Chat`, `Message input`, and `Playback controls` regions/controls are present
  - [x] 6.6 Resize to narrow viewport — confirmed editor still renders correctly and layout order remains editor → chat → transport at 768px wide
  - Manual verification date: 2026-03-13 via Playwright against a fresh local dev server on port 3000 after restarting the stale prior instance.

## Dev Notes

### Architecture Compliance

This story replaces the EditorSurface placeholder with a real CodeMirror 6 editor powered by `@strudel/codemirror`. The architecture specifies `StrudelEditor.tsx` as a sub-component inside `src/components/editor/`.

#### Package Selection — CRITICAL DECISIONS

1. **`@strudel/codemirror` (v1.3.0)** — Strudel-aware CodeMirror extensions (syntax highlighting, theme, language support). Architecture specified v1.2.6 but **1.3.0 is the latest stable version** on npm as of 2026-01. Use 1.3.0 unless compatibility issues arise.

2. **`@uiw/react-codemirror`** — React wrapper for CodeMirror 6. This is the de facto standard React integration for CodeMirror 6. The Strudel project itself used this package (see [PR #173](https://github.com/tidalcycles/strudel/pull/173)). It provides:
   - Controlled `value` + `onChange` props (exactly what we need for Zustand sync)
   - `extensions` prop for plugging in Strudel-specific extensions
   - `theme` prop for custom dark themes
   - `basicSetup` prop for common editor features

3. **`@uiw/codemirror-themes`** — Theme creation utilities (`createTheme`) for building a custom dark theme matching the app's design tokens.

4. **`@codemirror/lang-javascript`** — JavaScript/TypeScript language support. Strudel code is essentially JavaScript with domain-specific functions, so this provides baseline syntax highlighting that Strudel extensions enhance.

#### Zustand Integration — CONTROLLED EDITOR PATTERN

```tsx
// StrudelEditor.tsx — controlled component pattern
"use client";

import CodeMirror from "@uiw/react-codemirror";
import { useAppStore } from "@/stores/useAppStore";

export default function StrudelEditor() {
  const code = useAppStore((s) => s.editor.code);

  const handleChange = useCallback((value: string) => {
    // Use getState() to avoid re-render cascade
    if (value !== useAppStore.getState().editor.code) {
      useAppStore.getState().setCode(value);
    }
  }, []);

  return (
    <CodeMirror
      value={code}
      onChange={handleChange}
      extensions={[/* strudel + js extensions */]}
      theme={strudelDarkTheme}
      basicSetup={{ lineNumbers: true, bracketMatching: true, foldGutter: false }}
      height="100%"
    />
  );
}
```

**Key rules:**
- `useAppStore((s) => s.editor.code)` — selector subscription for reactive updates from Zustand to CodeMirror
- `useAppStore.getState().setCode()` — direct state access in `onChange` to avoid re-render loops
- Guard against no-op updates: check `value !== current` before calling `setCode`

#### Editor State — SINGLE SOURCE OF TRUTH (Inherited from Story 1.2)

- `store.editor.code` is the ONLY location where Strudel code lives
- CodeMirror is a **view** of this state, not the owner of it
- Future stories (2.x) will update code via `setCode()` from SSE streams — the editor must reflect these external updates
- `patchSlice.pushPatch()` saves snapshots BEFORE AI overwrites (not this story's concern, but don't break the contract)

#### Theme — DARK CREATIVE-TOOL AESTHETIC

The editor theme MUST match the existing dark surface palette from `globals.css`:
- Editor background: `#0d0d0d` (slightly lighter than `--color-surface-base: #0a0a0a`)
- Gutter/chrome: `#0a0a0a` / `#111111`
- Text: `#f4f4f5` (`--color-text-primary`)
- Muted text (line numbers, comments): `#71717a` (`--color-text-muted`)
- Accent caret/selection: `#d946ef` (`--color-accent-magenta`)
- String literals: `#06b6d4` (`--color-accent-cyan`)
- Keywords/functions: `#d946ef` (magenta)

If `@strudel/codemirror` provides a `strudelTheme`, check whether its colors align with the app palette. If not, create a custom theme using `createTheme` from `@uiw/codemirror-themes` and layer it with any Strudel-specific highlighting.

#### Accessibility (NFR10, NFR11, NFR12)

- CodeMirror 6 natively supports keyboard navigation and screen readers
- The editor MUST NOT create a keyboard trap — CodeMirror's default behavior allows Escape to move focus to the outer container
- The `<section aria-label="Code editor">` wrapper provides the accessible label
- Change `tabIndex` on the section from `{0}` to `{-1}` so the CodeMirror input field is the primary focus target (prevents double tab stops)

#### `"use client"` Directive

CodeMirror requires browser DOM APIs. `StrudelEditor.tsx` MUST have `"use client"` at the top. The parent `EditorSurface.tsx` may also need it if it doesn't already have it — check at implementation time.

### Project Structure Notes

**New files this story creates:**
```
bardicanai-web/
└── src/
    └── components/
        └── editor/
            ├── StrudelEditor.tsx       (new — CodeMirror 6 + @strudel/codemirror)
            └── StrudelEditor.test.tsx   (new — editor integration tests)
```

**Files this story modifies:**
```
bardicanai-web/
├── package.json                                  (modified — add editor dependencies)
├── pnpm-lock.yaml                                (modified — lockfile update)
└── src/
    └── components/
        └── workspace/
            ├── EditorSurface.tsx                  (modified — replace placeholder with <StrudelEditor />)
            └── AppShell.test.tsx                  (modified — update test if placeholder text assertion exists)
```

**Alignment with architecture `src/` structure:**
[Source: architecture.md — Frontend project structure]
- `StrudelEditor.tsx` goes in `src/components/editor/` per architecture spec
- This matches the planned structure: `editor/StrudelEditor.tsx`, `editor/PatchHighlight.tsx` (Story 4.1), `editor/RevertButton.tsx` (Story 4.2)

**What NOT to do in this story:**
- Do NOT install `@strudel/web` — that is Story 1.4 (playback runtime)
- Do NOT implement patch highlighting/decorations — that is Story 4.1
- Do NOT add the `useEditorDiff` hook — that is Story 4.1
- Do NOT create `src/types/strudel.ts` — defer until needed (Story 1.4 or 2.x)
- Do NOT touch TransportBar or ChatRail — those are unchanged
- Do NOT add audio playback logic — Story 1.4
- Do NOT use `npm` or `yarn` — pnpm only

### Previous Story Intelligence (from Story 1.2)

**Established conventions to follow:**
- **pnpm** is the only package manager
- **Tailwind CSS v4** — config via CSS (`@theme inline {}` in globals.css), no `tailwind.config.ts`
- **Zustand v5 slice pattern** — single store via `useAppStore`, slices composed with spread
- **Testing** — Vitest + React Testing Library + jsdom, config at `vitest.config.ts`, setup at `src/test/setup.ts`
- **TypeScript naming** — Components: PascalCase.tsx, Hooks: camelCase with `use` prefix, Constants: SCREAMING_SNAKE
- **Conventional Commits** — `feat:`, `fix:`, `refactor:`, `test:`, `chore:`

**Debug learnings from Story 1.2:**
- `patchSlice.revertToPatch()` was corrected to route through `setCode()` — confirms that ALL code mutations must go through `setCode`. The editor `onChange` handler follows this same rule.
- Grid areas for desktop layout use: `"chat editor" "transport transport"` — don't modify these.
- `overflow: hidden` on body is intentional — the workspace shell controls its own scroll regions.

**Files created in Story 1.2 that Story 1.3 touches:**
- `src/components/workspace/EditorSurface.tsx` — replace placeholder with `<StrudelEditor />`
- `src/components/workspace/AppShell.test.tsx` — may need test update if placeholder assertion exists

### Git Intelligence (Recent Commits)

Last 5 relevant commits:
1. `4ef7288 docs: mark story 1.2 complete and update sprint status to review`
2. `03182eb Merge branch 'story-1-2-workspace-shell'`
3. `26fa1e4 fix: route patch reverts through setCode`
4. `701e702 fix: correct workspace desktop grid areas`
5. `29c578f feat: add workspace shell layout`

**Established patterns:**
- Conventional Commits (`feat:`, `fix:`, `docs:`)
- Feature branches merged to main
- For this story: `feat: integrate strudel code editor with CodeMirror 6`

### Latest Technical Information

**@strudel/codemirror v1.3.0** (latest stable, published ~Jan 2026):
- Contains CodeMirror 6 extensions for Strudel syntax highlighting and theming
- Architecture specified v1.2.6 — use 1.3.0 unless a specific breaking change is identified
- The Strudel project refactored its REPL from React to vanilla JS in v1.0.0, but `@strudel/codemirror` still provides CodeMirror extensions that work with any React wrapper
- The Strudel project used `@uiw/react-codemirror` for its React integration (confirmed via [PR #173](https://github.com/tidalcycles/strudel/pull/173))

**@uiw/react-codemirror** (latest stable):
- De facto standard React wrapper for CodeMirror 6
- Controlled component: `value` + `onChange` props
- `extensions` prop accepts any CodeMirror 6 extension (including @strudel/codemirror extensions)
- `theme` prop accepts CodeMirror themes or custom themes via `createTheme`
- `basicSetup` prop for common features (line numbers, bracket matching, etc.)
- Compatible with React 19 (uses standard ref and effect patterns)

**CodeMirror 6 Notes:**
- CodeMirror 6 is a complete rewrite — no backward compatibility with CM5
- Extension-based architecture: language, theme, keybindings are all extensions
- Native accessibility: supports screen readers, keyboard navigation, ARIA attributes
- Escape key moves focus out of the editor by default (no keyboard trap)

**Peer dependency note:** `@uiw/react-codemirror` pulls in `@codemirror/state` and `@codemirror/view` as transitive dependencies. Verify no version conflicts arise with `@strudel/codemirror`'s expectations by checking `pnpm ls @codemirror/state @codemirror/view` after install.

### References

- [Source: _bmad-output/planning-artifacts/epics.md — "Story 1.3: Strudel Code Editor Integration"]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Frontend Architecture" section (@strudel/codemirror + CodeMirror 6)]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Frontend project structure" (src/components/editor/StrudelEditor.tsx)]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Code State Boundary" (editor.code single source of truth)]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Strudel Boundary" (browser-only runtime)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — "Primary Hierarchy" (editor-first, code visibility priority)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — "Editor Region" (syntax highlighting, manual editing)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — "Responsive Rule" (preserve code visibility first)]
- [Source: _bmad-output/planning-artifacts/prd.md — "FR2" (view and edit Strudel code), "NFR3" (500ms render), "NFR10-12" (accessibility)]
- [Source: _bmad-output/implementation-artifacts/1-2-workspace-shell-and-split-pane-layout.md — Dev Notes (Zustand patterns, Tailwind v4, testing setup)]
- [Source: npm — @strudel/codemirror v1.3.0](https://www.npmjs.com/package/@strudel/codemirror)
- [Source: @uiw/react-codemirror docs](https://uiwjs.github.io/react-codemirror/)
- [Source: Strudel project integration guide](https://strudel.cc/technical-manual/project-start/)

## Dev Agent Record

### Agent Model Used

claude-opus-4-6

### Debug Log References

- `@lezer/highlight` not hoisted by pnpm (not a direct dep) — originally used `createTheme({ styles: [] })` to avoid the dep. **Code review fix**: switched to sub-path import `@strudel/codemirror/themes/strudel-theme.mjs` which provides full per-token styles without requiring `@lezer/highlight` as a direct dep. The canvas issue is in `codemirror.mjs` (which imports `@strudel/draw`), NOT in `themes.mjs` or its subdirectories.
- `@strudel/codemirror/themes/strudel-theme.mjs` is safe to import: its only deps are `@codemirror/view`, `@codemirror/language`, and `@lezer/highlight` (all pure CodeMirror — no canvas or audio runtime).
- `@uiw/react-codemirror` mocked in both test files to avoid jsdom canvas limitations.
- External setCode test now correctly uses `act()` wrapper and asserts on the rendered textarea value, not just the store.

### Completion Notes List

- Installed: `@strudel/codemirror@1.3.0`, `@uiw/react-codemirror@4.25.8`, `@uiw/codemirror-themes@4.25.8`, `@codemirror/lang-javascript@6.2.5`
- Created `StrudelEditor.tsx`: `"use client"`, CodeMirror 6 controlled component, Zustand wiring with `.getState()` guard, Strudel theme import, and Geist Mono font styling
- Updated `EditorSurface.tsx`: replaced placeholder with `<StrudelEditor />`, changed `tabIndex` from `{0}` to `{-1}`, added `flex flex-col overflow-hidden` CSS for correct height fill
- Created `StrudelEditor.test.tsx`: 4 tests covering smoke render, store read, onChange→setCode wiring, and rendered external `setCode` updates via `act()`
- Updated `AppShell.test.tsx`: added CodeMirror/Strudel theme mocks to prevent jsdom failures
- Manual verification on 2026-03-13 confirmed live editor rendering, typing, console-driven external `setCode(...)` updates via dev-only `window.useAppStore`, keyboard escape from the editor, accessibility labels, and narrow viewport behavior
- All 11 tests pass, no regressions

### File List

- `bardicanai-web/package.json` (modified — added editor dependencies)
- `bardicanai-web/pnpm-lock.yaml` (modified — lockfile update)
- `bardicanai-web/src/components/editor/StrudelEditor.tsx` (new)
- `bardicanai-web/src/components/editor/StrudelEditor.test.tsx` (new)
- `bardicanai-web/src/components/workspace/EditorSurface.tsx` (modified)
- `bardicanai-web/src/components/workspace/AppShell.test.tsx` (modified)

## Change Log

- 2026-03-13: Story implemented — installed CodeMirror 6 dependencies, created StrudelEditor component with Zustand wiring, updated EditorSurface with real editor replacing placeholder, all tests pass (11/11)
- 2026-03-13: Code review fixes — switched from ad-hoc custom theme to safe `@strudel/codemirror/themes/strudel-theme.mjs` sub-path import for real Strudel token styling, updated tests to assert rendered external store updates via `act()`, and kept story status at `in-progress` until Task 6 manual verification is completed.
