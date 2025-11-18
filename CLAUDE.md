# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project originally called "Green Glide", now rebranded as **CABANA Cannabis Marketplace** (also referred to as "The Candy Kitchen"). It's a cannabis marketplace web application built with shadcn/ui components and Tailwind CSS. The project is managed via Lovable.dev and follows a single-page application (SPA) architecture.

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
  - Routes are centrally defined in `src/routes.ts` as an array of `RouteItem` objects
  - Each route has: `path`, `component`, `label`, and optional `private` flag
  - App.tsx maps over the routes array to generate `<Route>` elements
  - To add new routes: add entry to `routes` array in `src/routes.ts` ABOVE the catch-all "*" route
  - NotFound page handles 404s
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components (~50 components in `src/components/ui/`)
- **Styling**: Tailwind CSS with custom design system

### Directory Structure

```
src/
├── components/        # Feature components (Hero, Footer, ExploreMenus, etc.)
│   └── ui/           # shadcn/ui components (auto-generated)
├── pages/            # Route pages (Index, Dashboard, NotFound, RoutesDebug)
├── hooks/            # Custom React hooks (use-mobile, use-toast)
├── lib/              # Utilities (utils.ts for cn() helper)
├── data/             # Static data (products, categories)
└── assets/           # Static assets
```

### Design System

The project uses a **CABANA tropical/holographic cannabis marketplace** design system defined in `src/index.css`:

- **Colors**: All colors use HSL format with CSS custom properties
  - Primary: Deep purple/blue holographic (`--primary: 250 75% 60%`)
  - Secondary: Cannabis green (`--secondary: 120 30% 25%`)
  - Accent: Tropical teal/cyan (`--accent: 180 75% 55%`)
  - Golden: Highlight color (`--golden: 45 100% 65%`)
  - Background: Dark warm brown (`--background: 12 15% 8%`)
- **Gradients**:
  - `--gradient-holographic`: Multi-color holographic effect (purple → magenta → cyan → gold)
  - `--gradient-tropical`: Warm brown gradient
- **Shadows**: Glow effects via `--shadow-glow` and `--shadow-golden`
- **Animations**: Custom timing functions (`--transition-smooth`, `--transition-bounce`)
- **Theme**: Uses dark theme by default (no separate dark mode toggle needed)

**IMPORTANT**: When adding new colors, they MUST be defined as HSL values in `src/index.css` and referenced via CSS custom properties. The design system extends into `tailwind.config.ts` where color utilities like `bg-golden` or `text-primary-glow` are defined.

### Key Technical Details

- **Path Alias**: `@` resolves to `./src` (configured in `vite.config.ts:19`)
- **Component Tagger**: Uses `lovable-tagger` plugin in development mode for Lovable.dev integration
- **Port**: Dev server runs on `:8080` with IPv6 host (`::`)
- **UI Components**: Generated via shadcn/ui CLI (see `components.json`)
- **Form Validation**: Uses `react-hook-form` + `@hookform/resolvers` + `zod`
- **TypeScript**: Configured with relaxed strictness settings (`noImplicitAny: false`, `strictNullChecks: false`) for rapid development

### Adding New Routes

When adding routes to the application:

1. Create page component in `src/pages/` (should be a default export)
2. Import the component in `src/routes.ts`
3. Add entry to the `routes` array ABOVE the catch-all "*" route

Example:
```tsx
// In src/routes.ts:
import NewPage from "./pages/NewPage";

export const routes: RouteItem[] = [
  { path: "/", component: Index, label: "Landing (OTP)" },
  { path: "/new-page", component: NewPage, label: "New Page", private: false },
  { path: "*", component: NotFound, label: "Not Found" }, // Keep this last
];
```

Note: The `private` flag is for organizational purposes (e.g., routes requiring authentication).

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

- **Lovable.dev**: Changes pushed to this repo sync with Lovable project (ID: 80074ec3-bcf4-4664-b8d4-6e22f1506a17)
- **Build Modes**: Use `npm run build:dev` for development builds (includes component tagger)
- **TypeScript**: Configured with separate tsconfig files (app, node, base)
- **Deployment**: Configured for Vercel with SPA rewrites (see `vercel.json`)

## Current Pages

- `/` - Landing page with OTP authentication
- `/dashboard` - Main storefront (marked as private)
- `/_routes` - Routes debug page for development
- `*` - 404 Not Found page
