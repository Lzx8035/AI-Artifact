"use client";

import { useMemo, useRef } from "react";

import {
  diffFileMaps,
  type FileDiff,
  type FileDiffStatus,
} from "@/lib/diff";

const STATUS_META: Record<FileDiffStatus, { label: string; className: string }> =
  {
    modified: { label: "M", className: "bg-amber-100 text-amber-700" },
    added: { label: "A", className: "bg-emerald-100 text-emerald-700" },
    removed: { label: "D", className: "bg-red-100 text-red-700" },
  };

function displayName(name: string) {
  return name.replace(/^\//, "");
}

function StatusBadge({ status }: { status: FileDiffStatus }) {
  const meta = STATUS_META[status];

  return (
    <span
      aria-label={status}
      className={`inline-flex size-4 shrink-0 items-center justify-center rounded text-[10px] font-semibold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function DiffFileSection({ diff }: { diff: FileDiff }) {
  return (
    <section>
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-1.5">
        <StatusBadge status={diff.status} />
        <span className="truncate font-mono text-xs text-zinc-700">
          {displayName(diff.name)}
        </span>
        <span className="ml-auto shrink-0 font-mono text-[11px]">
          <span className="text-emerald-600">+{diff.added}</span>{" "}
          <span className="text-red-600">−{diff.removed}</span>
        </span>
      </header>
      <pre className="overflow-x-auto pb-2 font-mono text-xs leading-5">
        {diff.lines.map((line, index) => {
          const rowClass =
            line.type === "added"
              ? "bg-emerald-50"
              : line.type === "removed"
                ? "bg-red-50"
                : "";
          const marker =
            line.type === "added" ? "+" : line.type === "removed" ? "−" : " ";
          const markerClass =
            line.type === "added"
              ? "text-emerald-600"
              : line.type === "removed"
                ? "text-red-600"
                : "text-zinc-300";

          return (
            <div className={`flex ${rowClass}`} key={index}>
              <span className="w-8 shrink-0 select-none pr-1.5 text-right text-zinc-300">
                {line.oldNo ?? ""}
              </span>
              <span className="w-8 shrink-0 select-none pr-1.5 text-right text-zinc-300">
                {line.newNo ?? ""}
              </span>
              <span
                className={`w-4 shrink-0 select-none text-center ${markerClass}`}
              >
                {marker}
              </span>
              <span className="flex-1 whitespace-pre pr-4 text-zinc-700">
                {line.text || " "}
              </span>
            </div>
          );
        })}
      </pre>
    </section>
  );
}

/**
 * GitHub 风格的 unified diff 视图(zinc 适配)。
 * 左栏只列有改动的文件(M/A/D 徽章),点击滚动到对应文件段;
 * 主区按文件纵向堆叠展示红绿行。
 */
export function DiffView({
  oldFiles,
  newFiles,
  showFileList,
}: {
  oldFiles: Record<string, string>;
  newFiles: Record<string, string>;
  showFileList: boolean;
}) {
  const diffs = useMemo(
    () => diffFileMaps(oldFiles, newFiles),
    [oldFiles, newFiles],
  );
  const containerRef = useRef<HTMLDivElement>(null);

  function scrollToFile(name: string) {
    const el = containerRef.current?.querySelector(
      `[data-diff-file="${CSS.escape(name)}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (diffs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-400">
        与上一版本没有差异
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0">
      {showFileList ? (
        <div className="w-44 shrink-0 overflow-y-auto border-r border-zinc-200 py-2">
          {diffs.map((diff) => (
            <button
              className="flex w-full items-center gap-1.5 px-3 py-1 text-left text-xs text-[#808080] transition-colors hover:text-zinc-900"
              key={diff.name}
              onClick={() => scrollToFile(diff.name)}
              type="button"
            >
              <StatusBadge status={diff.status} />
              <span className="truncate">{displayName(diff.name)}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto" ref={containerRef}>
        {diffs.map((diff) => (
          <div data-diff-file={diff.name} key={diff.name}>
            <DiffFileSection diff={diff} />
          </div>
        ))}
      </div>
    </div>
  );
}
