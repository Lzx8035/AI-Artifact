export const focusV2Html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Focus 产品介绍</title>
  </head>
  <body>
    <div class="page">
      <header class="nav">
        <a class="brand" href="#">
          <span class="brand-mark">F</span>
          Focus
        </a>
        <nav class="nav-links">
          <a href="#features">功能</a>
          <a href="#">价格</a>
          <a href="#">文档</a>
        </nav>
        <button class="btn btn-ghost btn-sm" id="theme-toggle" type="button">
          深色模式
        </button>
        <a class="btn btn-ghost btn-sm" href="#">登录</a>
      </header>

      <main>
        <section class="hero">
          <span class="badge">
            <span class="dot"></span>
            全新 2.0 版本已发布
          </span>
          <h1>把重要的事情<br />放在最前面。</h1>
          <p class="intro">
            Focus 把任务、笔记和每日计划收进一个清晰的工作空间，
            让团队始终知道下一步该做什么。
          </p>
          <div class="actions">
            <button class="btn btn-primary" id="cta">免费开始使用</button>
            <a class="btn btn-secondary" href="#features">
              查看功能
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </div>
          <p class="hint">无需信用卡 · 2 分钟完成设置</p>
        </section>

        <section class="features" id="features">
          <article class="card">
            <span class="card-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M4 6h16M4 12h10M4 18h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <h2>清晰计划</h2>
            <p>把目标拆成今天就能完成的动作，进度一眼看清。</p>
          </article>
          <article class="card">
            <span class="card-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.8" />
                <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5M16 11l2 2 3-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <h2>专注协作</h2>
            <p>重要讨论和任务始终待在一起，不再来回切换工具。</p>
          </article>
          <article class="card">
            <span class="card-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M5 19V9m7 10V5m7 14v-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <h2>简单复盘</h2>
            <p>快速看见进展，用数据持续调整团队节奏。</p>
          </article>
        </section>
      </main>
    </div>
  </body>
</html>`;
