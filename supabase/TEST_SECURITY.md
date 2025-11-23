# Security System Testing Guide

## Quick Start Testing

### 1. Apply Database Migration

**Option A: Using Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to SQL Editor
4. Copy the entire contents of `supabase/migrations/20251123_auth_security_upgrade.sql`
5. Paste and run it

**Option B: Using Supabase CLI**
```bash
cd /Users/tylerdiorio/green-glide-app-1
supabase db push
```

### 2. Deploy Edge Functions

```bash
# Deploy signup function
supabase functions deploy signup

# Deploy login function
supabase functions deploy login

# Deploy access code management (optional)
supabase functions deploy manage-access-codes
```

### 3. Test Signup with Access Code

```bash
# Get your Supabase URL and anon key
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Test signup with access code
curl -X POST "${SUPABASE_URL}/functions/v1/signup" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "pin": "1234",
    "email": "test@example.com",
    "access_code": "1234"
  }'

# Expected response:
# {
#   "success": true,
#   "user": {
#     "id": "...",
#     "username": "testuser",
#     ...
#   }
# }
```

### 4. Test Login

```bash
# Test successful login
curl -X POST "${SUPABASE_URL}/functions/v1/login" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "pin": "1234"
  }'

# Expected response:
# {
#   "success": true,
#   "user": { ... }
# }
```

### 5. Test Rate Limiting

```bash
# Attempt 6 failed logins in a row
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST "${SUPABASE_URL}/functions/v1/login" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
      "username": "testuser",
      "pin": "9999"
    }'
  echo ""
  sleep 1
done

# Expected on 6th attempt:
# {
#   "error": "Too many failed login attempts. Please try again later.",
#   "retry_after_seconds": 900
# }
# HTTP Status: 429
```

### 6. Test Account Lockout

```bash
# After 5 failed attempts, account should be locked
curl -X POST "${SUPABASE_URL}/functions/v1/login" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "pin": "1234"
  }'

# Expected response:
# {
#   "error": "Account is temporarily locked due to too many failed attempts.",
#   "retry_after_seconds": ...
# }
# HTTP Status: 423
```

### 7. Verify Database State

Run these queries in Supabase SQL Editor:

```sql
-- Check if access codes were created
SELECT * FROM access_codes;

-- Check login attempts
SELECT * FROM login_attempts ORDER BY attempted_at DESC LIMIT 10;

-- Check user profile security fields
SELECT
  username,
  failed_login_attempts,
  last_failed_login_at,
  account_locked_until,
  is_active
FROM user_profiles_auth
WHERE username = 'testuser';

-- View security stats
SELECT * FROM auth_security_stats;
```

### 8. Test Access Code Management

```bash
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# List all access codes
curl -X GET "${SUPABASE_URL}/functions/v1/manage-access-codes?action=list" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"

# Create new access code
curl -X POST "${SUPABASE_URL}/functions/v1/manage-access-codes?action=create" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "NEWCODE123",
    "max_uses": 10,
    "description": "Test code"
  }'

# Get security stats
curl -X GET "${SUPABASE_URL}/functions/v1/manage-access-codes?action=stats" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

## Frontend Testing

### 1. Start Development Server

```bash
cd /Users/tylerdiorio/green-glide-app-1
npm run dev
```

### 2. Test Signup Flow

1. Navigate to http://localhost:8080
2. Enter access code "1234" (or "XMAS2024")
3. Click "Enter TD STUDIOS"
4. Fill out signup form with:
   - Username: "frontendtest"
   - PIN: "5678"
   - Email: "frontend@test.com"
5. Click "Create Account"
6. Should redirect to /dashboard

### 3. Test Login Flow

1. Refresh page (clears localStorage)
2. Enter access code "1234"
3. Click "Already have an account? Login"
4. Enter username: "frontendtest", PIN: "5678"
5. Click "Login"
6. Should redirect to /dashboard

### 4. Test Rate Limiting in Browser

1. Logout and return to login
2. Enter correct username but wrong PIN
3. Click login 5 times
4. Should see error: "Too many failed attempts"
5. Try again - should be blocked

### 5. Test Account Lockout

1. Open browser DevTools > Console
2. Enter correct credentials after being rate limited
3. Should see account locked message
4. Wait 30 minutes OR manually unlock via SQL:

```sql
UPDATE user_profiles_auth
SET failed_login_attempts = 0,
    account_locked_until = NULL
WHERE username = 'frontendtest';
```

## Manual Test Checklist

- [ ] New user can sign up with valid access code
- [ ] Signup fails with invalid access code
- [ ] Login works with correct credentials
- [ ] Login fails with wrong PIN
- [ ] After 5 failed attempts, rate limiting kicks in (429 error)
- [ ] After 5 failed attempts on same account, account locks (423 error)
- [ ] Successful login resets failed attempt counter
- [ ] Old SHA-256 hash users can login (backward compatibility)
- [ ] Old users are auto-upgraded to bcrypt on login
- [ ] Login attempts are logged in database
- [ ] Access code usage counter increments
- [ ] Access codes respect max_uses limit
- [ ] Access codes respect expiration dates
- [ ] RLS policies prevent direct database access

## Verification Queries

### Check Bcrypt Hash Format
```sql
-- New users should have bcrypt hashes (start with $2a$ or $2b$)
SELECT
  username,
  CASE
    WHEN pin_hash LIKE '$2%' THEN 'bcrypt'
    WHEN length(pin_hash) = 64 THEN 'SHA-256 (old)'
    ELSE 'unknown'
  END as hash_type,
  left(pin_hash, 10) as hash_prefix
