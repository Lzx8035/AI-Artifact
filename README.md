# Artifact 对话示例

一个静态的、Claude 风格的「对话 + Artifact 工作区」演示。左侧是模拟对话,右侧是可预览、可看源码的 Artifact 工作区,中间分隔线可拖拽调整宽度。**不连接任何 AI 服务**——所有内容来自本地样例数据。

支持两种 artifact(两档预览方案):

| kind    | 预览方式                                        | 适用             | 样例                            |
| ------- | ----------------------------------------------- | ---------------- | ------------------------------- |
| `html`  | 自装配 `<iframe srcDoc>`,无在线沙箱             | 静态 HTML/CSS/JS | 产品介绍页                      |
| `react` | **Sandpack** 真实打包(npm 依赖、可编辑、热更新) | React + npm 依赖 | React 庆祝按钮(canvas-confetti) |

## 技术栈

- **Next.js 16** (App Router) + **React 19**
- **HeroUI** — 按钮、Tabs、Tooltip、Toast 等组件
- **react-resizable-panels** — 可拖拽的左右分栏
- **prism-react-renderer** — html artifact 代码视图的语法高亮
- **@codesandbox/sandpack-react** — react artifact 的打包预览与可编辑代码
- **diff**(jsdiff)— 版本间差异的实时计算(自绘 GitHub 风格 unified 视图)
- **Tailwind CSS 4**

html 档预览不依赖任何在线沙箱:把 `{ html, css, js }` 装配成单个文档,渲染进 `sandbox="allow-scripts"` 的 `<iframe srcDoc>`。react 档则交给 Sandpack:npm 依赖真实安装打包,代码 Tab 可直接编辑、预览实时热更新。

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。点击对话中的「查看代码」即可打开右侧工作区,在「预览」和「代码」之间切换。

## 目录结构

```
src/
├─ app/
│  ├─ layout.tsx              # 根布局 + 全局 metadata
│  ├─ page.tsx                # 渲染 <ChatWorkspace />
│  └─ globals.css             # 全局样式
├─ components/
│  ├─ chat-workspace.tsx       # 【demo 侧】整体布局:对话 + 分栏 + 喂数据给工作区
│  └─ artifact/                # 【组件侧】受控、不依赖 demo 状态,可独立接入
│     ├─ index.ts              # 对外 API:导出 ArtifactWorkspace + 类型
│     ├─ workspace.tsx         # 受控外壳:props 驱动,顶栏 + 预览/代码切换,按 kind 分发
│     ├─ html/
│     │  ├─ preview.tsx        # html 档预览面板:地址栏 + 刷新/新窗口 + iframe
│     │  └─ code.tsx           # html 档代码面板:文件列表 + 复制 + prism 高亮
│     ├─ react/
│     │  └─ panes.tsx          # react 档双面板:Sandpack 打包预览 + 文件树 + 可编辑代码
│     ├─ diff-view.tsx         # GitHub 风格 unified diff(M/A/D 徽章、红绿行)
│     ├─ diff-toggle.tsx       # 「查看本次改动 / 返回代码」开关按钮
│     ├─ file-tree-toggle.tsx  # 文件列表显隐按钮(⌘B)
│     ├─ streaming-view.tsx    # 流式生成期间的统一视图(代码渐增 + 预览占位)
│     ├─ code-block.tsx        # 共享的只读 prism 代码块(html 代码视图 + 流式视图)
│     ├─ error-boundary.tsx    # 兜住面板渲染崩溃的降级 UI
│     └─ icon-button.tsx       # 共享的图标按钮(带 Tooltip)
├─ hooks/
│  ├─ use-artifact.tsx         # 【demo 侧】打开/关闭 + 当前 artifact + 打开意图
│  ├─ use-simulated-stream.ts  # 【demo 侧】把样例逐字播成流式(真实接入换后端流)
│  └─ use-is-desktop.ts        # md 断点检测,保证工作区只挂载一份
└─ lib/
   ├─ artifact.ts              # Artifact 数据模型(html | react 联合,versions 快照)
   ├─ build-preview.ts         # 把 { html, css, js } 装配成预览文档(html 档)
   ├─ diff.ts                  # jsdiff 封装:两版文件映射 → 每文件的 diff 行
   └─ sample/
      ├─ html-demo.ts          # html 样例(v1 + v2 两个版本)
      ├─ focus-html/css/js.ts  # html 样例 v1 源码
      ├─ focus-v2-*.ts         # html 样例 v2 源码(深色模式)
      ├─ react-demo.ts         # react 样例(v1 + v2 + v3,多目录 + npm 依赖)
      ├─ stream-demo.ts        # 流式生成 demo 样例(实时时钟,单版本)
      └─ error-demo.ts         # 错误态 demo 样例(故意留运行时 bug)
```

