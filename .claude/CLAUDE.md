# .claude Directory - Claude Code Configuration Guide

## WHAT IS THIS DIRECTORY?

The `.claude/` directory contains all Claude Code configuration for the EngineerDNA Website project:
- **Agents**: Specialized AI subagents for task-specific workflows
- **Skills**: Multi-file workflows for complex procedures
- **Hooks**: Event-driven automation and validation
- **Settings**: Project-wide configuration

**IMPORTANT:** This is the Astro marketing website, NOT the EngineerDNA Go application.

## DIRECTORY STRUCTURE

```
.claude/
├── CLAUDE.md                    # This file - navigation guide
├── settings.json                # Configuration and hooks
├── settings.local.json          # Local overrides (gitignored)
├── agents/                      # AI subagents (5 total)
│   ├── CLAUDE.md               # Agent architecture guide
│   ├── engineer.md             # Astro/React/Tailwind implementation
│   ├── quality.md              # Build and lint verification
│   ├── ui-tester.md            # Website testing with Chrome
│   ├── docs.md                 # Documentation management
│   └── advisor.md              # Code review
├── skills/                      # Complex workflows (6 total)
│   ├── using-claude-code/
│   │   ├── SKILL.md
│   │   └── reference/
│   ├── dev-server-diagnostics/
│   │   └── SKILL.md
│   ├── authoring-skills/
│   ├── using-mcp-tools/
│   ├── writing-agents/
│   └── writing-claude-md/
├── hooks/                       # Automated hooks (13 total)
│   ├── activate_skills.py       # Auto-suggest skills
│   ├── skill-rules.json         # Skill mapping config
│   ├── prevent_main_commits.sh  # Block commits to main
│   ├── validate_no_emojis.py    # Enforce no emojis
│   ├── validate_no_dev_markers.sh # Block TODO/FIXME/HACK
│   ├── prevent-no-verify.py     # Block --no-verify flag
│   ├── validate_version_bump.py # Enforce CHANGELOG updates
│   ├── validate_dead_code.py    # Check for dead code (knip)
│   ├── validate_formatting.py   # Enforce code formatting (prettier)
│   ├── validate_md_files.py     # Block unauthorized markdown
│   ├── validate_file_size.py    # Enforce 500 LOC limit
│   ├── validate_bash_usage.py   # Enforce proper tool usage
│   ├── track_edits.py           # Track file edits (.ts/.tsx/.astro)
│   ├── check_build.py           # Auto-run typecheck after edits
│   ├── check_ignored_errors.py  # Detect ignored errors
│   ├── log_agent_metrics.sh     # Log agent metrics
│   └── manage_dev_docs.py       # Auto-manage dev docs
├── scripts/                     # Validation utilities
└── logs/                        # Metrics and archives (gitignored)
```

## QUICK START

### Before ANY Work
```bash
pwd
git status
npm run typecheck  # TypeScript errors
npm run lint       # ESLint
```

### After ANY Work

**Astro Website:**
```bash
npm run typecheck  # TypeScript errors
npm run lint       # ESLint
npm run build      # Build for production
npm run preview    # Test production build
```

**Always:**
```bash
git diff  # review changes
```

## AGENTS (AI Subagents)

Specialized AI assistants for specific tasks. Automatically invoked by Claude or explicitly requested.

### Agent Pipeline (for website work)
```
engineer (Astro/React) → quality (npm checks) → ui-tester (Chrome) → docs → advisor
```

**NOTE:** For static website, we skip integration-checker and security agents.

### Key Agents

**engineer**: Astro/React/Tailwind implementation
- When: "implement", "fix", "create", "build", "component", "page", "layout", "styling"
- Output: Working Astro pages, React components, Tailwind styles

**quality**: Build and lint verification
- When: Build fail, lint errors, TypeScript errors
- Output: npm run build, typecheck, lint results

**ui-tester**: Website testing with Chrome
- When: "test website", "check page", "responsive design", "button not working", "layout broken"
- Output: Screenshots, console errors, responsive design verification

**docs**: Documentation management
- When: "update README", "write docs", "document component"
- Output: Updated documentation, CHANGELOG entries

**advisor**: Final review
- When: "review", "ready to deploy", "looks good?"
- Output: APPROVED/BLOCKED decision

### Invoking Agents

**Automatic** (Claude decides):
```
> Create the homepage hero section
Claude uses: engineer (Astro) → ui-tester → advisor

> Add the install button component
Claude uses: engineer (React island) → ui-tester → advisor

> Build the plugins page with plugin cards
Claude uses: engineer → ui-tester → advisor

> Update the README with deployment instructions
Claude uses: docs → advisor
```

**Explicit** (you specify):
```
> Use the engineer agent to create the How It Works page
> Use the ui-tester agent to verify responsive design on mobile
> Have the docs agent update the README
> Use the advisor agent to review before deployment
```

## SKILLS

Complex multi-file workflows. Automatically invoked when relevant or explicitly requested.

### using-claude-code
- **When**: Creating Skills, Hooks, Agents, or questions about Claude Code patterns
- **Does**: Guides usage of Claude Code best practices and project structure

### dev-server-diagnostics
- **When**: "localhost not loading", "dev server not responding", connection errors
- **Does**: Diagnoses Astro dev server issues (localhost:4321)

**To use explicitly**:
- "Use the dev-server-diagnostics skill to debug localhost:4321"

## AUTOMATIC WORKFLOW SYSTEMS

### Skills Auto-Activation
The `activate_skills.py` hook analyzes prompts BEFORE Claude sees them and suggests relevant skills based on `skill-rules.json` configuration.

