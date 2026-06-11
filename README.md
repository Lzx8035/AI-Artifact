# Artifact 对话示例

一个静态的、Claude 风格的「对话 + Artifact 工作区」演示。左侧是模拟对话,右侧是可预览、可看源码的 Artifact 工作区,中间分隔线可拖拽调整宽度。**不连接任何 AI 服务**——所有内容来自本地样例数据。

支持两种 artifact(两档预览方案):

| kind | 预览方式 | 适用 | 样例 |
|---|---|---|---|
| `web` | 自装配 `<iframe srcDoc>`,无在线沙箱 | 静态 HTML/CSS/JS | 产品介绍页 |
| `react` | **Sandpack** 真实打包(npm 依赖、可编辑、热更新) | React + npm 依赖 | React 庆祝按钮(canvas-confetti) |

## 技术栈

- **Next.js 16** (App Router) + **React 19**
- **HeroUI** —  按钮、Tabs、Tooltip、Toast 等组件
- **react-resizable-panels** — 可拖拽的左右分栏
- **prism-react-renderer** — web artifact 代码视图的语法高亮
- **@codesandbox/sandpack-react** — react artifact 的打包预览与可编辑代码
- **Tailwind CSS 4**

web 档预览不依赖任何在线沙箱:把 `{ html, css, js }` 装配成单个文档,渲染进 `sandbox="allow-scripts"` 的 `<iframe srcDoc>`。react 档则交给 Sandpack:npm 依赖真实安装打包,代码 Tab 可直接编辑、预览实时热更新。

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
│  ├─ chat-workspace.tsx       # 整体布局:对话面板 + 分栏 + 工作区(桌面/移动端)
│  ├─ artifact-workspace.tsx   # 工作区外壳:顶栏 + 预览/代码切换,按 kind 分发面板
│  ├─ artifact-preview.tsx     # web 预览面板:地址栏 + 刷新/新窗口 + iframe
│  ├─ artifact-code.tsx        # web 代码面板:文件切换 + 复制 + prism 高亮
│  ├─ artifact-react.tsx       # react 面板:Sandpack 打包预览 + 可编辑代码
│  └─ artifact-icon-button.tsx # 共享的图标按钮(带 Tooltip)
├─ hooks/
│  ├─ use-artifact.tsx         # 面板开关 + 当前 artifact 的状态(Context + hook)
│  └─ use-is-desktop.ts        # md 断点检测,保证工作区只挂载一份
└─ lib/
   ├─ artifact.ts              # Artifact 数据模型(web | react 联合)+ toFiles()
   ├─ build-preview.ts         # 把 { html, css, js } 装配成预览文档(web 档)
   ├─ sample-artifact.ts       # web 样例(组装 sample/ 下三段源码)
   └─ sample/
      ├─ focus-html.ts         # web 样例页面 HTML
      ├─ focus-css.ts          # web 样例页面 CSS
      ├─ focus-js.ts           # web 样例页面 JS
      └─ react-demo.ts         # react 样例(Sandpack 文件 + npm 依赖)
```

## 数据模型

artifact 是一个按 `kind` 区分的联合类型:

```ts
type WebArtifact = {
  kind: "web";
  title: string;
  html: string;
  css: string;
  js: string;
};

type ReactArtifact = {
  kind: "react";
  title: string;
  files: Record<string, string>;          // Sandpack 文件,如 "/App.js"
  dependencies?: Record<string, string>;  // npm 依赖
};

type Artifact = WebArtifact | ReactArtifact;
```

web 档的 `buildPreviewDocument()` 采用**注入式**装配:把 `<style>` 注入到 `</head>` 前、`<script>` 注入到 `</body>` 前(并转义内联脚本里的 `</script>`)。因此 `html` 字段无需自己引用样式/脚本文件。

要换预览内容:web 样例改 [`src/lib/sample/`](src/lib/sample) 下的 `focus-*.ts`;react 样例改 [`react-demo.ts`](src/lib/sample/react-demo.ts)(文件与依赖都在里面)。

## 说明 / 边界

- 这是一个**前端静态示例**,对话不会发送真实请求。
- web 档 iframe 沙箱为 `allow-scripts`,适合可信样例。若要运行不可信代码,建议升级为 blob URL 或独立子域名做隔离。
- react 档依赖 Sandpack 的**远程打包服务**(codesandbox.io):离线或网络受限时 react 预览会加载失败或很慢;web 档不受影响。首次打包期间预览区会显示加载动画。
- `next.config.ts` 中**关闭了 `reactStrictMode`**:开发模式下 StrictMode 的双挂载会与 Sandpack 客户端生命周期产生竞态(iframe 被重复加载后与打包客户端脱钩,表现为预览白屏)。如需重新开启,请先验证 react 预览仍正常。

## 命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 运行生产构建 |
| `npm run lint` | ESLint 检查 |
