---
stepsCompleted:
  - "step-01-init"
  - "step-02-discovery"
  - "step-02b-vision"
  - "step-02c-executive-summary"
  - "step-03-success"
  - "step-04-journeys"
  - "step-05-domain"
  - "step-06-innovation"
  - "step-07-project-type"
  - "step-08-scoping"
  - "step-09-functional"
  - "step-10-nonfunctional"
  - "step-11-polish"
  - "step-12-complete"
  - "step-e-01-discovery"
  - "step-e-02-review"
  - "step-e-03-edit"
inputDocuments:
  - "_bmad-output/brainstorming/brainstorming-session-2026-03-05-100420.md"
workflowType: 'prd'
workflow: 'edit'
date: '2026-03-06'
lastEdited: '2026-03-07'
editHistory:
  - date: '2026-03-07'
    changes: 'Tightened success criteria measurability and revised FR16, FR24, and NFR17 based on validation findings.'
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 1
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: general
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - BardicanAI

**Author:** Ronican
**Date:** 2026-03-05

## Executive Summary

BardicanAI is a web-based creative music tool that enables users to generate and iteratively refine Strudel music code through natural language conversation. It is designed for users who want to create music quickly, including users who cannot specify exact outputs upfront but can describe intent, mood, style, and desired changes conversationally. The product addresses the friction between musical ideation and technical coding by translating evolving user intent into executable Strudel code in real time.

The product vision is to make AI-assisted music creation feel fluid, exploratory, and low-friction while preserving practical output quality. Users should be able to describe what they want, receive immediate code results, iterate through conversational edits, and rapidly prototype sounds they can move into downstream DAW workflows. Success depends on combining strong intent interpretation with domain-grounded musical and Strudel-specific generation quality, so outputs are not only fast but also musically useful.

### What Makes This Special

The core differentiator is real-time generation and editing of actual Strudel code from conversation, targeted at a Strudel-centric workflow rather than generic AI music generation. While other AI music tools exist, BardicanAI is uniquely positioned for users who want direct control through code while still using natural language as the primary interface. This enables a co-creative loop: users describe intent, the system applies concrete code transformations, and users continue iterating without breaking flow.

The underlying insight is that high-quality AI music assistance requires two capabilities together: accurate interpretation of ambiguous creative intent and strong music-theory plus Strudel competency during generation and edits. By pairing these, BardicanAI can support fast experimentation without collapsing into random or low-utility output, making it practical for rapid prototyping and creative exploration.

## Project Classification

- **Project Type:** Web App
- **Domain:** General (Creative/Music Tooling)
- **Complexity:** Medium
- **Project Context:** Greenfield

## Success Criteria

### User Success

- A user can generate a **first usable loop in under 2 minutes** from a natural-language prompt.
- In a **10-session acceptance test** using intentionally ambiguous prompts, users can reach a revised loop they rate as closer to intended mood, style, or energy within **3 conversational refinement turns in at least 8 sessions**.
- The creator can complete **at least 3 real music-making sessions per week for 4 consecutive weeks** using the tool without blocking issues that force abandonment of the workflow.

### Business Success

- **Project Validation Success:** The creator actively uses the app for real creative workflow on an ongoing basis.
- **Release Success:** The project is publicly published on GitHub with clear setup instructions, runnable demo path, and documentation sufficient for others to try it.

### Technical Success

- **Patch Accuracy:** At least **90%** of patch operations produce the intended musical/code change without requiring manual correction.
- **Generation Latency:** End-to-end generation response time remains under **3 seconds** for standard requests.
- The system maintains stable real-time conversational generation/edit flow for Strudel code in typical usage.

### Measurable Outcomes

- First usable loop creation time: **≤ 2 minutes**
- Patch accuracy: **≥ 90%**
- Generation latency: **< 3s**
- Public GitHub release delivered with working setup and docs
- Demonstrated recurring real-world use by the creator

## Product Scope

### MVP - Minimum Viable Product

- Natural-language chat interface for music intent input
- Real-time Strudel code generation from prompts
- Iterative patch-based editing flow
- Strong intent understanding with music-theory/Strudel-aware generation quality
- Fast generation loop with latency target under 3 seconds
- Patch behavior quality targeting 90% intended-change accuracy
- Export/prototyping flow compatible with downstream DAW usage

### Growth Features (Post-MVP)

- Upload any sound/sample/reference and generate a close recreation in the app
- Oscilloscope-style visualization dashboard that reflects generated music in real time

