"use client";

import type { ReactNode } from "react";
import { Button, Tooltip } from "@heroui/react";

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
        <Button
          aria-label={label}
          className="size-8 min-w-0 shrink-0 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          isIconOnly
          onPress={onPress}
          size="sm"
          variant="ghost"
        >
          {children}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{tooltip}</Tooltip.Content>
    </Tooltip>
  );
}
