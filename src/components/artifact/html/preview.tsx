"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Globe,
  RefreshCw,
  Shield,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";

import type { HtmlFiles } from "@/lib/artifact";
import { buildPreviewDocument } from "@/lib/build-preview";
import { IconButton } from "@/components/artifact/icon-button";

type SandboxMode = "inline" | "isolated";

/**
 * 隔离状态指示器:只读。隔离与否取决于内容可信度,由集成方通过 prop 决定,
 * 不提供运行时切换——能关闭隔离的 UI 本身就是安全隐患(降级 footgun)。
 */
function SandboxIndicator({ isolated }: { isolated: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${
        isolated
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-white text-zinc-400"
      }`}
      title={
        isolated
          ? "隔离模式:已注入 CSP 切断外联,适合不可信代码"
          : "普通模式:同源沙箱,未切断外联(适合可信内容)"
      }
    >
      {isolated ? (
        <ShieldCheck aria-hidden="true" className="size-3.5" />
      ) : (
        <Shield aria-hidden="true" className="size-3.5" />
      )}
      {isolated ? "已隔离" : "未隔离"}
    </span>
  );
}

export function HtmlPreview({
  files,
  title,
  hidden,
  sandboxMode = "inline",
}: {
  files: HtmlFiles;
  title: string;
  hidden: boolean;
  /** inline = 同源 srcDoc(快,适合可信);isolated = 注入严格 CSP 切断外联。
   *  由集成方决定,运行时只读、不可切换。 */
  sandboxMode?: SandboxMode;
}) {
  const [previewKey, setPreviewKey] = useState(0);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const isolated = sandboxMode === "isolated";

  const previewDocument = useMemo(
    () => buildPreviewDocument(files, { isolated }),
    [files, isolated],
  );

  // 接收预览 iframe 内捕获并 postMessage 回来的运行时错误。
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (data && data.source === "artifact-preview" && data.error) {
        setRuntimeError(String(data.error));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // 刷新或换内容时清掉旧错误(重挂 iframe 会重新报)——渲染期重置,比 effect 合规。
  const [errorScope, setErrorScope] = useState({ previewKey, previewDocument });
  if (
    errorScope.previewKey !== previewKey ||
    errorScope.previewDocument !== previewDocument
  ) {
    setErrorScope({ previewKey, previewDocument });
    setRuntimeError(null);
  }

  function openInNewWindow() {
    const previewBlob = new Blob([previewDocument], { type: "text/html" });
    const previewUrl = URL.createObjectURL(previewBlob);
    window.open(previewUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(previewUrl), 30_000);
  }

  return (
    <div className={hidden ? "hidden" : "flex h-full min-h-0 flex-col"}>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-mono text-xs text-zinc-400">
            <Globe aria-hidden="true" className="size-3.5" />/
          </span>
          <SandboxIndicator isolated={isolated} />
        </div>
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
      <div className="relative min-h-0 flex-1">
        <iframe
          className="size-full border-0 bg-white"
          key={previewKey}
          sandbox="allow-scripts"
          srcDoc={previewDocument}
          title={`${title} 页面预览`}
        />
        {runtimeError ? (
          <div className="absolute inset-x-3 bottom-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 shadow-sm">
            <TriangleAlert
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-red-600"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-red-700">预览运行出错</p>
              <p className="mt-0.5 break-words font-mono text-[11px] leading-4 text-red-600">
                {runtimeError}
              </p>
            </div>
            <button
              aria-label="关闭错误提示"
              className="shrink-0 rounded p-0.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
              onClick={() => setRuntimeError(null)}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