**How it works**:
1. You submit a prompt
2. Hook analyzes keywords and intent patterns
3. Matches to skills in skill-rules.json
4. Suggests relevant skills to Claude
5. Claude decides whether to use them

**Disable**: Remove or comment out the UserPromptSubmit hook in settings.json

### Automatic Build Checking
The `check_build.py` hook runs after Stop events to automatically check TypeScript/Astro code.

**How it works**:
1. `track_edits.py` tracks when .ts, .tsx, or .astro files are modified
2. On Stop, `check_build.py` checks if frontend files changed
3. If yes, runs `npm run typecheck` and `npm run lint` automatically
4. Reports any compilation or lint errors

**Disable**: Remove or comment out the Stop hooks in settings.json

## HOOKS REFERENCE

Event-driven automation. Runs automatically at specific points.

### UserPromptSubmit Hooks (Run BEFORE Claude sees prompts)

- **activate_skills.py**: Suggests relevant skills based on prompt analysis

### PreToolUse Hooks (Run BEFORE actions)

**Bash commands**:
- **prevent_main_commits.sh**: Block commits to main branch
- **validate_no_emojis.py**: Block emojis in commits and PRs
- **validate_no_dev_markers.sh**: Block TODO/FIXME/HACK in commits
- **prevent-no-verify.py**: Block --no-verify flag in git commands
- **validate_bash_usage.py**: Enforce proper tool usage

**File operations** (Edit, Write):
- **validate_md_files.py**: Enforce authorized .md files only
- **validate_file_size.py**: Enforce 500 LOC limit on source files
- **validate_no_emojis.py**: Block emoji characters in code

### PostToolUse Hooks (Run AFTER actions)

**Edit/Write operations**:
- **track_edits.py**: Track file edits for build checking (.ts/.tsx/.astro)

**Bash commands**:
- Remind to test after build

### Stop Hooks (Run at END of each response)

- **manage_dev_docs.py**: Auto-create and update development docs
- **check_build.py**: Auto-run `npm run typecheck` if frontend files were edited
- Display post-work checklist reminder

### SessionStart Hooks (Run at START of session)

- Show environment info (directory, branch)
- Display pre-work and post-work checklists

### SubagentStop Hooks (Run AFTER subagent completes)

- **check_ignored_errors.py**: Detect and block ignored tool errors
- **log_agent_metrics.sh**: Track agent usage metrics

---

## COMMON WORKFLOWS

| Workflow | Steps | Notes |
|----------|-------|-------|
| New Page/Component | engineer → quality → ui-tester → advisor | Agent pipeline auto-invoked |
| Bug Fix | engineer → quality → advisor | Engineer agent direct |
| Styling Update | engineer → ui-tester → advisor | Visual verification |
| Code Review | advisor agent review | Final production readiness |

### Quick Reference

**Agent Usage**:
- Let Claude invoke agents automatically (it knows when)
- One task = one agent invocation (don't pass todo lists)
- Agent pipeline flows backward on errors (quality → engineer)

**Skills**:
- Keep SKILL.md under 500 lines (progressive disclosure)
- Use reference/ subdirectory for detailed docs
- Auto-invoked when description matches context

**Hooks**:
- Hooks solve problems, don't punt to Claude
- Enforce critical rules automatically (security, validation)
- Always quote shell variables, block path traversal

## TROUBLESHOOTING

### Agent Not Invoked
```
# Check agent description in .claude/agents/[name].md
# Use explicit invocation: "Use the [agent] agent to..."
```

### Skill Not Working
```
# Check skill description in .claude/skills/[name]/SKILL.md
# Verify skill-rules.json has correct triggers
# Use explicit invocation: "Use the [skill-name] skill to..."
```

### Hook Blocking Action
```
# Hooks enforce critical rules (main commits, emojis, dev markers)
# Fix the underlying issue, don't bypass the hook
# Check hook error message for specific violation
```

## EXTENDING CLAUDE CODE

### Adding New Skill

1. Create directory: `.claude/skills/my-skill/`
2. Create SKILL.md with frontmatter:
```yaml
---
name: my-skill
description: What this skill does and when to use it
---
# Content here
```
3. Add entry to `.claude/hooks/skill-rules.json`
4. Add reference/ subdirectory for detailed docs

### Adding New Agent

1. Create `.claude/agents/my-agent.md`
2. Add frontmatter with name, description, tools
3. Document agent's responsibility and protocols
4. Add to agent pipeline if needed

### Adding New Hook

Edit `.claude/settings.json` to add hook configuration.

See Claude Code documentation for hook event types.

## REFERENCE

### Project Documentation
- **Root CLAUDE.md**: Website project overview and tech stack (../CLAUDE.md)
- **.claude/CLAUDE.md**: This file - Claude Code configuration guide
- **Agent CLAUDE.md**: Agent architecture and patterns (agents/CLAUDE.md)

### Astro Documentation
- [Astro Docs](https://docs.astro.build)
- [Astro Components](https://docs.astro.build/en/core-concepts/astro-components/)
- [Astro Islands](https://docs.astro.build/en/concepts/islands/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

### Claude Code Documentation
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Skills Best Practices](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [Hooks Guide](https://docs.anthropic.com/en/docs/claude-code/hooks-guide)
- [Hooks Reference](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents)

## GETTING HELP

- Ask Claude: "What agents are available?"
- Ask Claude: "What skills are available?"
- Check agent files in `.claude/agents/` for capabilities
- Check skill files in `.claude/skills/` for workflows
