# Deployment Instructions for TD STUDIOS Auth System

## Current Status

✅ **Completed Locally**:
- Enhanced authentication UI with validation
- Security upgrade migration created
- Edge Functions updated with bcrypt and rate limiting
- Documentation created (.env.example, SYNC_WORKFLOW.md)

⚠️ **Needs Manual Deployment**:
- Database migrations need to be applied to Supabase
- Edge Functions need to be deployed

---

## Migration History Issue

The remote Supabase database has migrations that don't exist in local files. This happened because Lovable created migrations directly.

**Remote migrations** (applied but not in local files):
- `20251118064742`
- `20251123061831`

**Local migrations** (exist locally but not applied remotely):
- `20251123061832` - Original user_profiles_auth table
- `20251123_auth_security_upgrade` - Security enhancements

---

## Option 1: Manual SQL Execution (Recommended)

Since the migration history is out of sync, the safest approach is to manually run the new migration SQL:

### Steps:

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard/project/crpalakzdzvtgvljlutd
   - Navigate to: SQL Editor

2. **Execute the Security Upgrade Migration**:
   - Open: `supabase/migrations/20251123_auth_security_upgrade.sql`
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click "Run"

This will add:
- `access_codes` table with codes: 1420, 4200, 2024, 1111, 1234, XMAS2024
- `login_attempts` table for audit logging
- Security columns to `user_profiles_auth` (failed_login_attempts, account_locked_until, etc.)
- Database functions for rate limiting and account lockout
- Tightened RLS policies

3. **Verify Tables Created**:
   ```sql
   -- Run in SQL Editor to verify
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('access_codes', 'login_attempts', 'user_profiles_auth');
   ```

4. **Verify Access Codes Inserted**:
   ```sql
   SELECT code, max_uses, description FROM public.access_codes;
   ```

   Expected output:
   | code | max_uses | description |
   |------|----------|-------------|
   | 1420 | NULL | TD STUDIOS primary access code - unlimited uses |
   | 4200 | NULL | TD STUDIOS secondary access code - unlimited uses |
   | 2024 | NULL | Year code - unlimited uses |
   | 1111 | NULL | Demo/testing code - unlimited uses |
   | 1234 | NULL | Legacy testing code - unlimited uses |
   | XMAS2024 | 50 | Christmas 2024 promotion - 50 uses |

---

## Option 2: Reset and Rebuild (Nuclear Option)

⚠️ **WARNING**: This will delete all data in the database!

Only use if you don't have production data:

```bash
# 1. Reset remote database (DELETES ALL DATA!)
supabase db reset --linked

# 2. Push all migrations
supabase db push
```

---

## Deploy Edge Functions

After applying the database migrations, deploy the Edge Functions:

```bash
# Deploy all three functions
supabase functions deploy signup
supabase functions deploy login
supabase functions deploy manage-access-codes
```

Or deploy individually:

```bash
# Just signup
supabase functions deploy signup

# Just login
supabase functions deploy login

# Just access code management (admin function)
supabase functions deploy manage-access-codes
```

### Verify Deployment

Test the functions with curl:

#### Test Signup:
```bash
curl -X POST "https://crpalakzdzvtgvljlutd.supabase.co/functions/v1/signup" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "pin": "5678",
    "email": "test@example.com",
    "access_code": "1420"
  }'
```

Expected response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "created_at": "..."
  }
}
```

#### Test Login:
```bash
curl -X POST "https://crpalakzdzvtgvljlutd.supabase.co/functions/v1/login" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "pin": "5678"
  }'
```

---

## Environment Variables

### For Lovable

Add these in Lovable project settings:

```
VITE_SUPABASE_PROJECT_ID=crpalakzdzvtgvljlutd
VITE_SUPABASE_URL=https://crpalakzdzvtgvljlutd.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key-from-dashboard>
```

Get your anon key from: https://supabase.com/dashboard/project/crpalakzdzvtgvljlutd/settings/api

**Do NOT** add `SUPABASE_SERVICE_ROLE_KEY` to Lovable (Edge Functions get it automatically).

---

## Testing Checklist

After deployment, test the complete flow:

### 1. Access Code Entry
- [ ] Visit https://td-christmas.lovable.app
- [ ] Enter code `1420` → Should show green checkmark
- [ ] Enter invalid code `9999` → Should show error
- [ ] Click "Continue" with valid code → Should proceed to signup

### 2. Signup
- [ ] Enter username (3-20 chars)
- [ ] Enter 4-digit PIN
- [ ] Confirm PIN (must match)
- [ ] Enter at least one: phone, email, or Instagram
- [ ] Click "Create Account" → Should create account and redirect to dashboard

### 3. Login
- [ ] Return to homepage
- [ ] Switch to "Login" view
- [ ] Enter username and correct PIN → Should login successfully
- [ ] Enter wrong PIN 3 times → Should show "attempts remaining"
- [ ] Enter wrong PIN 5 times → Should lock account for 30 minutes

### 4. Dashboard
- [ ] See personalized welcome message with username
- [ ] Browse products
- [ ] Click logout → Should return to homepage

---

## Troubleshooting

### Migration Fails with "already exists"

If tables already exist:

```sql
-- Check what tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- If access_codes exists, just insert the codes:
INSERT INTO public.access_codes (code, max_uses, description)
VALUES
  ('1420', NULL, 'TD STUDIOS primary access code - unlimited uses'),
  ('4200', NULL, 'TD STUDIOS secondary access code - unlimited uses'),
  ('2024', NULL, 'Year code - unlimited uses'),
  ('1111', NULL, 'Demo/testing code - unlimited uses')
ON CONFLICT (code) DO NOTHING;
```

### Edge Function Deployment Fails

Check logs:
```bash
supabase functions logs signup --tail
```

Common issues:
- Missing environment variables (should be auto-injected)
- Syntax errors (check the TypeScript)
- Permissions issues (check Supabase dashboard)

### Can't Login After Deployment

1. Check Edge Function logs
2. Verify tables exist in database
3. Test Edge Function directly with curl
4. Check browser console for errors

---

## Next Steps

1. **Deploy migrations** (Option 1 or 2 above)
2. **Deploy Edge Functions** (`supabase functions deploy`)
3. **Test end-to-end** (follow testing checklist)
4. **Commit and sync** with Lovable (`git add . && git commit && git push`)

---

**Project ID**: `crpalakzdzvtgvljlutd`
**Dashboard**: https://supabase.com/dashboard/project/crpalakzdzvtgvljlutd
**Functions**: https://supabase.com/dashboard/project/crpalakzdzvtgvljlutd/functions
