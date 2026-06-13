"use client";

import { useEffect, useState } from "react";

import type { Artifact, HtmlFiles, ReactFiles } from "@/lib/artifact";

const STEP_MS = 30;
const CHARS_PER_STEP = 24;

function htmlRevealed(full: HtmlFiles, budget: number): HtmlFiles {
  const out: HtmlFiles = { html: "", css: "", js: "" };
  let left = budget;
  for (const key of ["html", "css", "js"] as const) {
    if (left <= 0) break;
    out[key] = full[key].slice(0, left);
    left -= full[key].length;
  }
  return out;
}

function reactRevealed(full: ReactFiles, budget: number): ReactFiles {
  const out: ReactFiles = {};
  let left = budget;
  for (const [path, code] of Object.entries(full)) {
    if (left <= 0) break;
    out[path] = code.slice(0, left);
    left -= code.length;
  }
  return out;
}

function totalChars(artifact: Artifact, index: number): number {
  if (artifact.kind === "html") {
    const v = artifact.versions[index];
    return v.html.length + v.css.length + v.js.length;
  }
  return Object.values(artifact.versions[index]).reduce(
    (sum, code) => sum + code.length,
    0,
  );
}

function partialArtifact(
  artifact: Artifact,
  index: number,
  revealed: number,
): Artifact {
  if (artifact.kind === "html") {
    const versions = [...artifact.versions];
    versions[index] = htmlRevealed(artifact.versions[index], revealed);
    return { ...artifact, versions, status: "streaming" };
  }
  const versions = [...artifact.versions];
  versions[index] = reactRevealed(artifact.versions[index], revealed);
  return { ...artifact, versions, status: "streaming" };
}

/**
 * 把一个已完成的 artifact 当作「流式生成」播放一遍:逐字揭示目标版本的
 * 内容,返回带 status:"streaming" 的部分 artifact,播完返回 status:"complete"。
 * 仅 demo 用——真实接入直接喂后端流式数据即可。
 *
 * runId 变化(每次重新打开)时从头重播。
 */
export function useSimulatedStream(
  target: Artifact | null,
  active: boolean,
  versionIndex: number,
  runId: number,
): Artifact | null {
  const [revealed, setRevealed] = useState(0);
  // runId 变化(重新打开)时在渲染期间把进度归零——比在 effect 里 setState 合规。
  const [animRunId, setAnimRunId] = useState(runId);
  if (animRunId !== runId) {
    setAnimRunId(runId);
    setRevealed(0);
  }

  useEffect(() => {
    if (!target || !active) {
      return;
    }
    const total = totalChars(target, versionIndex);
    const timer = window.setInterval(() => {
      setRevealed((current) => {
        const next = current + CHARS_PER_STEP;
        if (next >= total) {
          window.clearInterval(timer);
          return total;
        }
        return next;
      });
    }, STEP_MS);
    return () => window.clearInterval(timer);
    // runId 触发重播;target/versionIndex 同一次打开内稳定。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, active]);

  if (!target) {
    return null;
  }
  if (!active) {
    return target;
  }
  const total = totalChars(target, versionIndex);
  return revealed >= total
    ? { ...target, status: "complete" }
    : partialArtifact(target, versionIndex, revealed);
}
