#!/usr/bin/env python3
"""
Validates that all code is properly formatted before committing.

Astro/TypeScript: prettier

Exit codes:
  0: All code is formatted or not applicable
  2: Unformatted code found (blocks commit)
"""

import json
import subprocess
import sys
import os
from pathlib import Path


def is_commit_command(command: str) -> bool:
    """Check if this is a git commit command"""
    return 'git commit' in command


def has_frontend_files(project_root: str) -> bool:
    """Check if there are any Astro/TypeScript/TSX files in the staging area"""
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            cwd=project_root,
            capture_output=True,
            text=True,
            timeout=5
        )
        files = result.stdout.strip().split('\n')
        return any(f.endswith(('.ts', '.tsx', '.astro')) for f in files if f)
    except Exception:
        return False


def check_prettier(project_root: str) -> tuple[bool, list[str]]:
    """
    Check if Astro/TypeScript files are formatted with prettier.

    Returns (all_formatted, unformatted_files)
    """
    try:
        src_dir = os.path.join(project_root, 'src')
        if not os.path.exists(src_dir):
            # src directory not found
            return True, []

        # prettier --check for Astro, TS, and TSX files
        result = subprocess.run(
            ['npx', 'prettier', '--check', 'src/**/*.{ts,tsx,astro}'],
            cwd=project_root,
            capture_output=True,
            text=True,
            timeout=30
        )

        # prettier returns non-zero if files need formatting
        if result.returncode == 0:
            return True, []

        # Parse output for unformatted files
        unformatted = []
        for line in result.stdout.split('\n'):
            if line.strip() and not line.startswith('Checking'):
                unformatted.append(line.strip())

        return False, unformatted

    except FileNotFoundError:
        # prettier not found, skip check
        return True, []
    except Exception as e:
        print(f"Error running prettier: {str(e)}", file=sys.stderr)
        return True, []


def format_prettier_output(prettier_files: list[str]) -> str:
    """Format prettier issues for display"""
    lines = [
        "",
        "=" * 80,
        "CODE FORMATTING ISSUES",
        "=" * 80,
        "",
        "Files not formatted with prettier:",
        ""
    ]

    for file in prettier_files:
        lines.append(f"  - {file}")

    lines.extend([
        "",
        "To fix:",
        "  npx prettier --write 'src/**/*.{ts,tsx,astro}'",
        "",
        "  # Or use your editor's format-on-save",
        "",
        "=" * 80,
        ""
    ])

    return "\n".join(lines)


def main():
    try:
        # Read tool input from stdin
        tool_input = json.load(sys.stdin)
        command = tool_input.get('tool_input', {}).get('command', '')

        # Only check on git commit commands
        if not is_commit_command(command):
            sys.exit(0)

        # Get project root
        project_root = os.environ.get('CLAUDE_PROJECT_DIR', os.getcwd())

        # Check prettier formatting if frontend files are staged
        if has_frontend_files(project_root):
            prettier_ok, prettier_files = check_prettier(project_root)

            if not prettier_ok:
                output = format_prettier_output(prettier_files)
                print(output, file=sys.stderr)
                sys.exit(2)  # Block commit

        sys.exit(0)  # Allow commit

    except json.JSONDecodeError:
        # Not valid JSON input, allow
        sys.exit(0)
    except Exception as e:
        print(f"Error in formatting validation: {str(e)}", file=sys.stderr)
        # Don't block on hook errors
        sys.exit(0)


if __name__ == '__main__':
    main()
