export type HtmlFiles = {
  html: string;
  css: string;
  js: string;
};

export type ReactFiles = Record<string, string>;

/** 生成状态:streaming = 代码还在逐步到达;缺省/complete = 已完成。 */
export type ArtifactStatus = "streaming" | "complete";

export type HtmlArtifact = {
  kind: "html";
  title: string;
  /** 全量快照,按时间顺序;最后一项 = 当前版本。 */
  versions: HtmlFiles[];
  status?: ArtifactStatus;
};

export type ReactArtifact = {
  kind: "react";
  title: string;
  /** 全量快照(Sandpack files 映射),最后一项 = 当前版本。 */
  versions: ReactFiles[];
  dependencies?: Record<string, string>;
  status?: ArtifactStatus;
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

function languageOf(name: string): ArtifactLanguage {
  if (name.endsWith(".css")) return "css";
  if (name.endsWith(".html")) return "markup";
  return "javascript";
}

/** 取某版本的文件列表(两档同构,供流式视图统一渲染)。 */
export function versionFiles(artifact: Artifact, index: number): ArtifactFile[] {
  if (artifact.kind === "html") {
    return toFiles(artifact.versions[index]);
  }
  return Object.entries(artifact.versions[index]).map(([path, code]) => ({
    name: path.replace(/^\//, ""),
    language: languageOf(path),
    code,
  }));
}
