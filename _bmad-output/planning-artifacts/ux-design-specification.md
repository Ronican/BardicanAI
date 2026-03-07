---
stepsCompleted: [1]
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/brainstorming/brainstorming-session-2026-03-05-100420.md"
---

# UX Design Specification BardicanAI

**Author:** Ronican
**Date:** 2026-03-07

---

## Concise UX Concept

BardicanAI is a conversational music-making workspace for generating and refining Strudel code through natural language. The product should feel like a live creative instrument: the user describes musical intent in chat, the system generates or patches Strudel code directly in the editor, the user plays it immediately, and continues refining in a tight conversational loop.

### Core UX Principle

**Chat expresses intent, the editor shows truth, playback confirms outcome.**

### Product Feeling

- low-friction
- exploratory
- code-aware
- creative
- fast
- safe through reversibility, not friction

## MVP Screen List

### 1. Main Workspace Screen

The primary MVP screen containing the chat panel, Strudel editor, playback controls, patch status, revert action, and optional lightweight history/timeline region. This screen handles first-time use, idea-to-first-loop, iterative refinement, wrong-output recovery, and rapid experimentation.

### 2. Empty / First-Use State

A state of the main workspace, not a separate page. Includes a welcoming prompt, example starter prompts, empty editor or placeholder structure, and inactive playback until code exists.

### 3. Generating / Patching State

A state of the main workspace with visible generation feedback in chat, subtle patch-in-progress cues, and a stable visible editor.

### 4. Patch Applied State

A state of the main workspace where changed code is highlighted in the editor, chat shows a concise patch summary, patch-applied status is visible, and revert-last-patch is immediately available.

### 5. Error / Recovery State

A state of the main workspace that preserves code and conversation context while offering retry, regenerate, or revert paths.

### 6. Optional History / Checkpoint Panel

A supporting panel, drawer, or rail within the workspace, not a separate full screen. Used for recent patches, checkpoint awareness, and quick recovery affordances.

## Main Workspace Description

### Overall Layout

A single adaptive split workspace for desktop/laptop web use.

- Left panel: conversational chat
- Center/main panel: large Strudel code editor with strongest visual emphasis
- Persistent playback transport bar, ideally across the bottom
- Optional right-side collapsible history or patch timeline rail if space allows

### Chat Area

Purpose: capture musical intent, narrate changes, and support iterative refinement.

Contains:
- user and AI messages
- prompt composer
- concise AI patch summaries
- generation or patching indicators
- optional quick follow-up suggestions

### Strudel Code Editor

Purpose: source of truth for generated and patched output.

Contains:
- full current Strudel code
- syntax-highlighted code surface
- highlighted AI changes directly in the editor
- manual editing support

Patch highlight guidance:
- added/generated code: cool green/cyan glow
- modified code: violet/blue highlight
- removed/replaced code: subtle amber or red trace if shown

### Playback Controls

Purpose: immediate auditory validation.

Contains:
- Play
- Stop
- Replay / Restart
- playback status
- optional BPM visibility

Playback controls must remain visible at all times and should feel like a music-tool transport bar, not a generic toolbar.

### Status / Patch Feedback Region

Purpose: communicate system actions without breaking flow.

Contains lightweight cues for generating, applying patch, patch applied, playback active, reverted, and retry/error states.

### History / Patch Timeline

Purpose: confidence and recovery.

Contains recent changes, optional checkpoints, patch summaries, and revert affordances. This is secondary to the live creative loop.

## Key Interaction and State Decisions

### Primary Hierarchy

- Primary: Strudel editor
- Co-primary: chat panel
- Persistent: playback controls
- Secondary: history and additional status metadata

### Patch Understanding Model

Users should understand every AI edit through three layers:
1. direct patch highlights in the editor
2. concise patch narration in chat
3. immediate revert availability and patch status confirmation

### Recovery Model

Primary recovery action: **one-click revert last AI patch**.

Secondary recovery actions:
- corrective follow-up prompt
- regenerate from current context
- optional earlier checkpoints

### Important UI States

- idle / empty
- generating
- patch applied
- playback active
- error state
- recovery / retry state
- session continuity state

### Responsive Rule

Preserve code visibility first. On narrower widths, the chat compresses before the editor loses priority, history collapses into a drawer, and playback remains persistent.

