import type { HtmlFiles } from "@/lib/artifact";

/**
 * 把 { html, css, js } 装配成单个可预览的 HTML 文档。
 *
 * 不依赖 html 里是否引用了样式/脚本——我们自己负责注入,因此比"用正则
 * 剥离已有 <link>/<script>"稳健得多:
 *   - <style> 注入到 </head> 前(没有 </head> 就前置到文档最前)
 *   - <script> 注入到 </body> 前(没有 </body> 就追加到文档末尾)
 */
export function buildPreviewDocument(files: HtmlFiles): string {
  const { html, css, js } = files;

  // 防止内联脚本里的 </script> 提前闭合外层 <script> 标签。
  const safeJs = js.replace(/<\/script/gi, "<\\/script");

  const styleTag = css ? `<style>${css}</style>` : "";
  const scriptTag = safeJs ? `<script>${safeJs}</script>` : "";

  let document = html;

  if (styleTag) {
    document = document.includes("</head>")
      ? document.replace("</head>", `${styleTag}</head>`)
      : `${styleTag}${document}`;
  }

  if (scriptTag) {
    document = document.includes("</body>")
      ? document.replace("</body>", `${scriptTag}</body>`)
      : `${document}${scriptTag}`;
  }

  return document;
}