## 数据模型

artifact 是一个按 `kind` 区分的联合类型,**按版本存全量快照**(最后一项 = 当前版本):

```ts
type HtmlArtifact = {
  kind: "html";
  title: string;
  versions: Array<{ html: string; css: string; js: string }>;
};

type ReactArtifact = {
  kind: "react";
  title: string;
  versions: Array<Record<string, string>>; // Sandpack 文件快照,如 "/App.js"
  dependencies?: Record<string, string>; // npm 依赖
};

type Artifact = HtmlArtifact | ReactArtifact;
```

两档都可带 `status?: "streaming" | "complete"`(缺省 complete):`streaming` 时工作区显示「生成中」——代码逐步出现、预览占位,react 档的 Sandpack 待完成后才挂载。

## 作为组件接入

`components/artifact/` 是**受控组件,不依赖任何 demo 状态**(对话、`useArtifact` 都在 demo 侧)。接入方拿到 `Artifact` 数据、自己管打开/关闭即可,组件本体无需改动:

```tsx
import { ArtifactWorkspace, type Artifact } from "@/components/artifact";

<ArtifactWorkspace
  artifact={artifact} // 数据由外部喂(后端 / 流)
  onClose={() => setOpen(false)} // 关闭回调
  versionIndex={1} // 可选:定位到某个版本(默认最新版)
  initialView="code" // 可选:初始视图(默认 preview)
  initialShowDiff // 可选:打开即展开 diff 审阅
  htmlSandbox="isolated" // 可选:html 预览的初始隔离模式(默认 inline)
/>;
```

- 「再次打开时重置到某视图/版本」由调用方控制——给组件一个变化的 `key` 触发重挂即可(demo 里用 `openRequest.id`)。
- 预览/代码/diff 都相对 `versionIndex` 计算;`versionIndex > 0` 时 diff 开关才出现。
- demo 侧的 [`use-artifact.tsx`](src/hooks/use-artifact.tsx) 只是这个演示用来管"当前打开哪个 artifact"的状态;真实产品换成自己的状态管理即可。

## Diff 审阅

模拟「AI 修改已有代码」的场景:聊天里的 v2 卡片点「查看改动」会直接打开 **GitHub 风格的 unified diff**(红/绿行、M/A/D 文件徽章、`+x −y` 计数)。

- **存储 = 快照,diff = 实时计算**:版本只存完整文件,差异由 jsdiff 在打开时按行算出,不持久化。
- **默认显示干净的最新代码**:diff 是代码工具栏上按需进入的审阅模式;预览永远运行最新版本。
- react 档的 diff 对比的是版本快照(「AI 本次改动」),与编辑器里的实时编辑无关。

html 档的 `buildPreviewDocument()` 采用**注入式**装配:把 `<style>` 注入到 `</head>` 前、`<script>` 注入到 `</body>` 前(并转义内联脚本里的 `</script>`)。因此 `html` 字段无需自己引用样式/脚本文件。

要换预览内容:html 样例改 [`src/lib/sample/`](src/lib/sample) 下的 `focus-*.ts`;react 样例改 [`react-demo.ts`](src/lib/sample/react-demo.ts)(文件与依赖都在里面)。

## 预览隔离与隐私

预览不可信的 AI 生成代码时,隔离很重要。本组件提供两档,**由集成方通过 `htmlSandbox` prop 决定**——运行时只在工具栏只读展示当前状态(已隔离 / 未隔离),**不提供切换**:能关闭隔离的 UI 本身就是降级 footgun(可被诱导关掉保护),隔离与否应取决于内容可信度,由接入方在数据/接入层判定:

