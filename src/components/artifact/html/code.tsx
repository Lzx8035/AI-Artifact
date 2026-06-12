"use client";

import { useState } from "react";
import { Check, Copy, File } from "lucide-react";
import { toast } from "@heroui/react";
import { Highlight, themes } from "prism-react-renderer";

import type { ArtifactFile } from "@/lib/artifact";
import { IconButton } from "@/components/artifact/icon-button";
import { FileTreeToggle } from "@/components/artifact/file-tree-toggle";
import { DiffToggle } from "@/components/artifact/diff-toggle";
import { DiffView } from "@/components/artifact/diff-view";

type HtmlDiff = {
  oldFiles: Record<string, string>;
  newFiles: Record<string, string>;
};

function CopyButton({ file }: { file: ArtifactFile }) {
  const [copied, setCopied] = useState(false);

  async function copyActiveFile() {
    try {
      await navigator.clipboard.writeText(file.code);
      setCopied(true);
      toast.success(`已复制 ${file.name}`);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.danger("复制失败，请检查浏览器权限");
    }
  }

  return (
    <IconButton
      label={`复制 ${file.name}`}
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

/** 左侧文件列表,样式对齐 react 档的 Sandpack 文件树(蓝色激活/灰色默认)。 */
function FileList({
  files,
  activeName,
  onSelect,
}: {
  files: ArtifactFile[];
  activeName: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="w-44 shrink-0 overflow-y-auto border-r border-zinc-200 py-2">
      {files.map((file) => {
        const active = file.name === activeName;
        return (
          <button
            aria-pressed={active}
            className={`flex w-full items-center gap-1.5 px-3 py-1 text-left text-xs transition-colors ${
              active
                ? "text-[#3973e0]"
                : "text-[#808080] hover:text-zinc-900"
            }`}
            key={file.name}
            onClick={() => onSelect(file.name)}
            type="button"
          >
            <File aria-hidden="true" className="size-4 shrink-0" />
            {file.name}
          </button>
        );
      })}
    </div>
  );
}

function CodeView({ file }: { file: ArtifactFile }) {
  return (
    <Highlight code={file.code} language={file.language} theme={themes.github}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} h-full overflow-auto bg-white p-4 font-mono text-xs leading-5`}
          style={style}
        >
          {tokens.map((line, lineIndex) => {
            const lineProps = getLineProps({ line });
            return (
              <div key={lineIndex} {...lineProps}>
                <span className="mr-4 inline-block w-6 select-none text-right text-zinc-300">
                  {lineIndex + 1}
                </span>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}

export function HtmlCode({
  files,
  hidden,
  showFileTree,
  onToggleFileTree,
  diff,
  showDiff,
  onToggleDiff,
}: {
  files: ArtifactFile[];
  hidden: boolean;
  showFileTree: boolean;
  onToggleFileTree: () => void;
  diff: HtmlDiff | null;
  showDiff: boolean;
  onToggleDiff: () => void;
}) {
  const [activeFileName, setActiveFileName] = useState("index.html");
  const activeFile =
    files.find((file) => file.name === activeFileName) ?? files[0];
  const diffActive = showDiff && diff !== null;

  if (!activeFile) {
    return null;
  }

  return (
    <div className={hidden ? "hidden" : "flex h-full min-h-0 flex-col"}>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-2">
        <div className="flex min-w-0 items-center gap-1">
          <FileTreeToggle onToggle={onToggleFileTree} show={showFileTree} />
          <span className="truncate px-1 font-mono text-xs text-zinc-500">
            {diffActive ? "本次改动" : activeFile.name}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {diffActive ? null : <CopyButton file={activeFile} />}
          {diff ? (
            <DiffToggle active={diffActive} onToggle={onToggleDiff} />
          ) : null}
        </div>
      </div>
      {diffActive && diff ? (
        <div className="min-h-0 flex-1">
          <DiffView
            newFiles={diff.newFiles}
            oldFiles={diff.oldFiles}
            showFileList={showFileTree}
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          {showFileTree ? (
            <FileList
              activeName={activeFile.name}
              files={files}
              onSelect={setActiveFileName}
            />
          ) : null}
          <div className="min-h-0 flex-1">
            <CodeView file={activeFile} />
          </div>
        </div>
      )}
    </div>
  );
}
