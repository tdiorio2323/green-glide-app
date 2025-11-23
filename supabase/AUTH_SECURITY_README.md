# TD STUDIOS Authentication Security System

## Overview

This document describes the comprehensive security system implemented for TD STUDIOS cannabis marketplace authentication. The system includes bcrypt password hashing, rate limiting, account lockout, access code validation, and detailed audit logging.

## Security Features

### 1. Secure Password Hashing
- **Algorithm**: bcrypt with 12 salt rounds (configurable)
- **Migration**: Automatic upgrade from SHA-256 to bcrypt on login
- **Backward Compatibility**: Supports existing SHA-256 hashes during transition

### 2. Rate Limiting
- **Per-Username Limit**: 5 failed attempts per 15 minutes
- **Per-IP Tracking**: IP address logged for additional security monitoring
- **Response**: HTTP 429 with `Retry-After` header when limit exceeded

### 3. Account Lockout
- **Threshold**: 5 failed login attempts
- **Lockout Duration**: 30 minutes (configurable)
- **Auto-Unlock**: Automatically unlocks after lockout period expires
- **Reset**: Failed attempts counter resets on successful login

### 4. Access Code System
- **Optional/Required**: Configurable (currently optional)
- **Types**: Single-use or multi-use codes
- **Expiration**: Optional expiration dates
- **Usage Tracking**: Automatic increment of usage counter

### 5. Audit Logging
- **Login Attempts**: All login attempts logged with timestamp, IP, success/failure
- **Retention**: 7-day automatic cleanup (configurable)
- **Analytics**: Built-in view for security statistics

### 6. Enhanced Input Validation
- Username: 3-20 characters, alphanumeric + underscore
- PIN: Exactly 4 digits
- Email: Standard email format validation
- Phone: Basic format validation (10+ digits)

## Database Schema

### Tables

#### `user_profiles_auth`
Extended with security fields:
```sql
- failed_login_attempts (integer)
- last_failed_login_at (timestamp)
- account_locked_until (timestamp)
- is_active (boolean)
```

#### `access_codes`
Manages signup access codes:
```sql
- id (uuid, primary key)
- code (text, unique)
- is_active (boolean)
- max_uses (integer, nullable)
- current_uses (integer)
- expires_at (timestamp, nullable)
- description (text, nullable)
- created_at (timestamp)
```

#### `login_attempts`
Audit log for all login attempts:
```sql
- id (uuid, primary key)
- username (text)
- ip_address (text)
- success (boolean)
- attempted_at (timestamp)
- error_message (text, nullable)
```

### Database Functions

#### `check_rate_limit(username, ip_address, time_window_minutes, max_attempts)`
Returns rate limit status and retry time for a username/IP combination.

**Returns:**
- `is_limited` (boolean)
- `attempts_count` (bigint)
- `retry_after_seconds` (integer)

#### `increment_failed_login(user_id, max_attempts, lockout_minutes)`
Increments failed login counter and locks account if threshold exceeded.

**Returns:**
- `new_attempt_count` (integer)
- `is_locked` (boolean)
- `locked_until` (timestamp)

#### `reset_failed_login_attempts(user_id)`
Resets failed login counter and unlocks account.

#### `cleanup_old_login_attempts()`
Removes login attempts older than 7 days.

### Views

#### `auth_security_stats`
Real-time security statistics:
- Active users count
- Locked accounts count
- Active access codes count
- Login attempts (24h, 1h)
- Failed attempts (24h)

## Edge Functions

### `/signup`
**Path**: `/supabase/functions/signup/index.ts`

**Features:**
- Bcrypt password hashing (12 rounds)
- Access code validation (optional)
- Enhanced input validation
- Duplicate detection with specific error messages

**Request:**
```json
{
  "username": "string",
  "pin": "string (4 digits)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "instagram_handle": "string (optional)",
  "access_code": "string (optional)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "string",
    "phone": "string",
    "email": "string",
    "instagram_handle": "string",
    "created_at": "timestamp"
  }
}
```

**Error Responses:**
- 400: Validation error
- 403: Invalid access code
- 409: Duplicate username/email/phone
- 500: Server error

### `/login`
**Path**: `/supabase/functions/login/index.ts`

