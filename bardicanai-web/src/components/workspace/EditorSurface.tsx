"use client";

import StrudelEditor from "@/components/editor/StrudelEditor";

export default function EditorSurface() {
  return (
    <section
      aria-label="Code editor"
      tabIndex={-1}
      className="min-h-0 overflow-hidden rounded-xl border border-surface-border bg-surface-raised shadow-lg outline-none flex flex-col"
    >
      <StrudelEditor />
    </section>
  );
}
