import type { HtmlFiles } from "@/lib/artifact";

/**
 * 隔离模式的 CSP:default-src 'none' 切断一切外联(脚本无法 fetch/上报、
 * 无法加载外部字体/图片),只允许我们自己注入的内联 style/script 与 data/blob 资源。
 * 适合预览不可信的 AI 生成代码——它跑得起来,但「连不出去」。
 */
const ISOLATED_CSP =
  "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; " +
  "img-src data: blob:; font-src data:; connect-src 'none'; form-action 'none'";

/**
 * 把 { html, css, js } 装配成单个可预览的 HTML 文档。
 *
 * 不依赖 html 里是否引用了样式/脚本——我们自己负责注入,因此比"用正则
 * 剥离已有 <link>/<script>"稳健得多:
 *   - <style> 注入到 </head> 前(没有 </head> 就前置到文档最前)
 *   - <script> 注入到 </body> 前(没有 </body> 就追加到文档末尾)
 *
 * isolated=true 时额外注入严格 CSP,切断外联(见 ISOLATED_CSP)。
 */
export function buildPreviewDocument(
  files: HtmlFiles,
  options?: { isolated?: boolean },
): string {
  const { html, css, js } = files;

  // 防止内联脚本里的 </script> 提前闭合外层 <script> 标签。
  const safeJs = js.replace(/<\/script/gi, "<\\/script");

  const cspTag = options?.isolated
    ? `<meta http-equiv="Content-Security-Policy" content="${ISOLATED_CSP}" />`
    : "";
  const styleTag = css ? `<style>${css}</style>` : "";
  const scriptTag = safeJs ? `<script>${safeJs}</script>` : "";

  // CSP 必须在任何外联资源之前生效,放 <head> 最前(没有 </head> 就前置)。
  const headInjection = `${cspTag}${styleTag}`;

  let document = html;

  if (headInjection) {
    document = document.includes("</head>")
      ? document.replace("</head>", `${headInjection}</head>`)
      : `${headInjection}${document}`;
  }

  if (scriptTag) {
    document = document.includes("</body>")
      ? document.replace("</body>", `${scriptTag}</body>`)
      : `${document}${scriptTag}`;
  }

  return document;
}
