# TD STUDIOS Authentication Security Flow Diagrams

## Signup Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER SIGNUP FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

Frontend (Hero.tsx)
    │
    ├─→ User enters: username, PIN, contact info, access_code
    │
    ├─→ Frontend validation: PIN is 4 digits
    │
    ├─→ POST /functions/v1/signup
    │
    ▼
Edge Function (signup/index.ts)
    │
    ├─→ [1] INPUT VALIDATION
    │   ├─ Username: 3-20 chars, alphanumeric + underscore
    │   ├─ PIN: Exactly 4 digits
    │   ├─ Email: Valid format (if provided)
    │   ├─ Phone: 10+ digits (if provided)
    │   └─ At least one contact method required
    │
    ├─→ [2] ACCESS CODE VALIDATION (Optional)
    │   ├─ Query: SELECT * FROM access_codes WHERE code = ?
    │   ├─ Check: is_active = true
    │   ├─ Check: not expired (expires_at > now)
    │   ├─ Check: usage < max_uses
    │   ├─ ✓ Valid → Increment current_uses
    │   └─ ✗ Invalid → Return 403 error
    │
    ├─→ [3] HASH PIN (bcrypt)
    │   ├─ Generate salt (12 rounds)
    │   ├─ Hash PIN with salt
    │   └─ Result: $2a$12$... (60 chars)
    │
    ├─→ [4] CREATE USER
    │   ├─ INSERT INTO user_profiles_auth
    │   ├─ Fields: username, pin_hash, email, phone, instagram
    │   ├─ Set: is_active = true, failed_login_attempts = 0
    │   ├─ Check: Unique constraints (username, email, phone)
    │   └─ ✓ Success → Return user object
    │       ✗ Duplicate → Return 409 error
    │
    ▼
Response to Frontend
    │
    ├─→ Success (201): { success: true, user: {...} }
    └─→ Error (400/403/409/500): { error: "..." }
```

## Login Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER LOGIN FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

Frontend (Hero.tsx)
    │
    ├─→ User enters: username, PIN
    │
    ├─→ Frontend validation: PIN is 4 digits
    │
    ├─→ POST /functions/v1/login
    │
    ▼
Edge Function (login/index.ts)
    │
    ├─→ [1] INPUT VALIDATION
    │   ├─ Username: required
    │   ├─ PIN: Exactly 4 digits
    │   ├─ Extract client IP address
    │   └─ Normalize username (lowercase, trim)
    │
    ├─→ [2] RATE LIMITING CHECK
    │   ├─ Call: check_rate_limit(username, ip, 15min, 5 attempts)
    │   ├─ Query: COUNT failed attempts in last 15min
    │   ├─ ✓ Under limit → Continue
    │   └─ ✗ Over limit → Return 429 with retry_after_seconds
    │
    ├─→ [3] FETCH USER PROFILE
    │   ├─ Query: SELECT * FROM user_profiles_auth WHERE username = ?
    │   ├─ ✓ Found → Continue
    │   └─ ✗ Not found → Log failure, return 401 (don't reveal user doesn't exist)
    │
    ├─→ [4] CHECK ACCOUNT STATUS
    │   ├─ is_active = false?
    │   │   └─→ Return 403 "Account inactive"
    │   └─ account_locked_until > now?
    │       └─→ Return 423 "Account locked" with retry_after_seconds
    │
    ├─→ [5] VERIFY PIN
    │   ├─ Detect hash type:
    │   │   ├─ SHA-256 (64 hex chars)?
    │   │   │   ├─→ Compute SHA-256(PIN)
    │   │   │   ├─→ Compare hashes
    │   │   │   └─→ If valid: Auto-upgrade to bcrypt
    │   │   └─ bcrypt ($2a$ prefix)?
    │   │       └─→ bcrypt.compare(PIN, hash)
    │   │
    │   ├─ ✓ Valid PIN → Go to [6]
    │   └─ ✗ Invalid PIN → Go to [7]
    │
    ├─→ [6] SUCCESSFUL LOGIN
    │   ├─ Log attempt: INSERT INTO login_attempts (success=true)
    │   ├─ Update profile:
    │   │   ├─ last_login_at = now()
    │   │   ├─ failed_login_attempts = 0
    │   │   ├─ last_failed_login_at = NULL
    │   │   └─ account_locked_until = NULL
    │   └─ Return 200: { success: true, user: {...} }
    │
    └─→ [7] FAILED LOGIN
        ├─ Log attempt: INSERT INTO login_attempts (success=false)
        ├─ Call: increment_failed_login(user_id, 5, 30min)
        ├─ Increment: failed_login_attempts++
        ├─ Check: failed_login_attempts >= 5?
        │   ├─ Yes → Set account_locked_until = now() + 30min
        │   │       Return 423 "Account locked"
        │   └─ No → Return 401 with attempts_remaining
        └─ Return error
```

