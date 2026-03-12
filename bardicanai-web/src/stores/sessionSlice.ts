import type { StateCreator } from "zustand";

export interface SessionSlice {
  session: {
    sessionId: string | null;
    createdAt: string | null;
    name: string | null;
  };
  setSession: (session: SessionSlice["session"]) => void;
}

export const createSessionSlice: StateCreator<SessionSlice, [], [], SessionSlice> = (set) => ({
  session: {
    sessionId: null,
    createdAt: null,
    name: null,
  },
  setSession: (session) => set({ session }),
});
