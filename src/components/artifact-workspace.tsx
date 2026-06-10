"use client";

import { useMemo, useState } from "react";
import { FileCode2, X } from "lucide-react";

import { toFiles } from "@/lib/artifact";
import { buildPreviewDocument } from "@/lib/build-preview";
import { useArtifact } from "@/hooks/use-artifact";
import { IconButton } from "@/components/artifact-icon-button";
import { ArtifactPreview } from "@/components/artifact-preview";
import { ArtifactCode } from "@/components/artifact-code";

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

  const files = useMemo(() => (artifact ? toFiles(artifact) : []), [artifact]);
  const previewDocument = useMemo(
    () => (artifact ? buildPreviewDocument(artifact) : ""),
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
          <p className="truncate text-sm font-medium text-zinc-950">
            {artifact.title}
          </p>
        </div>

        <SegmentedToggle onChange={setView} value={view} />

        <span aria-hidden="true" className="h-5 w-px bg-zinc-200" />

        <IconButton label="关闭工作区" onPress={close} tooltip="关闭">
          <X aria-hidden="true" className="size-4" />
        </IconButton>
      </header>

      <div className="min-h-0 flex-1">
        <ArtifactPreview
          hidden={view !== "preview"}
          previewDocument={previewDocument}
          title={artifact.title}
        />
        <ArtifactCode files={files} hidden={view !== "code"} />
      </div>
    </section>
  );
}
