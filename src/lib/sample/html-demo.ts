import type { HtmlArtifact } from "@/lib/artifact";
import { focusHtml } from "@/lib/sample/focus-html";
import { focusCss } from "@/lib/sample/focus-css";
import { focusJs } from "@/lib/sample/focus-js";

export const sampleHtmlArtifact: HtmlArtifact = {
  kind: "html",
  title: "产品介绍页",
  html: focusHtml,
  css: focusCss,
  js: focusJs,
};
