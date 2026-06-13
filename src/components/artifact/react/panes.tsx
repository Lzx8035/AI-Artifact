"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Globe, Loader2, RefreshCw, RotateCcw } from "lucide-react";
import { toast } from "@heroui/react";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackProvider,
  useActiveCode,
  useSandpack,
  useSandpackNavigation,
} from "@codesandbox/sandpack-react";

import { type ReactArtifact } from "@/lib/artifact";
import { IconButton } from "@/components/artifact/icon-button";
import { FileTreeToggle } from "@/components/artifact/file-tree-toggle";
import { DiffToggle } from "@/components/artifact/diff-toggle";
import { DiffView } from "@/components/artifact/diff-view";

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

/**
 * 恢复初始代码。只在用户改动过任一文件后出现;
 * resetAllFiles 会把所有文件重置回 Provider props 里的原始内容。
 */
function ResetButton({
  originalFiles,
}: {
  originalFiles: Record<string, string>;
}) {
  const { sandpack } = useSandpack();
  const dirty = Object.entries(originalFiles).some(
    ([path, code]) => sandpack.files[path]?.code !== code,
  );

  if (!dirty) {
    return null;
  }

  function reset() {
    sandpack.resetAllFiles();
    toast.success("已恢复初始代码");
  }

  return (
    <IconButton label="恢复初始代码" onPress={reset} tooltip="恢复初始代码">
      <RotateCcw aria-hidden="true" className="size-4" />
    </IconButton>
  );
}

/** 顶栏里的当前文件路径(随文件树选择实时变化)。 */
function ActiveFilePath() {
  const { sandpack } = useSandpack();

  return (
    <span className="truncate px-1 font-mono text-xs text-zinc-500">
      {sandpack.activeFile.slice(1)}
    </span>
  );
}

export function ReactPanes({
  artifact,
  versionIndex,
  view,
  showFileTree,
  onToggleFileTree,
  showDiff,
  onToggleDiff,
}: {
  artifact: ReactArtifact;
  versionIndex: number;
  view: View;
  showFileTree: boolean;
  onToggleFileTree: () => void;
  showDiff: boolean;
  onToggleDiff: () => void;
}) {
  const files = artifact.versions[versionIndex];
  const previousFiles =
    versionIndex > 0 ? artifact.versions[versionIndex - 1] : null;
  // diff 对比的是快照 v(n-1) → v(n),即「AI 本次改动」,与编辑器实时编辑无关。
  const diffActive = showDiff && previousFiles !== null;

  // SandpackProvider 内部用「props 身份比较」决定是否整体重置文件状态
  // (dist 的 useFiles effect 依赖 [props.files, props.customSetup, props.template])。
  // 这两个 props 必须 memoize,否则本组件任何一次重渲染(如切换视图)
  // 都会把用户在编辑器里的修改抹掉。
  const customSetup = useMemo(
    () => ({ dependencies: artifact.dependencies }),
    [artifact.dependencies],
  );
  const options = useMemo(() => {
    const visibleFiles = Object.keys(files);
    return { activeFile: visibleFiles[0], visibleFiles };
  }, [files]);

  // 代码面板首次切换到时才挂载,之后保持挂载(同 artifact-workspace 的做法)。
  const [hasVisitedCode, setHasVisitedCode] = useState(false);
  if (view === "code" && !hasVisitedCode) {
    setHasVisitedCode(true);
  }

  return (
    <div className="artifact-react h-full min-h-0">
      <SandpackProvider
        customSetup={customSetup}
        files={files}
        options={options}
        template="react"
        theme="light"
      >
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
              <div className="flex min-w-0 items-center gap-1">
                <FileTreeToggle onToggle={onToggleFileTree} show={showFileTree} />
                {diffActive ? (
                  <span className="truncate px-1 font-mono text-xs text-zinc-500">
                    本次改动
                  </span>
                ) : (
                  <ActiveFilePath />
                )}
              </div>
              <div className="flex items-center gap-0.5">
                {diffActive ? null : (
                  <>
                    <ResetButton originalFiles={files} />
                    <SandpackCopyButton />
                  </>
                )}
                {previousFiles ? (
                  <DiffToggle active={diffActive} onToggle={onToggleDiff} />
                ) : null}
              </div>
            </div>
            {/* Sandpack 子树保持挂载(hidden),diff 只是盖在上面的只读审阅 */}
            <div className={diffActive ? "hidden" : "flex min-h-0 flex-1"}>
              <SandpackFileExplorer
                autoHiddenFiles
                className={`w-44 shrink-0 border-r border-zinc-200 ${
                  showFileTree ? "" : "artifact-tree-hidden"
                }`}
              />
              <div className="min-h-0 flex-1">
                <SandpackCodeEditor
                  className="h-full"
                  initMode="immediate"
                  showLineNumbers
                  showTabs={false}
                />
              </div>
            </div>
            {diffActive && previousFiles ? (
              <div className="min-h-0 flex-1">
                <DiffView
                  newFiles={files}
                  oldFiles={previousFiles}
                  showFileList={showFileTree}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </SandpackProvider>
    </div>
  );
}
