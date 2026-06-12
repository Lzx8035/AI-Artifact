import type { ReactArtifact, ReactFiles } from "@/lib/artifact";

// ---------- 两版共享的文件 ----------

const headerJs = `export default function Header() {
  return (
    <header>
      <span className="badge">React · canvas-confetti</span>
      <h1>每一次进展，都值得庆祝。</h1>
      <p className="intro">
        这个组件运行在 Sandpack 里：npm 依赖被真实安装打包，
        修改代码会实时热更新。
      </p>
    </header>
  );
}`;

const celebrateButtonJs = `export default function CelebrateButton({ onCelebrate }) {
  return (
    <button className="cta" onClick={onCelebrate} type="button">
      庆祝一下 🎉
    </button>
  );
}`;

const baseCss = `:root {
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

header {
  display: flex;
  flex-direction: column;
  align-items: center;
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
}`;

// ---------- v1:初始版本 ----------

const v1Files: ReactFiles = {
  "/App.js": `import Header from "./components/Header";
import CelebrateButton from "./components/CelebrateButton";
import { useCelebration } from "./hooks/useCelebration";
import "./styles.css";

export default function App() {
  const { count, celebrate } = useCelebration();

  return (
    <main className="stage">
      <Header />
      <CelebrateButton onCelebrate={celebrate} />
      <p className="count">已庆祝 {count} 次</p>
    </main>
  );
}`,
  "/components/Header.js": headerJs,
  "/components/CelebrateButton.js": celebrateButtonJs,
  "/hooks/useCelebration.js": `import { useState } from "react";
import confetti from "canvas-confetti";

export function useCelebration() {
  const [count, setCount] = useState(0);

  function celebrate() {
    setCount((current) => current + 1);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
    });
  }

  return { count, celebrate };
}`,
  "/styles.css": baseCss,
};

// ---------- v2:AI 应用户要求加入庆祝历史 ----------

const v2Files: ReactFiles = {
  "/App.js": `import Header from "./components/Header";
import CelebrateButton from "./components/CelebrateButton";
import History from "./components/History";
import { useCelebration } from "./hooks/useCelebration";
import "./styles.css";

export default function App() {
  const { count, history, celebrate } = useCelebration();

  return (
    <main className="stage">
      <Header />
      <CelebrateButton onCelebrate={celebrate} />
      <p className="count">已庆祝 {count} 次</p>
      <History records={history} />
    </main>
  );
}`,
  "/components/Header.js": headerJs,
  "/components/CelebrateButton.js": celebrateButtonJs,
  "/components/History.js": `export default function History({ records }) {
  if (records.length === 0) {
    return null;
  }

  return (
    <section className="history">
      <h2>庆祝历史</h2>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <span>第 {record.no} 次</span>
            <time>{record.time}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
  "/hooks/useCelebration.js": `import { useState } from "react";
import confetti from "canvas-confetti";

export function useCelebration() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);

  function celebrate() {
    const next = count + 1;
    setCount(next);
    setHistory((records) =>
      [
        {
          id: next,
          no: next,
          time: new Date().toLocaleTimeString(),
        },
        ...records,
      ].slice(0, 5),
    );
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
    });
  }

  return { count, history, celebrate };
}`,
  "/styles.css": `${baseCss}

.history {
  width: 100%;
  max-width: 320px;
  margin-top: 28px;
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #ffffff;
  text-align: left;
}

.history h2 {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
}

.history ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.history li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-top: 1px solid var(--line);
  font-size: 13px;
}

.history li:first-child {
  border-top: 0;
}

.history time {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}`,
};

export const sampleReactArtifact: ReactArtifact = {
  kind: "react",
  title: "React 庆祝按钮",
  versions: [v1Files, v2Files],
  dependencies: {
    "canvas-confetti": "1.9.3",
  },
};
