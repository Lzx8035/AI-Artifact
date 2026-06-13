import type { ReactArtifact } from "@/lib/artifact";

// 单版本小应用,专用于演示「流式生成 → 打包 → 运行」的完整生命周期。
export const sampleStreamArtifact: ReactArtifact = {
  kind: "react",
  title: "实时时钟",
  versions: [
    {
      "/App.js": `import Clock from "./components/Clock";
import "./styles.css";

export default function App() {
  return (
    <main className="stage">
      <p className="eyebrow">STREAMING DEMO</p>
      <Clock />
      <p className="hint">这个组件是「流式生成」出来的——代码逐步到达，完成后才打包运行。</p>
    </main>
  );
}`,
      "/components/Clock.js": `import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <time className="clock">
      {now.toLocaleTimeString("zh-CN", { hour12: false })}
    </time>
  );
}`,
      "/styles.css": `:root {
  color-scheme: light;
  --ink: #09090b;
  --muted: #71717a;
}

body {
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(60% 50% at 50% 0%, #f4f4f5 0%, rgba(244, 244, 245, 0) 70%),
    #ffffff;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
}

.stage {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 0 24px;
  text-align: center;
}

.eyebrow {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
}

.clock {
  font-size: clamp(48px, 12vw, 88px);
  font-weight: 600;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}

.hint {
  max-width: 360px;
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
}`,
    },
  ],
};