### Vision (Future)

- Community layer where users share creations and explore others’ work
- Minimal TouchDesigner integration to generate visuals from produced sound

## User Journeys

### Journey 1 — Primary User (Success Path): From idea to playable loop

**Opening Scene:** Ronican opens the app and sees a single screen with two panes: chat on the left and Strudel editor on the right. He has a musical idea but not exact code.

**Rising Action:** He describes what he wants in chat. The AI interprets intent, writes Strudel code directly into the editor, and explains what it generated in chat. He presses **Play** and listens. He continues refining by sending follow-up prompts; the AI applies patch-style updates in the editor.

**Climax:** After a few conversational iterations, the generated code matches the intended groove/style and becomes immediately usable.

**Resolution:** Ronican leaves with a playable, iterated loop he is satisfied with and can continue prototyping for DAW workflow.

### Journey 2 — Primary User (Edge Case): Wrong output, fast recovery

**Opening Scene:** The user requests a change, but the AI output misses intent (wrong style, structure, or energy).

**Rising Action:** The user explains what was wrong and what should not happen again. The AI regenerates with corrective context and applies an updated patch.

**Climax:** The regenerated output avoids the previous mistake and aligns more closely with intent.

**Resolution:** The user recovers quickly without breaking flow, continues iteration, and reaches a usable result.

### Journey 3 — Admin/Operations User (Maintainer Mode): Keep quality high over time

**Opening Scene:** Ronican switches from creator mode to maintainer mode to improve reliability and releases.

**Rising Action:** He tunes prompts, triages bugs, adjusts configuration, and prepares release updates.

**Climax:** Improvements reduce recurring generation and patch issues and stabilize core behavior.

**Resolution:** The product evolves with better quality, clearer versioning, and smoother user experience.

### Journey 4 — Support/Troubleshooting User: Issue to fix loop

**Opening Scene:** A user encounters a problem and opens a GitHub issue.

**Rising Action:** Ronican reviews the report, reproduces the issue, inspects behavior, and implements a fix.

**Climax:** The fix resolves the issue and is shipped.

**Resolution:** Users regain confidence, and troubleshooting knowledge accumulates through issue history.

### Journey Requirements Summary

These journeys imply requirements for:

- Split-pane UI (chat and live Strudel editor)
- AI intent interpretation with code generation and explanation in chat
- Patch-application pipeline that updates editor code reliably
- Fast play-test loop (generate → play → refine)
- Error recovery flow for wrong generations (explicit corrective feedback and regenerate)
- Maintainer workflow for prompt tuning, configuration updates, and release management
- GitHub issue-based support process and reproducible debugging workflow
- No API/integration journey in MVP (can be revisited later)

## Domain-Specific Requirements

### Compliance & Regulatory
- No formal regulated-domain compliance requirements are in scope for MVP.
- Copyright/licensing risk must be managed by user guidance: generated outputs are assistive compositions and users remain responsible for downstream usage rights.

### Technical Constraints
- Generation and patch application must preserve fast creative flow, with response latency aligned to the <3s success target.
- Browser audio playback and Strudel execution should remain stable across iterative edits without requiring page refresh resets.
- Patch operations must be deterministic enough to meet the 90% intended-change accuracy target.

### Integration Requirements
- MVP should support practical downstream DAW prototyping/export workflow.
- Future integrations (e.g., TouchDesigner visuals) are non-blocking for MVP and should be designed as optional extensions.

### Risk Mitigations
- **Risk:** Repeated wrong-style generations.
  - **Mitigation:** Use corrective user feedback loops that explicitly state what was wrong and regenerate with constraints.
- **Risk:** Style drift across iterative edits.
  - **Mitigation:** Preserve key musical intent markers and apply scoped patching instead of full rewrites when possible.
- **Risk:** User confusion about what changed.
  - **Mitigation:** Keep chat-side explanations tied to each code patch so changes are transparent and learnable.

## Innovation & Novel Patterns

### Detected Innovation Areas

- **Conversational code-native music creation:** Natural-language prompts generate and iteratively modify real Strudel code, not just opaque audio output.
- **Patch-centered co-creation loop:** Users guide change through corrective intent; the system applies targeted edits instead of forcing full regeneration each time.
- **Unified creation surface:** Split-pane chat + code editor design keeps explanation, control, and execution in one continuous flow.
- **Planned multimodal evolution:** Roadmap includes reference-sound recreation and minimal audio-to-visual generation integration.

