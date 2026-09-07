"""HTTP routes for the Kiro Desktop Pet appearance selector."""

from __future__ import annotations

import asyncio
import os
from pathlib import Path

from aiohttp import web

from kiro_crew.apps.manager import app_data_dir, is_app_enabled

APP_NAME = "kiro-desktop-pet"
BASE = f"/api/apps/{APP_NAME}"
VALID_SKINS = frozenset({"business", "casual"})


def _skin_path() -> Path:
    return app_data_dir(APP_NAME) / "skin.txt"


def _read_skin() -> str:
    try:
        skin = _skin_path().read_text(encoding="utf-8").strip()
    except OSError:
        return "business"
    return skin if skin in VALID_SKINS else "business"


def _write_skin(skin: str) -> None:
    path = _skin_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(f"{skin}\n", encoding="utf-8")
    os.replace(temporary, path)


async def _get_skin(_request: web.Request) -> web.Response:
    if not await asyncio.to_thread(is_app_enabled, APP_NAME):
        return web.json_response(
            {"error": "kiro-desktop-pet is disabled", "code": "app_disabled"},
            status=403,
        )
    return web.json_response({"skin": await asyncio.to_thread(_read_skin)})


async def _set_skin(request: web.Request) -> web.Response:
    if not await asyncio.to_thread(is_app_enabled, APP_NAME):
        return web.json_response(
            {"error": "kiro-desktop-pet is disabled", "code": "app_disabled"},
            status=403,
        )

    try:
        body = await request.json()
    except ValueError:
        body = {}
    skin = body.get("skin") if isinstance(body, dict) else None
    if skin not in VALID_SKINS:
        return web.json_response(
            {"error": "skin must be business or casual", "code": "invalid_skin"},
            status=400,
        )

    try:
        await asyncio.to_thread(_write_skin, skin)
    except OSError:
        return web.json_response(
            {"error": "could not save skin", "code": "skin_write_failed"},
            status=503,
        )
    return web.json_response({"ok": True, "skin": skin})


def register_routes(app: web.Application) -> None:
    app.router.add_get(f"{BASE}/skin", _get_skin)
    app.router.add_put(f"{BASE}/skin", _set_skin)
