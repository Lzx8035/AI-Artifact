export type HtmlFiles = {
  html: string;
  css: string;
  js: string;
};

export type ReactFiles = Record<string, string>;

export type HtmlArtifact = {
  kind: "html";
  title: string;
  /** 全量快照,按时间顺序;最后一项 = 当前版本。 */
  versions: HtmlFiles[];
};

export type ReactArtifact = {
  kind: "react";
  title: string;
  /** 全量快照(Sandpack files 映射),最后一项 = 当前版本。 */
  versions: ReactFiles[];
  dependencies?: Record<string, string>;
};

export type Artifact = HtmlArtifact | ReactArtifact;

export type ArtifactLanguage = "markup" | "css" | "javascript";

export type ArtifactFile = {
  name: string;
  language: ArtifactLanguage;
  code: string;
};

export function currentVersion<T>(versions: T[]): T {
  return versions[versions.length - 1];
}

export function previousVersion<T>(versions: T[]): T | null {
  return versions.length > 1 ? versions[versions.length - 2] : null;
}

export function toFiles(files: HtmlFiles): ArtifactFile[] {
  return [
    { name: "index.html", language: "markup", code: files.html },
    { name: "styles.css", language: "css", code: files.css },
    { name: "script.js", language: "javascript", code: files.js },
  ];
}

/** html 三元组转统一的 name → code 映射(diff 计算用,与 react 档同构)。 */
export function toFileMap(files: HtmlFiles): Record<string, string> {
  return {
    "index.html": files.html,
    "styles.css": files.css,
    "script.js": files.js,
  };
}
