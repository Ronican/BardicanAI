import { create } from "zustand";
import { createChatSlice, type ChatSlice } from "./chatSlice";
import { createEditorSlice, type EditorSlice } from "./editorSlice";
import { createPatchSlice, type PatchSlice } from "./patchSlice";
import { createPlaybackSlice, type PlaybackSlice } from "./playbackSlice";
import { createSessionSlice, type SessionSlice } from "./sessionSlice";
import { createUiSlice, type UiSlice } from "./uiSlice";

export type AppStore =
  & SessionSlice
  & ChatSlice
  & EditorSlice
  & PatchSlice
  & PlaybackSlice
  & UiSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createSessionSlice(...args),
  ...createChatSlice(...args),
  ...createEditorSlice(...args),
  ...createPatchSlice(...args),
  ...createPlaybackSlice(...args),
  ...createUiSlice(...args),
}));
