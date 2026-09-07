const RELEASE_URL = "https://github.com/Ethanvibe/kiro-desktop-pet/releases/tag/v0.1.3";
const MAC_DOWNLOAD =
  "https://github.com/Ethanvibe/kiro-desktop-pet/releases/download/v0.1.3/Kiro.Desktop.Pet_0.1.3_aarch64.dmg";
const WINDOWS_DOWNLOAD =
  "https://github.com/Ethanvibe/kiro-desktop-pet/releases/download/v0.1.3/Kiro.Desktop.Pet_0.1.3_x64-setup.exe";
const BUSINESS_IMAGE = new URL("./assets/business.png", import.meta.url).href;
const CASUAL_IMAGE = new URL("./assets/casual.png", import.meta.url).href;
const SKIN_ENDPOINT = "/api/apps/kiro-desktop-pet/skin";

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

async function loadSkin() {
  const response = await fetch(SKIN_ENDPOINT, { credentials: "same-origin" });
  if (!response.ok) throw new Error(`Skin request failed: ${response.status}`);
  const payload = await response.json();
  return payload.skin === "casual" ? "casual" : "business";
}

async function saveSkin(skin) {
  const response = await fetch(SKIN_ENDPOINT, {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skin }),
  });
  if (!response.ok) throw new Error(`Skin update failed: ${response.status}`);
}

export function mount(target) {
  const root = resolveRoot(target);
  const page = document.createElement("div");
  page.className = "kiro-pet-page";
  page.innerHTML = `
    <style>
      .kiro-pet-page {
        min-height: 100%;
        padding: clamp(24px, 5vw, 56px);
        color: var(--text, #e8ebf2);
        background: var(--bg, #0d0f12);
        font-family: Inter, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
      }
      .kiro-pet-shell { max-width: 960px; margin: 0 auto; }
      .kiro-pet-eyebrow {
        margin: 0 0 10px;
        color: #8ba8ff;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .kiro-pet-page h1 { margin: 0; font-size: clamp(30px, 5vw, 46px); line-height: 1.08; }
      .kiro-pet-lead { max-width: 720px; margin: 14px 0 26px; color: #aeb6c7; line-height: 1.7; }
      .kiro-pet-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 22px;
        padding: 13px 16px;
        background: #151922;
        border: 1px solid #2a3040;
        border-radius: 14px;
      }
      .kiro-pet-dot { width: 10px; height: 10px; background: #45c58a; border-radius: 50%; box-shadow: 0 0 0 5px rgb(69 197 138 / 14%); }
      .kiro-pet-picker { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
      .kiro-pet-choice {
        position: relative;
        display: grid;
        min-height: 460px;
        padding: 18px;
        color: inherit;
        text-align: center;
        background: #151922;
        border: 2px solid #2a3040;
        border-radius: 22px;
        cursor: pointer;
        transition: 160ms ease;
      }
      .kiro-pet-choice:hover { border-color: #53617a; transform: translateY(-2px); }
      .kiro-pet-choice.selected { border-color: #6f91ff; background: #182039; box-shadow: 0 0 0 3px rgb(111 145 255 / 12%); }
      .kiro-pet-choice img { width: 100%; height: 360px; object-fit: contain; pointer-events: none; }
      .kiro-pet-choice strong { margin-top: 10px; font-size: 18px; }
      .kiro-pet-choice span { margin-top: 4px; color: #9da7ba; font-size: 13px; }
      .kiro-pet-check {
        position: absolute;
        top: 16px;
        right: 16px;
        display: none;
        padding: 6px 10px;
        color: white !important;
        font-size: 12px !important;
        font-weight: 700;
        background: #5279ed;
        border-radius: 999px;
      }
      .kiro-pet-choice.selected .kiro-pet-check { display: block; }
      .kiro-pet-downloads { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
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
      .kiro-pet-button.secondary { color: #c9d1df; background: #202633; border: 1px solid #353d4d; }
      .kiro-pet-button:hover { filter: brightness(1.1); }
      .kiro-pet-help { margin: 14px 0 0; color: #8992a5; font-size: 13px; line-height: 1.6; }
      .kiro-pet-help a { color: #8ba8ff; }
      @media (max-width: 700px) {
        .kiro-pet-picker { grid-template-columns: 1fr; }
        .kiro-pet-choice { min-height: 400px; }
        .kiro-pet-choice img { height: 300px; }
      }
    </style>
    <main class="kiro-pet-shell">
      <p class="kiro-pet-eyebrow">KiroCrew Desktop App</p>
      <h1>选择桌宠</h1>
      <p class="kiro-pet-lead">
        选择会立即保存。已运行的桌宠会自动切换；下次打开桌宠时也会继续使用这里选中的人物。
      </p>
      <div class="kiro-pet-status" role="status">
        <span class="kiro-pet-dot" aria-hidden="true"></span>
        <strong id="kiroPetStatus">正在读取当前桌宠…</strong>
      </div>
      <section class="kiro-pet-picker" aria-label="桌宠图片选择">
        <button class="kiro-pet-choice" type="button" data-skin="business" aria-pressed="false">
          <span class="kiro-pet-check">当前使用</span>
          <img src="${BUSINESS_IMAGE}" alt="商务装桌宠" />
          <strong>商务装</strong>
          <span>深蓝西装</span>
        </button>
        <button class="kiro-pet-choice" type="button" data-skin="casual" aria-pressed="false">
          <span class="kiro-pet-check">当前使用</span>
          <img src="${CASUAL_IMAGE}" alt="休闲装桌宠" />
          <strong>休闲装</strong>
          <span>绿色夹克</span>
        </button>
      </section>
      <div class="kiro-pet-downloads">
        <a class="kiro-pet-button" href="${MAC_DOWNLOAD}" target="_blank" rel="noreferrer">下载 macOS 版</a>
        <a class="kiro-pet-button" href="${WINDOWS_DOWNLOAD}" target="_blank" rel="noreferrer">下载 Windows 版</a>
        <a class="kiro-pet-button secondary" href="${RELEASE_URL}" target="_blank" rel="noreferrer">查看 Release</a>
      </div>
      <p class="kiro-pet-help">原生桌宠窗口仍然只有透明人物图片，不显示卡片、状态栏或人工背景。</p>
    </main>
  `;

  root.replaceChildren(page);

  const status = page.querySelector("#kiroPetStatus");
  const choices = [...page.querySelectorAll("[data-skin]")];

  const renderSelection = (skin) => {
    for (const choice of choices) {
      const selected = choice.dataset.skin === skin;
      choice.classList.toggle("selected", selected);
      choice.setAttribute("aria-pressed", String(selected));
    }
    status.textContent = skin === "casual" ? "当前桌宠：休闲装" : "当前桌宠：商务装";
  };

  for (const choice of choices) {
    choice.addEventListener("click", async () => {
      const skin = choice.dataset.skin;
      status.textContent = "正在保存…";
      try {
        await saveSkin(skin);
        renderSelection(skin);
      } catch (error) {
        console.error(error);
        status.textContent = "保存失败，请确认 App 已启用并受信任";
      }
    });
  }

  loadSkin()
    .then(renderSelection)
    .catch((error) => {
      console.error(error);
      status.textContent = "无法读取桌宠设置，请确认 App 已启用并受信任";
    });

  return () => {
    if (page.parentNode === root) page.remove();
  };
}

export default mount;