### Market Context & Competitive Landscape

- Existing AI music tools often optimize for fast audio generation but provide limited transparent code-level control.
- Existing Strudel workflows are powerful but require manual coding fluency and longer iteration cycles for non-experts.
- BardicanAI positions between these categories: preserving code transparency and editability while lowering interaction friction through conversational intent.

### Validation Approach

- Validate with creator workflow outcomes: first usable loop in ≤2 minutes, patch accuracy ≥90%, generation latency <3s.
- Track correction-loop effectiveness: percentage of wrong-first-result cases that resolve within one subsequent corrective prompt.
- Run comparative sessions against baseline manual Strudel workflow to confirm faster iteration and equivalent or better usability of output code.

### Risk Mitigation

- **Risk:** Innovation depends on high intent fidelity; failures feel random.
  - **Mitigation:** Structured corrective prompting, constrained patch scopes, and clear explanation of applied changes.
- **Risk:** Novel interaction model may confuse users about what changed.
  - **Mitigation:** Explicit change narration tied to each patch and visible before/after code context.
- **Risk:** Ambitious future innovation features can derail MVP focus.
  - **Mitigation:** Lock MVP to chat↔Strudel core loop and defer multimodal/community features to post-MVP phases.

## Web App Specific Requirements

### Project-Type Overview

BardicanAI will be delivered as a **Single-Page Application (SPA)** optimized for modern browser environments. The application prioritizes rapid conversational iteration, live code updates, and immediate audio feedback over content discoverability or SEO concerns.

### Technical Architecture Considerations

- **Application Model:** SPA architecture with a persistent split-pane workspace (chat + Strudel editor).
- **Runtime Interaction Pattern:** Real-time conversational loop where prompts produce immediate editor updates and play-test cycles.
- **State Management:** Session-level state must preserve conversational context, generated code, and patch history for iterative refinement.
- **Performance Orientation:** Frontend and backend interactions should support low-latency response targets aligned with <3s generation expectations.

### Browser Matrix

- Support **modern browsers** as MVP baseline.
- Primary testing focus should include current stable versions of:
  - Chrome
  - Firefox
  - Safari
  - Edge
- No legacy-browser compatibility guarantees in MVP.

### Responsive Design

- Core layout must preserve usability of split-pane interaction on standard desktop/laptop viewports.
- For smaller screens, layout can degrade gracefully (stacked panes or prioritized editor/chat focus) without full mobile-first optimization in MVP.
- Priority is creative workflow continuity over broad device-class optimization.

### Performance Targets

- Maintain interactive feel for core loop:
  - Prompt submit → response/patch visible with minimal perceived delay
  - Playback trigger responsiveness suitable for iterative music experimentation
- Align frontend behavior with product-level targets:
  - Generation latency under 3 seconds (typical)
  - Smooth repeated patch/play cycles without requiring page resets

### SEO Strategy

- **No SEO strategy required for MVP.**
- Product is interaction-first (authenticated/tooling-like usage), not discoverability-first content publishing.

### Accessibility Level

- **Basic accessibility baseline** for MVP:
  - Keyboard-operable core controls (chat input, send, play, editor focus)
  - Readable contrast and clear focus indicators
  - Minimal semantic labeling for essential interactive elements
- Advanced conformance targets can be elevated post-MVP if user/community needs expand.

### Implementation Considerations

- Prioritize robust editor-playback-chat loop stability over broad platform expansion in MVP.
- Keep architecture modular so future roadmap items (community features, visuals, external integrations) can be added without reworking core SPA foundations.
- Exclude non-essential web concerns (SEO, legacy browser support) from MVP to protect delivery focus and quality.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP focused on proving a useful creative loop quickly: conversational intent → Strudel code generation/patching → immediate play-test iteration.

**Resource Requirements:** Solo developer execution with iterative release cycles, prioritizing core reliability over breadth. Scope assumes no strict external deadline and continuous refinement based on real usage.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Primary user success path (idea to playable loop through chat and editor iteration)
- Primary user edge-case recovery (wrong output correction via explicit feedback and regeneration)

**Must-Have Capabilities:**
- Single-screen split-pane interface (chat and Strudel editor)
- Natural-language-to-Strudel generation
- Patch-based iterative updates to existing code
- Immediate play-test workflow and fast iteration loop
- Corrective regeneration flow that incorporates user error feedback
- Basic change explanation/logging for transparency and learning
- Performance and quality alignment with defined targets (latency and patch accuracy)

