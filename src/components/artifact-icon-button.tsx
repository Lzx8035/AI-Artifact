"use client";

import type { ReactNode } from "react";
import { Tooltip } from "@heroui/react";

export function IconButton({
  label,
  onPress,
  tooltip,
  children,
}: {
  label: string;
  onPress: () => void;
  tooltip: string;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <button
          aria-label={label}
          className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200"
          onClick={onPress}
          type="button"
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>{tooltip}</Tooltip.Content>
    </Tooltip>
  );
}
