import type { StateCreator } from "zustand";

export interface PlaybackSlice {
  playback: { isPlaying: boolean; tempo: number | null };
}

export const createPlaybackSlice: StateCreator<PlaybackSlice, [], [], PlaybackSlice> = () => ({
  playback: { isPlaying: false, tempo: null },
});
