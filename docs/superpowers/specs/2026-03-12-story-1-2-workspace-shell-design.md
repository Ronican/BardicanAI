# Story 1.2 Design Spec: Workspace Shell and Split-Pane Layout

## Objective

Implement Story 1.2 by replacing the default Next.js starter page with a dark, responsive workspace shell that establishes three stable UI regions: `ChatRail`, `EditorSurface`, and `TransportBar`. At the same time, create the frontend state and provider scaffolding that later stories will extend without changing the shell contract.

## Scope

This spec covers only the shell and state foundation required by Story 1.2.

In scope:
- Responsive three-region app shell
- Dark theme tokens in `globals.css`
- Combined Zustand store with six slices
- Shared type definitions and constants
- TanStack Query provider scaffolding
- Landmark and store-contract tests

Out of scope:
- Real Strudel editor integration
- Audio playback logic
- Backend or API integration
- Additional panel abstractions beyond the named story components
- Future-story hooks or runtime behavior

## Constraints

- Use `pnpm` for all package operations.
- Use a single Zustand store composed from slices.
- Keep `store.editor.code` as the only location that stores code.
- Follow the existing Next.js App Router structure under `bardicanai-web/src/`.
- Preserve the existing Geist font setup in `src/app/layout.tsx`.
- Do not create `tailwind.config.ts`; use Tailwind CSS v4 CSS-based theming only.
- Keep the implementation shell-only: placeholders and disabled transport controls only.

## Architecture

### Route entry

`src/app/page.tsx` becomes a single-purpose workspace entry point that renders `<AppShell />`.

`src/app/layout.tsx` remains the application root, keeps existing metadata and fonts, adds `suppressHydrationWarning`, ensures the body fills the viewport, and wraps children with a shared `Providers` component.

### Shell structure

`AppShell` owns the layout contract.

Desktop behavior (`>=1024px`):
- Left `ChatRail` with fixed width of `280px`
- Dominant `EditorSurface` filling the remaining width
- Bottom `TransportBar` spanning the full width

Narrow behavior (`<1024px`):
- `EditorSurface` first
- `ChatRail` stacked below the editor
- `TransportBar` last and always visible in the shell layout

Implementation approach:
- Use CSS Grid in `AppShell`
- Use `100dvh` for the root shell height
- Keep root overflow hidden so each region controls its own internal space

Scroll ownership:
- `AppShell` does not scroll
- `EditorSurface` owns the primary content scroll region
- `ChatRail` may scroll internally if its placeholder content exceeds available height
- `TransportBar` remains fixed within the shell grid and does not scroll
- In the narrow layout, `EditorSurface` and `ChatRail` remain independent vertical regions above the persistent `TransportBar`

This makes the shell contract explicit: content scrolls inside regions, never on the page root.

### Data and naming conventions

The frontend store uses app-native camelCase naming even if future API payloads use snake_case.

That means:
- story-level field names that were written as `session_id` and `created_at` should be implemented as `sessionId` and `createdAt` in the Zustand store
- any future snake_case to camelCase mapping belongs in the API boundary, not in components or store shape

This keeps the store consistent with the project’s TypeScript conventions and avoids mixing transport format with application state.

### Initial slice contracts

The combined store should initialize with deterministic defaults.

- `sessionSlice`
  - `session.sessionId: string | null = null`
  - `session.createdAt: string | null = null`
  - `session.name: string | null = null`
- `chatSlice`
  - `chat.messages: ChatMessage[] = []`
  - `appendChatMessage(message)` appends to `chat.messages`
- `editorSlice`
  - `editor.code: string = ""`
  - `setCode(code)` replaces `editor.code`
- `patchSlice`
  - `patch.stack: PatchEntry[] = []`
  - `pushPatch(code)` appends a new entry and trims history to `MAX_PATCH_HISTORY`
  - `revertToPatch(index)` replaces `editor.code` with the selected patch content and trims newer history entries after that index
- `playbackSlice`
  - `playback.isPlaying: boolean = false`
  - `playback.tempo: number | null = null`
