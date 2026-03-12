import type { StateCreator } from "zustand";

export interface EditorSlice {
  editor: { code: string };
  setCode: (code: string) => void;
}

export const createEditorSlice: StateCreator<EditorSlice, [], [], EditorSlice> = (set) => ({
  editor: { code: "" },
  setCode: (code) => set({ editor: { code } }),
});
