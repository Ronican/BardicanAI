"use client";

import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
// @ts-expect-error -- @strudel/codemirror has no type declarations; themes/strudel-theme.mjs
// is safe to import (no @strudel/draw canvas deps — only @codemirror/view + @lezer/highlight)
import strudelTheme from "@strudel/codemirror/themes/strudel-theme.mjs";
import { useAppStore } from "@/stores/useAppStore";

export default function StrudelEditor() {
  const code = useAppStore((s) => s.editor.code);

  const handleChange = useCallback((value: string) => {
    const store = useAppStore.getState();
    if (value !== store.editor.code) {
      store.setCode(value);
    }
  }, []);

  return (
    <CodeMirror
      value={code}
      onChange={handleChange}
      extensions={[javascript()]}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      theme={strudelTheme}
      basicSetup={{ lineNumbers: true, bracketMatching: true, foldGutter: false }}
      height="100%"
      className="h-full"
      style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
    />
  );
}
