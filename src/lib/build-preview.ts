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
 * 注入到预览文档最前面的错误捕获:把运行时错误/未处理拒绝 postMessage 回父窗口,
 * 由 HtmlPreview 展示错误横幅。postMessage 不受 CSP 约束,沙箱 iframe 也能发给 parent。
 */
const ERROR_CATCHER = `<script>(function(){
  function report(msg){try{parent.postMessage({source:"artifact-preview",error:String(msg)},"*");}catch(e){}}
  window.addEventListener("error",function(e){report(e.message||(e.error&&e.error.message)||"运行时错误");});
  window.addEventListener("unhandledrejection",function(e){var r=e.reason;report("未处理的 Promise 拒绝: "+(r&&r.message?r.message:r));});
})();</script>`;

/** 入口 html:优先 index.html,否则取第一个 .html 文件,再没有则空文档。 */
function entryHtml(files: HtmlFiles): string {
  if (files["index.html"] !== undefined) {
    return files["index.html"];
  }
  const htmlKey = Object.keys(files)
    .sort()
    .find((name) => name.endsWith(".html"));
  return htmlKey ? files[htmlKey] : "";
}

/**
 * 把 html 档的文件树(路径 → 代码)装配成单个可预览的 HTML 文档。
 *
 * 沿用"注入式"装配,不依赖 html 里是否引用了样式/脚本——我们自己负责注入,
 * 因此比"用正则剥离已有 <link>/<script>"稳健得多:
 *   - 入口取 index.html(见 entryHtml)
 *   - 所有 .css 文件(按路径排序)各自包成 <style> 注入 </head> 前
 *   - 所有 .js 文件(按路径排序)各自包成 <script> 注入 </body> 前
 *   - 没有 </head>/</body> 时分别前置/追加
 *
 * isolated=true 时额外注入严格 CSP,切断外联(见 ISOLATED_CSP)。
 */
export function buildPreviewDocument(
  files: HtmlFiles,
  options?: { isolated?: boolean },
): string {
  const names = Object.keys(files).sort();

  const styleTags = names
    .filter((name) => name.endsWith(".css") && files[name])
    .map((name) => `<style>${files[name]}</style>`)
    .join("");

  const scriptTags = names
    .filter((name) => name.endsWith(".js") && files[name])
    // 防止内联脚本里的 </script> 提前闭合外层 <script> 标签。
    .map((name) => `<script>${files[name].replace(/<\/script/gi, "<\\/script")}</script>`)
    .join("");

  const cspTag = options?.isolated
    ? `<meta http-equiv="Content-Security-Policy" content="${ISOLATED_CSP}" />`
    : "";

  // CSP 必须最先生效;错误捕获要早于用户脚本注册;最后才是样式。
  const headInjection = `${cspTag}${ERROR_CATCHER}${styleTags}`;

  let document = entryHtml(files);

  if (headInjection) {
    document = document.includes("</head>")
      ? document.replace("</head>", `${headInjection}</head>`)
      : `${headInjection}${document}`;
  }

  if (scriptTags) {
    document = document.includes("</body>")
      ? document.replace("</body>", `${scriptTags}</body>`)
      : `${document}${scriptTags}`;
  }

  return document;
}
