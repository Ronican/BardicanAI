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
  setCode: (code: string) => void;
};

export const createPatchSlice: StateCreator<
  PatchSliceDependencies,
  [],
  [],
  PatchSlice
> = (set, get) => ({
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
  revertToPatch: (index) => {
    const stack = get().patch.stack;

    if (index < 0 || index >= stack.length) {
      return;
    }

    get().setCode(stack[index].code);
    set({
      patch: {
        stack: stack.slice(0, index + 1),
      },
    });
  },
});
