"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Globe, Loader2, RefreshCw } from "lucide-react";
import { toast } from "@heroui/react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useActiveCode,
  useSandpack,
  useSandpackNavigation,
} from "@codesandbox/sandpack-react";

import type { ReactArtifact } from "@/lib/artifact";
import { IconButton } from "@/components/artifact-icon-button";

type View = "preview" | "code";

/** 打包器是否已完成过至少一次编译(收到过 "done" 消息)。 */
function useBundlerReady() {
  const { listen } = useSandpack();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "done") {
        setReady(true);
      }
    });
    return unsubscribe;
  }, [listen]);

  return ready;
}

/**
 * Sandpack 的重编译只发给已就绪的客户端,首次打包期间的编辑会被
 * 静默丢弃。这里在切回预览视图时把当前文件重新推一次,保证预览
 * 总是渲染最新代码。首次打包完成前不做任何干预(避免影响初始加载)。
 */
function SyncPreviewOnView({ view }: { view: View }) {
  const { sandpack } = useSandpack();
  const ready = useBundlerReady();
  const prevViewRef = useRef(view);

  useEffect(() => {
    if (ready && prevViewRef.current !== view && view === "preview") {
      const file = sandpack.files[sandpack.activeFile];
      if (file) {
        sandpack.updateFile(sandpack.activeFile, file.code);
      }
    }
    prevViewRef.current = view;
  }, [view, sandpack, ready]);

  return null;
}

/** 首次打包完成前盖在预览上方的加载态。 */
function PreviewLoadingOverlay() {
  const ready = useBundlerReady();
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (ready) {
      return;
    }
    const timer = window.setTimeout(() => setSlow(true), 12_000);
    return () => window.clearTimeout(timer);
  }, [ready]);

  if (ready) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
      <Loader2 aria-hidden="true" className="size-5 animate-spin text-zinc-400" />
      <p className="text-xs text-zinc-500">
        正在打包 React 应用（首次需安装 npm 依赖）...
      </p>
      {slow ? (
        <p className="text-[11px] text-zinc-400">
          加载较慢，可能是网络问题，可稍后点击右上角刷新重试
        </p>
      ) : null}
    </div>
  );
}

function RefreshButton() {
  const { sandpack } = useSandpack();
  const ready = useBundlerReady();
  const { refresh } = useSandpackNavigation();

  function handleRefresh() {
    // 就绪后刷新前先把当前文件状态推给打包器,确保渲染最新代码;
    // 首次打包尚未完成时只做普通刷新,不干预加载过程。
    if (ready) {
      const file = sandpack.files[sandpack.activeFile];
      if (file) {
        sandpack.updateFile(sandpack.activeFile, file.code);
      }
    }
    refresh();
  }

  return (
    <IconButton label="刷新预览" onPress={handleRefresh} tooltip="刷新预览">
      <RefreshCw aria-hidden="true" className="size-4" />
    </IconButton>
  );
}

function SandpackCopyButton() {
  const { code } = useActiveCode();
  const { sandpack } = useSandpack();
  const [copied, setCopied] = useState(false);
  const fileName = sandpack.activeFile.slice(1);

  async function copyActiveFile() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`已复制 ${fileName}`);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.danger("复制失败，请检查浏览器权限");
    }
  }

  return (
    <IconButton
      label={`复制 ${fileName}`}
      onPress={copyActiveFile}
      tooltip="复制当前文件"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" />
      ) : (
        <Copy aria-hidden="true" className="size-4" />
      )}
    </IconButton>
  );
}

function FileTabs() {
  const { sandpack } = useSandpack();

  return (
    <div className="flex items-center gap-0.5">
      {sandpack.visibleFiles.map((path) => (
        <button
          aria-pressed={path === sandpack.activeFile}
          className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
            path === sandpack.activeFile
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
          key={path}
          onClick={() => sandpack.setActiveFile(path)}
          type="button"
        >
          {path.slice(1)}
        </button>
      ))}
    </div>
  );
}

export function ArtifactReact({
  artifact,
  view,
}: {
  artifact: ReactArtifact;
  view: View;
}) {
  const visibleFiles = Object.keys(artifact.files);
  // 代码面板首次切换到时才挂载,之后保持挂载(同 artifact-workspace 的做法)。
  const [hasVisitedCode, setHasVisitedCode] = useState(false);
  if (view === "code" && !hasVisitedCode) {
    setHasVisitedCode(true);
  }

  return (
    <div className="artifact-react h-full min-h-0">
      <SandpackProvider
        customSetup={{ dependencies: artifact.dependencies }}
        files={artifact.files}
        options={{ activeFile: visibleFiles[0], visibleFiles }}
        template="react"
        theme="light"
      >
        <SyncPreviewOnView view={view} />
        <div
          className={
            view === "preview" ? "flex h-full min-h-0 flex-col" : "hidden"
          }
        >
          <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-mono text-xs text-zinc-400">
              <Globe aria-hidden="true" className="size-3.5" />/
            </span>
            <RefreshButton />
          </div>
          <div className="relative min-h-0 flex-1">
            <SandpackPreview
              className="h-full"
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
            />
            <PreviewLoadingOverlay />
          </div>
        </div>

        {hasVisitedCode || view === "code" ? (
          <div
            className={
              view === "code" ? "flex h-full min-h-0 flex-col" : "hidden"
            }
          >
            <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-2">
              <FileTabs />
              <SandpackCopyButton />
            </div>
            <div className="min-h-0 flex-1">
              <SandpackCodeEditor
                className="h-full"
                showLineNumbers
                showTabs={false}
              />
            </div>
          </div>
        ) : null}
      </SandpackProvider>
    </div>
  );
}
