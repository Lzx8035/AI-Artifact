"use client";

import {
  ArrowUp,
  Atom,
  Bot,
  Code2,
  FileDiff,
  Menu,
  Plus,
  Sparkles,
  User,
} from "lucide-react";
import { Button, ScrollShadow, TextArea, ToastProvider } from "@heroui/react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { ArtifactWorkspace } from "@/components/artifact/workspace";
import { ArtifactProvider, useArtifact } from "@/hooks/use-artifact";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import type { Artifact } from "@/lib/artifact";
import { sampleHtmlArtifact } from "@/lib/sample/html-demo";
import { sampleReactArtifact } from "@/lib/sample/react-demo";

/**
 * 卡片右侧的打开按钮组:「预览 / 代码」,v2 卡片追加「改动」(直达 diff)。
 * 点哪个就打开到哪个视图。
 */
function CardOpenActions({
  artifact,
  withDiff = false,
}: {
  artifact: Artifact;
  withDiff?: boolean;
}) {
  const { open } = useArtifact();
  const itemClass =
    "px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950";

  return (
    <div className="inline-flex shrink-0 overflow-hidden rounded-lg border border-zinc-200">
      <button
        className={itemClass}
        onClick={() => open(artifact)}
        type="button"
      >
        预览
      </button>
      <button
        className={`${itemClass} border-l border-zinc-200`}
        onClick={() => open(artifact, { view: "code" })}
        type="button"
      >
        代码
      </button>
      {withDiff ? (
        <button
          className={`${itemClass} border-l border-zinc-200`}
          onClick={() => open(artifact, { showDiff: true })}
          type="button"
        >
          改动
        </button>
      ) : null}
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
              <div className="flex flex-col gap-3 text-[15px] leading-7 text-zinc-700">
                <p>
                  已经为你生成了一个静态产品介绍页。页面使用原生 HTML、CSS 和
                  JavaScript，可以直接预览并查看每个文件。
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
                    <CardOpenActions artifact={sampleHtmlArtifact} />
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
                    <CardOpenActions artifact={sampleReactArtifact} />
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
                    <CardOpenActions artifact={sampleHtmlArtifact} withDiff />
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
                  里记录历史，样式同步补充。可以查看具体改动。
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
                      <p className="text-xs text-zinc-500">v2 · 庆祝历史</p>
                    </div>
                    <CardOpenActions artifact={sampleReactArtifact} withDiff />
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
  const { isOpen } = useArtifact();
  // 工作区(尤其 react kind 的 Sandpack 实例)较重,按断点只挂载一份;
  // ChatPanel 保持双挂载(成本低,且 SSR 渲染稳定)。
  const isDesktop = useIsDesktop();

  return (
    <main className="h-dvh min-h-[560px] overflow-hidden bg-white text-zinc-950">
      <ToastProvider placement="bottom end" />

      <div className="hidden h-full md:block">
        {isOpen && isDesktop ? (
          <Group
            className="h-full"
            defaultLayout={{ artifact: 58, chat: 42 }}
            orientation="horizontal"
          >
            <Panel id="chat" minSize="320px">
              <ChatPanel />
            </Panel>
            <Separator className="group relative w-px bg-zinc-200 outline-none transition-colors focus-visible:bg-zinc-500 data-[separator=hover]:bg-zinc-400 data-[separator=active]:bg-zinc-500">
              <span className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2" />
              <span className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            </Separator>
            <Panel id="artifact" minSize="420px">
              <ArtifactWorkspace />
            </Panel>
          </Group>
        ) : (
          <ChatPanel />
        )}
      </div>

      <div className="h-full md:hidden">
        <ChatPanel />
        {isOpen && !isDesktop ? (
          <div className="fixed inset-0 z-50 bg-white">
            <ArtifactWorkspace />
          </div>
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
