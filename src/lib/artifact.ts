/** html 档文件树:相对路径 → 代码(如 "index.html"、"styles.css"、"css/theme.css")。
 *  与 react 档同构,支持任意数量/层级的文件。 */
export type HtmlFiles = Record<string, string>;

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
  return Object.entries(files).map(([path, code]) => ({
    name: path.replace(/^\//, ""),
    language: languageOf(path),
    code,
  }));
}

function languageOf(name: string): ArtifactLanguage {
  if (name.endsWith(".css")) return "css";
  if (name.endsWith(".html")) return "markup";
  return "javascript";
}

/** 取某版本的文件列表(两档同构,供流式视图统一渲染)。 */
export function versionFiles(artifact: Artifact, index: number): ArtifactFile[] {
  return toFiles(artifact.versions[index]);
}
