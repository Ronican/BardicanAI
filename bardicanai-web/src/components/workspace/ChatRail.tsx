export default function ChatRail() {
  return (
    <aside
      aria-label="Chat"
      className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-surface-border bg-surface-raised shadow-lg"
    >
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-text-muted">Chat will appear here</p>
      </div>
      <div className="border-t border-surface-border p-4">
        <input
          type="text"
          aria-label="Message input"
          placeholder="Type a message..."
          className="w-full rounded-md border border-surface-border bg-surface-base px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-accent-magenta focus-visible:outline-none"
        />
      </div>
    </aside>
  );
}