- `uiSlice`
  - `ui.isGenerating: boolean = false`
  - `ui.activePanelFocus: "chat" | "editor" | "transport" | null = null`
  - `ui.patchHighlightRange: { from: number; to: number } | null = null`

The patch history contract is important for later stories: reverting is state-changing behavior, not a passive selection.

### Component boundaries

#### `AppShell`
Purpose: compose the three required regions and define responsive layout behavior.

Responsibilities:
- Render `ChatRail`, `EditorSurface`, and `TransportBar`
- Apply grid layout rules for desktop and narrow viewports
- Own the viewport-height shell container

Non-responsibilities:
- No editor logic
- No playback logic
- No chat messaging logic

#### `ChatRail`
Purpose: provide the visual and semantic shell for the future chat panel.

Responsibilities:
- Render an `<aside aria-label="Chat">`
- Show placeholder text
- Show a composer input placeholder near the bottom
- Use the raised dark surface and border styling

Non-responsibilities:
- No message rendering beyond placeholder shell content
- No input submission behavior

#### `EditorSurface`
Purpose: provide the dominant visual shell for the future Strudel editor.

Responsibilities:
- Render a `<section aria-label="Code editor">`
- Accept keyboard focus via `tabIndex={0}`
- Show placeholder text for the future Strudel integration
- Occupy the dominant visual region

Non-responsibilities:
- No CodeMirror or Strudel integration yet
- No local code state

#### `TransportBar`
Purpose: provide the persistent shell for future playback controls.

Responsibilities:
- Render a `<footer aria-label="Playback controls" role="contentinfo">`
- Render disabled `Play`, `Stop`, and `Restart` buttons
- Expose visible focus styles and explicit `aria-label`s on buttons
- Keep a consistent dark raised surface and top border

Non-responsibilities:
- No audio runtime behavior
- No transport state transitions yet

## State design

Create a single Zustand store in `src/stores/useAppStore.ts` by composing six slices.

### Slice list

- `sessionSlice`: `session`, `setSession`
- `chatSlice`: `chat`, `appendChatMessage`
- `editorSlice`: `editor`, `setCode`
- `patchSlice`: `patch`, `pushPatch`, `revertToPatch`
- `playbackSlice`: `playback`
- `uiSlice`: `ui`

Each slice owns a single namespaced object plus its actions. The concrete field shapes and defaults are defined in the initial slice contracts above.

This keeps the top-level store consistent with the project’s naming conventions and makes each slice independently understandable.

### Critical invariant

`editor.code` is the only valid home for code state.

The implementation must not:
- duplicate a top-level `code` field elsewhere,
- add `code` to another slice, or
- store a local component copy intended to mirror the canonical editor state.

### Supporting files

- `src/types/store.ts`: shared store and domain types such as `ChatMessage` and `PatchEntry`
- `src/types/api.ts`: exports a single placeholder type alias such as `export type ApiPlaceholder = never` with the story comment about the future snake_case to camelCase bridge
- `src/lib/constants.ts`: define `MAX_PATCH_HISTORY = 50`

`src/types/api.ts` exists only because the story explicitly requires it. It should contain a minimal real export, not only a comment, so the file remains valid TypeScript without introducing API behavior early.

## Provider scaffolding

Add TanStack Query now so later stories can add server state without changing app structure.

Files:
- `src/lib/queryClient.ts`: exports a client-side `QueryClient` singleton for use inside the browser provider layer
- `src/components/Providers.tsx`: is a client component that wraps children with `QueryClientProvider`

Provider contract:
- the `QueryClient` instance is created once in client-side module scope for this frontend app
- the provider layer does not introduce request-scoped server behavior in this story
- the provider layer remains thin and does not add unrelated wrappers

This makes the provider boundary explicit and avoids ambiguity about server-side state sharing.

## Theme and styling

Update `src/app/globals.css` to define the permanent dark creative-tool palette via CSS variables.

