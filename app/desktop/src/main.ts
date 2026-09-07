import { getCurrentWindow } from "@tauri-apps/api/window";
import "./styles.css";

type SkinId = "business" | "casual";

type Skin = {
  id: SkinId;
  label: string;
  description: string;
  src: string;
};

const skins: Record<SkinId, Skin> = {
  business: {
    id: "business",
    label: "商务装",
    description: "专注工作",
    src: "/skins/business.png",
  },
  casual: {
    id: "casual",
    label: "休闲装",
    description: "轻松陪伴",
    src: "/skins/casual.png",
  },
};

const icon = (path: string) => `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="${path}" />
  </svg>
`;

const icons = {
  outfit: icon("M20 7 15.5 4.5 13 7l-1-3H8l-1 3-2.5-2.5L0 7l3 5 3-1v9h12v-9l3 1 3-5h-4Z"),
  task: icon("M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"),
  rest: icon("M12 2a10 10 0 1 0 10 10A7 7 0 0 1 12 2Z"),
  hide: icon("M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"),
  check: icon("m5 12 4 4L19 6"),
};

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("App root not found");

app.innerHTML = `
  <section class="pet-stage" aria-label="Kiro 桌面宠物">
    <div class="status-pill" role="status">
      <span class="status-dot"></span>
      <span id="statusText">空闲待命</span>
    </div>

    <nav class="radial-menu" id="radialMenu" aria-label="快捷操作" aria-hidden="true">
      <button class="action action-outfit" data-action="outfit" aria-label="换装">
        ${icons.outfit}<span>换装</span>
      </button>
      <button class="action action-task" data-action="task" aria-label="任务">
        ${icons.task}<span>任务</span>
      </button>
      <button class="action action-rest" data-action="rest" aria-label="休息">
        ${icons.rest}<span>休息</span>
      </button>
      <button class="action action-hide" data-action="hide" aria-label="隐藏">
        ${icons.hide}<span>隐藏</span>
      </button>
    </nav>

    <button class="pet-surface" id="petSurface" aria-label="点击打开快捷操作，拖动可移动桌宠" aria-expanded="false">
      <span class="drag-hint">拖动我 · 点击互动</span>
      <img id="petImage" alt="Kiro 桌面宠物" draggable="false" />
      <span class="pet-shadow"></span>
    </button>

    <aside class="skin-picker" id="skinPicker" aria-label="换装" aria-hidden="true">
      <header>
        <div>
          <strong>今天穿什么？</strong>
          <span>选择一套造型</span>
        </div>
        <button class="close-picker" id="closePicker" aria-label="关闭换装">×</button>
      </header>
      <div class="skin-options">
        ${Object.values(skins)
          .map(
            (skin) => `
              <button class="skin-option" data-skin="${skin.id}" aria-label="切换到${skin.label}">
                <span class="skin-thumb"><img src="${skin.src}" alt="" /></span>
                <span class="skin-copy"><strong>${skin.label}</strong><small>${skin.description}</small></span>
                <span class="skin-check">${icons.check}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </aside>

    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  </section>
`;

const petWindow = getCurrentWindow();
const petSurface = document.querySelector<HTMLButtonElement>("#petSurface")!;
const petImage = document.querySelector<HTMLImageElement>("#petImage")!;
const radialMenu = document.querySelector<HTMLElement>("#radialMenu")!;
const skinPicker = document.querySelector<HTMLElement>("#skinPicker")!;
const closePicker = document.querySelector<HTMLButtonElement>("#closePicker")!;
const toast = document.querySelector<HTMLElement>("#toast")!;
const statusText = document.querySelector<HTMLElement>("#statusText")!;

let activeSkin: SkinId = localStorage.getItem("kiro-pet-skin") === "casual" ? "casual" : "business";
let menuOpen = false;
let pickerOpen = false;
let toastTimer: number | undefined;
let pointerOrigin: { x: number; y: number } | null = null;
let dragging = false;

function updateSkin(skinId: SkinId, announce = false) {
  activeSkin = skinId;
  petImage.src = skins[skinId].src;
  petImage.alt = `穿着${skins[skinId].label}的 Kiro 桌面宠物`;
  localStorage.setItem("kiro-pet-skin", skinId);
  document.querySelectorAll<HTMLButtonElement>(".skin-option").forEach((button) => {
    const selected = button.dataset.skin === skinId;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  if (announce) showToast(`已换上${skins[skinId].label}`);
}

function setMenu(open: boolean) {
  menuOpen = open;
  radialMenu.classList.toggle("open", open);
  radialMenu.setAttribute("aria-hidden", String(!open));
  petSurface.setAttribute("aria-expanded", String(open));
  if (!open) setPicker(false);
}

function setPicker(open: boolean) {
  pickerOpen = open;
  skinPicker.classList.toggle("open", open);
  skinPicker.setAttribute("aria-hidden", String(!open));
}

function showToast(message: string) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

petSurface.addEventListener("pointerdown", (event) => {
  pointerOrigin = { x: event.screenX, y: event.screenY };
  dragging = false;
  petSurface.setPointerCapture(event.pointerId);
});

petSurface.addEventListener("pointermove", (event) => {
  if (!pointerOrigin || dragging) return;
  const distance = Math.hypot(event.screenX - pointerOrigin.x, event.screenY - pointerOrigin.y);
  if (distance > 6) {
    dragging = true;
    void petWindow.startDragging();
  }
});

petSurface.addEventListener("pointerup", () => {
  if (pointerOrigin && !dragging) setMenu(!menuOpen);
  pointerOrigin = null;
  dragging = false;
});

petSurface.addEventListener("pointercancel", () => {
  pointerOrigin = null;
  dragging = false;
});

document.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    switch (button.dataset.action) {
      case "outfit":
        setPicker(!pickerOpen);
        break;
      case "task":
        statusText.textContent = "准备工作";
        showToast("任务入口将在 KiroCrew 接入后启用");
        break;
      case "rest":
        statusText.textContent = "休息一下";
        showToast("深呼吸，稍后继续");
        setMenu(false);
        window.setTimeout(() => (statusText.textContent = "空闲待命"), 3500);
        break;
      case "hide":
        void petWindow.hide();
        break;
    }
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-skin]").forEach((button) => {
  button.addEventListener("click", () => updateSkin(button.dataset.skin as SkinId, true));
});

closePicker.addEventListener("click", () => setPicker(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.addEventListener("contextmenu", (event) => event.preventDefault());

updateSkin(activeSkin);
