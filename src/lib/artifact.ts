export type WebArtifact = {
  kind: "web";
  title: string;
  html: string;
  css: string;
  js: string;
};

export type ReactArtifact = {
  kind: "react";
  title: string;
  files: Record<string, string>;
  dependencies?: Record<string, string>;
};

export type Artifact = WebArtifact | ReactArtifact;

export type ArtifactLanguage = "markup" | "css" | "javascript";

export type ArtifactFile = {
  name: string;
  language: ArtifactLanguage;
  code: string;
};

export function toFiles(artifact: WebArtifact): ArtifactFile[] {
  return [
    { name: "index.html", language: "markup", code: artifact.html },
    { name: "styles.css", language: "css", code: artifact.css },
    { name: "script.js", language: "javascript", code: artifact.js },
  ];
}
