import type { StateCreator } from "zustand";
import { MAX_PATCH_HISTORY } from "@/lib/constants";
import type { PatchEntry } from "@/types/store";

interface PatchSliceState {
  patch: { stack: PatchEntry[] };
}

interface PatchSliceActions {
  pushPatch: (code: string) => void;
  revertToPatch: (index: number) => void;
}

export interface PatchSlice extends PatchSliceState, PatchSliceActions {}

type PatchSliceDependencies = PatchSlice & {
  editor: { code: string };
};

export const createPatchSlice: StateCreator<
  PatchSliceDependencies,
  [],
  [],
  PatchSlice
> = (set) => ({
  patch: { stack: [] },
  pushPatch: (code) =>
    set((state) => {
      const nextStack = [
        ...state.patch.stack,
        { code, createdAt: new Date().toISOString() },
      ];

      return {
        patch: {
          stack: nextStack.slice(-MAX_PATCH_HISTORY),
        },
      };
    }),
  revertToPatch: (index) =>
    set((state) => {
      if (index < 0 || index >= state.patch.stack.length) {
        return state;
      }

      const selectedPatch = state.patch.stack[index];

      return {
        editor: { code: selectedPatch.code },
        patch: {
          stack: state.patch.stack.slice(0, index + 1),
        },
      };
    }),
});
