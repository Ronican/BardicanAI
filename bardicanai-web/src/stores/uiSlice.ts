import type { StateCreator } from "zustand";
import type { ActivePanelFocus, PatchHighlightRange } from "@/types/store";

export interface UiSlice {
  ui: {
    isGenerating: boolean;
    activePanelFocus: ActivePanelFocus | null;
    patchHighlightRange: PatchHighlightRange | null;
  };
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = () => ({
  ui: {
    isGenerating: false,
    activePanelFocus: null,
    patchHighlightRange: null,
  },
});
