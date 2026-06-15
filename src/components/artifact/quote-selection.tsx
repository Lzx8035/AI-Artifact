"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TextQuote } from "lucide-react";

import type { Quote } from "@/hooks/use-artifact";

type Pos = { x: number; y: number; quote: Quote };

/** 从选区某个端点节点上解析来源文件名:代码视图用 data-quote-file,diff 用 data-diff-file。 */
function resolveFile(node: Node | null): string | undefined {
  const el = node instanceof Element ? node : node?.parentElement;
  const source = el?.closest<HTMLElement>("[data-quote-file], [data-diff-file]");
  const name = source?.dataset.quoteFile ?? source?.dataset.diffFile;
  // diff / Sandpack 的文件键带前导斜杠(/App.js),统一去掉。
  return name ? name.replace(/^\//, "") : undefined;
}

/**
 * 解析端点所在行号:
 * - CodeBlock / DiffView:行元素带 data-line,直接读。
 * - Sandpack(CodeMirror):无 data-line,用 .cm-line 的垂直位置去对齐
 *   .cm-lineNumbers 的 gutter 元素读数字(兼容虚拟滚动;读不到则放弃)。
 */
function resolveLine(node: Node | null): number | undefined {
  const el = node instanceof Element ? node : node?.parentElement;
  if (!el) {
    return undefined;
  }
  const tagged = el.closest<HTMLElement>("[data-line]");
  if (tagged?.dataset.line) {
    const n = Number.parseInt(tagged.dataset.line, 10);
    return Number.isNaN(n) ? undefined : n;
  }
  const cmLine = el.closest(".cm-line");
  if (cmLine) {
    const top = cmLine.getBoundingClientRect().top;
    const gutters = document.querySelectorAll<HTMLElement>(
      ".cm-lineNumbers .cm-gutterElement",
    );
    for (const gutter of gutters) {
      const rect = gutter.getBoundingClientRect();
      // 跳过 CodeMirror 的测量占位元素(visibility:hidden、height:0,top 与首行相同)。
      if (rect.height > 0 && Math.abs(rect.top - top) <= 1) {
        const n = Number.parseInt(gutter.textContent ?? "", 10);
        if (!Number.isNaN(n)) {
          return n;
        }
      }
    }
  }
  return undefined;
}

/**
 * 选区引用层:在标了 `data-quote-source` 的代码/ diff 区拖选后,浮出「引用」按钮,
 * 点击把选中文本连同来源(文件名 + 起止行)交给 onQuote。
 * 来源信息让接入的 AI 知道选的是哪个文件、哪几行;解析不到时优雅降级(只带文本)。
 */
export function QuoteSelectionLayer({
  onQuote,
}: {
  onQuote: (quote: Quote) => void;
}) {
  const [pos, setPos] = useState<Pos | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onMouseUp(event: MouseEvent) {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setPos(null);
        return;
      }
      const text = selection.toString();
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const element =
        startNode instanceof Element ? startNode : startNode.parentElement;
      if (!text.trim() || !element?.closest("[data-quote-source]")) {
        setPos(null);
        return;
      }
      // 文档序的起止端点解析来源(start≤end,与拖选方向无关)。
      const file = resolveFile(startNode);
      const startLine = resolveLine(startNode);
      const endLine = resolveLine(range.endContainer);
      const quote: Quote = {
        text,
        ...(file ? { file } : {}),
        ...(startLine !== undefined ? { startLine } : {}),
        ...(endLine !== undefined ? { endLine } : {}),
      };
      // 锚到鼠标松开处:多行选择时用包围盒中点会让按钮飘在整块正中、远离落点,
      // 贴着落点更自然(也避免横跨多文件的 diff 选区把按钮甩到中间)。
      setPos({ x: event.clientX, y: event.clientY, quote });
    }
    // 滚动或重新按下时收起旧按钮(位置会失效)。
    // 但按在「引用」按钮自身上时不收——否则 mousedown 会先卸载它,click 永远到不了。
    function dismiss(event: Event) {
      if (
        event.target instanceof Node &&
        buttonRef.current?.contains(event.target)
      ) {
        return;
      }
      setPos(null);
    }
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousedown", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, []);

  if (!pos) {
    return null;
  }

  // 默认浮在落点上方;离视口顶部太近就翻到下方,水平方向夹取避免顶/底出屏。
  const flipBelow = pos.y < 44;
  const left = Math.min(Math.max(pos.x, 52), window.innerWidth - 52);
  const top = flipBelow ? pos.y + 14 : pos.y - 10;

  return createPortal(
    <button
      ref={buttonRef}
      className={`fixed z-50 inline-flex -translate-x-1/2 items-center gap-1 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-colors hover:bg-zinc-700 ${
        flipBelow ? "" : "-translate-y-full"
      }`}
      onClick={() => {
        onQuote(pos.quote);
        setPos(null);
        window.getSelection()?.removeAllRanges();
      }}
      // 保住选区,别让点击清掉它。
      onMouseDown={(event) => event.preventDefault()}
      style={{ left, top }}
      type="button"
    >
      <TextQuote aria-hidden="true" className="size-3.5" />
      引用
    </button>,
    document.body,
  );
}
