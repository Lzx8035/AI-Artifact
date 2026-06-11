"use client";

import { useMemo, useState } from "react";
import { FileCode2, X } from "lucide-react";

import { toFiles } from "@/lib/artifact";
import { buildPreviewDocument } from "@/lib/build-preview";
import { useArtifact } from "@/hooks/use-artifact";
import { IconButton } from "@/components/artifact/icon-button";
import { HtmlPreview } from "@/components/artifact/html/preview";
import { HtmlCode } from "@/components/artifact/html/code";
import { ReactPanes } from "@/components/artifact/react/panes";

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

export function ArtifactWorkspace() {
  const { artifact, close } = useArtifact();
  const [view, setView] = useState<View>("preview");
  // 代码面板首次切换到时才挂载,之后保持挂载(隐藏)。避免在 display:none
  // 里挂载 Tooltip 触发器(react-aria 会告警),也保住编辑器状态。
  const [hasVisitedCode, setHasVisitedCode] = useState(false);
  if (view === "code" && !hasVisitedCode) {
    setHasVisitedCode(true);
  }

  const files = useMemo(
    () => (artifact?.kind === "html" ? toFiles(artifact) : []),
    [artifact],
  );
  const previewDocument = useMemo(
    () => (artifact?.kind === "html" ? buildPreviewDocument(artifact) : ""),
    [artifact],
  );

  if (!artifact) {
    return null;
  }

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
              {artifact.kind === "html" ? "静态 HTML 预览" : "React · Sandpack"}
            </p>
          </div>
        </div>

        <SegmentedToggle onChange={setView} value={view} />

        <span aria-hidden="true" className="h-5 w-px bg-zinc-200" />

        <IconButton label="关闭工作区" onPress={close} tooltip="关闭">
          <X aria-hidden="true" className="size-4" />
        </IconButton>
      </header>

      <div className="min-h-0 flex-1">
        {artifact.kind === "html" ? (
          <>
            <HtmlPreview
              hidden={view !== "preview"}
              previewDocument={previewDocument}
              title={artifact.title}
            />
            {hasVisitedCode || view === "code" ? (
              <HtmlCode files={files} hidden={view !== "code"} />
            ) : null}
          </>
        ) : (
          <ReactPanes artifact={artifact} view={view} />
        )}
      </div>
    </section>
  );
}
