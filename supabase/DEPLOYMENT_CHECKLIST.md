# TD STUDIOS Security Deployment Checklist

Use this checklist when deploying the authentication security system.

## Pre-Deployment

### 1. Environment Setup
- [ ] Supabase CLI installed (`supabase --version`)
- [ ] Project linked (`supabase link`)
- [ ] Database credentials available
- [ ] Anon key available
- [ ] Service role key available (for testing)

### 2. Backup Current State
- [ ] Export current user data:
```sql
COPY (SELECT * FROM user_profiles_auth) TO '/tmp/users_backup.csv' CSV HEADER;
```
- [ ] Note current user count
- [ ] Document any existing PINs (for testing)

## Deployment Steps

### Step 1: Database Migration

- [ ] Review migration file: `migrations/20251123_auth_security_upgrade.sql`
- [ ] Apply migration:
```bash
supabase db push
```
- [ ] Verify tables created:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('access_codes', 'login_attempts');
```
- [ ] Verify functions created:
```sql
SELECT proname FROM pg_proc
WHERE proname IN ('check_rate_limit', 'increment_failed_login', 'reset_failed_login_attempts');
```
- [ ] Verify default access codes:
```sql
SELECT code, max_uses FROM access_codes;
```
Expected: '1234' and 'XMAS2024'

### Step 2: Deploy Edge Functions

- [ ] Deploy signup:
```bash
supabase functions deploy signup
```
- [ ] Deploy login:
```bash
supabase functions deploy login
```
- [ ] Deploy manage-access-codes:
```bash
supabase functions deploy manage-access-codes
```
- [ ] Verify deployments in Supabase Dashboard → Edge Functions

### Step 3: Test Authentication

#### Test Signup (New User)
- [ ] Run signup test:
```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/signup" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "pin": "1234",
    "email": "test'$(date +%s)'@example.com",
    "access_code": "1234"
  }'
```
- [ ] Expected: 201 status, user object returned
- [ ] Verify user in database:
```sql
SELECT username, LEFT(pin_hash, 10) FROM user_profiles_auth ORDER BY created_at DESC LIMIT 1;
```
- [ ] Expected: pin_hash starts with `$2a$` or `$2b$` (bcrypt)

#### Test Login (New User)
- [ ] Run login test:
```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/login" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "TESTUSER_FROM_ABOVE",
    "pin": "1234"
  }'
```
- [ ] Expected: 200 status, user object returned
- [ ] Verify login logged:
```sql
SELECT * FROM login_attempts ORDER BY attempted_at DESC LIMIT 1;
```

#### Test Login (Existing User with SHA-256)
If you have existing users:
- [ ] Login with existing credentials
- [ ] Expected: 200 status (auto-upgrade should work)
- [ ] Verify hash upgraded:
```sql
SELECT username, LEFT(pin_hash, 10) FROM user_profiles_auth WHERE username = 'EXISTING_USER';
```
- [ ] Expected: pin_hash now starts with `$2a$` or `$2b$`

#### Test Rate Limiting
- [ ] Attempt 6 failed logins:
```bash
for i in {1..6}; do
  echo "Attempt $i"
  curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/login" \
    -H "Authorization: Bearer YOUR_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","pin":"9999"}'
  echo ""
  sleep 1
done
```
- [ ] Expected: Attempts 1-5 return 401
- [ ] Expected: Attempt 6 returns 429 (rate limited)
- [ ] Verify rate limit data:
```sql
SELECT check_rate_limit('testuser', 'unknown', 15, 5);
```

#### Test Account Lockout
- [ ] After 5 failed attempts, try correct PIN
- [ ] Expected: 423 status (account locked)
- [ ] Verify lock in database:
```sql
SELECT username, failed_login_attempts, account_locked_until
FROM user_profiles_auth
WHERE username = 'testuser';
```
- [ ] Expected: failed_login_attempts = 5, account_locked_until > now()

#### Test Access Code Validation
- [ ] Test invalid code:
```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/signup" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "badcode'$(date +%s)'",
    "pin": "1234",
    "email": "badcode@test.com",
    "access_code": "INVALID"
  }'
