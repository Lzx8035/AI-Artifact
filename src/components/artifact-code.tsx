"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "@heroui/react";
import { Highlight, themes } from "prism-react-renderer";

import type { ArtifactFile } from "@/lib/artifact";
import { IconButton } from "@/components/artifact-icon-button";

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

export function ArtifactCode({
  files,
  hidden,
}: {
  files: ArtifactFile[];
  hidden: boolean;
}) {
  const [activeFileName, setActiveFileName] = useState("index.html");
  const activeFile =
    files.find((file) => file.name === activeFileName) ?? files[0];

  if (!activeFile) {
    return null;
  }

  return (
    <div className={hidden ? "hidden" : "flex h-full min-h-0 flex-col"}>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-2">
        <div className="flex items-center gap-0.5">
          {files.map((file) => (
            <button
              aria-pressed={file.name === activeFile.name}
              className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                file.name === activeFile.name
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
              key={file.name}
              onClick={() => setActiveFileName(file.name)}
              type="button"
            >
              {file.name}
            </button>
          ))}
        </div>
        <CopyButton file={activeFile} />
      </div>
      <div className="min-h-0 flex-1">
        <CodeView file={activeFile} />
      </div>
    </div>
  );
}
