import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import StrudelEditor from "./StrudelEditor";
import { useAppStore } from "@/stores/useAppStore";

// CodeMirror requires real DOM APIs not available in jsdom.
// Mock the wrapper component and test the Zustand wiring logic.
vi.mock("@uiw/react-codemirror", () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="codemirror-mock"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="code editor mock"
    />
  ),
}));

vi.mock("@codemirror/lang-javascript", () => ({
  javascript: () => [],
}));

vi.mock("@strudel/codemirror/themes/strudel-theme.mjs", () => ({
  default: [],
}));

describe("StrudelEditor", () => {
  beforeEach(() => {
    useAppStore.getState().setCode("");
  });

  it("renders without crashing", () => {
    render(<StrudelEditor />);
    expect(screen.getByTestId("codemirror-mock")).toBeInTheDocument();
  });

  it("displays the current code from the Zustand store", () => {
    useAppStore.getState().setCode("s('bd sd')");
    render(<StrudelEditor />);
    expect(screen.getByTestId("codemirror-mock")).toHaveValue("s('bd sd')");
  });

  it("updates store when editor content changes", () => {
    render(<StrudelEditor />);
    const editor = screen.getByTestId("codemirror-mock");
    fireEvent.change(editor, { target: { value: "note('c3 e3 g3')" } });
    expect(useAppStore.getState().editor.code).toBe("note('c3 e3 g3')");
  });

  it("reflects external setCode updates in the editor", () => {
    render(<StrudelEditor />);
    act(() => {
      useAppStore.getState().setCode("s('hh*8')");
    });
    expect(screen.getByTestId("codemirror-mock")).toHaveValue("s('hh*8')");
  });
});
