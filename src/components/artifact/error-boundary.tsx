"use client";

import { Component, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * 兜住面板渲染期崩溃(Sandpack / prism / diff 等),避免整页白屏——
 * 退化成一块降级 UI,工作区顶栏(关闭按钮)仍可用。
 */
export class ArtifactErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-white px-6 text-center">
          <TriangleAlert aria-hidden="true" className="size-6 text-red-500" />
          <p className="text-sm font-medium text-zinc-950">工作区渲染出错</p>
          <p className="max-w-sm break-words font-mono text-xs text-zinc-500">
            {this.state.error.message}
          </p>
          <button
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            onClick={() => this.setState({ error: null })}
            type="button"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
