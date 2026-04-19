# AGENTS.md

Project agents guidance for `art-space-next`.

## 🧭 Navigation Rules (MANDATORY)
1.  **Entry Point**: ALWAYS start by reading [src/README.md](file:///d:/data/learning/work/real-work/art-space-next/src/README.md) to understand current architecture before searching.
2.  **Feature Discovery**: Before touching a feature, read its local `README.md` (e.g., `src/features/auth/README.md`).
3.  **Documentation Rule**: Whenever the architecture, platform sync, or model lookup of a feature changes, the corresponding `README.md` MUST be updated in the same turn to prevent documentation rot.

## 🎯 Source of Truth
- **Models/Entities**: [src/types/models/](file:///d:/data/learning/work/real-work/art-space-next/src/types/models/)
- **Data Fetching Keys**: [src/config/query-keys.ts](file:///d:/data/learning/work/real-work/art-space-next/src/config/query-keys.ts)
- **API Implementation**: [src/features/service/artspace/](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/)
- **Session State**: [src/features/auth/store.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/auth/store.ts) (Zustand)

## 🏗️ Technical Standards
- **Stack**: Next.js App Router, Tailwind CSS, Zustand, React Query, Axios.
- **Pattern**: vertical feature slices. Components in `app/` should be thin compositors; logic lives in `features/`.
- **Formatting**: Match existing patterns. Add comments only when logic is non-obvious. No Unicode in ASCII files.

## ✅ Verification
- **Testing**: Run relevant tests when changes are non-trivial. If tests aren't run, state why.
- **Rules**: Avoid destructive commands unless explicitly requested.
