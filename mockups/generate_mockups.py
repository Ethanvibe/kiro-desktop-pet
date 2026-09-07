from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).parent
ASSETS = ROOT / "assets"
OUT = ROOT / "desktop-pet-concepts-v2.png"
W, H = 1800, 1080


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size, index=0)
        except OSError:
            pass
    return ImageFont.load_default()


def fit_pet(path: Path, max_w: int, max_h: int):
    image = Image.open(path).convert("RGBA")
    bbox = image.getchannel("A").getbbox()
    if bbox:
        image = image.crop(bbox)
    image.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    return image


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, size, color, bold=False, anchor=None):
    draw.text(xy, value, fill=color, font=font(size, bold), anchor=anchor)


canvas = Image.new("RGB", (W, H), "#f4f7fb")
d = ImageDraw.Draw(canvas)
text(d, (70, 44), "Kiro Desktop Pet · 视觉方向提案", 42, "#10213d", True)
text(d, (70, 100), "基于你提供的商务装角色，先确认交互形态，再进入 macOS / Windows 实现。", 23, "#607089")

business = fit_pet(ASSETS / "pet-business.png", 360, 650)
casual = fit_pet(ASSETS / "pet-casual.png", 250, 300)

cards = [(60, 170, 580, 1010), (640, 170, 1160, 1010), (1220, 170, 1740, 1010)]
for box in cards:
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((box[0] + 8, box[1] + 12, box[2] + 8, box[3] + 12), 28, fill=(35, 51, 78, 28))
    canvas.paste(shadow.filter(ImageFilter.GaussianBlur(14)), (0, 0), shadow)

# A — corner companion
box = cards[0]
d.rounded_rectangle(box, 28, fill="#ffffff", outline="#dce5f2", width=2)
text(d, (box[0] + 28, box[1] + 25), "A  极简角落陪伴", 28, "#12233f", True)
text(d, (box[0] + 28, box[1] + 66), "推荐 · 不打扰，状态一眼可见", 19, "#2f8a62")
desktop = (box[0] + 24, box[1] + 112, box[2] - 24, box[3] - 28)
d.rounded_rectangle(desktop, 22, fill="#e9f0f8")
for i in range(5):
    x = desktop[0] + 28 + i * 84
    rounded(d, (x, desktop[1] + 28, x + 54, desktop[1] + 82), 12, "#d3deeb")
rounded(d, (desktop[0] + 185, desktop[1] + 225, desktop[2] - 25, desktop[1] + 330), 22, "#ffffff", "#d5dfeb")
text(d, (desktop[0] + 210, desktop[1] + 248), "任务已完成 ✓", 23, "#173050", True)
text(d, (desktop[0] + 210, desktop[1] + 287), "需求文档已经整理好了", 18, "#63748a")
pet = business.copy()
pet.thumbnail((250, 480), Image.Resampling.LANCZOS)
canvas.paste(pet, (desktop[2] - pet.width - 25, desktop[3] - pet.height - 22), pet)
rounded(d, (desktop[0] + 30, desktop[3] - 90, desktop[0] + 210, desktop[3] - 42), 24, "#153a67")
text(d, (desktop[0] + 120, desktop[3] - 66), "● 空闲待命", 18, "#ffffff", True, "mm")

