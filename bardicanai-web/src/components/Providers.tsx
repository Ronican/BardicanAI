"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/stores/useAppStore";

declare global {
  interface Window {
    useAppStore?: typeof useAppStore;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    window.useAppStore = useAppStore;

    return () => {
      delete window.useAppStore;
    };
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
