const transportButtonClassName =
  "rounded-md border border-surface-border bg-surface-raised px-4 py-2 text-sm font-medium text-text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:cursor-not-allowed disabled:opacity-60";

export default function TransportBar() {
  return (
    <footer
      role="contentinfo"
      aria-label="Playback controls"
      className="flex h-14 items-center gap-3 rounded-xl border border-surface-border bg-surface-base px-4"
    >
      <button type="button" aria-label="Play" disabled className={transportButtonClassName}>
        Play
      </button>
      <button type="button" aria-label="Stop" disabled className={transportButtonClassName}>
        Stop
      </button>
      <button type="button" aria-label="Restart" disabled className={transportButtonClassName}>
        Restart
      </button>
    </footer>
  );
}