## Rate Limiting Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      RATE LIMITING MECHANISM                         │
└─────────────────────────────────────────────────────────────────────┘

Login Attempt
    │
    ├─→ check_rate_limit(username, ip, 15min, 5 attempts)
    │
    ▼
Database Function (check_rate_limit)
    │
    ├─→ time_threshold = now() - 15 minutes
    │
    ├─→ Query login_attempts:
    │   SELECT COUNT(*), MIN(attempted_at)
    │   WHERE username = ? AND success = false
    │   AND attempted_at > time_threshold
    │   AND ip_address = ? (optional)
    │
    ├─→ Count failed attempts in window
    │
    ├─→ Is count >= 5?
    │   │
    │   ├─ YES → Rate Limited
    │   │   ├─ Calculate: retry_after = (oldest_attempt + 15min) - now
    │   │   └─ Return: { is_limited: true, retry_after_seconds: X }
    │   │
    │   └─ NO → Not Limited
    │       └─ Return: { is_limited: false, attempts_count: X }
    │
    ▼
Edge Function Decision
    │
    ├─ is_limited = true?
    │   └─→ Return 429 with Retry-After header
    │
    └─ is_limited = false?
        └─→ Continue to PIN verification
```

## Account Lockout Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ACCOUNT LOCKOUT MECHANISM                       │
└─────────────────────────────────────────────────────────────────────┘

Failed Login Attempt
    │
    ├─→ increment_failed_login(user_id, max=5, lockout=30min)
    │
    ▼
Database Function (increment_failed_login)
    │
    ├─→ UPDATE user_profiles_auth SET:
    │   ├─ failed_login_attempts = failed_login_attempts + 1
    │   ├─ last_failed_login_at = now()
    │   └─ account_locked_until = CASE
    │       WHEN failed_login_attempts + 1 >= 5
    │       THEN now() + 30 minutes
    │       ELSE account_locked_until
    │
    ├─→ Return:
    │   ├─ new_attempt_count
    │   ├─ is_locked (true if count >= 5)
    │   └─ locked_until (timestamp)
    │
    ▼
Edge Function Response
    │
    ├─ is_locked = true?
    │   └─→ Return 423: "Account locked for 30 minutes"
    │
    └─ is_locked = false?
        └─→ Return 401: "Invalid PIN" + attempts_remaining


Auto-Unlock Process
    │
    ├─→ On next login attempt:
    │   ├─ Check: account_locked_until > now()?
    │   ├─ NO → Account auto-unlocked, allow login
    │   └─ YES → Still locked, return 423
    │
    └─→ On successful login:
        └─ Reset: failed_login_attempts = 0
                  account_locked_until = NULL
```

## Access Code Validation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ACCESS CODE VALIDATION                            │
└─────────────────────────────────────────────────────────────────────┘

Signup with Access Code
    │
    ├─→ Query: SELECT * FROM access_codes WHERE code = ?
    │
    ▼