### Post-MVP Features

**Phase 2 (Post-MVP):**
- Upload/reference sound input and generate close recreations
- Oscilloscope-style music visualization dashboard for generated output

**Phase 3 (Expansion):**
- Community feature layer for sharing and exploring creations
- Minimal TouchDesigner integration for audio-reactive visual generation

### Risk Mitigation Strategy

**Technical Risks:**
- Hard trade-off between maintaining high patch accuracy and low latency under repeated iterations.
- Mitigation: constrain patch scope, prioritize deterministic transforms, and continuously test against quality and latency thresholds.

**Market Risks:**
- Product may be too niche if limited to Strudel-centric creators.
- Mitigation: validate engagement via real creator usage first, then evaluate onboarding improvements to broaden accessibility without diluting code-native value.

**Resource Risks:**
- Solo development can lead to scope drift and unfinished advanced features.
- Mitigation: enforce phase gates, keep MVP strictly to core loop, and defer non-essential roadmap items until MVP metrics are consistently met.

## Functional Requirements

### Conversational Composition Workspace

- FR1: Creator can interact with the system through a chat interface to describe musical intent in natural language.
- FR2: Creator can view and edit generated Strudel code in a dedicated code workspace.
- FR3: Creator can use a split-pane layout that keeps conversational context and code context visible in the same session.
- FR4: Creator can iteratively submit follow-up prompts that build on prior conversational context.
- FR5: Creator can receive plain-language explanations of generated or modified musical output in chat.

### Music Generation & Patch-Based Editing

- FR6: Creator can request initial Strudel code generation from a natural-language prompt.
- FR7: Creator can request targeted changes to existing musical output without recreating the session from scratch.
- FR8: System can apply patch-style modifications to existing Strudel code based on user instructions.
- FR9: Creator can provide corrective feedback about incorrect results and request adjusted regeneration.
- FR10: System can incorporate corrective feedback to reduce repetition of prior generation mistakes within the active workflow.
- FR11: Creator can iterate repeatedly between prompting and patched updates until desired output is reached.
- FR12: System can preserve core musical intent markers during iterative modification workflows.
- FR13: Creator can request style, structure, density, and mood-oriented refinements through conversational commands.

### Playback & Prototyping Workflow

- FR14: Creator can play generated Strudel output directly from the workspace.
- FR15: Creator can continue editing after playback and re-run output in successive iteration cycles.
- FR16: Creator can use the product to produce a playable Strudel loop that can be auditioned in-app and retained for continued prototyping within the same session.
- FR17: Creator can export or transfer resulting output into downstream DAW-oriented workflow.
- FR18: System can support a continuous generate→play→refine loop in a single session context.

### Transparency, Recovery & Session Reliability

- FR19: Creator can see what changed after each AI-driven modification cycle.
- FR20: System can provide change narration aligned to generated patches.
- FR21: Creator can recover from unsatisfactory generations by issuing corrective prompts rather than restarting from zero.
- FR22: System can maintain session continuity across multiple iterative turns in the same composition flow.
- FR23: Creator can continue manually refining outcomes after AI-assisted changes are applied.
- FR24: During a single active session, repeated iterative edit requests with retained conversation context shall preserve chat history, current code state, and patch applicability across at least 10 consecutive edit turns without requiring a session reset.

### Maintainer Operations & Quality Evolution

- FR25: Maintainer can tune generation behavior through prompt/configuration adjustments.
- FR26: Maintainer can triage and track reported issues as part of product improvement workflow.
- FR27: Maintainer can manage release iterations that deliver improvements to generation and patch behavior.
- FR28: Maintainer can investigate problematic generation/editing outcomes from user reports.
- FR29: Maintainer can apply fixes based on issue findings and incorporate them into subsequent releases.
- FR30: Maintainer can evolve capability quality without breaking core creator workflow continuity.

### Public Release, Support & Future Expansion

- FR31: User can access project setup and usage documentation from public repository distribution.
- FR32: User can report defects and usability issues through a public issue workflow.
- FR33: Maintainer can process issue reports into actionable remediation updates.
- FR34: Product can support post-MVP reference-sound upload and recreation workflows.
- FR35: Product can support post-MVP oscilloscope-style visualization of generated output.
- FR36: Product can support future community sharing of created outputs.
- FR37: Product can support future lightweight audio-reactive visual integration workflows.
- FR38: Product can preserve core conversational code-generation workflow as future capabilities are added.

