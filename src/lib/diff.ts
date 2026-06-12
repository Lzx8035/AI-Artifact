import { diffLines } from "diff";

export type FileDiffStatus = "added" | "removed" | "modified";

export type DiffLineType = "context" | "added" | "removed";

export type DiffLine = {
  type: DiffLineType;
  oldNo: number | null;
  newNo: number | null;
  text: string;
};

export type FileDiff = {
  name: string;
  status: FileDiffStatus;
  lines: DiffLine[];
  added: number;
  removed: number;
};

function splitChunkLines(value: string): string[] {
  const lines = value.split("\n");
  // diffLines 的 chunk 通常以 \n 结尾,split 会多出一个空尾项
  if (lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines;
}

/**
 * 对比两份 name → code 文件映射,产出每个有改动文件的 unified diff 行。
 * 版本按全量快照存储,diff 在此实时计算(不持久化)。
 */
export function diffFileMaps(
  oldFiles: Record<string, string>,
  newFiles: Record<string, string>,
): FileDiff[] {
  const names = [
    ...new Set([...Object.keys(oldFiles), ...Object.keys(newFiles)]),
  ];
  const result: FileDiff[] = [];

  for (const name of names) {
    const oldCode = oldFiles[name];
    const newCode = newFiles[name];

    if (oldCode === newCode) {
      continue;
    }

    const status: FileDiffStatus =
      oldCode === undefined
        ? "added"
        : newCode === undefined
          ? "removed"
          : "modified";

    const lines: DiffLine[] = [];
    let added = 0;
    let removed = 0;
    let oldNo = 1;
    let newNo = 1;

    for (const chunk of diffLines(oldCode ?? "", newCode ?? "")) {
      for (const text of splitChunkLines(chunk.value)) {
        if (chunk.added) {
          lines.push({ type: "added", oldNo: null, newNo: newNo++, text });
          added++;
        } else if (chunk.removed) {
          lines.push({ type: "removed", oldNo: oldNo++, newNo: null, text });
          removed++;
        } else {
          lines.push({ type: "context", oldNo: oldNo++, newNo: newNo++, text });
        }
      }
    }

    result.push({ name, status, lines, added, removed });
  }

  return result;
}
