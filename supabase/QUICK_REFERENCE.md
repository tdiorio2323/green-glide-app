# TD STUDIOS Authentication Security - Quick Reference Card

## Deployment Commands

```bash
# 1. Apply database migration
supabase db push

# 2. Deploy Edge Functions
supabase functions deploy signup
supabase functions deploy login
supabase functions deploy manage-access-codes

# 3. Verify deployment
# Run this in Supabase SQL Editor:
# SELECT * FROM auth_security_stats;
```

## Default Access Codes

- **1234** - Unlimited use, never expires (testing/default)
- **XMAS2024** - 50 uses, Christmas promotion

## Configuration Constants

Located in Edge Functions:

### Login Function (`/supabase/functions/login/index.ts`)
```typescript
RATE_LIMIT_WINDOW_MINUTES = 15   // Rate limit window
MAX_FAILED_ATTEMPTS = 5           // Attempts before lock
ACCOUNT_LOCKOUT_MINUTES = 30      // Lock duration
```

### Signup Function (`/supabase/functions/signup/index.ts`)
```typescript
BCRYPT_SALT_ROUNDS = 12           // Bcrypt cost factor
```

## Common SQL Queries

### Check Security Stats
```sql
SELECT * FROM auth_security_stats;
```

### View Locked Accounts
```sql
SELECT username, account_locked_until
FROM user_profiles_auth
WHERE account_locked_until > now();
```

### Unlock User Manually
```sql
UPDATE user_profiles_auth
SET failed_login_attempts = 0,
    account_locked_until = NULL
WHERE username = 'USERNAME_HERE';
```

### View Recent Failed Logins
```sql
SELECT username, ip_address, attempted_at, error_message
FROM login_attempts
WHERE success = false
  AND attempted_at > now() - interval '24 hours'
ORDER BY attempted_at DESC
LIMIT 20;
```

### Create Access Code
```sql
INSERT INTO access_codes (code, max_uses, expires_at, description)
VALUES ('NEWCODE', 10, '2024-12-31 23:59:59', 'Description');
```

### View Access Code Usage
```sql
SELECT code, current_uses, max_uses,
       CASE WHEN max_uses IS NULL THEN '∞'
            ELSE (max_uses - current_uses)::text END as remaining
FROM access_codes
WHERE is_active = true;
```

### Check Bcrypt Migration Progress
```sql
SELECT
  COUNT(*) FILTER (WHERE pin_hash LIKE '$2%') as bcrypt_users,
  COUNT(*) FILTER (WHERE length(pin_hash) = 64) as sha256_users,
  ROUND(COUNT(*) FILTER (WHERE pin_hash LIKE '$2%')::numeric / COUNT(*)::numeric * 100, 1) as percent_migrated
FROM user_profiles_auth;
```

### Cleanup Old Login Attempts
```sql
SELECT cleanup_old_login_attempts();
```

## Test Commands

### Test Signup
```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/signup" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","pin":"1234","email":"test@test.com","access_code":"1234"}'
```

### Test Login
```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/login" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","pin":"1234"}'
```

### Test Rate Limiting (Run 6 times)
```bash
for i in {1..6}; do
  curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/login" \
    -H "Authorization: Bearer YOUR_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{"username":"test","pin":"9999"}'
  echo ""
  sleep 1
done
```

## API Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Validation error | Check input format |
| 401 | Invalid credentials | Wrong username/PIN |
| 403 | Access denied | Invalid access code or inactive account |
| 409 | Duplicate | Username/email/phone exists |
| 423 | Account locked | Wait for unlock or contact admin |
| 429 | Rate limited | Wait specified retry time |
| 500 | Server error | Check Edge Function logs |

## Response Examples

