# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project called "Green Glide" (formerly CANDYMAN EXOTICS), a cannabis marketplace web application built with shadcn/ui components and Tailwind CSS. The project is managed via Lovable.dev and follows a single-page application (SPA) architecture.

## Development Commands

```bash
# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Application Structure

- **Entry Point**: `src/main.tsx` → `src/App.tsx`
- **Routing**: React Router v6 with `BrowserRouter`
  - All custom routes must be added ABOVE the catch-all "*" route in `App.tsx:19`
  - NotFound page handles 404s
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components (~50 components in `src/components/ui/`)
- **Styling**: Tailwind CSS with custom design system

### Directory Structure

```
src/
├── components/        # Feature components (Hero, Footer, etc.)
│   └── ui/           # shadcn/ui components (auto-generated)
├── pages/            # Route pages (Index, NotFound)
├── hooks/            # Custom React hooks (use-mobile, use-toast)
├── lib/              # Utilities (utils.ts for cn() helper)
└── assets/           # Static assets
```

### Design System

The project uses a **tropical/holographic cannabis marketplace** design system defined in `src/index.css`:

- **Colors**: All colors use HSL format with CSS custom properties
  - Primary: Deep purple/blue holographic (`--primary`)
  - Secondary: Cannabis green (`--secondary`)
  - Accent: Tropical teal/cyan (`--accent`)
  - Golden: Highlight color (`--golden`)
- **Gradients**: `--gradient-holographic` and `--gradient-tropical`
- **Shadows**: Glow effects via `--shadow-glow` and `--shadow-golden`
- **Animations**: Custom timing functions (`--transition-smooth`, `--transition-bounce`)

**IMPORTANT**: When adding new colors, they MUST be defined as HSL values in `src/index.css` and referenced via CSS custom properties.

### Key Technical Details

- **Path Alias**: `@` resolves to `./src` (configured in `vite.config.ts:19`)
- **Component Tagger**: Uses `lovable-tagger` plugin in development mode for Lovable.dev integration
- **Port**: Dev server runs on `:8080` with IPv6 host (`::`)
- **UI Components**: Generated via shadcn/ui CLI (see `components.json`)
- **Form Validation**: Uses `react-hook-form` + `@hookform/resolvers` + `zod`

### Adding New Routes

When adding routes to the application:

1. Create page component in `src/pages/`
2. Import and add `<Route>` in `src/App.tsx` ABOVE line 20 (the catch-all route)
3. Route components should be default exports

Example:
```tsx
// In App.tsx, add BEFORE the "*" route:
<Route path="/new-page" element={<NewPage />} />
<Route path="*" element={<NotFound />} />
```

### Working with shadcn/ui

- Components are in `src/components/ui/` (auto-managed)
- Use the `cn()` utility from `src/lib/utils.ts` for conditional className merging
- Import components from `@/components/ui/[component-name]`

### Styling Guidelines

- Use Tailwind utility classes
- Reference design system colors via `bg-primary`, `text-golden`, etc.
- For custom styles, extend in `tailwind.config.ts` or use CSS custom properties in `src/index.css`
- The theme uses a dark background by default (no separate dark mode toggle needed)

## Integration Notes

- **Lovable.dev**: Changes pushed to this repo sync with Lovable project
- **Build Modes**: Use `npm run build:dev` for development builds (includes component tagger)
- **TypeScript**: Configured with separate tsconfig files (app, node, base)
