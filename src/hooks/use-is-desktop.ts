"use client";

import { useSyncExternalStore } from "react";

/**
 * md 断点(768px)的运行时检测,用于在桌面分栏 / 移动覆盖层之间
 * 只挂载一份 ArtifactWorkspace(Sandpack 实例较重,双挂载代价高)。
 */
const QUERY = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
