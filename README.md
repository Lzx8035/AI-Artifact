# Artifact 对话示例

一个静态的、Claude 风格的「对话 + Artifact 工作区」演示。左侧是模拟对话,右侧是可预览、可看源码的 Artifact 工作区,中间分隔线可拖拽调整宽度。**不连接任何 AI 服务**——所有内容来自本地样例数据。

## 技术栈

- **Next.js 16** (App Router) + **React 19**
- **HeroUI** —  按钮、Tabs、Tooltip、Toast 等组件
- **react-resizable-panels** — 可拖拽的左右分栏
- **prism-react-renderer** — 代码视图的语法高亮
- **Tailwind CSS 4**

预览不依赖任何在线沙箱:把 artifact 的 `{ html, css, js }` 装配成单个文档,渲染进一个 `sandbox="allow-scripts"` 的 `<iframe srcDoc>`。

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
│  ├─ chat-workspace.tsx      # 整体布局:对话面板 + 分栏 + 工作区(桌面/移动端)
│  └─ artifact-workspace.tsx  # Artifact 工作区:预览 iframe + prism 代码视图
├─ hooks/
│  └─ use-artifact.tsx        # 面板开关 + 当前 artifact 的状态(Context + hook)
└─ lib/
   ├─ artifact.ts             # WebArtifact 数据模型 + toFiles()
   ├─ build-preview.ts        # 把 { html, css, js } 装配成预览文档
   └─ sample-artifact.ts      # 样例 artifact 数据
```

## 数据模型

一个 artifact 就是一段静态网页:

```ts
type WebArtifact = {
  title: string;
  html: string;
  css: string;
  js: string;
};
```

`buildPreviewDocument()` 采用**注入式**装配:把 `<style>` 注入到 `</head>` 前、`<script>` 注入到 `</body>` 前(并转义内联脚本里的 `</script>`)。因此 `html` 字段无需自己引用样式/脚本文件。

要换预览内容,改 [`src/lib/sample-artifact.ts`](src/lib/sample-artifact.ts) 即可。

## 说明 / 边界

- 这是一个**前端静态示例**,对话不会发送真实请求。
- iframe 沙箱当前为 `allow-scripts`,适合可信样例。若要运行不可信代码,建议升级为 blob URL 或独立子域名做隔离。

## 命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 运行生产构建 |
| `npm run lint` | ESLint 检查 |
