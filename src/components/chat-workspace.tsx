"use client";

import {
  ArrowUp,
  Atom,
  Bot,
  Code2,
  FileDiff,
  Menu,
  Play,
  Plus,
  Sparkles,
  TextQuote,
  User,
  X,
} from "lucide-react";
import { Button, ScrollShadow, TextArea, ToastProvider } from "@heroui/react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { ArtifactWorkspace } from "@/components/artifact/workspace";
import { ArtifactProvider, useArtifact } from "@/hooks/use-artifact";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useSimulatedStream } from "@/hooks/use-simulated-stream";
import type { Artifact } from "@/lib/artifact";
import { sampleHtmlArtifact } from "@/lib/sample/html-demo";
import { sampleReactArtifact } from "@/lib/sample/react-demo";
import { sampleStreamArtifact } from "@/lib/sample/stream-demo";
import { sampleErrorArtifact } from "@/lib/sample/error-demo";

/**
 * 卡片右侧的打开按钮组:「预览 / 代码」,非首版追加「改动」(直达该版本的 diff)。
 * 每张卡绑定自己的 versionIndex——打开后定位到该版本,改动 = 该版本 vs 上一版。
 */
function CardOpenActions({
  artifact,
  versionIndex,
  htmlSandbox,
}: {
  artifact: Artifact;
  versionIndex: number;
  htmlSandbox?: "inline" | "isolated";
}) {
  const { open } = useArtifact();
  const itemClass =
    "px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950";

  return (
    <div className="inline-flex shrink-0 overflow-hidden rounded-lg border border-zinc-200">
      <button
        className={itemClass}
        onClick={() => open(artifact, { versionIndex, htmlSandbox })}
        type="button"
      >
        预览
      </button>
      <button
        className={`${itemClass} border-l border-zinc-200`}
        onClick={() => open(artifact, { view: "code", versionIndex, htmlSandbox })}
        type="button"
      >
        代码
      </button>
      {versionIndex > 0 ? (
        <button
          className={`${itemClass} border-l border-zinc-200`}
          onClick={() =>
            open(artifact, { showDiff: true, versionIndex, htmlSandbox })
          }
          type="button"
        >
          改动
        </button>
      ) : null}
    </div>
  );
}

/** 流式生成 demo 的触发按钮:打开工作区并以流式播放生成过程。 */
function GenerateButton({ artifact }: { artifact: Artifact }) {
  const { open } = useArtifact();

  return (
    <button
      className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
      onClick={() => open(artifact, { stream: true })}
      type="button"
    >
      <Play aria-hidden="true" className="size-3.5" />
      观看生成
    </button>
  );
}

/** 引用条来源标题:「文件名 · 行 a–b」(单行只显示行 a;缺什么省什么)。 */
function quoteSourceLabel(quote: {
  file?: string;
  startLine?: number;
  endLine?: number;
}): string | null {
  const parts: string[] = [];
  if (quote.file) {
    parts.push(quote.file);
  }
  if (quote.startLine !== undefined) {
    const end = quote.endLine ?? quote.startLine;
    parts.push(
      end > quote.startLine ? `行 ${quote.startLine}–${end}` : `行 ${quote.startLine}`,
    );
  }
  return parts.length ? parts.join(" · ") : null;
}

