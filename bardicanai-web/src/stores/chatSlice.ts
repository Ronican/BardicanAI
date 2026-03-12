import type { StateCreator } from "zustand";
import type { ChatMessage } from "@/types/store";

export interface ChatSlice {
  chat: { messages: ChatMessage[] };
  appendChatMessage: (message: ChatMessage) => void;
}

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (set) => ({
  chat: { messages: [] },
  appendChatMessage: (message) =>
    set((state) => ({
      chat: {
        messages: [...state.chat.messages, message],
      },
    })),
});
