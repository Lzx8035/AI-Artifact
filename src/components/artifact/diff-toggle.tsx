"use client";

import { FileDiff } from "lucide-react";

import { IconButton } from "@/components/artifact/icon-button";

export function DiffToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <IconButton
      label={active ? "返回代码" : "查看本次改动"}
      onPress={onToggle}
      tooltip={active ? "返回代码" : "查看本次改动"}
    >
      <FileDiff
        aria-hidden="true"
        className={`size-4 ${active ? "text-zinc-950" : ""}`}
      />
    </IconButton>
  );
}
