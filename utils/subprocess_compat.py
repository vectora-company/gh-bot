"""Compatibility helpers for package-manager launchers across operating systems."""

from __future__ import annotations

import os
import shutil
from collections.abc import Sequence
from pathlib import Path


def command_for_execution(command: Sequence[str]) -> list[str]:
    """Run POSIX script launchers without shebang through sh."""
    argv = list(command)
    if os.name == "nt" or not argv:
        return argv

    executable = Path(shutil.which(argv[0]) or argv[0])
    if not executable.is_file():
        return argv
    try:
        with executable.open("rb") as launcher:
            first_line = launcher.readline()
    except OSError:
        return argv

    if first_line.startswith(b"#") and not first_line.startswith(b"#!"):
        return [shutil.which("sh") or "/bin/sh", str(executable), *argv[1:]]
    return argv
