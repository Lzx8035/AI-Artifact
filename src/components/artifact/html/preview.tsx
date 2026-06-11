"use client";

import { useState } from "react";
import { ExternalLink, Globe, RefreshCw } from "lucide-react";

import { IconButton } from "@/components/artifact/icon-button";

export function HtmlPreview({
  previewDocument,
  title,
  hidden,
}: {
  previewDocument: string;
  title: string;
  hidden: boolean;
}) {
  const [previewKey, setPreviewKey] = useState(0);

  function openInNewWindow() {
    const previewBlob = new Blob([previewDocument], { type: "text/html" });
    const previewUrl = URL.createObjectURL(previewBlob);
    window.open(previewUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(previewUrl), 30_000);
  }

  return (
    <div className={hidden ? "hidden" : "flex h-full min-h-0 flex-col"}>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-mono text-xs text-zinc-400">
          <Globe aria-hidden="true" className="size-3.5" />/
        </span>
        <div className="flex items-center gap-0.5">
          <IconButton
            label="刷新预览"
            onPress={() => setPreviewKey((key) => key + 1)}
            tooltip="刷新预览"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
          </IconButton>
          <IconButton
            label="在新窗口打开预览"
            onPress={openInNewWindow}
            tooltip="在新窗口打开"
          >
            <ExternalLink aria-hidden="true" className="size-4" />
          </IconButton>
        </div>
      </div>
      <iframe
        className="min-h-0 flex-1 border-0 bg-white"
        key={previewKey}
        sandbox="allow-scripts"
        srcDoc={previewDocument}
        title={`${title} 页面预览`}
      />
    </div>
  );
}
