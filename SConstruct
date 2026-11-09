"""Cross-platform SCons tasks for the single Vectora GH Bot application."""

from __future__ import annotations

import os
import shutil
import subprocess
import sys

from utils.subprocess_compat import command_for_execution

ROOT = Dir(".").abspath


def _tool(name: str) -> str:
    candidates = (name, f"{name}.cmd", f"{name}.exe") if os.name == "nt" else (name,)
    for candidate in candidates:
        found = shutil.which(candidate)
        if found:
            return found
    raise SystemExit(
        f"Required tool '{name}' was not found. Install the prerequisites in CONTRIBUTING.md."
    )


def _run(*args: str, cwd: str = ROOT) -> None:
    command = [_tool(args[0]), *args[1:]]
    if os.name == "nt" and command[0].lower().endswith((".cmd", ".bat")):
        command_line = subprocess.list2cmdline(command)
        result = subprocess.run(command_line, cwd=cwd, shell=True, check=False)
    else:
        result = subprocess.run(
            command_for_execution(command),
            cwd=cwd,
            stdin=subprocess.DEVNULL,
            check=False,
        )
    if result.returncode:
        raise SystemExit(result.returncode)


def _install(target, source, env):
    _tool("node")
    _tool("pnpm")
    _run("pnpm", "install", "--frozen-lockfile")


def _web(target, source, env):
    _run("pnpm", "build:start")


def _lint(target, source, env):
    _run(
        "pnpm",
        "exec",
        "prettier",
        "--check",
        "app/src",
        "app/vite.config.ts",
        "app/tsconfig.json",
        "docs",
        "README.md",
        "AGENTS.md",
        "CONTRIBUTING.md",
        ".github",
        ".pre-commit-config.yaml",
        ".prettierrc.json",
        "package.json",
        "pnpm-lock.yaml",
    )
    _run("pnpm", "typecheck")


def _tests(target, source, env):
    _run("python", "-m", "unittest", "discover", "-s", "utils", "-p", "test_*.py")
    _run("pnpm", "test")


def _ci(target, source, env):
    _install(target, source, env)
    _lint(target, source, env)
    _web(target, source, env)
    _tests(target, source, env)


def _clean(target, source, env):
    for path in ("app/dist", "app/.output", "coverage", ".scons-logs"):
        absolute = os.path.join(ROOT, path)
        if os.path.isdir(absolute):
            shutil.rmtree(absolute)


def _help(target, source, env):
    print(
        """Vectora GH Bot — alvos SCons (rodar da raiz do repositório)

Setup
  scons install    instala dependências Node do app pelo lockfile

Build
  scons frontend   compila a aplicação TanStack Start; não instala dependências
  scons build      compila a aplicação e a CLI

Qualidade
  scons lint       Prettier e TypeScript typecheck
  scons tests      executa testes definidos pelo app e tooling compartilhado
  scons ci         install + lint + build + tests

Manutenção
  scons clean      remove outputs de build
"""
    )


def _build(target, source, env):
    _web(target, source, env)
    _run("pnpm", "run", "build:cli")


env = Environment(ENV=os.environ)
for name, action in {
    "_help": _help,
    "_install": _install,
    "_frontend": _web,
    "_build": _build,
    "_lint": _lint,
    "_tests": _tests,
    "_ci": _ci,
    "_clean": _clean,
}.items():
    env.Command(name, [], action)

Default("_help")
for alias, target in {
    "install": "_install",
    "frontend": "_frontend",
    "build": "_build",
    "lint": "_lint",
    "tests": "_tests",
    "ci": "_ci",
    "clean": "_clean",
}.items():
    Alias(alias, target)
