"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Artifact } from "@/lib/artifact";

type OpenOptions = {
  /** 打开后落在哪个视图(默认预览)。 */
  view?: "preview" | "code";
  /** 打开后直接进入代码视图并展开 diff(聊天卡片「查看改动」用)。 */
  showDiff?: boolean;
  /** 定位到哪个版本(默认最新版);diff 即该版本 vs 上一版。 */
  versionIndex?: number;
  /** 以流式生成的方式播放该版本(demo:逐字揭示)。 */
  stream?: boolean;
};

type OpenRequest = {
  /** 每次 open() 递增,让工作区能响应"同一 artifact 再次打开"。 */
  id: number;
  view: "preview" | "code";
  showDiff: boolean;
  versionIndex: number;
  stream: boolean;
};

type ArtifactContextValue = {
  artifact: Artifact | null;
  isOpen: boolean;
  openRequest: OpenRequest;
  open: (artifact: Artifact, options?: OpenOptions) => void;
  close: () => void;
};

const ArtifactContext = createContext<ArtifactContextValue | null>(null);

export function ArtifactProvider({ children }: { children: ReactNode }) {
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openRequest, setOpenRequest] = useState<OpenRequest>({
    id: 0,
    view: "preview",
    showDiff: false,
    versionIndex: 0,
    stream: false,
  });

  const open = useCallback((next: Artifact, options?: OpenOptions) => {
    setArtifact(next);
    setIsOpen(true);
    setOpenRequest((request) => ({
      id: request.id + 1,
      // 流式时默认落在代码视图,看着代码被写出来。
      view: options?.stream
        ? (options?.view ?? "code")
        : options?.showDiff
          ? "code"
          : (options?.view ?? "preview"),
      showDiff: options?.showDiff ?? false,
      versionIndex: options?.versionIndex ?? next.versions.length - 1,
      stream: options?.stream ?? false,
    }));
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ artifact, isOpen, openRequest, open, close }),
    [artifact, isOpen, openRequest, open, close],
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