**Features:**
- Bcrypt password verification
- SHA-256 to bcrypt auto-upgrade
- Rate limiting (5 attempts / 15 min)
- Account lockout (30 min after 5 failures)
- IP address tracking
- Failed attempt logging

**Request:**
```json
{
  "username": "string",
  "pin": "string (4 digits)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "string",
    "phone": "string",
    "email": "string",
    "instagram_handle": "string",
    "created_at": "timestamp"
  }
}
```

**Error Responses:**
- 400: Validation error
- 401: Invalid credentials (with attempts_remaining if applicable)
- 403: Account inactive
- 423: Account locked (with retry_after_seconds)
- 429: Rate limited (with retry_after_seconds)
- 500: Server error

### `/manage-access-codes`
**Path**: `/supabase/functions/manage-access-codes/index.ts`

**Actions:**
- `GET ?action=list` - List all access codes
- `GET ?action=stats` - Get security statistics
- `POST ?action=create` - Create new access code
- `POST ?action=update` - Update existing code
- `POST ?action=delete` - Delete access code

**Create Code Example:**
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/manage-access-codes?action=create' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "XMAS2024",
    "max_uses": 100,
    "expires_at": "2024-12-31T23:59:59Z",
    "description": "Christmas promotion"
  }'
```

## Security Best Practices

### For Production Deployment

1. **Enable Access Code Requirement**
   - Uncomment the mandatory check in `/supabase/functions/signup/index.ts` (lines 122-130)
   - Generate secure random codes for distribution

2. **Monitor Failed Attempts**
   - Regularly check `login_attempts` table for suspicious patterns
   - Query: `SELECT * FROM login_attempts WHERE success = false ORDER BY attempted_at DESC LIMIT 100;`

3. **Review Locked Accounts**
   - Check: `SELECT * FROM user_profiles_auth WHERE account_locked_until > now();`

4. **Cleanup Old Data**
   - Run periodically: `SELECT cleanup_old_login_attempts();`
   - Consider setting up a cron job via Supabase

5. **Adjust Rate Limits**
   - Modify constants in `/supabase/functions/login/index.ts`:
     - `RATE_LIMIT_WINDOW_MINUTES` (default: 15)
     - `MAX_FAILED_ATTEMPTS` (default: 5)
     - `ACCOUNT_LOCKOUT_MINUTES` (default: 30)

6. **Bcrypt Cost Factor**
   - Current: 12 rounds (good balance)
   - Increase to 13-14 for higher security (slower performance)
   - Decrease to 10-11 for faster performance (lower security)

### RLS Policies

**Current Setup:**
- Service role has full access (Edge Functions use this)
- Anonymous users have NO direct database access
- All auth must go through Edge Functions

**Why this is secure:**
- Prevents direct database manipulation
- All security logic enforced in Edge Functions
- No client-side bypass possible

### IP Address Collection

IP addresses are extracted from:
1. `x-forwarded-for` header (primary)
2. `x-real-ip` header (fallback)
3. 'unknown' if neither available

**Note**: Ensure your hosting/proxy forwards real IP addresses.

## Monitoring Queries

### Recent Failed Logins
```sql
SELECT
  username,
  ip_address,
  attempted_at,
  error_message
FROM login_attempts
WHERE success = false
  AND attempted_at > now() - interval '24 hours'
ORDER BY attempted_at DESC;
```

### Currently Locked Accounts
```sql
SELECT
  username,
  failed_login_attempts,
  account_locked_until,
  EXTRACT(EPOCH FROM (account_locked_until - now())) as seconds_remaining
FROM user_profiles_auth
WHERE account_locked_until > now();
```

### Access Code Usage
```sql
SELECT
  code,
  current_uses,
  max_uses,
  CASE
    WHEN max_uses IS NULL THEN 'Unlimited'
    WHEN current_uses >= max_uses THEN 'Exhausted'
    ELSE 'Active'
  END as status,
  expires_at
FROM access_codes
WHERE is_active = true
ORDER BY created_at DESC;
```

### Top Failed Username Attempts (Potential Attacks)
```sql
SELECT
  username,
  COUNT(*) as failed_attempts,
  COUNT(DISTINCT ip_address) as unique_ips,
  MIN(attempted_at) as first_attempt,
  MAX(attempted_at) as last_attempt
FROM login_attempts
WHERE success = false
  AND attempted_at > now() - interval '24 hours'
