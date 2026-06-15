import type { HtmlArtifact } from "@/lib/artifact";
import { focusHtml } from "@/lib/sample/focus-html";
import { focusCss } from "@/lib/sample/focus-css";
import { focusJs } from "@/lib/sample/focus-js";
import { focusV2Html } from "@/lib/sample/focus-v2-html";
import { focusV2Css } from "@/lib/sample/focus-v2-css";
import { focusV2Js } from "@/lib/sample/focus-v2-js";

export const sampleHtmlArtifact: HtmlArtifact = {
  kind: "html",
  title: "产品介绍页",
  versions: [
    // v1:初始版本
    { "index.html": focusHtml, "styles.css": focusCss, "script.js": focusJs },
    // v2:AI 应用户要求加入深色模式切换
    {
      "index.html": focusV2Html,
      "styles.css": focusV2Css,
      "script.js": focusV2Js,
    },
  ],
};
