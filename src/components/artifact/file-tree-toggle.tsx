"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { IconButton } from "@/components/artifact/icon-button";

export function FileTreeToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <IconButton
      label={show ? "隐藏文件列表" : "显示文件列表"}
      onPress={onToggle}
      tooltip={`${show ? "隐藏" : "显示"}文件列表 (⌘B)`}
    >
      {show ? (
        <PanelLeftClose aria-hidden="true" className="size-4" />
      ) : (
        <PanelLeftOpen aria-hidden="true" className="size-4" />
      )}
    </IconButton>
  );
}
