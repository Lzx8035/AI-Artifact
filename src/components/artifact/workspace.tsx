"use client";

import { useEffect, useMemo, useState } from "react";
import { FileCode2, X } from "lucide-react";

import { toFileMap, toFiles, type Artifact } from "@/lib/artifact";
import type { Quote } from "@/hooks/use-artifact";
import { IconButton } from "@/components/artifact/icon-button";
import { ArtifactErrorBoundary } from "@/components/artifact/error-boundary";
import { QuoteSelectionLayer } from "@/components/artifact/quote-selection";
import { HtmlPreview } from "@/components/artifact/html/preview";
import { HtmlCode } from "@/components/artifact/html/code";
import { ReactPanes } from "@/components/artifact/react/panes";
import { StreamingView } from "@/components/artifact/streaming-view";

type View = "preview" | "code";

function SegmentedToggle({
  value,
  onChange,
}: {
  value: View;
  onChange: (next: View) => void;
}) {
  const segments: { id: View; label: string }[] = [
    { id: "preview", label: "预览" },
    { id: "code", label: "代码" },
  ];

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-100 p-0.5">
      {segments.map((segment) => {
        const active = segment.id === value;
        return (
          <button
            aria-pressed={active}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
            key={segment.id}
            onClick={() => onChange(segment.id)}
            type="button"
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}

export type ArtifactWorkspaceProps = {
  /** 要展示的 artifact(html | react 联合)。 */
  artifact: Artifact;
  /** 关闭工作区(点 X 或按 Esc)。 */
  onClose: () => void;
  /** 初始落在哪个视图(默认预览)。切换打开意图时由调用方用 key 重挂以重应用。 */
  initialView?: View;
  /** 初始是否展开 diff 审阅(默认否)。 */
  initialShowDiff?: boolean;
  /** 定位到哪个版本(默认最新版);预览/代码/diff 都相对该版本。 */
  versionIndex?: number;
  /** html 预览的初始隔离模式(默认 inline);isolated 注入严格 CSP 切断外联。 */
  htmlSandbox?: "inline" | "isolated";
  /** 提供时,代码/diff 视图拖选后浮出「引用」按钮,点击回调选中片段(含来源)。 */
  onQuote?: (quote: Quote) => void;
};

/**
 * 受控的 Artifact 工作区组件。不依赖任何 demo 状态,可独立接入:
 *   <ArtifactWorkspace artifact={...} onClose={...} initialShowDiff />
 * 若需"再次打开时重置到某视图",调用方给本组件一个变化的 key 即可。
 */
export function ArtifactWorkspace({
  artifact,
  onClose,
  initialView = "preview",
  initialShowDiff = false,
  versionIndex,
  htmlSandbox = "inline",
  onQuote,
}: ArtifactWorkspaceProps) {
  // 缺省定位到最新版;index>0 时才有可对比的上一版(diff 开关据此显隐)。
  const index = versionIndex ?? artifact.versions.length - 1;
  const streaming = artifact.status === "streaming";
  const [view, setView] = useState<View>(initialView);
  // diff 审阅模式:默认关(显示干净的最新代码),卡片「查看改动」可直接打开。
  const [showDiff, setShowDiff] = useState(initialShowDiff);

  // 代码面板首次切换到时才挂载,之后保持挂载(隐藏)。避免在 display:none
  // 里挂载 Tooltip 触发器(react-aria 会告警),也保住编辑器状态。
  const [hasVisitedCode, setHasVisitedCode] = useState(false);
  if (view === "code" && !hasVisitedCode) {
    setHasVisitedCode(true);
  }

  // 快捷键:⌘B/Ctrl+B 切文件列表(仿 VS Code)、Esc 关闭工作区。
  const [showFileTree, setShowFileTree] = useState(true);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setShowFileTree((current) => !current);
        return;
      }
      if (event.key === "Escape") {
        // 正在代码编辑器/输入框里时不抢 Esc,避免打断编辑。
        const target = event.target;
        if (
          target instanceof Element &&
          target.closest(".cm-editor, input, textarea, [contenteditable]")
        ) {
          return;
        }
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const files = useMemo(
    () =>
      artifact.kind === "html" ? toFiles(artifact.versions[index]) : [],
    [artifact, index],
  );
  // html 档的 diff 数据(该版本 vs 上一版;无上一版则 null,面板据此隐藏 diff 开关)
  const htmlDiff = useMemo(() => {
    if (artifact.kind !== "html" || index < 1) {
      return null;
    }
    return {
      oldFiles: toFileMap(artifact.versions[index - 1]),
      newFiles: toFileMap(artifact.versions[index]),
    };
  }, [artifact, index]);

  return (
    <section
      aria-label={`${artifact.title} Artifact 工作区`}
      className="flex h-full min-w-0 flex-col bg-white"
    >
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-zinc-200 px-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FileCode2 aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-950">
              {artifact.title}
            </p>
            <p className="hidden text-[11px] leading-tight text-zinc-400 sm:block">
              {streaming
                ? "生成中…"
                : artifact.kind === "html"
                  ? "静态 HTML 预览"
                  : "React · Sandpack"}
            </p>
          </div>
        </div>

        <SegmentedToggle onChange={setView} value={view} />

        <span aria-hidden="true" className="h-5 w-px bg-zinc-200" />

        <IconButton label="关闭工作区" onPress={onClose} tooltip="关闭">
          <X aria-hidden="true" className="size-4" />
        </IconButton>
      </header>

      <div className="min-h-0 flex-1">
        {onQuote ? <QuoteSelectionLayer onQuote={onQuote} /> : null}
        <ArtifactErrorBoundary>
        {streaming ? (
          <StreamingView artifact={artifact} versionIndex={index} view={view} />
        ) : artifact.kind === "html" ? (
          <>
            <HtmlPreview
              files={artifact.versions[index]}
              hidden={view !== "preview"}
              sandboxMode={htmlSandbox}
              title={artifact.title}
            />
            {hasVisitedCode || view === "code" ? (
              <HtmlCode
                diff={htmlDiff}
                files={files}
                hidden={view !== "code"}
                onToggleDiff={() => setShowDiff((c) => !c)}
                onToggleFileTree={() => setShowFileTree((c) => !c)}
                showDiff={showDiff}
                showFileTree={showFileTree}
              />
            ) : null}
          </>
        ) : (
          <ReactPanes
            artifact={artifact}
            onToggleDiff={() => setShowDiff((c) => !c)}
            onToggleFileTree={() => setShowFileTree((c) => !c)}
            showDiff={showDiff}
            showFileTree={showFileTree}
            versionIndex={index}
            view={view}
          />
        )}
        </ArtifactErrorBoundary>
      </div>
    </section>
  );
}
