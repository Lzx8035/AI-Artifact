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
    { html: focusHtml, css: focusCss, js: focusJs },
    // v2:AI 应用户要求加入深色模式切换
    { html: focusV2Html, css: focusV2Css, js: focusV2Js },
  ],
};
