# Git ↔ Lovable Sync Workflow

This document explains how to keep your local development environment synchronized with Lovable.

## Single Source of Truth

**GitHub Repository**: `https://github.com/tdiorio2323/green-glide-app.git`
- **Branch**: `main`
- **Local Directory**: `/Users/tylerdiorio/green-glide-app-1` ⚠️ (Note: Use `green-glide-app-1`, not `green-glide-app`)

## How Lovable Sync Works

Lovable uses **GitHub as the sync bridge**:

```
Local Development (green-glide-app-1)
           ↕ git push/pull
      GitHub (main branch)
           ↕ auto-sync
   Lovable (td-christmas.lovable.app)
```

- **Lovable watches** the GitHub repository and automatically pulls changes from `main`
- **Lovable publishes** push changes to GitHub when you click "Publish" in Lovable
- **You must manually pull** Lovable changes to your local environment

---

## Workflow 1: Making Changes Locally

When you develop code on your machine:

### Before Starting Work

**Always pull the latest changes** to avoid conflicts:

```bash
cd /Users/tylerdiorio/green-glide-app-1
git pull origin main
```

This ensures you have Lovable's latest changes.

### During Development

1. Make your changes in your code editor (VS Code, etc.)
2. Test locally with `pnpm dev` (runs on http://localhost:8080)
3. Review changes with `git status` and `git diff`

### After Completing Changes

**Commit and push** your changes to sync with Lovable:

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Brief description of what you changed"

# Push to GitHub (triggers Lovable sync)
git push origin main
```

**Result**: Lovable will automatically pull your changes within seconds.

---

## Workflow 2: Making Changes in Lovable

When you use the Lovable web editor:

### In Lovable

1. Make changes in the Lovable editor
2. Test using Lovable's preview
3. Click **"Publish"** in Lovable when ready

**Result**: Lovable pushes changes to GitHub `main` branch.

### On Your Local Machine

**Pull the changes** to get Lovable's updates:

```bash
cd /Users/tylerdiorio/green-glide-app-1
git pull origin main
```

⚠️ **Important**: This step is **MANUAL** - Lovable can't automatically update your local files!

---

## Handling Merge Conflicts

If both you and Lovable edited the same files, you'll get a merge conflict:

```bash
# Pull changes (conflict detected)
git pull origin main

# Git will show conflicting files
# Open them in your editor and resolve conflicts manually

# After resolving conflicts:
git add .
git commit -m "Merge Lovable changes"
git push origin main
```

**Best Practice**: Coordinate with Lovable - if you're working locally, don't edit in Lovable simultaneously.

---

## Quick Reference

| Action | Command |
|--------|---------|
| **Check status** | `git status` |
| **Pull latest** | `git pull origin main` |
| **Stage changes** | `git add .` |
| **Commit** | `git commit -m "message"` |
| **Push to sync** | `git push origin main` |
| **View changes** | `git diff` |
| **View history** | `git log --oneline -10` |
| **Discard local changes** | `git restore <file>` |

---

## Environment Variables

When working with Supabase or other services:

### Local Development
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials
3. **Never commit `.env`** to Git (it's in `.gitignore`)

### Lovable Deployment
1. Go to Lovable project settings
2. Add environment variables in the "Environment Variables" section
3. Add all `VITE_*` variables (these are safe for browser)
4. **Do NOT** add `SUPABASE_SERVICE_ROLE_KEY` (Edge Functions get it automatically)

---

## Deployment Architecture

```
Local Development
├── Frontend Code → Lovable → Vercel (or similar)
└── Backend (Edge Functions) → Deployed directly to Supabase

GitHub (main branch)
├── Watches: Lovable
└── Source of Truth for code
```

### Deploying Edge Functions

Edge Functions are **NOT** deployed via Lovable - they're deployed directly to Supabase:

```bash
# From your local machine:
supabase functions deploy signup
supabase functions deploy login
supabase functions deploy manage-access-codes
```

### Deploying Database Migrations

Database changes are applied directly to Supabase:

```bash
# From your local machine:
supabase db push
```

---

## Common Scenarios

### Scenario 1: "I made changes locally but don't see them in Lovable"

**Solution**: You forgot to push!

```bash
git push origin main
```

Wait a few seconds for Lovable to sync.

---

### Scenario 2: "I published in Lovable but don't see changes locally"

**Solution**: You forgot to pull!

```bash
git pull origin main
```

---

### Scenario 3: "My local and Lovable are out of sync"

**Solution**: Pull first, then push:

```bash
git pull origin main
# Resolve conflicts if any
git push origin main
```

---

### Scenario 4: "I updated Edge Functions but Lovable doesn't reflect changes"

**Explanation**: Edge Functions are deployed separately from Lovable.

**Solution**: Deploy them manually:

```bash
supabase functions deploy <function-name>
```

---

## Best Practices

1. ✅ **Always `git pull` before starting work**
2. ✅ **Commit frequently** with descriptive messages
3. ✅ **Push after completing a feature** to keep Lovable in sync
4. ✅ **Test locally** before pushing (run `pnpm dev`)
5. ✅ **Use meaningful commit messages** (helps track changes)
6. ⚠️ **Don't work in both places simultaneously** (causes conflicts)
7. ⚠️ **Never commit `.env`** or other secrets
8. ⚠️ **Deploy Edge Functions separately** (not via Git/Lovable)

---

## Project Structure Notes

⚠️ **Important**: You have two similar folders:

- `/Users/tylerdiorio/green-glide-app` - **OLD**, not a git repo
- `/Users/tylerdiorio/green-glide-app-1` - **ACTIVE**, connected to GitHub

**Always use** `green-glide-app-1` for development!

Consider deleting or archiving `green-glide-app` to avoid confusion.

---

## Links

- **GitHub Repo**: https://github.com/tdiorio2323/green-glide-app.git
- **Lovable Project**: https://td-christmas.lovable.app
- **Lovable Project ID**: `80074ec3-bcf4-4664-b8d4-6e22f1506a17`
- **Supabase Project**: `crpalakzdzvtgvljlutd`

---

## Need Help?

- **Git conflicts**: Search for conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) in files
- **Lovable not syncing**: Check GitHub Actions/webhooks in GitHub settings
- **Local server issues**: Run `pnpm install` and restart dev server

---

**Last Updated**: 2025-11-23
**Maintainer**: TD STUDIOS
