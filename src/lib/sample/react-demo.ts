import type { ReactArtifact } from "@/lib/artifact";

export const sampleReactArtifact: ReactArtifact = {
  kind: "react",
  title: "React 庆祝按钮",
  files: {
    "/App.js": `import { useState } from "react";
import confetti from "canvas-confetti";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);

  function celebrate() {
    setCount((current) => current + 1);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
    });
  }

  return (
    <main className="stage">
      <span className="badge">React · canvas-confetti</span>
      <h1>每一次进展，都值得庆祝。</h1>
      <p className="intro">
        这个组件运行在 Sandpack 里：npm 依赖被真实安装打包，
        修改代码会实时热更新。
      </p>
      <button className="cta" onClick={celebrate} type="button">
        庆祝一下 🎉
      </button>
      <p className="count">已庆祝 {count} 次</p>
    </main>
  );
}`,
    "/styles.css": `:root {
  color-scheme: light;
  --ink: #09090b;
  --muted: #71717a;
  --line: #e4e4e7;
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
  max-width: 520px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.badge {
  margin-bottom: 24px;
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
}

h1 {
  margin: 0;
  font-size: clamp(28px, 6vw, 40px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.intro {
  max-width: 400px;
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.7;
}

.cta {
  margin-top: 28px;
  border: 0;
  border-radius: 10px;
  padding: 12px 22px;
  color: #fff;
  background: var(--ink);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease,
    box-shadow 150ms ease;
}

.cta:hover {
  background: #2a2a2e;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  transform: translateY(-1px);
}

.cta:active {
  transform: translateY(1px);
}

.count {
  margin: 18px 0 0;
  color: var(--muted);
  font-size: 13px;
}`,
  },
  dependencies: {
    "canvas-confetti": "1.9.3",
  },
};
