const RELEASE_URL = "https://github.com/Ethanvibe/kiro-desktop-pet/releases/tag/v0.1.2";
const MAC_DOWNLOAD =
  "https://github.com/Ethanvibe/kiro-desktop-pet/releases/download/v0.1.2/Kiro.Desktop.Pet_0.1.2_aarch64.dmg";
const WINDOWS_DOWNLOAD =
  "https://github.com/Ethanvibe/kiro-desktop-pet/releases/download/v0.1.2/Kiro.Desktop.Pet_0.1.2_x64-setup.exe";

function resolveRoot(target) {
  if (target instanceof HTMLElement) return target;

  for (const candidate of [
    target?.root,
    target?.container,
    target?.element,
    target?.el,
  ]) {
    if (candidate instanceof HTMLElement) return candidate;
  }

  throw new Error("Kiro Desktop Pet UI mount target is unavailable");
}

export function mount(target) {
  const root = resolveRoot(target);
  const page = document.createElement("div");
  page.className = "kiro-pet-page";
  page.innerHTML = `
    <style>
      .kiro-pet-page {
        min-height: 100%;
        padding: clamp(24px, 5vw, 64px);
        color: var(--text, #e8ebf2);
        background: var(--bg, #0d0f12);
        font-family: Inter, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
      }
      .kiro-pet-shell { max-width: 860px; margin: 0 auto; }
      .kiro-pet-eyebrow {
        margin: 0 0 10px;
        color: #8ba8ff;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .kiro-pet-page h1 { margin: 0; font-size: clamp(30px, 5vw, 48px); line-height: 1.08; }
      .kiro-pet-lead { max-width: 650px; margin: 16px 0 28px; color: #aeb6c7; line-height: 1.7; }
      .kiro-pet-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 28px;
        padding: 14px 16px;
        background: #151922;
        border: 1px solid #2a3040;
        border-radius: 14px;
      }
      .kiro-pet-dot { width: 10px; height: 10px; background: #45c58a; border-radius: 50%; box-shadow: 0 0 0 5px rgb(69 197 138 / 14%); }
      .kiro-pet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
      .kiro-pet-card { padding: 20px; background: #151922; border: 1px solid #2a3040; border-radius: 18px; }
      .kiro-pet-card h2 { margin: 0 0 8px; font-size: 18px; }
      .kiro-pet-card p { min-height: 48px; margin: 0 0 18px; color: #aeb6c7; line-height: 1.55; }
      .kiro-pet-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0 16px;
        color: white;
        font-weight: 700;
        text-decoration: none;
        background: #4169e1;
        border-radius: 11px;
      }
      .kiro-pet-button:hover { background: #5279ed; }
      .kiro-pet-help { margin: 24px 0 0; color: #8992a5; font-size: 13px; line-height: 1.6; }
      .kiro-pet-help a { color: #8ba8ff; }
    </style>
    <main class="kiro-pet-shell">
      <p class="kiro-pet-eyebrow">KiroCrew Desktop App</p>
      <h1>Kiro Desktop Pet</h1>
      <p class="kiro-pet-lead">
        桌面上只显示透明人物图片，没有卡片、状态栏或背景。拖动人物可以移动位置，点击人物即可在商务装与休闲装之间切换。
      </p>
      <div class="kiro-pet-status" role="status">
        <span class="kiro-pet-dot" aria-hidden="true"></span>
        <strong>KiroCrew App 已启用</strong>
      </div>
      <section class="kiro-pet-grid" aria-label="桌宠下载">
        <article class="kiro-pet-card">
          <h2>macOS · Apple Silicon</h2>
          <p>下载 DMG，拖入 Applications 后打开 Kiro Desktop Pet。</p>
          <a class="kiro-pet-button" href="${MAC_DOWNLOAD}" target="_blank" rel="noreferrer">下载 macOS 版</a>
        </article>
        <article class="kiro-pet-card">
          <h2>Windows · x64</h2>
          <p>下载安装程序，完成后从开始菜单打开 Kiro Desktop Pet。</p>
          <a class="kiro-pet-button" href="${WINDOWS_DOWNLOAD}" target="_blank" rel="noreferrer">下载 Windows 版</a>
        </article>
      </section>
      <p class="kiro-pet-help">
        桌宠安装包与校验文件可在
        <a href="${RELEASE_URL}" target="_blank" rel="noreferrer">GitHub Release v0.1.2</a>
        查看。安装包暂未签名，首次打开时系统可能要求确认。
      </p>
    </main>
  `;

  root.replaceChildren(page);

  return () => {
    if (page.parentNode === root) page.remove();
  };
}

export default mount;
