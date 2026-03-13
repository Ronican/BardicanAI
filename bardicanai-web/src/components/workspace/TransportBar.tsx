const transportButtonClassName =
  "cursor-not-allowed rounded-md border border-surface-border bg-surface-raised px-4 py-2 text-sm font-medium text-text-muted opacity-60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base";

export default function TransportBar() {
  return (
    <footer
      role="contentinfo"
      aria-label="Playback controls"
      className="flex h-14 items-center gap-3 rounded-xl border border-surface-border bg-surface-base px-4"
    >
      <button type="button" aria-label="Play" aria-disabled="true" className={transportButtonClassName}>
        Play
      </button>
      <button type="button" aria-label="Stop" aria-disabled="true" className={transportButtonClassName}>
        Stop
      </button>
      <button type="button" aria-label="Restart" aria-disabled="true" className={transportButtonClassName}>
        Restart
      </button>
    </footer>
  );
}