GROUP BY username
HAVING COUNT(*) > 10
ORDER BY failed_attempts DESC;
```

## Migration Instructions

### Applying the Migration

1. **Using Supabase CLI:**
   ```bash
   supabase db reset  # For fresh start (CAUTION: deletes data)
   # OR
   supabase db push  # Push new migrations only
   ```

2. **Using Supabase Dashboard:**
   - Navigate to SQL Editor
   - Copy contents of `/supabase/migrations/20251123_auth_security_upgrade.sql`
   - Execute the SQL

3. **Verify Migration:**
   ```sql
   -- Check if new tables exist
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('access_codes', 'login_attempts');

   -- Check if new columns exist
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'user_profiles_auth'
   AND column_name IN ('failed_login_attempts', 'account_locked_until', 'is_active');
   ```

### Deploying Edge Functions

1. **Deploy all functions:**
   ```bash
   supabase functions deploy signup
   supabase functions deploy login
   supabase functions deploy manage-access-codes
   ```

2. **Test functions:**
   ```bash
   # Test signup
   curl -X POST 'https://your-project.supabase.co/functions/v1/signup' \
     -H 'Content-Type: application/json' \
     -d '{"username":"test","pin":"1234","email":"test@example.com"}'

   # Test login
   curl -X POST 'https://your-project.supabase.co/functions/v1/login' \
     -H 'Content-Type: application/json' \
     -d '{"username":"test","pin":"1234"}'
   ```

## Frontend Integration

The frontend code at `/src/lib/auth.ts` and `/src/components/Hero.tsx` requires minimal changes:

**Optional Enhancement**: Add access code field to signup form:

```tsx
// In src/components/Hero.tsx, add state:
const [accessCode, setAccessCode] = useState("");

// Add input field in signup form:
<Input
  type="text"
  placeholder="Access Code (optional)"
  value={accessCode}
  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
/>

// Pass to auth.signup:
const result = await auth.signup({
  username,
  pin,
  phone: phone || undefined,
  email: email || undefined,
  instagram_handle: instagram || undefined,
  access_code: accessCode || undefined, // Add this line
});
```

The existing frontend will work without changes since access codes are optional by default.

## Troubleshooting

### Issue: "Rate limit check error"
**Cause**: Database function `check_rate_limit` not found
**Solution**: Re-run migration script

### Issue: Existing users can't log in
**Cause**: Old SHA-256 hashes
**Solution**: System auto-upgrades on login. Existing users log in normally with old hash, then get upgraded to bcrypt automatically.

### Issue: All logins fail with 500 error
**Cause**: Bcrypt module not available in Deno
**Solution**: Ensure Supabase Edge Functions have internet access to import Deno modules

### Issue: Access codes not working
**Cause**: RLS policies blocking read access
**Solution**: Verify "Anyone can validate active access codes" policy exists

## Security Audit Checklist

- [ ] All Edge Functions use service role key (not anon key)
- [ ] RLS policies prevent direct database access for anon users
- [ ] Rate limiting is enabled and tested
- [ ] Account lockout is working correctly
- [ ] Login attempts are being logged
- [ ] Old login attempts are being cleaned up
- [ ] Access codes require authentication (if mandatory)
- [ ] Bcrypt cost factor is appropriate (12+)
- [ ] Error messages don't leak user existence
- [ ] IP addresses are being captured correctly
- [ ] Failed login counter resets on success
- [ ] Account unlock works after timeout

## Performance Considerations

### Bcrypt Performance
- 12 rounds: ~100-300ms per hash/verify
- Impact: Acceptable for authentication (not called frequently)
- Benefit: Prevents brute force attacks

### Database Indexes
All critical queries are indexed:
- `idx_login_attempts_username_time` - Rate limit checks
- `idx_user_profiles_auth_username` - User lookups
- `idx_access_codes_code` - Access code validation

### Auto-Cleanup
Schedule `cleanup_old_login_attempts()` to run daily:
```sql
-- Via pg_cron or external scheduler
SELECT cron.schedule('cleanup-old-logins', '0 3 * * *', 'SELECT cleanup_old_login_attempts()');
```

## License & Credits

Created for TD STUDIOS cannabis marketplace.
Security implementation follows OWASP best practices.