/** 输入框上方的引用条:展示引用片段的来源(文件名/行号)与文本(最多 3 行),× 可清除。 */
function QuoteChip() {
  const { quote, clearQuote } = useArtifact();

  if (!quote) {
    return null;
  }

  const sourceLabel = quoteSourceLabel(quote);

  return (
    <div className="mx-auto mb-2 flex max-w-3xl items-start gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
      <TextQuote
        aria-hidden="true"
        className="mt-0.5 size-3.5 shrink-0 text-zinc-400"
      />
      <div className="min-w-0 flex-1">
        {sourceLabel ? (
          <p className="mb-0.5 truncate font-mono text-[11px] font-medium text-zinc-400">
            {sourceLabel}
          </p>
        ) : null}
        <pre className="overflow-hidden font-mono text-xs leading-5 text-zinc-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {quote.text}
        </pre>
      </div>
      <button
        aria-label="清除引用"
        className="shrink-0 rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700"
        onClick={clearQuote}
        type="button"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
}

function ChatPanel() {
  return (
    <section className="flex h-full min-w-0 flex-col bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-4">
        <div className="flex items-center gap-3">
          <Button
            aria-label="打开菜单"
            className="md:hidden"
            isIconOnly
            size="sm"
            variant="ghost"
          >
            <Menu aria-hidden="true" />
          </Button>
          <div>
            <p className="text-sm font-medium text-zinc-950">新对话</p>
            <p className="text-xs text-zinc-500">静态页面生成示例</p>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <Plus aria-hidden="true" />
          新建
        </Button>
      </header>

      <ScrollShadow className="min-h-0 flex-1" hideScrollBar>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-10 sm:px-8">
          <div className="flex justify-end gap-3">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-zinc-100 px-4 py-3 text-[15px] leading-6 text-zinc-900">
              帮我做一个简单的产品介绍页，包含标题、功能介绍和行动按钮。
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <User aria-hidden="true" className="size-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="pt-1 text-[15px] leading-7 text-zinc-700">
                没问题。预览要用隔离模式吗？如果对生成代码的来源不完全放心，
                建议开启——会注入 CSP 切断外联，让代码跑得起来但连不出去。
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-zinc-100 px-4 py-3 text-[15px] leading-6 text-zinc-900">
              用隔离模式吧。
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <User aria-hidden="true" className="size-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 text-[15px] leading-7 text-zinc-700">
                <p>
                  好的，已按隔离模式生成产品介绍页。页面使用原生 HTML、CSS 和
                  JavaScript，预览已切断外联，可以直接查看每个文件。
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                      <Code2 aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-950">
                        {sampleHtmlArtifact.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        HTML · CSS · JavaScript
                      </p>
                    </div>
                    <CardOpenActions artifact={sampleHtmlArtifact} htmlSandbox="isolated" versionIndex={0} />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-zinc-100 px-2 py-3 text-center text-xs text-zinc-500">
                    <span>index.html</span>
                    <span>styles.css</span>
                    <span>script.js</span>
                  </div>
                </div>
                <p>
                  右侧工作区支持预览、文件切换和复制源码，拖动中间分隔线可以调整宽度。
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-zinc-100 px-4 py-3 text-[15px] leading-6 text-zinc-900">
              产品介绍页加一个深色模式切换。
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <User aria-hidden="true" className="size-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 text-[15px] leading-7 text-zinc-700">
                <p>
                  已更新产品介绍页：导航栏加了「深色模式」切换按钮，CSS
                  增加了一组暗色变量，脚本里补充了切换逻辑。可以查看具体改动。
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                      <FileDiff aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-950">
                        {sampleHtmlArtifact.title}
                      </p>
                      <p className="text-xs text-zinc-500">v2 · 深色模式</p>
                    </div>
                    <CardOpenActions artifact={sampleHtmlArtifact} htmlSandbox="isolated" versionIndex={1} />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-zinc-100 px-2 py-3 text-center text-xs text-zinc-500">
                    <span>index.html</span>
                    <span>styles.css</span>
                    <span>script.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-zinc-100 px-4 py-3 text-[15px] leading-6 text-zinc-900">
              再来一个 React 版本的试试，要用到 npm 依赖。
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <User aria-hidden="true" className="size-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 text-[15px] leading-7 text-zinc-700">
                <p>
                  这次是一个 React 组件，通过 Sandpack 真实打包运行，安装了
                  canvas-confetti 这个 npm
                  依赖。代码可以直接编辑，预览会实时热更新。
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                      <Atom aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-950">
                        {sampleReactArtifact.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        React · canvas-confetti
                      </p>
                    </div>
                    <CardOpenActions artifact={sampleReactArtifact} versionIndex={0} />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-zinc-100 px-2 py-3 text-center text-xs text-zinc-500">
                    <span>App.js</span>
                    <span>components/</span>
                    <span>hooks/</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-zinc-100 px-4 py-3 text-[15px] leading-6 text-zinc-900">
              庆祝按钮加一个历史记录。
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <User aria-hidden="true" className="size-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 text-[15px] leading-7 text-zinc-700">
                <p>
                  已更新 React
                  组件：新增了 History 组件展示最近五次庆祝，useCelebration
                  里记录历史，样式同步补充。
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                      <Atom aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-950">
                        {sampleReactArtifact.title}
                      </p>
                      <p className="text-xs text-zinc-500">v2 · 庆祝历史</p>
                    </div>
                    <CardOpenActions artifact={sampleReactArtifact} versionIndex={1} />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-zinc-100 px-2 py-3 text-center text-xs text-zinc-500">
                    <span>History.js 新增</span>
                    <span>useCelebration.js</span>
                    <span>App.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-zinc-100 px-4 py-3 text-[15px] leading-6 text-zinc-900">
              历史记录加一个清空按钮。
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <User aria-hidden="true" className="size-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 text-[15px] leading-7 text-zinc-700">
                <p>
                  已更新 React
                  组件：在历史卡片标题旁加了「清空」按钮，useCelebration
                  里补充了 clearHistory。改动在 v2 的基础上。
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                      <FileDiff aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-950">
                        {sampleReactArtifact.title}
                      </p>
                      <p className="text-xs text-zinc-500">v3 · 清空历史</p>
                    </div>
                    <CardOpenActions artifact={sampleReactArtifact} versionIndex={2} />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-zinc-100 px-2 py-3 text-center text-xs text-zinc-500">
                    <span>History.js</span>
                    <span>useCelebration.js</span>
                    <span>App.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-zinc-100 px-4 py-3 text-[15px] leading-6 text-zinc-900">
              想看看流式生成的过程，从零写一个组件。
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <User aria-hidden="true" className="size-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 text-[15px] leading-7 text-zinc-700">
                <p>
                  好的，这就生成一个实时时钟组件。点下面的按钮可以看到代码逐步
                  写出来，生成完成后会自动打包运行。
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                      <Atom aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-950">
                        {sampleStreamArtifact.title}
                      </p>
                      <p className="text-xs text-zinc-500">React · 流式生成</p>
                    </div>
                    <GenerateButton artifact={sampleStreamArtifact} />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-zinc-100 px-2 py-3 text-center text-xs text-zinc-500">
                    <span>App.js</span>
                    <span>components/</span>
                    <span>styles.css</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-zinc-100 px-4 py-3 text-[15px] leading-6 text-zinc-900">
              再写个小看板,展示本周数据总计。
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <User aria-hidden="true" className="size-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 text-[15px] leading-7 text-zinc-700">
                <p>
                  生成了一个数据看板。
                  <span className="text-zinc-500">
                    (这个示例故意留了个 bug——脚本引用了未定义的变量,打开预览会
                    触发错误横幅,演示预览的运行时错误捕获。)
                  </span>
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                      <Code2 aria-hidden="true" className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-950">
                        {sampleErrorArtifact.title}
                      </p>
                      <p className="text-xs text-zinc-500">HTML · 含运行时报错</p>
                    </div>
                    <CardOpenActions
                      artifact={sampleErrorArtifact}
                      versionIndex={0}
                    />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-zinc-100 px-2 py-3 text-center text-xs text-zinc-500">
                    <span>index.html</span>
                    <span>styles.css</span>
                    <span>script.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm">
              <Bot aria-hidden="true" className="size-4" />
            </div>
            <p className="pt-1 text-sm text-zinc-500">
              这是静态交互样例，不会发送真实消息。
            </p>
          </div>
        </div>
      </ScrollShadow>

      <div className="shrink-0 border-t border-zinc-100 bg-white px-4 py-4 sm:px-6">
        <QuoteChip />
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <TextArea
            aria-label="消息输入框"
            className="min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none"
            placeholder="输入消息..."
            rows={1}
          />
          <Button
            aria-label="发送消息"
            isDisabled
            isIconOnly
            size="sm"
            variant="primary"
          >
            <ArrowUp aria-hidden="true" />
          </Button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-zinc-400">
          Sample UI · 未连接 AI 服务
        </p>
      </div>
    </section>
  );
}

function WorkspaceLayout() {
  // demo 侧状态(组件本体不依赖它,这里把值作为 props 喂给受控的 ArtifactWorkspace)。
  const { artifact, isOpen, openRequest, close, setQuote } = useArtifact();
  // 工作区(尤其 react kind 的 Sandpack 实例)较重,按断点只挂载一份;
  // ChatPanel 保持双挂载(成本低,且 SSR 渲染稳定)。
  const isDesktop = useIsDesktop();

  // demo 侧模拟流:openRequest.stream 时把目标 artifact 逐字播放成 streaming 态,
  // 播完返回 complete。真实接入这里直接换成后端流式数据。
  const shownArtifact = useSimulatedStream(
    artifact,
    openRequest.stream,
    openRequest.versionIndex,
    openRequest.id,
  );

  // key=openRequest.id:每次 open()(含同一 artifact 再次打开)重挂工作区,
  // 让 initialView/initialShowDiff 按本次打开意图重新生效。
  const workspace =
    isOpen && shownArtifact ? (
      <ArtifactWorkspace
        artifact={shownArtifact}
        htmlSandbox={openRequest.htmlSandbox}
        initialShowDiff={openRequest.showDiff}
        initialView={openRequest.view}
        key={openRequest.id}
        onClose={close}
        onQuote={setQuote}
        versionIndex={openRequest.versionIndex}
      />
    ) : null;

  return (
    <main className="h-dvh min-h-[560px] overflow-hidden bg-white text-zinc-950">
      <ToastProvider placement="bottom end" />

      <div className="hidden h-full md:block">
        {/* Group 与 chat Panel 始终挂载,只条件渲染分隔条 + artifact 面板,
            避免打开/关闭时 ChatPanel 重新挂载导致滚动位置丢失。 */}
        <Group
          className="h-full"
          defaultLayout={{ artifact: 58, chat: 42 }}
          orientation="horizontal"
        >
          <Panel id="chat" minSize="320px">
            <ChatPanel />
          </Panel>
          {workspace && isDesktop ? (
            <>
              <Separator className="group relative w-px bg-zinc-200 outline-none transition-colors focus-visible:bg-zinc-500 data-[separator=hover]:bg-zinc-400 data-[separator=active]:bg-zinc-500">
                <span className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2" />
                <span className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
              </Separator>
              <Panel id="artifact" minSize="420px">
                {workspace}
              </Panel>
            </>
          ) : null}
        </Group>
      </div>

      <div className="h-full md:hidden">
        <ChatPanel />
        {workspace && !isDesktop ? (
          <div className="fixed inset-0 z-50 bg-white">{workspace}</div>
        ) : null}
      </div>
    </main>
  );
}

export function ChatWorkspace() {
  return (
    <ArtifactProvider>
      <WorkspaceLayout />
    </ArtifactProvider>
  );
}
