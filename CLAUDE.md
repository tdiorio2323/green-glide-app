# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project originally called "Green Glide", now rebranded as **TD STUDIOS**. It's a cannabis marketplace web application built with shadcn/ui components and Tailwind CSS. The project is managed via Lovable.dev and follows a single-page application (SPA) architecture.

## Development Commands

This project uses **pnpm** as the package manager (v10.21.0+).

```bash
# Start development server (runs on port 8080)
pnpm dev

# Build for production
pnpm build

# Build for development mode (includes component tagger)
pnpm build:dev

# Lint the codebase
pnpm lint

# Type check without emitting files
pnpm typecheck

# Preview production build
pnpm preview
```

## Environment Setup

Required environment variables (copy `.env.example` to `.env`):

```bash
# Supabase Configuration (required for authentication and database)
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key-here"

# Server-side only (for Edge Functions, not needed in .env for local dev)
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key-here"
```

Get credentials from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

## Architecture

### Application Structure

- **Entry Point**: `src/main.tsx` → `src/App.tsx`
- **Routing**: React Router v6 with `BrowserRouter`
  - Routes are centrally defined in `src/routes.ts` as an array of `RouteItem` objects
  - Each route has: `path`, `component`, `label`, and optional `private` flag
  - App.tsx maps over the routes array to generate `<Route>` elements
  - All routes are wrapped in `AppLayout` component which provides the base page structure
  - To add new routes: add entry to `routes` array in `src/routes.ts` ABOVE the catch-all "*" route
  - NotFound page handles 404s
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components (~50 components in `src/components/ui/`)
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (authentication and database)
  - Client configured in `src/integrations/supabase/client.ts`
  - Uses environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
  - Custom authentication system (see Authentication Architecture below)

### Directory Structure

```
src/
├── components/        # Feature components (Hero, Footer, ExploreMenus, etc.)
│   ├── ui/           # shadcn/ui components (auto-generated)
│   ├── auth/         # Authentication components (FormField, PINInput, LoadingSpinner)
│   └── layout/       # Layout components (Page wrapper)
├── pages/            # Route pages (Index, Dashboard, NotFound, RoutesDebug)
├── layouts/          # Layout wrappers (AppLayout)
├── hooks/            # Custom React hooks (use-mobile, use-toast)
├── lib/              # Utilities (utils.ts for cn() helper, theme.ts for TD Studios tokens, auth.ts)
├── data/             # Static data (products.ts, categories.ts)
├── integrations/     # External service integrations (Supabase)
└── assets/           # Static assets
```

**Note**: Product and category data are statically defined in `src/data/products.ts` and `src/data/categories.ts`.

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

### Authentication Architecture

The application uses a **custom username/PIN authentication system** (no email/password or OAuth):

- **Client-Side Auth Module**: `src/lib/auth.ts`
  - Provides `auth.signup()`, `auth.login()`, `auth.logout()`, `auth.getUser()`, `auth.isAuthenticated()`
  - Stores user sessions in localStorage under key `td_studios_user`
  - All authentication flows invoke Supabase Edge Functions (not direct Supabase Auth)

- **User Model**:
  ```tsx
  {
    id: string;
    username: string;
    pin: string; // Hashed server-side
    phone?: string;
    email?: string;
    instagram_handle?: string;
    created_at: string;
  }
  ```

- **Authentication Flow**:
  1. User submits username + 6-digit PIN via forms in `src/components/Hero.tsx`
  2. Client calls `auth.signup()` or `auth.login()` from `src/lib/auth.ts`
  3. Request is sent to Supabase Edge Functions (`supabase.functions.invoke()`)
  4. Edge Function validates credentials and returns user object
  5. User object is stored in localStorage for session persistence

**IMPORTANT**: This is NOT using Supabase's built-in auth system. Authentication is custom-built via Edge Functions.

### Supabase Edge Functions

The backend logic runs on Supabase Edge Functions (Deno runtime) in the `supabase/functions/` directory:

1. **signup** (`supabase/functions/signup/`)
   - Creates new user accounts with username/PIN
   - Hashes PIN using bcrypt before storing
   - Validates username uniqueness
   - Returns user object on success

2. **login** (`supabase/functions/login/`)
   - Validates username/PIN credentials
   - Compares hashed PIN from database
   - Returns user object on successful authentication

3. **manage-access-codes** (`supabase/functions/manage-access-codes/`)
   - Admin functionality for managing access codes
   - Used for invite/access control system

**Deployment**: Edge Functions are deployed separately to Supabase and invoked via `supabase.functions.invoke()` from the client.