# B — work coach
box = cards[1]
d.rounded_rectangle(box, 28, fill="#ffffff", outline="#dce5f2", width=2)
text(d, (box[0] + 28, box[1] + 25), "B  工作助理卡片", 28, "#12233f", True)
text(d, (box[0] + 28, box[1] + 66), "信息更完整，适合任务管理", 19, "#6c7a90")
desktop = (box[0] + 24, box[1] + 112, box[2] - 24, box[3] - 28)
d.rounded_rectangle(desktop, 22, fill="#14233d")
rounded(d, (desktop[0] + 25, desktop[1] + 25, desktop[2] - 25, desktop[1] + 92), 18, "#1e3254")
text(d, (desktop[0] + 50, desktop[1] + 58), "Kiro 正在工作", 22, "#ffffff", True, "lm")
rounded(d, (desktop[0] + 300, desktop[1] + 44, desktop[2] - 45, desktop[1] + 74), 15, "#2f7f69")
text(d, (desktop[2] - 90, desktop[1] + 59), "68%", 16, "#ffffff", True, "mm")
pet = business.copy()
pet.thumbnail((245, 465), Image.Resampling.LANCZOS)
canvas.paste(pet, (desktop[0] + 12, desktop[3] - pet.height - 20), pet)
rounded(d, (desktop[0] + 230, desktop[1] + 155, desktop[2] - 25, desktop[1] + 420), 22, "#ffffff")
text(d, (desktop[0] + 254, desktop[1] + 182), "当前任务", 18, "#75849a")
text(d, (desktop[0] + 254, desktop[1] + 220), "生成桌宠安装包", 22, "#14233d", True)
for idx, (label, done) in enumerate((("整理素材", True), ("构建 macOS", True), ("构建 Windows", False))):
    y = desktop[1] + 280 + idx * 48
    text(d, (desktop[0] + 254, y), "✓" if done else "○", 20, "#2c9a6d" if done else "#9ca9ba", True)
    text(d, (desktop[0] + 286, y), label, 18, "#32435b")
rounded(d, (desktop[0] + 230, desktop[1] + 450, desktop[2] - 25, desktop[1] + 508), 16, "#2f6fe4")
text(d, ((desktop[0] + desktop[2] + 205) // 2, desktop[1] + 479), "打开 KiroCrew", 18, "#ffffff", True, "mm")

# C — playful floating pet
box = cards[2]
d.rounded_rectangle(box, 28, fill="#ffffff", outline="#dce5f2", width=2)
text(d, (box[0] + 28, box[1] + 25), "C  自由悬浮互动", 28, "#12233f", True)
text(d, (box[0] + 28, box[1] + 66), "更有趣，强调换装与点击互动", 19, "#6c7a90")
desktop = (box[0] + 24, box[1] + 112, box[2] - 24, box[3] - 28)
for y in range(desktop[1], desktop[3]):
    t = (y - desktop[1]) / (desktop[3] - desktop[1])
    c = tuple(int(a * (1 - t) + b * t) for a, b in zip((237, 228, 255), (199, 224, 255)))
    d.line((desktop[0], y, desktop[2], y), fill=c)
d.rounded_rectangle(desktop, 22, outline="#d7d9ef", width=2)
pet = business.copy()
pet.thumbnail((295, 560), Image.Resampling.LANCZOS)
px = desktop[0] + (desktop[2] - desktop[0] - pet.width) // 2
py = desktop[3] - pet.height - 95
canvas.paste(pet, (px, py), pet)
for cx, cy, label in ((desktop[0] + 82, desktop[1] + 235, "换装"), (desktop[2] - 82, desktop[1] + 235, "任务"), (desktop[0] + 82, desktop[1] + 335, "休息"), (desktop[2] - 82, desktop[1] + 335, "隐藏")):
    d.ellipse((cx - 35, cy - 35, cx + 35, cy + 35), fill="#ffffff", outline="#c9d3e4", width=2)
    text(d, (cx, cy), label, 16, "#33445e", True, "mm")
rounded(d, (desktop[0] + 120, desktop[3] - 76, desktop[2] - 120, desktop[3] - 28), 24, "#ffffff", "#cbd5e5")
text(d, ((desktop[0] + desktop[2]) // 2, desktop[3] - 52), "点击我看看", 18, "#33445e", True, "mm")
casual.thumbnail((90, 108), Image.Resampling.LANCZOS)
thumb_x, thumb_y = desktop[2] - 115, desktop[3] - 170
rounded(d, (thumb_x - 8, thumb_y - 8, thumb_x + 98, thumb_y + 116), 18, "#ffffff", "#aebdd1", 2)
canvas.paste(casual, (thumb_x, thumb_y), casual)

canvas.save(OUT, optimize=True)
print(OUT)