## Stitch Export Audit — BardicanAI Workspace

### Audited Artifact

- Screen: `BardicanAI Workspace`
- Source: `stitch-downloads/bardicanai-workspace.html`
- Purpose: assess whether the generated UI concept aligns with the intended BardicanAI MVP UX direction and determine what should be carried forward into planning and implementation.

### What the Stitch Export Gets Right

#### 1. Correct core workspace model
The export strongly matches the intended **single adaptive creative workspace** rather than drifting into a generic multi-screen SaaS layout.

Evidence:
- left chat panel
- dominant central code editor
- persistent bottom transport bar
- secondary right-side utility rail

Assessment: **Strong alignment**

#### 2. Editor correctly reads as the source of truth
The central editor is visually dominant and receives the most attention in the composition, which matches the intended hierarchy.

Evidence:
- code area occupies the largest region
- editor has clear file/context framing
- patch changes are highlighted directly inside code lines

Assessment: **Strong alignment**

#### 3. Chat is present as narration, not the main canvas
The chat panel correctly supports the workflow without overwhelming it.

Evidence:
- user prompt and AI patch narration shown in left rail
- clear conversational framing
- prompt composer remains visible at the bottom of chat

Assessment: **Strong alignment**

#### 4. Patch highlighting is successfully expressed
The export captures one of the most important UX requirements: visible AI changes directly in the code editor.

Evidence:
- highlighted patch lines with cyan glow and left-border emphasis
- patch lines differentiated from surrounding code
- patch narration in chat references the change

Assessment: **Very strong alignment**

#### 5. Persistent playback controls are handled well
The bottom transport bar communicates a music-tool feeling and keeps playback visible as part of the creative loop.

Evidence:
- persistent footer transport
- clear play / stop / replay controls
- BPM and elapsed time visible
- tactile, studio-like transport styling

Assessment: **Strong alignment**

#### 6. Visual tone is close to the intended direction
The export successfully delivers a dark, atmospheric, experimental creative-tool aesthetic rather than a bland product UI.

Evidence:
- black/graphite base surfaces
- magenta/cyan/green accent palette
- oscilloscope/glow motifs
- immersive cinematic styling

Assessment: **Strong alignment**

### Where the Stitch Export Falls Short

#### 1. Recovery is present but underdeveloped
The export includes a `Revert Patch` control, which is good, but recovery is not visually integrated as a first-class post-patch state.

Missing or weak areas:
- no clear "patch applied → undo available" transient state pattern
- no explicit wrong-output recovery guidance in chat
- no visible retry / alternate variation affordance

Assessment: **Partial alignment**

#### 2. History/checkpoint model is not yet legible
A right utility rail exists, but it does not yet clearly express patch history, checkpoints, or timeline understanding.

Missing or weak areas:
- no visible named recent patches
- no checkpoint labels
- no explicit timeline of changes
- utility icons are atmospheric but semantically unclear

Assessment: **Weak alignment**

#### 3. Important system states are underrepresented
The export mainly shows a static “active” concept, but does not fully represent the range of required operational states.

Missing or weak areas:
- no clear empty/first-use state
- no explicit error state
- no visible retry state
- no clear session continuity / saved-state cue
- generating state is present but simplistic

Assessment: **Partial alignment**

#### 4. Responsive/editor-first behavior is not demonstrated
The exported HTML represents a large desktop concept only, so the responsive rule is not yet proven.

Missing or weak areas:
- no evidence of chat compression behavior
- no evidence of history collapsing into a drawer
- no smaller-width adaptation shown

Assessment: **Unknown / not demonstrated**

#### 5. Some visual choices are more concept-art than implementation-guiding
The export is visually strong, but a few details drift toward art direction over product clarity.

Examples:
- right-side icon rail lacks explicit semantic meaning
- oscilloscope widget is atmospheric but not clearly tied to a concrete MVP workflow
- “Optimize” action introduces a capability not defined as a core MVP interaction in the UX direction

Assessment: **Useful inspiration, but should not be treated as literal product requirement**

### Carry Forward into Planning and Implementation

The following Stitch outcomes should be treated as **validated visual/structural direction**:
- single split workspace model
- dominant code editor
- visible chat narration rail
- persistent bottom transport bar
- direct in-editor patch highlighting
- dark experimental creative-tool visual language

