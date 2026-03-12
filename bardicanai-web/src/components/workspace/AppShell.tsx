import ChatRail from "./ChatRail";
import EditorSurface from "./EditorSurface";
import TransportBar from "./TransportBar";

export default function AppShell() {
  return (
    <main className="h-[100dvh] overflow-hidden bg-surface-base p-4 text-text-primary">
      <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(16rem,auto)_56px] gap-4 [grid-template-areas:'editor''chat''transport'] lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,2.2fr)] lg:grid-rows-[minmax(0,1fr)_56px] lg:[grid-template-areas:'chat_editor''transport_transport']">
        <div className="[grid-area:editor] min-h-0">
          <EditorSurface />
        </div>
        <div className="[grid-area:chat] min-h-0">
          <ChatRail />
        </div>
        <div className="[grid-area:transport]">
          <TransportBar />
        </div>
      </div>
    </main>
  );
}