Required tokens:
- `--color-surface-base`: `#0a0a0a`
- `--color-surface-raised`: `#111111`
- `--color-surface-border`: `#2a2a2a`
- `--color-accent-magenta`: `#d946ef`
- `--color-accent-cyan`: `#06b6d4`
- `--color-accent-green`: `#22d3ee` (retain the story value as written, even though the hue reads closer to cyan)
- `--color-text-primary`: `#f4f4f5`
- `--color-text-muted`: `#71717a`

Body rules:
- background uses `--color-surface-base`
- text uses `--color-text-primary`
- root body overflow is hidden

Styling direction:
- Keep panel styling simple and dark
- Use slightly raised surfaces for side and bottom regions
- Keep the editor region slightly distinct so it remains visually dominant
- Do not spend scope on decorative polish beyond hierarchy, contrast, and focus visibility

## Accessibility contract

The shell must satisfy the story’s accessibility requirements through semantics and focus order.

Required landmarks:
- `ChatRail`: `<aside aria-label="Chat">`
- `EditorSurface`: `<section aria-label="Code editor">`
- `TransportBar`: `<footer aria-label="Playback controls" role="contentinfo">`

Required keyboard behavior:
- Focus can move through the page without traps
- `EditorSurface` is directly focusable
- `ChatRail` exposes its input placeholder as a natural focus stop
- The transport region stays reachable in reading order

Disabled transport control rule:
- Transport controls are rendered as native disabled buttons in this story
- Because native disabled buttons are not focusable, focus verification for Story 1.2 applies to the major regions and any naturally focusable shell elements, not to disabled transport buttons themselves
- Visible focus styling is still defined now so it is ready when the buttons become enabled in Story 1.4

Required button labeling:
- `aria-label="Play"`
- `aria-label="Stop"`
- `aria-label="Restart"`

This keeps the accessibility contract internally consistent while preserving the future control shape.

## Testing strategy

Keep tests contract-focused rather than style-fragile.

### Store test

File: `src/stores/useAppStore.test.ts`

Verify:
- `setCode("bd")` updates `useAppStore.getState().editor.code`
- No other slice exposes a `code` field

This test protects the single-source-of-truth rule.

### Shell test

File: `src/components/workspace/AppShell.test.tsx`

Verify:
- `AppShell` renders all three major regions
- Landmarks are present by semantic role and label

This test protects the shell contract without pinning the implementation to exact class strings.

## Validation checklist

After implementation:
- `pnpm dev` runs without import errors
- The shell renders at desktop width with editor dominance
- The shell stacks editor first and chat second below `1024px`
- The transport region remains visible in the layout
- Keyboard focus moves through the shell without traps
- `pnpm test` passes
- Existing lint checks still pass

## Recommended implementation path

1. Install runtime dependencies for Zustand and TanStack Query.
2. Scaffold directories and supporting type/lib files.
3. Build the combined Zustand store and enforce the editor-code invariant.
4. Update global tokens and dark body rules.
5. Implement `AppShell`, `ChatRail`, `EditorSurface`, and `TransportBar`.
6. Replace the default page with `<AppShell />` and add `Providers` in layout.
7. Add Vitest and React Testing Library.
8. Add contract-focused store and shell tests.
9. Verify behavior in browser, tests, and linting.

## Success criteria

This story is successful when the app stops looking like a starter template and instead presents a stable creative-tool shell that later stories can plug into without changing the route structure, layout contract, or state ownership model.
### Critical invariant

`editor.code` is the only valid home for code state.

The implementation must not:
- duplicate a top-level `code` field elsewhere,
- add `code` to another slice, or
- store a local component copy intended to mirror the canonical editor state.

### Supporting files

- `src/types/store.ts`: shared store and domain types such as `ChatMessage` and `PatchEntry`
- `src/types/api.ts`: exports a single placeholder type alias such as `export type ApiPlaceholder = never` with the story comment about the future snake_case to camelCase bridge
- `src/lib/constants.ts`: define `MAX_PATCH_HISTORY = 50`

## Provider scaffolding

Add TanStack Query now so later stories can add server state without changing app structure.

