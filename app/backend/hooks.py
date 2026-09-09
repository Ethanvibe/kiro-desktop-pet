"""Start and stop the macOS desktop-pet overlay with the KiroCrew App."""

from __future__ import annotations

import os
import signal
import subprocess
import time
from pathlib import Path
from typing import Any

_PROCESS: subprocess.Popen[bytes] | None = None
_LOG_HANDLE: Any = None


def _app_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _script_path() -> Path:
    return _app_root() / "native" / "macos" / "overlay.js"


def _pid_path(ctx: Any) -> Path:
    return Path(ctx.data_dir) / "overlay.pid"


def _read_pid(ctx: Any) -> int | None:
    try:
        value = int(_pid_path(ctx).read_text("utf-8").strip())
        return value if value > 1 else None
    except (OSError, TypeError, ValueError):
        return None


def _is_our_process(pid: int) -> bool:
    try:
        result = subprocess.run(
            ["/bin/ps", "-p", str(pid), "-o", "command="],
            check=False,
            capture_output=True,
            text=True,
            timeout=2,
        )
    except (OSError, subprocess.SubprocessError):
        return False
    command = result.stdout.strip()
    return result.returncode == 0 and str(_app_root() / "native" / "macos" / "supervise.sh") in command


def _stop_pid(pid: int, logger: Any) -> None:
    if not _is_our_process(pid):
        return
    try:
        os.kill(pid, signal.SIGTERM)
    except ProcessLookupError:
        return
    except OSError as exc:
        logger.warning("desktop pet: could not stop overlay pid %s: %s", pid, exc)
        return

    for _ in range(20):
        if not _is_our_process(pid):
            return
        time.sleep(0.1)
    logger.warning("desktop pet: overlay pid %s did not exit after SIGTERM", pid)


def on_startup(ctx: Any) -> None:
    """Launch one native overlay after the App is enabled."""
    global _LOG_HANDLE, _PROCESS

    if os.uname().sysname != "Darwin":
        raise RuntimeError("Kiro Desktop Pet native overlay currently requires macOS")

    script = _script_path()
    business = _app_root() / "ui" / "assets" / "business.png"
    casual = _app_root() / "ui" / "assets" / "casual.png"
    for required in (script, business, casual):
        if not required.is_file():
            raise RuntimeError(f"desktop pet asset is missing: {required.name}")

    stale_pid = _read_pid(ctx)
    if stale_pid:
        _stop_pid(stale_pid, ctx.logger)

    data_dir = Path(ctx.data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)
    state_path = data_dir / "overlay-state.tsv"
    log_path = data_dir / "overlay.log"
    _LOG_HANDLE = log_path.open("ab", buffering=0)

    supervisor = _app_root() / "native" / "macos" / "supervise.sh"
    command = [
        "/bin/sh",
        str(supervisor),
        str(os.getpid()),
        str(script),
        str(business),
        str(casual),
        str(state_path),
        str(_app_root() / "installed.json"),
        str(_pid_path(ctx)),
    ]
    _PROCESS = subprocess.Popen(
        command,
        stdin=subprocess.DEVNULL,
        stdout=_LOG_HANDLE,
        stderr=subprocess.STDOUT,
        close_fds=True,
        start_new_session=True,
    )
    _pid_path(ctx).write_text(f"{_PROCESS.pid}\n", "utf-8")

    time.sleep(0.35)
    return_code = _PROCESS.poll()
    if return_code is not None:
        _pid_path(ctx).unlink(missing_ok=True)
        _LOG_HANDLE.close()
        _LOG_HANDLE = None
        _PROCESS = None
        raise RuntimeError(
            f"desktop pet overlay exited during startup (code {return_code}); "
            f"see {log_path}"
        )

    ctx.logger.info("desktop pet: native overlay started (pid=%s)", _PROCESS.pid)


def on_shutdown(ctx: Any) -> None:
    """Stop the native overlay when the App is disabled or KiroCrew exits."""
    global _LOG_HANDLE, _PROCESS

    pid = _PROCESS.pid if _PROCESS is not None else _read_pid(ctx)
    if pid:
        _stop_pid(pid, ctx.logger)
    _pid_path(ctx).unlink(missing_ok=True)

    if _LOG_HANDLE is not None:
        try:
            _LOG_HANDLE.close()
        except OSError:
            pass
    _LOG_HANDLE = None
    _PROCESS = None