Validation Checks
    │
    ├─→ [1] Code exists?
    │   └─ NO → Return 403 "Invalid access code"
    │
    ├─→ [2] is_active = true?
    │   └─ NO → Return 403 "Invalid access code"
    │
    ├─→ [3] Not expired?
    │   ├─ expires_at = NULL → OK (never expires)
    │   └─ expires_at > now() → OK
    │       └─ ELSE → Return 403 "Access code has expired"
    │
    ├─→ [4] Usage available?
    │   ├─ max_uses = NULL → OK (unlimited)
    │   └─ current_uses < max_uses → OK
    │       └─ ELSE → Return 403 "Access code exhausted"
    │
    ├─→ [5] All checks passed
    │   ├─ UPDATE: current_uses = current_uses + 1
    │   └─ Continue to user creation
    │
    ▼
Continue Signup Flow
```

## Security Layers Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                                 │
└─────────────────────────────────────────────────────────────────────┘

USER REQUEST
    │
    ▼
┌──────────────────────────────────────────┐
│   Layer 1: Input Validation              │
│   - Format checks                        │
│   - Length limits                        │
│   - Required fields                      │
└──────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────┐
│   Layer 2: Rate Limiting                 │
│   - 5 attempts per 15 min                │
│   - Per-username tracking                │
│   - Per-IP tracking                      │
└──────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────┐
│   Layer 3: Access Control                │
│   - Access code validation (signup)      │
│   - Account status check (login)         │
│   - Account lock check (login)           │
└──────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────┐
│   Layer 4: Cryptographic Verification    │
│   - bcrypt password hashing              │
│   - Salt rounds: 12                      │
│   - Constant-time comparison             │
└──────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────┐
│   Layer 5: Audit Logging                 │
│   - Log all attempts                     │
│   - Track IP addresses                   │
│   - Monitor patterns                     │
└──────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────┐
│   Layer 6: RLS Policies                  │
│   - Service role only                    │
│   - No direct DB access                  │
│   - Function-based auth                  │
└──────────────────────────────────────────┘
    │
    ▼
SUCCESS / FAILURE RESPONSE
```

## Data Flow: Successful Login

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA FLOW: SUCCESSFUL LOGIN                       │
└─────────────────────────────────────────────────────────────────────┘

Browser                Edge Function              Database
   │                          │                        │
   │  POST /login            │                        │
   │  {username,pin}         │                        │
   ├────────────────────────>│                        │
   │                          │                        │
   │                          │  check_rate_limit()   │
   │                          ├───────────────────────>│
   │                          │<───────────────────────┤
   │                          │  { is_limited: false } │
   │                          │                        │
   │                          │  SELECT user profile  │
   │                          ├───────────────────────>│
   │                          │<───────────────────────┤
   │                          │  { user data }         │
   │                          │                        │
   │                          │  bcrypt.compare()     │
   │                          │  (local operation)    │
   │                          │                        │
   │                          │  INSERT login_attempt │
   │                          ├───────────────────────>│
   │                          │                        │
   │                          │  UPDATE user profile  │
   │                          │  (reset counters)     │
   │                          ├───────────────────────>│
   │                          │                        │
   │  200 OK                 │                        │
   │  {success,user}         │                        │
   │<────────────────────────┤                        │
   │                          │                        │
   │  Store in localStorage │                        │
   │  Navigate to /dashboard│                        │
   │                          │                        │
```

## Data Flow: Failed Login with Lockout

```
┌─────────────────────────────────────────────────────────────────────┐
│                 DATA FLOW: FAILED LOGIN → LOCKOUT                    │
└─────────────────────────────────────────────────────────────────────┘

Attempt #1-4 (Failed)
Browser → Edge Function → Database
   │           │              │
   │  POST     │  Verify PIN  │  ✗ Invalid
   │           │  Log failure │
   │           │  Increment   │  failed_attempts++
   │  401      │              │
   │  "Invalid PIN, 3 attempts remaining"
   │

Attempt #5 (Failed)
Browser → Edge Function → Database
   │           │              │
   │  POST     │  Verify PIN  │  ✗ Invalid
   │           │  Log failure │
   │           │  Increment   │  failed_attempts = 5
   │           │              │  account_locked_until = now + 30min
   │  423      │              │
   │  "Account locked for 30 minutes"
   │

