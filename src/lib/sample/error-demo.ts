import type { HtmlArtifact } from "@/lib/artifact";

// 故意留了个运行时 bug(引用未定义的 stats),用于演示预览的错误捕获横幅。
export const sampleErrorArtifact: HtmlArtifact = {
  kind: "html",
  title: "数据看板",
  versions: [
    {
      html: `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>数据看板</title>
  </head>
  <body>
    <main class="board">
      <h1>本周数据</h1>
      <p class="total">总计:<span id="total">—</span></p>
    </main>
  </body>
</html>`,
      css: `body {
  margin: 0;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #18181b;
}

.board {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

h1 {
  font-size: 28px;
  font-weight: 600;
}

.total {
  color: #71717a;
  font-size: 16px;
}`,
      // bug:stats 未定义,加载时即抛 ReferenceError。
      js: `const total = stats.reduce((sum, n) => sum + n, 0);
document.querySelector("#total").textContent = total;`,
    },
  ],
};
