# Agent Architecture

## Agent Pipeline

For EngineerDNA Website (Astro static site):

```
engineer (Astro/React) → quality (npm checks) → ui-tester (Chrome) → docs → advisor
```

**Simplified pipelines:**
- Pages/components: `engineer → quality → ui-tester → advisor`
- Docs only: `docs → advisor`
- Quick fixes: `engineer → quality → advisor`

**NOT USED FOR WEBSITE:**
- integration-checker (no plugin system)
- security (no backend, static site)

## Agent Principles

### 1. Single Responsibility
Each agent has ONE focused purpose:
- **engineer**: Implementation only (Go + React)
- **quality**: Testing and verification only
- **integration-checker**: Plugin system integration testing only
- **security**: Security review only
- **ui-tester**: Frontend/UI testing only
- **docs**: Documentation management only
- **advisor**: Final production readiness review only

### 2. Stateless Design
Agents don't remember previous iterations. Each invocation needs:
- Full context from previous agents
- Complete file list with changes
- All relevant success criteria
- Known issues or blockers

### 3. Evidence-Based Claims
**NO TOOL CALL = NO CLAIM**

Every claim must be backed by tool evidence:
```yaml
claim: "Tests pass"
tool: Bash
command: go test ./...
result: ok    github.com/...
```

### 4. Exhaustiveness Protocol
After finding ANY issue, search for ALL instances:
1. Find first occurrence
2. Extract searchable pattern  
3. Grep entire codebase
4. Document ALL instances
5. Fix/report ALL, not just first

### 5. Error Handling
After EVERY tool call:
1. Check result status
2. If error → STOP immediately
3. Investigate cause
4. Fix issue
5. Retry
6. Verify success before continuing

## Agent Handoff Context

### Engineer → Quality
```yaml
FILES_CHANGED:
  - path: what changed
TESTS_ADDED:
  - test: what it verifies
SECURITY_IMPLEMENTED:
  - organization filtering: where/how
```

### Quality → Integration-Checker
```yaml
TEST_RESULTS:
  - test: pass/fail
VERIFICATION_COMPLETED:
  - go vet: result
  - staticcheck: result
  - go test: result
```

### Integration-Checker → Security
```yaml
INTEGRATION_VERIFIED:
  - Plugin discovery: status
  - JSON-RPC: status
  - Encryption: status
PLUGINS_TESTED:
  - plugin: all methods verified
```

### Security → UI-Tester (if frontend changes)
```yaml
SECURITY_VERIFIED:
  - encryption: verified
  - validation: verified
FRONTEND_CHANGES:
  - files: list of changed files
```

### UI-Tester → Docs
```yaml
UI_VERIFIED:
  - Pages: tested
  - Components: rendering
  - Console: no errors
SCREENSHOTS:
  - page: screenshot file
```

### Docs → Advisor
```yaml
DOCUMENTATION_COMPLETE:
  - Files updated: list
  - CHANGELOG: updated
  - Accuracy verified: yes/no
```

## Tool Access

**engineer**: All tools (Read, Write, Edit, Bash, Grep, Glob)
**quality**: Read-only + Bash (Bash, Read, Grep, Glob)
**integration-checker**: Read-only + Bash (Bash, Read, Grep, Glob)
**security**: Read-only (Read, Grep, Glob)
**ui-tester**: Read-only + Bash + Chrome MCP (Bash, Read, Grep, Glob, chrome_*)
**docs**: Read + Write (Read, Write, Edit, Grep, Glob)
**advisor**: Read-only (Read, Grep, Glob)

## Invocation Patterns

### Automatic
Claude invokes agents based on task description keywords in agent frontmatter.

### Explicit
```
> Use the go-engineer agent to implement the plugin system
> Have the security agent review the encryption implementation
```

### One Task = One Invocation
Do NOT pass todo lists to agents. One task at a time.

**Wrong:**
> Use engineer agent to: 1) add table, 2) create API, 3) add tests

**Right:**
> Use engineer agent to add the events table with anonymization support
[After completion]
> Use engineer agent to create the API endpoint for event ingestion
[After completion]
> Use engineer agent to add tests for the event API

## Agent-Specific Notes

### engineer
- Implements Astro pages, React islands, Tailwind styles
- Follows Astro patterns (zero JS by default)
- Uses kebab-case for file names
- Enforces TypeScript type safety
- NO aspirational code (YAGNI)

### quality
- Verifies build passes (npm run build)
- Checks typecheck and lint
- Ensures production build works
- CANNOT write code
- Returns to engineer if issues found

### ui-tester
- Tests website with Chrome MCP
- Verifies pages render correctly
- Checks responsive design
- Tests React islands work
- Verifies no console errors
- CANNOT write code
- Returns to engineer if broken

### docs
- Creates and updates documentation
- Maintains README, CHANGELOG
- Documents components and pages
- CAN write/edit markdown files only
- Returns to engineer if clarification needed

### advisor
- Final review before deployment
- Checks for regressions
- Verifies best practices
- Fresh-eyes protocol for re-reviews
- APPROVED or BLOCKED decision only

### NOT USED FOR WEBSITE
- **integration-checker**: (no plugin system)
- **security**: (no backend, static site)

## Common Mistakes

1. **Agent writes code when should only verify** → Use disallowedTools
2. **Agent continues after errors** → Enforce error handling protocol
3. **Agent reports first issue only** → Enforce exhaustiveness protocol
4. **Agent lacks context** → Previous agent must provide full handoff
5. **Multiple tasks in one invocation** → Split into sequential agent calls
