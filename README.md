# Good Commit — Conventional Commit Generator

A modern, fast, and feature-rich **React (pure JavaScript, no TypeScript)** application styled with **Tailwind CSS** for generating standard Conventional Commit messages adhering strictly to the **Conventional Commits 1.0.0** specification.

## ✨ Features

- **Strict Conventional Commits v1.0.0 Compliance**:
  - Full support for standard types (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`)
  - Automated **Semantic Versioning (SemVer)** mapping (`MAJOR`, `MINOR`, `PATCH`, `NONE`)
  - Optional scope formatting: `<type>(<scope>): <description>`
  - Breaking change exclamation: `<type>(<scope>)!: <description>`
  - Optional multi-line body with 72-character wrap guide and line counters
- **Persistent LocalStorage Scope Caching**:
  - Add and cache scopes automatically
  - Interactive clickable chips to select/deselect scopes
  - Ability to delete individual cached scopes, add custom ones, or reset to common presets
- **Extensive Footers & Git Trailers Support**:
  - **Issues & PRs**: `Closes #123`, `Fixes #456`, `Resolves #789`, `Refs #101`, `See also`
  - **Breaking Change**: `BREAKING CHANGE: <description>` with migration guide
  - **Co-Authors**: `Co-authored-by: Name <email>` for pair programming attribution
  - **Custom Git Trailers**: Key-value trailers (e.g., `Signed-off-by`, `Reviewed-by`, `Migration-Guide`)
- **Theme & Git Icons**:
  - Dark and Light mode toggle (persisted in `localStorage`)
  - Lucide icons with rich Git iconography (`GitCommit`, `GitBranch`, `GitPullRequest`, `Tag`, etc.)
  - Interactive visual Git graph tree node simulation (`git log` preview)
- **Developer Experience**:
  - Live syntax-highlighted terminal preview with macOS/Linux style window controls
  - Multiple copy modes:
    - Raw multi-line commit message
    - Multi-flag git command: `git commit -m "..." -m "..."`
    - Heredoc command for bash/zsh
  - Real-time **Conventional Commits Linter** (imperative mood check, capitalization warnings, trailing period warnings, 50/72 character header length bar)
  - Quick presets/templates (New Feature, Bug Fix with issue, Breaking API Change, Dependency update, etc.)
  - Local commit history drawer to review and re-copy previously saved commits
  - Interactive Conventional Commits v1.0.0 Cheat Sheet modal

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```