### Successful Login
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "test",
    "email": "test@test.com",
    ...
  }
}
```

### Rate Limited
```json
{
  "error": "Too many failed login attempts. Please try again later.",
  "retry_after_seconds": 900
}
```
HTTP Status: 429

### Account Locked
```json
{
  "error": "Account is temporarily locked due to too many failed attempts.",
  "retry_after_seconds": 1800
}
```
HTTP Status: 423

### Failed Login (with attempts remaining)
```json
{
  "error": "Invalid username or PIN",
  "attempts_remaining": 3
}
```
HTTP Status: 401

## File Locations

### Documentation
- `/supabase/AUTH_SECURITY_README.md` - Complete documentation
- `/supabase/TEST_SECURITY.md` - Testing guide
- `/SECURITY_UPGRADE_SUMMARY.md` - Implementation summary
- `/supabase/QUICK_REFERENCE.md` - This file

### Code
- `/supabase/functions/signup/index.ts` - Signup function
- `/supabase/functions/login/index.ts` - Login function
- `/supabase/functions/manage-access-codes/index.ts` - Access code management

### SQL
- `/supabase/migrations/20251123_auth_security_upgrade.sql` - Main migration
- `/supabase/scripts/generate_access_codes.sql` - Code generation
- `/supabase/scripts/security_monitoring.sql` - Monitoring queries

## Monitoring Checklist

### Daily
- [ ] Check `auth_security_stats`
- [ ] Review locked accounts
- [ ] Check for suspicious IPs (>20 failures)

### Weekly
- [ ] Run full monitoring script
- [ ] Review access code usage
- [ ] Deactivate expired codes
- [ ] Check bcrypt migration progress

### Monthly
- [ ] Analyze login patterns
- [ ] Generate new access codes
- [ ] Review and adjust rate limits
- [ ] Clean up old data

## Emergency Commands

### Unlock All Expired Locks
```sql
UPDATE user_profiles_auth
SET failed_login_attempts = 0,
    account_locked_until = NULL,
    last_failed_login_at = NULL
WHERE account_locked_until < now();
```

### Deactivate Expired Access Codes
```sql
UPDATE access_codes
SET is_active = false
WHERE expires_at IS NOT NULL
  AND expires_at < now()
  AND is_active = true;
```

### Emergency Cleanup (30+ days)
```sql
DELETE FROM login_attempts
WHERE attempted_at < now() - interval '30 days';
```

### Disable Rate Limiting (Emergency Only)
```sql
-- Temporarily increase limits (not recommended)
-- Edit /supabase/functions/login/index.ts and change:
-- MAX_FAILED_ATTEMPTS = 999
-- Then redeploy: supabase functions deploy login
```

## Getting Help

1. **Check Logs**: Supabase Dashboard → Edge Functions → Logs
2. **Run Diagnostics**: See `/supabase/TEST_SECURITY.md`
3. **Monitoring Queries**: See `/supabase/scripts/security_monitoring.sql`
4. **Full Docs**: See `/supabase/AUTH_SECURITY_README.md`

## Making Access Codes Mandatory

Edit `/supabase/functions/signup/index.ts`:

```typescript
// Find lines 122-130 and uncomment:
else {
  return new Response(
    JSON.stringify({ error: 'Access code is required for signup' }),
    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

Then redeploy:
```bash
supabase functions deploy signup
```

## Security Levels

### Current: MEDIUM-HIGH
- Bcrypt hashing ✓
- Rate limiting ✓
- Account lockout ✓
- Audit logging ✓
- Access codes OPTIONAL ✗

### To Achieve HIGH:
- Make access codes mandatory ✓ (see above)
- Set expiration on all codes ✓
- Enable monitoring alerts ✓
- Regular security reviews ✓

### To Achieve MAXIMUM:
- Implement 2FA
- Add email verification
- Implement session management
- Add device fingerprinting
- Set up WAF rules

## Performance Benchmarks

Expected response times:
- Signup: 200-500ms
- Login (success): 200-500ms
- Login (failure): 150-400ms
- Rate check: <10ms

If slower than this:
1. Check bcrypt rounds (should be 12)
2. Check database performance
3. Check Edge Function logs for errors

## Security Contacts

- **Logs**: Supabase Dashboard → Edge Functions → Logs
- **Database**: Supabase Dashboard → SQL Editor
- **Metrics**: Run `SELECT * FROM auth_security_stats;`

---

**Last Updated**: 2025-11-23
**Version**: 1.0
**Quick Access**: Keep this file bookmarked for rapid troubleshooting