## Non-Functional Requirements

### Performance

- NFR1: For standard generation and edit requests, end-to-end response time shall be **< 3.0 seconds at the 95th percentile** under normal load of **1 active session issuing 1 request at a time**, measured from prompt submission to completed response using application timing telemetry.
- NFR2: For active composition sessions, the complete generate→patch→play loop shall complete in **≤ 5.0 seconds at the 95th percentile** under normal load, measured from prompt submission to playback-ready editor state using client-side session instrumentation.
- NFR3: After an AI change is accepted, the updated Strudel code shall render in the editor in **≤ 500 ms at the 95th percentile**, measured from acceptance event to visible editor update using browser performance instrumentation.

### Reliability

- NFR4: During a **30-minute composition session** containing at least **20 iterative edits**, **≥ 95%** of sessions shall preserve chat history, current code state, and patch continuity without unrecoverable session loss, measured by scenario-based integration tests and session error telemetry.
- NFR5: During the same **30-minute / 20-edit** test profile, **≥ 95%** of playback and iterative editing cycles shall complete without requiring a page refresh or manual session reset, measured by end-to-end test runs and runtime error logs.
- NFR6: For failed generation or patch attempts, users shall be able to continue the same session with a corrective prompt in **≥ 90%** of cases without reloading the page, measured by failure-recovery scenario tests and production failure telemetry.

### Security

- NFR7: All client-server communication that carries prompts, generated code, or session data shall be transmitted over **HTTPS using TLS 1.2 or higher**, verified by deployment configuration checks and external transport inspection in staging and production.
- NFR8: **100%** of write operations that modify a composition session shall enforce authorization checks against the owning workspace context, verified by automated access-control tests covering authorized and unauthorized session mutation attempts.
- NFR9: Public issue templates, logs, and report workflows shall expose **0 plaintext secrets, API keys, or internal credentials** in release builds and issue templates, verified by secret-scanning on release artifacts and manual review of public support surfaces before release.

### Accessibility

- NFR10: The core actions required for MVP use—chat input, submit, play, and editor focus—shall be fully operable by keyboard alone with **0 keyboard traps** in current stable Chrome, Firefox, Safari, and Edge, verified by manual keyboard test scripts before release.
- NFR11: Core interactive elements and essential text shall meet **WCAG 2.1 AA contrast requirements** and expose a visible focus indicator with at least **3:1 contrast** against adjacent colors, verified by automated accessibility checks and manual visual review.
- NFR12: Essential interactive controls shall expose programmatic labels sufficient for screen-reader identification in **100%** of MVP-critical controls, verified by accessibility audit tooling and manual screen-reader spot checks.

### Integration

- NFR13: DAW-oriented export or handoff shall produce output that can be opened or copied into the intended downstream workflow with **≥ 90% task success** in a **10-run acceptance test** using representative prototype outputs, measured by manual acceptance testing.
- NFR14: When optional integrations are disabled or unavailable, the core chat→editor generation workflow shall continue to meet NFR1 in **≥ 95%** of standard requests, verified by integration-disabled regression tests.
- NFR15: Failures in optional external integrations shall not terminate the active composition session or corrupt current editor state in **100%** of tested failure scenarios, verified by fault-injection tests covering timeout, unavailable-service, and malformed-response cases.

### Scalability (MVP Baseline)

- NFR16: The MVP shall support **at least 5 concurrent active sessions** performing standard generation/edit requests while maintaining NFR1 compliance, verified by repeatable load tests in a staging environment.
- NFR17: After at least one deployment iteration, the system shall continue to satisfy NFR16 without changes to user-visible functional behavior when session-state handling, generation services, or playback-facing concerns are modified independently, verified by regression testing and successful execution of the NFR16 load profile.

## Appendix A — Traceability Summary

| Source | User Journeys | Requirements |
|---|---|---|
| Conversational Strudel co-creation | J1, J2 | FR1–FR24, NFR1–NFR6 |
| Sustained creator value and maintainability | J3 | FR25–FR30, NFR4–NFR9, NFR16–NFR17 |
| Public delivery and supportability | J4 | FR31–FR33, NFR7–NFR9 |
| DAW-compatible prototyping workflow | J1 | FR14–FR18, NFR13 |
| Future optional integrations and expansion | J3 context | FR34–FR38, NFR14–NFR15 |