FROM user_profiles_auth;
```

### Monitor Active Locks
```sql
SELECT
  username,
  failed_login_attempts as attempts,
  to_char(account_locked_until, 'YYYY-MM-DD HH24:MI:SS') as locked_until,
  CASE
    WHEN account_locked_until > now() THEN 'LOCKED'
    ELSE 'unlocked'
  END as status
FROM user_profiles_auth
WHERE failed_login_attempts > 0
ORDER BY account_locked_until DESC NULLS LAST;
```

### Login Activity Report
```sql
SELECT
  DATE(attempted_at) as date,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE success = true) as successful,
  COUNT(*) FILTER (WHERE success = false) as failed,
  COUNT(DISTINCT username) as unique_users,
  COUNT(DISTINCT ip_address) as unique_ips
FROM login_attempts
WHERE attempted_at > now() - interval '7 days'
GROUP BY DATE(attempted_at)
ORDER BY date DESC;
```

### Access Code Usage Report
```sql
SELECT
  code,
  current_uses,
  max_uses,
  CASE
    WHEN max_uses IS NULL THEN '∞'
    ELSE (max_uses - current_uses)::text
  END as remaining,
  is_active,
  to_char(expires_at, 'YYYY-MM-DD') as expires,
  description
FROM access_codes
ORDER BY created_at DESC;
```

## Performance Benchmarks

Run these to measure bcrypt performance:

```bash
# Test bcrypt hashing speed (should be ~100-300ms)
time curl -X POST "${SUPABASE_URL}/functions/v1/signup" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "perftest'$(date +%s)'",
    "pin": "1234",
    "email": "perf@test.com"
  }'

# Test login speed (should be similar)
time curl -X POST "${SUPABASE_URL}/functions/v1/login" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "pin": "1234"
  }'
```

Expected times:
- Signup: 200-500ms (includes bcrypt hash + DB insert)
- Login: 200-500ms (includes bcrypt compare + DB update)
- Failed login: 150-400ms (includes bcrypt + DB logging)

## Troubleshooting Common Issues

### Issue: "Function not found"
**Fix**: Deploy the functions:
```bash
supabase functions deploy signup
supabase functions deploy login
```

### Issue: "relation 'access_codes' does not exist"
**Fix**: Run the migration:
```bash
# Copy SQL from migration file and run in SQL Editor
# OR
supabase db push
```

### Issue: "No direct anon access" error when querying DB
**Fix**: This is expected! All auth must go through Edge Functions.

### Issue: Rate limiting not working
**Fix**: Check if function `check_rate_limit` exists:
```sql
SELECT proname FROM pg_proc WHERE proname = 'check_rate_limit';
```

### Issue: Bcrypt module fails to import
**Fix**: Ensure Edge Function has network access. May need to wait 1-2 minutes after deployment.

### Issue: Old users can't log in
**Fix**: This shouldn't happen - backward compatibility is built in. Check if user exists:
```sql
SELECT username, pin_hash FROM user_profiles_auth WHERE username = 'olduser';
```

## Security Testing Scenarios

### Scenario 1: Brute Force Attack Simulation
```bash
# Simulate attacker trying multiple PINs
for pin in 0000 1111 2222 3333 4444 5555 6666 7777 8888 9999; do
  echo "Trying PIN: $pin"
  curl -X POST "${SUPABASE_URL}/functions/v1/login" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"testuser\",\"pin\":\"$pin\"}"
  echo ""
done

# Should be blocked after 5 attempts
```

### Scenario 2: Multiple Account Targeting
```bash
# Attacker trying same PIN on multiple accounts
for user in user1 user2 user3 admin testuser; do
  echo "Trying user: $user"
  curl -X POST "${SUPABASE_URL}/functions/v1/login" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$user\",\"pin\":\"1234\"}"
  echo ""
done

# Each username gets its own rate limit counter
```

### Scenario 3: Access Code Exhaustion
```bash
# Try to exhaust a limited-use access code
for i in {1..15}; do
  echo "Signup attempt $i:"
  curl -X POST "${SUPABASE_URL}/functions/v1/signup" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
      \"username\":\"testuser$i\",
      \"pin\":\"1234\",
      \"email\":\"test$i@example.com\",
      \"access_code\":\"XMAS2024\"
    }"
  echo ""
done

# Should fail after max_uses reached (50 for XMAS2024)
```

## Production Deployment Checklist

Before deploying to production:

- [ ] Migration applied successfully
- [ ] All Edge Functions deployed
- [ ] Default access codes removed or changed
- [ ] Production access codes generated
- [ ] Rate limits tested and working
- [ ] Account lockout tested
- [ ] Bcrypt hashing verified
- [ ] Login attempt logging verified
- [ ] RLS policies preventing direct DB access
- [ ] Error messages don't leak user information
- [ ] Frontend displays rate limit errors properly
- [ ] Monitoring queries saved for regular review
- [ ] Cleanup cron job scheduled (if using pg_cron)

## Next Steps

After testing:

1. **Optional: Make Access Codes Mandatory**
   - Edit `supabase/functions/signup/index.ts`
   - Uncomment lines 122-130
   - Redeploy: `supabase functions deploy signup`

2. **Optional: Add Access Code Field to Frontend**
   - See AUTH_SECURITY_README.md "Frontend Integration" section

3. **Set Up Monitoring**
   - Create dashboard with security queries
   - Set up alerts for suspicious activity
   - Schedule weekly security reviews

4. **Document Your Access Codes**
   - Keep track of codes distributed
   - Set appropriate expiration dates
   - Monitor usage patterns
