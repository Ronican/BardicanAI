export default function EditorSurface() {
  return (
    <section
      aria-label="Code editor"
      tabIndex={0}
      className="min-h-0 overflow-y-auto rounded-xl border border-surface-border bg-surface-raised p-6 shadow-lg outline-none"
    >
      <div className="flex min-h-full items-start">
        <p className="text-sm text-text-muted">Strudel code editor will appear here (Story 1.3)</p>
      </div>
    </section>
  );
}
