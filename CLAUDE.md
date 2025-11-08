# CLAUDE.md - EngineerDNA Website Navigation Guide

## PRODUCT OVERVIEW
Marketing website for EngineerDNA - an open-source alternative to LinearB and Jellyfish for engineering metrics.

### What This Is
- **Static Astro website** deployed to GitHub Pages at engineerdna.com
- Marketing content: hero, features, how-it-works, plugins, community
- **NOT the EngineerDNA application** (that's a separate Go + React desktop app)

### Tech Stack
- **Framework**: Astro 4.x (static site generation, zero JS by default)
- **Styling**: Tailwind CSS 3.x (utility-first)
- **Interactive**: React 18+ islands (copy buttons, mobile menu only)
- **Build**: Node.js 20+, npm
- **Deploy**: GitHub Actions → GitHub Pages

## NAVIGATION
The `.claude/` directory contains all Claude Code configuration:
- **agents/** - AI subagents for implementation, testing, docs, review
- **hooks/** - Automated validation and build checking
- **skills/** - Multi-file workflows for complex procedures

## CRITICAL PROJECT-WIDE RULES

1. **Static site only** - No backend, no database, no API endpoints
2. **Astro patterns** - Zero JS by default, React islands for interactivity only
3. **Kebab-case file names** - `hero.astro`, `install-button.tsx` (NOT `Hero.astro`, `InstallButton.tsx`)
4. **Tailwind utility-first** - Use design tokens from `tailwind.config.mjs`
5. **Dark mode default** - Primary color scheme is dark (`bg-primary: #0a0a0a`)
6. **500 LOC limit per file** - Enforced by hooks for `.astro`, `.ts`, `.tsx` files
7. **NO emojis ANYWHERE** - Code, docs, commits, PRs (enforced by hooks)
8. **Dead code removal** - Run `npx knip` before commits to main
9. **Prettier formatting** - All `.astro`, `.ts`, `.tsx` files formatted
10. **Component islands** - Use `client:load` or `client:visible` for React components
11. **Always run checks** - Before and after work (typecheck, lint, build)
12. **Professional naming** - No "refactored", "v2", "new" in file names
13. **No partial implementations** - Every line must work, no TODOs
14. **Test what you build** - Verify in browser, don't assume
15. **UTC timestamps** - N/A (static site has no timestamps)
16. **NO aspirational code** - Delete unused components immediately

## QUICK START CHECKLIST

### Before ANY Work:
```bash
pwd                    # Verify current directory
git status             # Check branch and uncommitted changes
npm run typecheck      # Check TypeScript types
npm run lint           # Run ESLint
```

### After ANY Work:
```bash
npm run typecheck      # Fix any type errors
npm run lint           # Fix any linting issues
npm run build          # Ensure production build works
npm run preview        # Test production build locally
git diff               # Review all changes
```

### When Creating Components:
```bash
# Check if exports are used
npx knip
```

## AI AGENT BEHAVIOR PRINCIPLES

### Code Quality Standards
1. **NO SHORTCUTS** - Complete, production-ready implementations only
   - No stubs, TODOs, or "will implement later" comments
   - No placeholder functions or mock data
   - Every component must render correctly
   - Every interactive element must work

2. **CRITICAL THINKING REQUIRED** - Challenge incorrect assumptions
   - Don't automatically agree - evaluate requests against Astro best practices
   - If user's approach conflicts with static site patterns, explain why
   - Present evidence from docs/codebase to support your position
   - Example: "The user wants client-side state, but Astro component props would be more appropriate because..."

3. **ABSOLUTE HONESTY** - Report actual results, not desired outcomes
   - If build fails, show the failure and fix it - don't pretend it passed
   - If component doesn't render, acknowledge it and resolve it
   - If you can't find something, say so - don't make up file paths
   - Reality example: "The build failed with error X. Let me fix it..." NOT "The build passed successfully"

### Implementation Integrity
- **Every line of code must work** - No partial implementations
- **Test what you build** - View in browser, verify functionality
- **Fix what breaks** - Don't move on until current work is solid
- **Report accurately** - Your credibility depends on truthfulness

## AI AGENT ORCHESTRATION

### YOU ARE THE ORCHESTRATOR

### Available Agents (.claude/agents/)
Agents are stateless LLM subagents invoked via Task tool. See .claude/agents/CLAUDE.md for details.

### Agent Pipeline

```
engineer (Astro/React) → quality (npm checks) → ui-tester (Chrome) → docs → advisor
```

### Efficient Routing by Task Type

| Task Type | Agent Pipeline | Skip Agents If |
|-----------|---------------|----------------|
| **New page** | engineer → quality → ui-tester → advisor | Standard page |
| **New component** | engineer → quality → ui-tester → advisor | Standard component |
| **Bug/Type Fix** | engineer → quality → Done | Clear fix |
| **Styling Update** | engineer → ui-tester → Done | Visual only |
| **Review Request** | advisor → engineer (if issues) | Code review |
| **Docs Update** | docs → advisor | Documentation only |

**One Task = One Engineer invocation. NEVER pass todo lists.**

### Context Accumulation (CRITICAL)

**AGENTS ARE STATELESS - Pass complete context in each invocation:**

- **Requirements**: What needs to be built/fixed
- **Design spec**: Component structure, styling, responsive behavior
- **File locations**: Which files to create/modify
- **Previous results**: What previous agents found (errors, issues)

### Iteration & Backward Flow Rules

**When to go BACKWARD in the pipeline:**
- **quality fails checks** → Back to engineer with specific errors
- **ui-tester finds broken UI** → Back to engineer to fix rendering
- **advisor blocks with issues** → Back to engineer with specific fixes

**When to STOP and ask user:**
- Multiple back-and-forth attempts fail (>3 cycles)
- Design requirements unclear
- Conflicting requirements discovered

### Common Fixes to Apply Automatically
- **Blank page**: Check Astro dev server, restart with `npm run dev`
- **Module not found**: Check imports, verify file paths
- **Type error**: Run `npm run typecheck` for details
- **Build error**: Check `npm run build` output

## COMMON MISTAKES (TOP 5)

1. **Not Running Checks** - Always run pre/post work checklists
2. **Wrong Directory** - Always `pwd` first (should be /Users/ryanspoone/dev/site)
3. **Creating PascalCase Files** - Use kebab-case: `hero.astro` not `Hero.astro`
4. **Adding Client-Side JS Unnecessarily** - Astro is zero JS by default
5. **Forgetting to Test** - Always view in browser, don't assume it works

## DEV SERVER MANAGEMENT

### Astro Dev Server
```bash
# Start dev server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Hot Reload
- Astro dev server has automatic hot reload
- Just save files and browser updates
- No manual restart needed (unlike build artifacts)

### When to Restart
- After installing new dependencies: `npm install`
- If hot reload stops working: Ctrl+C and `npm run dev` again
- Port conflict on 4321: Kill existing process first

### Port Assignment
- **4321**: Astro dev server (both dev and preview)

## TROUBLESHOOTING GUIDE

### Build Errors
**Problem**: `npm run build` fails

**Diagnosis Steps**:
1. Check TypeScript errors: `npm run typecheck`
2. Check ESLint errors: `npm run lint`
3. Check for missing imports
4. Verify Astro config is valid

**Common Errors**:
| Error | Fix |
|-------|-----|
| Module not found | Check import path, verify file exists |
| Type error | Add proper TypeScript types |
| Astro syntax error | Check frontmatter `---` delimiters |
| React component not rendering | Add `client:load` or `client:visible` directive |

### UI Issues
**Problem**: Component doesn't render or looks wrong

**Diagnosis Steps**:
1. Check browser console for errors (F12)
2. Verify Tailwind classes are correct
3. Check responsive breakpoints (mobile, tablet, desktop)
4. Inspect element to verify HTML structure

**Common Issues**:
| Issue | Fix |
|-------|-----|
| Blank page | Check dev server running on port 4321 |
| Styles not applied | Verify Tailwind class names, check config |
| Component not interactive | Missing `client:*` directive on React island |
| Layout broken on mobile | Add responsive prefixes (`md:`, `lg:`) |

## QUICK REFERENCE

### Development
```bash
# Development workflow
npm run dev            # Start dev server (localhost:4321)
npm run typecheck      # Check TypeScript types
npm run lint           # Run ESLint
npm run build          # Build for production
npm run preview        # Preview production build

# Dead code checking
npx knip               # Find unused exports/files
```

### File Structure
```
src/
├── pages/              # Routes (.astro files)
│   ├── index.astro     # Homepage (/)
│   ├── how-it-works.astro  # /how-it-works
│   ├── plugins.astro   # /plugins
│   └── community.astro # /community
├── components/         # Reusable components
│   ├── header.astro    # Static Astro component
│   ├── footer.astro    # Static Astro component
│   ├── hero.astro      # Static Astro component
│   └── install-button.tsx  # React island (interactive)
├── layouts/
│   └── base-layout.astro   # Shared page wrapper
└── styles/
    └── global.css      # Tailwind imports + custom styles

public/
├── CNAME               # engineerdna.com
├── favicon.svg
├── og-image.svg        # Social sharing image
└── robots.txt          # Search engine directives
```

### Key Design Tokens (tailwind.config.mjs)
```javascript
colors: {
  'bg-primary': '#0a0a0a',      // Near-black background
  'bg-secondary': '#1a1a1a',    // Elevated surfaces
  'bg-tertiary': '#2a2a2a',     // Higher elevation
  'text-primary': '#e5e5e5',    // Main text
  'text-secondary': '#a3a3a3',  // Secondary text
  'text-tertiary': '#737373',   // Tertiary text
  'accent-primary': '#3b82f6',  // Blue (CTAs)
  'accent-secondary': '#60a5fa', // Lighter blue
},
fontFamily: {
  sans: ['Inter', 'system-ui', ...], // Main font
  mono: ['JetBrains Mono', ...],     // Code font
}
```

### Messaging Guidelines
**Voice & Tone**: Direct, technical, confident

**What To Say**:
- "Desktop app that opens in your browser"
- "Runs on localhost:3847"
- "100% open source, Apache 2.0"

**What NOT To Say**:
- "Self-hosted" (incorrect - it's a desktop app)
- "Better than LinearB" (comparative marketing)
- "Seamless integration" (buzzword)
