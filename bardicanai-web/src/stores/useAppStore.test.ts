import { beforeEach, describe, expect, it } from "vitest";
import { MAX_PATCH_HISTORY } from "@/lib/constants";
import { useAppStore } from "./useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState({
      session: { sessionId: null, createdAt: null, name: null },
      chat: { messages: [] },
      editor: { code: "" },
      patch: { stack: [] },
      playback: { isPlaying: false, tempo: null },
      ui: { isGenerating: false, activePanelFocus: null, patchHighlightRange: null },
    });
  });

  it("exports the patch history constant", () => {
    expect(MAX_PATCH_HISTORY).toBe(50);
  });

  it("setCode updates editor.code", () => {
    useAppStore.getState().setCode("bd");
    expect(useAppStore.getState().editor.code).toBe("bd");
  });

  it("does not expose code on other slices", () => {
    const state = useAppStore.getState();
    expect("code" in state.chat).toBe(false);
    expect("code" in state.playback).toBe(false);
    expect("code" in state.ui).toBe(false);
  });

  it("pushPatch trims history to the max limit", () => {
    for (let index = 0; index < MAX_PATCH_HISTORY + 1; index += 1) {
      useAppStore.getState().pushPatch(`code-${index}`);
    }

    expect(useAppStore.getState().patch.stack).toHaveLength(MAX_PATCH_HISTORY);
    expect(useAppStore.getState().patch.stack.at(0)?.code).toBe("code-1");
  });

  it("revertToPatch restores editor.code and trims newer patches", () => {
    useAppStore.getState().pushPatch("alpha");
    useAppStore.getState().pushPatch("beta");
    useAppStore.getState().pushPatch("gamma");

    useAppStore.getState().revertToPatch(1);

    expect(useAppStore.getState().editor.code).toBe("beta");
    expect(useAppStore.getState().patch.stack.map((entry) => entry.code)).toEqual(["alpha", "beta"]);
  });
});
