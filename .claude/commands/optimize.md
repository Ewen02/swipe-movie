Run a comprehensive code audit for the Swipe Movie project.

If `$ARGUMENTS` is provided, focus on that area. Valid focus areas: `api`, `web`, `database`, `security`, `performance`, `types`. If no argument, run the full audit.

---

## Phase 1 — Scan automatique

Launch up to 3 Explore agents **in parallel** to scan the codebase. Adapt scope based on `$ARGUMENTS`.

**Agent 1 — Code quality & patterns (API):**
- Read all service files in `apps/api/src/modules/*/` — look for:
  - Functions longer than 50 lines
  - Duplicated logic across services
  - Missing error handling (try/catch around external calls)
  - N+1 query patterns (loops with individual DB queries)
  - Hardcoded values that should be constants/config
  - Missing input validation on controller parameters
  - Inconsistent naming conventions
- Read `apps/api/src/common/` — check middleware, guards, decorators for consistency
- Read `apps/api/src/infra/` — check Prisma setup, connection handling

**Agent 2 — Code quality & patterns (Web):**
- Read all page files in `apps/web/src/app/` — look for:
  - Large components (>200 lines) that should be split
  - Missing loading/error states
  - Inline styles or magic numbers
  - Missing `useCallback`/`useMemo` on expensive operations
  - Props drilling (>3 levels deep)
  - Missing accessibility attributes (alt, aria-label, role)
  - Client components that could be server components
- Read hooks in `apps/web/src/hooks/` — check for:
  - Duplicated fetch logic
  - Missing error handling
  - Inconsistent SWR configuration
  - Memory leaks (missing cleanup in useEffect)
- Read `apps/web/src/lib/` — check API client, auth, utilities

**Agent 3 — Infrastructure & config:**
- Read `packages/database/prisma/schema.prisma` — check for:
  - Missing indexes on frequently queried fields
  - Missing cascade delete rules
  - Unused or redundant fields
  - Missing unique constraints
- Read `docker/docker-compose.yml` — check for best practices
- Read `apps/api/package.json` and `apps/web/package.json` — check for:
  - Outdated or unused dependencies
  - Missing scripts
  - Security vulnerabilities (deprecated packages)
- Read `.github/workflows/ci.yml` — check CI pipeline quality
- Check TypeScript config strictness in `tsconfig.json` files
- Run `git diff --stat HEAD~20` to see recently changed files (focus audit there)

---

## Phase 2 — Analyse et classification

For each issue found, classify it:

### Categories:
| Category | Description |
|----------|-------------|
| `refactor` | Code that works but is hard to read, maintain, or extend |
| `performance` | Inefficient queries, missing caching, unnecessary re-renders |
| `security` | Potential vulnerabilities, missing validation, exposed secrets |
| `types` | Missing or weak TypeScript types, `any` usage, missing generics |
| `clean-code` | Dead code, unused imports, inconsistent patterns, magic values |
| `best-practice` | Violations of NestJS/Next.js/React conventions |
| `testing` | Missing tests for critical paths, untested edge cases |
| `accessibility` | Missing ARIA, poor keyboard navigation, contrast issues |

### Severity levels:
- **Critical**: Security vulnerabilities, data loss risks, crashes
- **High**: Performance issues, broken patterns that scale badly
- **Medium**: Code quality issues that slow development
- **Low**: Style/convention issues, nice-to-haves

### Effort levels:
- **S**: < 30 minutes, single file change
- **M**: 1-3 hours, multiple files
- **L**: Half day+, architectural change

---

## Phase 3 — Rapport structure

Present the audit report in this exact format:

```markdown
# Code Audit — YYYY-MM-DD

## Scope: [full | api | web | database | security | performance | types]

## Summary
- X issues found
- Y critical, Z high, W medium
- Estimated total effort: Xh

---

## Critical Issues

| # | Category | File | Issue | Fix | Effort |
|---|----------|------|-------|-----|--------|
| 1 | security | path/to/file.ts:42 | Description | Suggested fix | S/M/L |

## High Priority

| # | Category | File | Issue | Fix | Effort |
|---|----------|------|-------|-----|--------|
| ... | ... | ... | ... | ... | ... |

## Medium Priority

| # | Category | File | Issue | Fix | Effort |
|---|----------|------|-------|-----|--------|
| ... | ... | ... | ... | ... | ... |

## Low Priority

| # | Category | File | Issue | Fix | Effort |
|---|----------|------|-------|-----|--------|
| ... | ... | ... | ... | ... | ... |

---

## Quick Wins (effort S, impact high)
1. ...
2. ...
3. ...

## Refactoring Opportunities
1. ...
2. ...

## Architecture Recommendations
1. ...
```

---

## Phase 4 — Proposition de fixes

After presenting the report, use `AskUserQuestion` to ask:

"Quelles issues veux-tu que je corrige maintenant ?"

Options:
- "Quick wins seulement" — Fix all S-effort, high-impact issues
- "Critical + High" — Fix all critical and high priority issues
- "Tout" — Fix everything possible
- "Aucune" — Just keep the report

If the user chooses to fix issues:
1. Create a todo list with all selected fixes
2. Fix each issue one by one, marking as completed
3. After all fixes, run `pnpm typecheck` to verify nothing is broken
4. Present a summary of changes made

---

## Rules

- Base ALL findings on actual code reading, never assumptions
- Do NOT flag issues that are intentional design decisions documented in CLAUDE.md or comments
- Do NOT suggest adding comments/docstrings to code that is already clear
- Do NOT flag test files for type issues (they often have looser typing)
- Focus on issues that have real impact on maintainability, performance, or security
- When suggesting fixes, reference existing patterns in the codebase
- Be specific: include file paths and line numbers for every issue
- Do NOT refactor working code just for style preferences
- Prioritize issues in recently changed files (more likely to be relevant)
- If `$ARGUMENTS` is `security`, also run: check for hardcoded secrets, exposed env vars, missing rate limits, SQL injection risks, XSS vectors
- If `$ARGUMENTS` is `performance`, also check: bundle size, unnecessary re-renders, missing lazy loading, unoptimized images, slow DB queries
