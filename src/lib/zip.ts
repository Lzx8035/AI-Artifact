import { strToU8, zipSync } from "fflate";

/** 把 artifact 标题清洗成安全文件名(中文保留,去路径符,空白转连字符)。 */
export function zipFileName(title: string): string {
  const cleaned = title
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-");
  return cleaned || "artifact";
}

/**
 * 把 `name → code` 文件映射打成 zip 并触发浏览器下载。
 * name 可含子目录(react 嵌套路径如 /components/Header.js),zip 内保留目录结构;
 * 前导斜杠去掉,避免解压出空的顶层目录。
 */
export function downloadFilesAsZip(
  files: Record<string, string>,
  zipName: string,
): void {
  const entries: Record<string, Uint8Array> = {};
  for (const [name, code] of Object.entries(files)) {
    entries[name.replace(/^\//, "")] = strToU8(code);
  }
  const bytes = zipSync(entries, { level: 6 });

  const url = URL.createObjectURL(
    new Blob([bytes], { type: "application/zip" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = zipName.endsWith(".zip") ? zipName : `${zipName}.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // 留点时间让浏览器发起下载再回收 URL。
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