The following should be treated as **conceptual inspiration only** and must be clarified before implementation:
- right utility rail behavior and semantics
- oscilloscope / ambient visualization treatment
- “Optimize” action and any non-PRD controls
- exact visual treatment of patch history/checkpoints

### Implementation Guidance Based on the Audit

#### Lock in as MVP requirements
- persistent split workspace
- editor-first hierarchy
- chat-side patch narration
- visible in-editor patch highlighting
- bottom transport controls
- one-click revert last AI patch

#### Add explicit requirements for later design/implementation work
- a defined patch-applied state with obvious undo availability
- a concrete history/checkpoint component model
- explicit empty, error, retry, and session continuity states
- responsive rules for narrow desktop/laptop layouts
- semantics for any right-rail tools before implementation

### Final Audit Judgment

The Stitch export is **directionally successful** and should be considered a strong visual concept for BardicanAI’s MVP workspace.

It successfully validates the overall product shape:
- this should be one primary workspace
- the editor should dominate
- chat should narrate
- playback should be persistent
- AI edits should be visible in code

However, the export should **not** be treated as a complete UX specification. It is strongest as a **visual confirmation of layout and tone**, while the UX specification remains the source of truth for product behavior, states, recovery, and implementation guidance.

### Decision

Use the Stitch export as:
- **visual reference for tone, composition, and patch-highlighting treatment**
- **supporting artifact for future UI implementation**

Do not use it as the sole source of truth for:
- state modeling
- recovery behavior
- history/checkpoint interaction
- responsive behavior
- final component semantics

## Future Session and Workflow Reference Rules

This section exists to make future BMAD workflows, agents, and implementation sessions aware of the approved UI reference artifacts for BardicanAI.

### Reference Artifacts

Behavioral source of truth:
- `_bmad-output/planning-artifacts/ux-design-specification.md`

Product requirements source of truth:
- `_bmad-output/planning-artifacts/prd.md`

Approved visual reference artifacts:
- `stitch-downloads/bardicanai-workspace.html`
- `stitch-downloads/bardicanai-workspace.png`

### How Future Work Should Use These Files

All future planning, architecture, story creation, and implementation work should treat the Stitch artifacts as the **approved visual reference** for the main BardicanAI workspace.

The Stitch artifacts should be used to preserve and guide:
- overall workspace composition
- editor-first visual hierarchy
- chat as a visible narration rail
- persistent bottom transport/playback controls
- in-editor patch-highlighting treatment
- dark experimental creative-tool tone

### Conflict Resolution Rule

If there is any conflict between the Stitch export and the written UX behavior, follow this priority order:

1. `ux-design-specification.md` — source of truth for behavior, states, recovery, responsiveness, and component semantics
2. `prd.md` — source of truth for product goals, requirements, and scope
3. Stitch HTML/PNG export — source of truth only for visual reference, composition, and stylistic direction

### Required Guidance for Later BMAD Workflows

Future workflows should explicitly carry forward these rules:
- The product should remain a **single primary workspace**, not a multi-screen SaaS dashboard.
- The **editor is the source of truth** and should remain visually dominant.
- The **chat panel must remain visible** as the intent and patch narration layer.
- **Playback controls should remain persistent** and feel like a music-tool transport bar.
- **AI edits should be visible directly in the editor** using patch-highlighting treatment.
- **One-click revert last AI patch** remains a required recovery affordance even if the Stitch export under-specifies it.

### Guidance for Architecture, Stories, and Implementation

When future agents create architecture, epics/stories, implementation plans, or UI code, they should:
- read this UX specification first
- use the Stitch HTML/PNG as visual reference for the workspace layout and tone
- avoid blindly copying any unsupported controls or decorative concept elements from the Stitch export
- treat right-rail controls, oscilloscope widgets, and non-PRD actions as optional concept inspiration unless explicitly re-specified in later documents

### Intent for Future Sessions

The intent of documenting the Stitch artifacts here is to ensure future sessions do **not** rediscover the visual direction from scratch. They should assume that the Stitch workspace export is the current approved reference for BardicanAI’s main workspace visual direction, while this UX specification remains the governing document for product behavior.

<!-- UX design content will be appended sequentially through collaborative workflow steps -->
