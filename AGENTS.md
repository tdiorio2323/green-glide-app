# Repository Guidelines

This Vite + React + TypeScript app powers the Green Glide experience, with UI primitives from shadcn/ui and Tailwind CSS. Follow the guidance below to keep contributions consistent and production-ready.

## Project Structure & Module Organization
- `src/` holds all runtime code. Use `components/` for reusable UI, `pages/` for routed views, `hooks/` for shared logic, `data/` for static datasets, and `lib/` for utilities and service wrappers. Entry points live in `main.tsx` and `routes.ts`.
- Static assets belong in `public/` for Vite to serve, while generated bundles land in `dist/` after `npm run build`.
- Global styling and theme tokens are managed via `tailwind.config.ts`, `postcss.config.js`, and `src/index.css`. ESLint and TS config files at the repo root steer linting and module resolution (notably the `@/` alias to `src/`).

## Build, Test, and Development Commands
- `npm install` ensures local dependencies match the lockfile.
- `npm run dev` starts Vite at `http://localhost:5173` with hot module reload.
- `npm run build` compiles an optimized production bundle; `npm run build:dev` emits a development build useful for profiling.
- `npm run preview` serves the `dist/` output locally to mirror deploy behavior.
- `npm run lint` applies the shared ESLint/Tailwind ruleset for static checks.

## Coding Style & Naming Conventions
- Stick to TypeScript, ES modules, and 2-space indentation. Prefer functional React components with `PascalCase` names and file-local hooks using `use` prefixes.
- Scope Tailwind utility classes in JSX; extract repeated styling into shadcn/ui components or `lib/utils.ts` helpers.
- Import application code through `@/...` paths to preserve consistency when files move.

## Testing Guidelines
- Automated testing is not wired yet; include manual verification notes in each PR (routes exercised, browsers checked).
- When adding tests, colocate `*.test.ts(x)` beside the subject or under `src/__tests__/`, and wire a `test` script (e.g., Vitest + Testing Library) so future contributors can run `npm run test`.
- Provide coverage expectations with new frameworks (target >80% statement coverage for critical modules) and document any gaps in the PR.

## Commit & Pull Request Guidelines
- Follow the Conventional Commit prefixes seen in history (`feat:`, `fix:`, `update:`, `add:`) and keep subject lines under ~72 characters.
- Open PRs with a concise summary, linked issue or task reference, screenshots/GIFs for visual changes, and clear testing notes. Include deployment considerations (env vars, migrations) when relevant.
- Ensure lint passes before review and request re-review after any force-push.
