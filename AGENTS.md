# AGENTS.md

Project agents guidance for `art-space-next`.

## General
- Keep changes small and focused.
- Prefer `rg` for searches.
- Use `apply_patch` for single-file edits when reasonable.
- Avoid destructive commands unless explicitly requested.

## Code Style
- Match existing patterns and formatting.
- Add comments only when logic is non-obvious.
- Keep files ASCII unless the file already uses Unicode.

## React/Next.js
- Follow established component structure.
- Optimize for performance when touching data fetching or rendering.

## Testing
- Run relevant tests when changes are non-trivial.
- If tests aren't run, say so.
