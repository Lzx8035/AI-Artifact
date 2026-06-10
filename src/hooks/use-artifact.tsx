"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { WebArtifact } from "@/lib/artifact";

type ArtifactContextValue = {
  artifact: WebArtifact | null;
  isOpen: boolean;
  open: (artifact: WebArtifact) => void;
  close: () => void;
};

const ArtifactContext = createContext<ArtifactContextValue | null>(null);

export function ArtifactProvider({ children }: { children: ReactNode }) {
  const [artifact, setArtifact] = useState<WebArtifact | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next: WebArtifact) => {
    setArtifact(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ artifact, isOpen, open, close }),
    [artifact, isOpen, open, close],
  );

  return (
    <ArtifactContext.Provider value={value}>
      {children}
    </ArtifactContext.Provider>
  );
}

export function useArtifact() {
  const context = useContext(ArtifactContext);

  if (!context) {
    throw new Error("useArtifact must be used within an ArtifactProvider");
  }

  return context;
}
