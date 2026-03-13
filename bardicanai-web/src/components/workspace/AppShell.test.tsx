import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AppShell from "./AppShell";

// CodeMirror requires real DOM APIs not available in jsdom.
vi.mock("@uiw/react-codemirror", () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="codemirror-mock">{value}</div>
  ),
}));

vi.mock("@codemirror/lang-javascript", () => ({
  javascript: () => [],
}));

vi.mock("@strudel/codemirror/themes/strudel-theme.mjs", () => ({
  default: [],
}));

describe("AppShell", () => {
  it("renders chat, editor, and playback regions", () => {
    render(<AppShell />);

    expect(screen.getByLabelText("Chat")).toBeInTheDocument();
    expect(screen.getByLabelText("Code editor")).toBeInTheDocument();
    expect(screen.getByLabelText("Playback controls")).toBeInTheDocument();
  });
});