Files:
- `src/lib/queryClient.ts`: exports a client-side `QueryClient` singleton for use inside the browser provider layer
- `src/components/Providers.tsx`: is a client component that wraps children with `QueryClientProvider`

Provider contract:
- the `QueryClient` instance is created once in client-side module scope for this frontend app
- the provider layer does not introduce request-scoped server behavior in this story
- the provider layer remains thin and does not add unrelated wrappers

This makes the provider boundary explicit and avoids ambiguity about server-side state sharing.

## Theme and styling

## Theme and styling

Update `src/app/globals.css` to define the permanent dark creative-tool palette via CSS variables.

Required tokens:
- `--color-surface-base`: `#0a0a0a`
- `--color-surface-raised`: `#111111`
- `--color-surface-border`: `#2a2a2a`
- `--color-accent-magenta`: `#d946ef`
- `--color-accent-cyan`: `#06b6d4`
- `--color-accent-green`: `#22d3ee`
- `--color-text-primary`: `#f4f4f5`
- `--color-text-muted`: `#71717a`

Body rules:
- background uses `--color-surface-base`
- text uses `--color-text-primary`
- root body overflow is hidden

Styling direction:
- Keep panel styling simple and dark
- Use slightly raised surfaces for side and bottom regions
- Keep the editor region slightly distinct so it remains visually dominant
- Do not spend scope on decorative polish beyond hierarchy, contrast, and focus visibility

## Accessibility contract

The shell must satisfy the story’s accessibility requirements through semantics and focus order.

Required landmarks:
- `ChatRail`: `<aside aria-label="Chat">`
- `EditorSurface`: `<section aria-label="Code editor">`
- `TransportBar`: `<footer aria-label="Playback controls" role="contentinfo">`

Required keyboard behavior:
- Focus can move through the page without traps
- `EditorSurface` is directly focusable
- `ChatRail` exposes its input placeholder as a natural focus stop
- The transport region stays reachable in reading order

Disabled transport control rule:
- Transport controls are rendered as native disabled buttons in this story
- Because native disabled buttons are not focusable, focus verification for Story 1.2 applies to the major regions and any naturally focusable shell elements, not to disabled transport buttons themselves
- Visible focus styling is still defined now so it is ready when the buttons become enabled in Story 1.4

Required button labeling:
- `aria-label="Play"`
- `aria-label="Stop"`
- `aria-label="Restart"`

This keeps the accessibility contract internally consistent while preserving the future control shape.

## Testing strategy

## Testing strategy

Keep tests contract-focused rather than style-fragile.

### Store test

File: `src/stores/useAppStore.test.ts`

Verify:
- `setCode("bd")` updates `useAppStore.getState().editor.code`
- No other slice exposes a `code` field

This test protects the single-source-of-truth rule.

### Shell test

File: `src/components/workspace/AppShell.test.tsx`

Verify:
- `AppShell` renders all three major regions
- Landmarks are present by semantic role and label

This test protects the shell contract without pinning the implementation to exact class strings.

## Validation checklist

After implementation:
- `pnpm dev` runs without import errors
- The shell renders at desktop width with editor dominance
- The shell stacks editor first and chat second below `1024px`
- The transport region remains visible in the layout
- Keyboard focus moves through the shell without traps
- `pnpm test` passes
- Existing lint checks still pass

## Recommended implementation path

1. Install runtime dependencies for Zustand and TanStack Query.
2. Scaffold directories and supporting type/lib files.
3. Build the combined Zustand store and enforce the editor-code invariant.
4. Update global tokens and dark body rules.
5. Implement `AppShell`, `ChatRail`, `EditorSurface`, and `TransportBar`.
6. Replace the default page with `<AppShell />` and add `Providers` in layout.
7. Add Vitest and React Testing Library.
8. Add contract-focused store and shell tests.
9. Verify behavior in browser, tests, and linting.

## Success criteria

This story is successful when the app stops looking like a starter template and instead presents a stable creative-tool shell that later stories can plug into without changing the route structure, layout contract, or state ownership model.