**Development Workflow**:
- Edge Functions run locally via `supabase functions serve` (requires Supabase CLI)
- Deploy to production via `supabase functions deploy <function-name>`
- Environment variables for Edge Functions are managed in Supabase dashboard

### Key Technical Details

- **Path Alias**: `@` resolves to `./src` (configured in `vite.config.ts:19`)
- **Component Tagger**: Uses `lovable-tagger` plugin in development mode for Lovable.dev integration
- **Port**: Dev server runs on `:8080` with IPv6 host (`::`)
- **UI Components**: Generated via shadcn/ui CLI (see `components.json`)
- **Form Validation**: Uses `react-hook-form` + `@hookform/resolvers` + `zod`
- **TypeScript**: Configured with relaxed strictness settings (`noImplicitAny: false`, `strictNullChecks: false`) for rapid development
- **Package Manager**: Uses pnpm (v10.21.0+)

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
- Mobile-safe utilities available: `.pb-safe`, `.pt-safe`, `.pl-safe`, `.pr-safe` for notched devices

## Integration Notes

- **Lovable.dev**: Changes pushed to this repo sync with Lovable project (ID: 80074ec3-bcf4-4664-b8d4-6e22f1506a17)
- **Build Modes**: Use `pnpm build:dev` for development builds (includes component tagger)
- **TypeScript**: Configured with separate tsconfig files (app, node, base)
- **Deployment**: Configured for Vercel with SPA rewrites (see `vercel.json`)

## Current Pages

- `/` - Landing page with username/PIN authentication (signup and login forms)
- `/dashboard` - Main storefront with product catalog (marked as private)
- `/_routes` - Routes debug page for development
- `*` - 404 Not Found page

The landing page (`/`) contains the Hero component with authentication forms. After successful authentication, users are redirected to `/dashboard`.

## Common Tasks

### Add a New Page/Route

1. Create a new file in `src/pages/` (must be a default export)
2. Wrap the content in `<Page title="..." description="...">...</Page>` from `@/components/layout/Page`
3. Register the path + component in `src/routes.ts` (add ABOVE the catch-all "*" route)
4. The page will automatically be wrapped in `AppLayout` from `src/layouts/AppLayout.tsx`

Example:
```tsx
// src/pages/MyNewPage.tsx
import { Page } from "@/components/layout/Page";

export default function MyNewPage() {
  return (
    <Page title="My New Page" description="Page description here">
      <div>Your content</div>
    </Page>
  );
}

// src/routes.ts - add this entry
import MyNewPage from "./pages/MyNewPage";

export const routes: RouteItem[] = [
  { path: "/", component: Index, label: "Landing (OTP)" },
  { path: "/my-new-page", component: MyNewPage, label: "My New Page" },
  { path: "*", component: NotFound, label: "Not Found" }, // Keep last
];
```

### Use TD STUDIOS Theme Tokens

The design system has two layers:
1. **CSS Custom Properties** in `src/index.css` - Base color/gradient definitions
2. **TD Studios Tokens** in `src/lib/theme.ts` - Reusable className utilities

For Christmas/luxury holographic styling on cards or featured elements:

```tsx
import { cn } from "@/lib/utils";
import { tds } from "@/lib/theme";

<div className={cn("p-4 rounded-xl", tds.holoCard, tds.glass)}>
  {/* Your content with red-green gradient + glass effect */}
</div>
```

Available `tds` tokens:
- `tds.holoCard` - Red/green holographic gradient background
- `tds.glass` - Glass morphism backdrop blur effect
- `tds.christmasGlow` - Christmas-themed glow shadow

For base colors, use Tailwind utilities: `bg-primary`, `text-golden`, `bg-gradient-holographic`, etc.

### Work with Authentication

Import and use the auth module:
```tsx
import { auth } from "@/lib/auth";

// Sign up a new user
const result = await auth.signup({
  username: "myusername",
  pin: "123456",
  phone: "555-0100", // optional
  email: "user@example.com", // optional
  instagram_handle: "@myhandle" // optional
});

// Log in
const result = await auth.login("myusername", "123456");

// Check authentication status
if (auth.isAuthenticated()) {
  const user = auth.getUser();
  console.log(user.username);
}

// Log out
auth.logout();
```

### Work with Supabase

Import the Supabase client for direct database access:
```tsx
import { supabase } from "@/integrations/supabase/client";

// Example: Query data
const { data, error } = await supabase
  .from('table_name')
  .select('*');

// Example: Invoke Edge Function
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { key: 'value' }
});
```

The client is configured with:
- Persistent sessions using localStorage
- Auto token refresh
- Type-safe database access via generated types

**Note**: For authentication, always use `src/lib/auth.ts` instead of calling Edge Functions directly.
