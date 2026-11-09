#!/usr/bin/env python3
"""Small repository checks shared by local hooks and GitHub Actions."""

from __future__ import annotations

import os
import platform
import re
import shutil
import sys


def environment() -> int:
    system = platform.system()
    print(
        f"Development environment: OS={system} ({platform.release()}), "
        f"arch={platform.machine()}, Python={platform.python_version()}"
    )
    if system not in {"Linux", "Windows", "Darwin"}:
        print("Supported development hosts are Linux, Windows, and macOS.", file=sys.stderr)
        return 2

    missing = []
    for name in ("git", "node", "pnpm", "scons"):
        executable = shutil.which(name) or (shutil.which(f"{name}.cmd") if os.name == "nt" else None)
        if executable:
            print(f"  {name}: {executable}")
        else:
            print(f"  {name}: missing")
            missing.append(name)
    if missing:
        print("Install missing tools using the setup instructions in CONTRIBUTING.md.", file=sys.stderr)
        return 1
    return 0


def pr_metadata() -> int:
    title = os.environ.get("PR_TITLE", "").strip()
    body = os.environ.get("PR_BODY", "")
    if not title:
        print("PR_TITLE is required.", file=sys.stderr)
        return 2

    conventional = r"^(feat|fix|docs|refactor|test|chore|build|ci|perf|style|revert)(\([a-z0-9._/-]+\))?: .+"
    if not re.match(conventional, title):
        print("Use um título de PR em português no formato Conventional Commits.", file=sys.stderr)
        return 1

    english_headings = re.findall(r"(?m)^##\s+(Summary|Description|Testing|Checklist)\s*$", body)
    if english_headings:
        print("Use títulos de seção em português na descrição do PR.", file=sys.stderr)
        return 1
    print("Metadados do PR válidos.")
    return 0


def main() -> int:
    commands = {"environment": environment, "pr-metadata": pr_metadata}
    if len(sys.argv) != 2 or sys.argv[1] not in commands:
        print("Uso: python utils/checks.py {environment|pr-metadata}", file=sys.stderr)
        return 2
    return commands[sys.argv[1]]()


if __name__ == "__main__":
    raise SystemExit(main())