| 模式           | 做法                                                                                       | 适用                               |
| -------------- | ------------------------------------------------------------------------------------------ | ---------------------------------- |
| `inline`(默认) | `srcDoc` + `sandbox="allow-scripts"`(opaque origin,无 `allow-same-origin`)                 | 可信内容,加载快                    |
| `isolated`     | 额外注入严格 CSP:`default-src 'none'` 切断一切外联(脚本无法 fetch/上报、外部字体/图片被拦) | 不可信代码——跑得起来但「连不出去」 |

**实现方式**:两档都是同一个 `<iframe srcDoc>`,隔离靠两层叠加——

1. **iframe `sandbox="allow-scripts"`**(两档都有):内容处于 opaque origin,脚本能跑但碰不到我们页面的 DOM / cookie / localStorage,也禁了表单提交、弹窗、顶层跳转。这是「进不来」的一层。
2. **注入的 CSP `<meta>`**(仅 isolated):由 [`buildPreviewDocument()`](src/lib/build-preview.ts) 在装配文档时往 `<head>` 注入 `default-src 'none'; …`,切断一切网络出口。这是「出不去」的一层。

即:`inline` = iframe sandbox;`isolated` = iframe sandbox **+** CSP。

**为什么只有 html 需要这个开关**:html 档把 AI 代码直接跑在**我们自己页面 origin** 的 iframe 里,所以得我们主动用 CSP 切断它的外联(否则脚本能 fetch 上报、外联打点)。react 档的代码则跑在 Sandpack **独立跨域 iframe**(codesandbox 的打包域)里,浏览器同源策略天然把它和我们的应用隔开,无需我们再加 CSP——代价是代码被发去远程打包(见下面的隐私红线)。

**仍需注意的边界**:

- 两档都跑在同一页面 origin 的 iframe 里。要做到**真正的跨 origin 隔离**(连 cookie/localStorage 都摸不到),生产应把预览部署到**独立子域名**(如 `preview.yourapp.com`),本组件在单页内无法替代部署层。
- 「在新窗口打开」走 blob URL(opaque origin),已比同源页面更隔离;因此本项目**未**做同源 `/preview` 路由(那样反而是安全剧场)。
- **react 档的隐私红线**:Sandpack 把代码发往 **codesandbox.io 的远程打包服务**——即代码会离开浏览器。涉敏场景请仅对可信内容启用,或自托管 `sandpack-bundler`。

## 错误态

- **html 预览运行时错误**:[`buildPreviewDocument()`](src/lib/build-preview.ts) 往文档注入错误捕获脚本(`window.onerror` / `unhandledrejection`),iframe 内的报错 `postMessage` 回父窗口,预览底部弹红色横幅(可关闭;刷新/换内容自动清除)。postMessage 不受 CSP 约束,隔离模式下同样工作。
- **react 编译/运行时错误**:由 Sandpack 自带的错误覆盖层呈现(默认开启,未关闭)。
- **渲染崩溃兜底**:工作区主体包了 [`ArtifactErrorBoundary`](src/components/artifact/error-boundary.tsx),面板(Sandpack/prism/diff)若抛错退化成降级 UI + 重试,顶栏关闭按钮仍可用,不会整页白屏。

## 快捷键

| 快捷键          | 作用                                   |
| --------------- | -------------------------------------- |
| `⌘B` / `Ctrl+B` | 在代码视图切换文件列表显隐             |
| `Esc`           | 关闭工作区(焦点在代码编辑器内时不触发) |

## 说明 / 边界

- 这是一个**前端静态示例**,对话不会发送真实请求。(预览隔离与隐私见上一节。)
- react 档依赖 Sandpack 的
  远程打包服务:离线或网络受限时 react 预览会加载失败或很慢(html 档不受影响),首次打包期间预览区会显示加载动画。
- `next.config.ts` 中**关闭了 `reactStrictMode`**:开发模式下 StrictMode 的双挂载会与 Sandpack 客户端生命周期产生竞态(iframe 被重复加载后与打包客户端脱钩,表现为预览白屏)。如需重新开启,请先验证 react 预览仍正常。

## 命令

| 命令            | 作用           |
| --------------- | -------------- |
| `npm run dev`   | 启动开发服务器 |
| `npm run build` | 生产构建       |
| `npm run start` | 运行生产构建   |
| `npm run lint`  | ESLint 检查    |
