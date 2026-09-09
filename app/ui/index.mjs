import { createElement, useEffect, useRef } from "react";

const BUSINESS_IMAGE = new URL("./assets/business.png", import.meta.url).href;
const CASUAL_IMAGE = new URL("./assets/casual.png", import.meta.url).href;
const SKIN_KEY = "kiro-desktop-pet:skin";
const POSITION_KEY = "kiro-desktop-pet:position";

const skins = {
  business: { label: "商务装", src: BUSINESS_IMAGE },
  casual: { label: "休闲装", src: CASUAL_IMAGE },
};

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

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function loadPosition() {
  try {
    const value = JSON.parse(localStorage.getItem(POSITION_KEY) || "null");
    if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) {
      return { x: clamp(value.x, 0, 1), y: clamp(value.y, 0, 1) };
    }
  } catch {
    // Ignore invalid values left by an older version.
  }
  return { x: 0.5, y: 0.56 };
}

export function mount(target) {
  const root = resolveRoot(target);
  const page = document.createElement("div");
  page.className = "kiro-pet-page";
  page.innerHTML = `
    <style>
      .kiro-pet-page {
        position: relative;
        width: 100%;
        min-height: 100%;
        overflow: hidden;
        color: var(--text, inherit);
        background: transparent;
        font-family: Inter, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
        user-select: none;
        -webkit-user-select: none;
      }
      .kiro-pet-canvas {
        position: relative;
        width: 100%;
        min-height: clamp(440px, calc(100vh - 150px), 760px);
        overflow: hidden;
        background: transparent;
      }
      .kiro-pet-hint {
        position: absolute;
        top: 12px;
        left: 50%;
        z-index: 2;
        margin: 0;
        color: var(--text-muted, var(--muted-foreground, #8d96a8));
        font-size: 12px;
        line-height: 1.4;
        white-space: nowrap;
        opacity: .78;
        pointer-events: none;
        transform: translateX(-50%);
      }
      .kiro-pet-surface {
        position: absolute;
        z-index: 1;
        display: block;
        width: clamp(132px, 19vw, 210px);
        height: clamp(220px, 44vh, 330px);
        padding: 0;
        appearance: none;
        color: inherit;
        background: transparent;
        border: 0;
        outline: 0;
        box-shadow: none;
        cursor: grab;
        touch-action: none;
        transform: translate(-50%, -50%);
        -webkit-tap-highlight-color: transparent;
      }
      .kiro-pet-surface:active { cursor: grabbing; }
      .kiro-pet-surface:focus-visible {
        outline: 2px solid var(--accent, #6f91ff);
        outline-offset: 5px;
        border-radius: 45%;
      }
      .kiro-pet-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center bottom;
        pointer-events: none;
        -webkit-user-drag: none;
      }
      .kiro-pet-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      @media (max-width: 640px) {
        .kiro-pet-surface {
          width: clamp(120px, 38vw, 175px);
          height: clamp(200px, 42vh, 285px);
        }
      }
    </style>
    <main class="kiro-pet-canvas" aria-label="Kiro 桌宠活动区域">
      <p class="kiro-pet-hint">点击人物换装 · 拖动人物移动</p>
      <button class="kiro-pet-surface" type="button">
        <img class="kiro-pet-image" draggable="false" />
        <span class="kiro-pet-sr-only" aria-live="polite"></span>
      </button>
    </main>
  `;

  root.replaceChildren(page);

  const canvas = page.querySelector(".kiro-pet-canvas");
  const surface = page.querySelector(".kiro-pet-surface");
  const image = page.querySelector(".kiro-pet-image");
  const announcement = page.querySelector(".kiro-pet-sr-only");
  let activeSkin = localStorage.getItem(SKIN_KEY) === "casual" ? "casual" : "business";
  let position = loadPosition();
  let drag = null;

  const renderPosition = () => {
    const canvasRect = canvas.getBoundingClientRect();
    const surfaceRect = surface.getBoundingClientRect();
    const minX = canvasRect.width ? surfaceRect.width / 2 / canvasRect.width : 0;
    const minY = canvasRect.height ? surfaceRect.height / 2 / canvasRect.height : 0;
    position = {
      x: clamp(position.x, minX, 1 - minX),
      y: clamp(position.y, minY, 1 - minY),
    };
    surface.style.left = `${position.x * 100}%`;
    surface.style.top = `${position.y * 100}%`;
  };

  const renderSkin = (announce = false) => {
    const skin = skins[activeSkin];
    image.src = skin.src;
    image.alt = `${skin.label} Kiro 桌宠`;
    surface.setAttribute("aria-label", `当前${skin.label}。点击换装，拖动移动`);
    if (announce) announcement.textContent = `已切换为${skin.label}`;
  };

  const switchSkin = () => {
    activeSkin = activeSkin === "business" ? "casual" : "business";
    localStorage.setItem(SKIN_KEY, activeSkin);
    renderSkin(true);
  };

  const persistPosition = () => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(position));
  };

  surface.addEventListener("pointerdown", (event) => {
    drag = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x,
      startY: position.y,
      moved: false,
    };
    surface.setPointerCapture(event.pointerId);
  });

  surface.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const deltaX = event.clientX - drag.startClientX;
    const deltaY = event.clientY - drag.startClientY;
    if (Math.hypot(deltaX, deltaY) > 5) drag.moved = true;

    position = {
      x: drag.startX + deltaX / rect.width,
      y: drag.startY + deltaY / rect.height,
    };
    renderPosition();
  });

  surface.addEventListener("pointerup", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) persistPosition();
    else switchSkin();
    drag = null;
  });

  surface.addEventListener("pointercancel", () => {
    if (drag?.moved) persistPosition();
    drag = null;
  });

  surface.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      switchSkin();
    }
  });

  const handleResize = () => renderPosition();
  window.addEventListener("resize", handleResize);
  renderSkin();
  requestAnimationFrame(renderPosition);

  return () => {
    window.removeEventListener("resize", handleResize);
    if (page.parentNode === root) page.remove();
  };
}

export default mount;

export default function KiroDesktopPetPage() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return undefined;
    return mount(rootRef.current);
  }, []);

  return createElement("div", {
    ref: rootRef,
    style: {
      width: "100%",
      height: "100%",
      minHeight: 0,
      overflow: "hidden",
    },
  });
}
