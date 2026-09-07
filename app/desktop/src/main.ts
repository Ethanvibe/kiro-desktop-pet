import { getCurrentWindow } from "@tauri-apps/api/window";
import "./styles.css";

type SkinId = "business" | "casual";

type Skin = {
  label: string;
  src: string;
};

const skins: Record<SkinId, Skin> = {
  business: {
    label: "商务装",
    src: "/skins/business.png",
  },
  casual: {
    label: "休闲装",
    src: "/skins/casual.png",
  },
};

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("App root not found");

app.innerHTML = `
  <main class="pet-stage">
    <button
      class="pet-surface"
      id="petSurface"
      type="button"
      aria-label="点击切换造型，拖动移动桌宠"
    >
      <img id="petImage" alt="Kiro 桌面宠物" draggable="false" />
    </button>
  </main>
`;

const petWindow = getCurrentWindow();
const petSurface = document.querySelector<HTMLButtonElement>("#petSurface")!;
const petImage = document.querySelector<HTMLImageElement>("#petImage")!;

let activeSkin: SkinId =
  localStorage.getItem("kiro-pet-skin") === "casual" ? "casual" : "business";
let pointerOrigin: { x: number; y: number } | null = null;
let dragging = false;

function updateSkin(skinId: SkinId) {
  activeSkin = skinId;
  petImage.src = skins[skinId].src;
  petImage.alt = `穿着${skins[skinId].label}的 Kiro 桌面宠物`;
  localStorage.setItem("kiro-pet-skin", skinId);
}

function switchSkin() {
  updateSkin(activeSkin === "business" ? "casual" : "business");
}

petSurface.addEventListener("pointerdown", (event) => {
  pointerOrigin = { x: event.screenX, y: event.screenY };
  dragging = false;
  petSurface.setPointerCapture(event.pointerId);
});

petSurface.addEventListener("pointermove", (event) => {
  if (!pointerOrigin || dragging) return;

  const distance = Math.hypot(
    event.screenX - pointerOrigin.x,
    event.screenY - pointerOrigin.y,
  );

  if (distance > 6) {
    dragging = true;
    void petWindow.startDragging();
  }
});

petSurface.addEventListener("pointerup", () => {
  if (pointerOrigin && !dragging) switchSkin();
  pointerOrigin = null;
  dragging = false;
});

petSurface.addEventListener("pointercancel", () => {
  pointerOrigin = null;
  dragging = false;
});

document.addEventListener("contextmenu", (event) => event.preventDefault());

updateSkin(activeSkin);