```
- [ ] Expected: 403 status, "Invalid or expired access code"

### Step 4: Frontend Testing

- [ ] Start dev server: `npm run dev`
- [ ] Navigate to http://localhost:8080
- [ ] Test access code entry (enter "1234")
- [ ] Test signup flow
  - [ ] Username validation (3-20 chars)
  - [ ] PIN validation (4 digits)
  - [ ] Email validation
  - [ ] Contact method requirement
- [ ] Test login flow
  - [ ] Successful login
  - [ ] Failed login with wrong PIN
  - [ ] Rate limiting (5 attempts)
  - [ ] Account lockout
- [ ] Test error messages display correctly
- [ ] Test redirect to /dashboard on success

### Step 5: Security Verification

- [ ] Check RLS policies:
```sql
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('user_profiles_auth', 'access_codes', 'login_attempts');
```
- [ ] Expected: Service role policies, no permissive anon policies
- [ ] Test direct database access (should fail):
```sql
-- Run this with ANON key (not service role)
-- Should fail with permission error
SELECT * FROM user_profiles_auth;
```
- [ ] Verify bcrypt hashing:
```sql
SELECT
  COUNT(*) FILTER (WHERE pin_hash LIKE '$2%') as bcrypt_count,
  COUNT(*) FILTER (WHERE length(pin_hash) = 64) as sha256_count
FROM user_profiles_auth;
```

### Step 6: Monitoring Setup

- [ ] Save monitoring queries (from scripts/security_monitoring.sql)
- [ ] Test security stats view:
```sql
SELECT * FROM auth_security_stats;
```
- [ ] Create saved query in Supabase Dashboard
- [ ] Set up any alerting (external tools if needed)

## Post-Deployment

### Verification

- [ ] All existing users can login
- [ ] New signups work with access code
- [ ] Rate limiting prevents brute force
- [ ] Account lockout works after 5 failures
- [ ] Login attempts are logged
- [ ] Access code usage increments
- [ ] Frontend displays errors correctly
- [ ] Edge Function logs show no errors

### Configuration

- [ ] Change/remove default access codes:
```sql
-- Deactivate '1234' in production
UPDATE access_codes SET is_active = false WHERE code = '1234';

-- Create production codes
INSERT INTO access_codes (code, max_uses, description)
VALUES ('PROD001', 100, 'Production launch code');
```
- [ ] Adjust rate limits if needed (edit login/index.ts)
- [ ] Set access code requirement (optional, edit signup/index.ts)

### Documentation

- [ ] Update team on new security features
- [ ] Document production access codes
- [ ] Share monitoring queries with ops team
- [ ] Document unlock procedures
- [ ] Create runbook for common issues

### Monitoring

- [ ] Schedule daily security stats check
- [ ] Set up weekly access code review
- [ ] Plan monthly security audit
- [ ] Document escalation procedures

## Rollback Plan

If issues arise:

### Emergency Rollback
```bash
# 1. Revert Edge Functions (deploy old versions)
# 2. Revert migration (manual SQL)
DROP TABLE IF EXISTS login_attempts;
DROP TABLE IF EXISTS access_codes;
ALTER TABLE user_profiles_auth DROP COLUMN failed_login_attempts;
ALTER TABLE user_profiles_auth DROP COLUMN last_failed_login_at;
ALTER TABLE user_profiles_auth DROP COLUMN account_locked_until;
ALTER TABLE user_profiles_auth DROP COLUMN is_active;
```

### Unlock All Accounts
```sql
UPDATE user_profiles_auth
SET failed_login_attempts = 0,
    account_locked_until = NULL,
    last_failed_login_at = NULL;
```

### Disable Rate Limiting
```typescript
// Edit login/index.ts
MAX_FAILED_ATTEMPTS = 999
// Redeploy: supabase functions deploy login
```

## Success Criteria

Deployment is successful when:
- [ ] All tests pass
- [ ] Existing users can login
- [ ] New signups work
- [ ] Rate limiting functions correctly
- [ ] No errors in Edge Function logs
- [ ] Frontend works seamlessly
- [ ] Security monitoring operational

## Sign-off

- [ ] Technical lead approval: ________________
- [ ] Security review: ________________
- [ ] Ops team notified: ________________
- [ ] Deployment date/time: ________________

## Notes

_Use this section for deployment-specific notes, issues encountered, etc._

---

**Checklist Version**: 1.0
**Created**: 2025-11-23
**Project**: TD STUDIOS Authentication Security
