"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

import { versionFiles, type Artifact } from "@/lib/artifact";
import { CodeBlock } from "@/components/artifact/code-block";

type View = "preview" | "code";

/**
 * 流式生成期间的统一视图(两档共用)。代码逐步出现;预览显示占位
 * (此时还没有可运行的完整代码——react 的 Sandpack 也尚未挂载)。
 */
export function StreamingView({
  artifact,
  versionIndex,
  view,
}: {
  artifact: Artifact;
  versionIndex: number;
  view: View;
}) {
  const files = versionFiles(artifact, versionIndex).filter(
    (file) => file.code.length > 0,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // 代码增长时自动滚到底部,像在“看它被写出来”。
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  });

  return (
    <div className="h-full min-h-0">
      <div className={view === "preview" ? "flex h-full" : "hidden"}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white">
          <Loader2
            aria-hidden="true"
            className="size-5 animate-spin text-zinc-400"
          />
          <p className="text-xs text-zinc-500">正在生成代码…</p>
        </div>
      </div>

      <div
        className={
          view === "code" ? "h-full min-h-0 overflow-y-auto" : "hidden"
        }
        ref={scrollRef}
      >
        {files.map((file) => (
          <section key={file.name}>
            <header className="sticky top-0 z-10 flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3 py-1.5 font-mono text-xs text-zinc-500">
              {file.name}
            </header>
            <CodeBlock code={file.code} language={file.language} />
          </section>
        ))}
        <div className="flex items-center gap-2 px-4 py-3 text-xs text-zinc-400">
          <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
          生成中…
        </div>
      </div>
    </div>
  );
}