Attempt #6 (While Locked)
Browser → Edge Function → Database
   │           │              │
   │  POST     │  Check lock  │  ✓ Still locked
   │           │              │  (locked_until > now)
   │  423      │              │
   │  "Account locked, retry_after: 1500 seconds"
   │

After 30 Minutes
Browser → Edge Function → Database
   │           │              │
   │  POST     │  Check lock  │  ✗ Lock expired
   │           │              │  (locked_until < now)
   │           │  Verify PIN  │  ✓ Valid
   │           │  Reset       │  failed_attempts = 0
   │           │              │  locked_until = NULL
   │  200 OK   │              │
   │  {success, user}         │
```

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA OVERVIEW                          │
└─────────────────────────────────────────────────────────────────────┘

user_profiles_auth (Main Table)
┌──────────────────────────────────────┐
│ id (PK)                              │
│ username (UNIQUE)                    │◄────┐
│ pin_hash                             │     │
│ email (UNIQUE)                       │     │ Referenced by
│ phone (UNIQUE)                       │     │ login_attempts.username
│ instagram_handle                     │     │
│ created_at                           │     │
│ last_login_at                        │     │
│ failed_login_attempts (NEW)          │     │
│ last_failed_login_at (NEW)           │     │
│ account_locked_until (NEW)           │     │
│ is_active (NEW)                      │     │
└──────────────────────────────────────┘     │
                                             │
                                             │
login_attempts (Audit Log)                   │
┌──────────────────────────────────────┐     │
│ id (PK)                              │     │
│ username ────────────────────────────┼─────┘
│ ip_address                           │
│ success                              │
│ attempted_at                         │
│ error_message                        │
└──────────────────────────────────────┘


access_codes (Access Control)
┌──────────────────────────────────────┐
│ id (PK)                              │
│ code (UNIQUE)                        │
│ is_active                            │
│ max_uses                             │
│ current_uses                         │
│ created_by                           │
│ created_at                           │
│ expires_at                           │
│ description                          │
└──────────────────────────────────────┘


Indexes:
- user_profiles_auth: username, email, phone, account_locked_until
- login_attempts: (username, attempted_at), (ip_address, attempted_at)
- access_codes: code
```

## Security Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│              AUTHENTICATION SECURITY TIMELINE                        │
└─────────────────────────────────────────────────────────────────────┘

Before Upgrade:
─────────────────────────────────────────────────────────────
                                    ✗ Vulnerable
┌─────────────────────────────────────────────────────────────┐
│ SHA-256 Hashing (No Salt)                                   │
│ - Fast to compute                                           │
│ - No rate limiting                                          │
│ - No account lockout                                        │
│ - No audit logging                                          │
│ - Permissive RLS policies                                  │
└─────────────────────────────────────────────────────────────┘


After Upgrade:
─────────────────────────────────────────────────────────────
                                    ✓ Secure
┌─────────────────────────────────────────────────────────────┐
│ bcrypt Hashing (12 rounds, salted)                         │
│ + Rate Limiting (5 attempts / 15min)                       │
│ + Account Lockout (30min after 5 failures)                 │
│ + Comprehensive Audit Logging                               │
│ + Restricted RLS Policies                                  │
│ + Access Code System (optional/mandatory)                  │
│ + IP Address Tracking                                       │
│ + Automatic SHA-256 → bcrypt Migration                     │
└─────────────────────────────────────────────────────────────┘


Migration Progress:
─────────────────────────────────────────────────────────────
Old Users                          New Users
(SHA-256)                          (bcrypt)
    │                                  │
    │   Login with correct PIN         │   Signup with bcrypt
    ├──────────────────────────────────┤
    │   Auto-upgrade to bcrypt         │
    │   (Transparent)                  │
    ▼                                  ▼
All Users on bcrypt (Secure)
```

---

**Visual Reference Version**: 1.0
**Created**: 2025-11-23
**Purpose**: Quick understanding of security flows
