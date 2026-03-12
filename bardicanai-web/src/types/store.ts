export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export interface PatchEntry {
  code: string;
  createdAt: string;
}

export type ActivePanelFocus = "chat" | "editor" | "transport";

export interface PatchHighlightRange {
  from: number;
  to: number;
}
