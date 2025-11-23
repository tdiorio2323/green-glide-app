-- TD STUDIOS Security Monitoring Dashboard
-- Run these queries regularly to monitor authentication security

-- ==============================================
-- SECURITY OVERVIEW
-- ==============================================

-- Overall security statistics
SELECT
  'Active Users' as metric,
  COUNT(*)::text as value
FROM user_profiles_auth
WHERE is_active = true

UNION ALL

SELECT
  'Locked Accounts',
  COUNT(*)::text
FROM user_profiles_auth
WHERE account_locked_until > now()

UNION ALL

SELECT
  'Failed Logins (24h)',
  COUNT(*)::text
FROM login_attempts
WHERE success = false
  AND attempted_at > now() - interval '24 hours'

UNION ALL

SELECT
  'Successful Logins (24h)',
  COUNT(*)::text
FROM login_attempts
WHERE success = true
  AND attempted_at > now() - interval '24 hours'

UNION ALL

SELECT
  'Active Access Codes',
  COUNT(*)::text
FROM access_codes
WHERE is_active = true
  AND (expires_at IS NULL OR expires_at > now())

UNION ALL

SELECT
  'Average Logins/Hour (24h)',
  ROUND(COUNT(*)::numeric / 24, 1)::text
FROM login_attempts
WHERE attempted_at > now() - interval '24 hours';


-- ==============================================
-- ACCOUNT SECURITY ALERTS
-- ==============================================

-- Currently locked accounts (need attention)
SELECT
  'LOCKED ACCOUNTS' as alert_type,
  username,
  failed_login_attempts as attempts,
  to_char(account_locked_until, 'YYYY-MM-DD HH24:MI:SS') as locked_until,
  EXTRACT(EPOCH FROM (account_locked_until - now()))::integer / 60 as minutes_remaining,
  to_char(last_failed_login_at, 'YYYY-MM-DD HH24:MI:SS') as last_failed
FROM user_profiles_auth
WHERE account_locked_until > now()
ORDER BY account_locked_until DESC;


-- Accounts with multiple recent failures (not yet locked)
SELECT
  'HIGH FAILURE RATE' as alert_type,
  username,
  failed_login_attempts as current_attempts,
  5 - failed_login_attempts as attempts_until_lock,
  to_char(last_failed_login_at, 'YYYY-MM-DD HH24:MI:SS') as last_failed
FROM user_profiles_auth
WHERE failed_login_attempts > 2
  AND failed_login_attempts < 5
  AND is_active = true
ORDER BY failed_login_attempts DESC;


-- Inactive accounts (potential issues)
SELECT
  'INACTIVE ACCOUNTS' as alert_type,
  username,
  email,
  to_char(created_at, 'YYYY-MM-DD') as created,
  to_char(last_login_at, 'YYYY-MM-DD HH24:MI:SS') as last_login
FROM user_profiles_auth
WHERE is_active = false
ORDER BY created_at DESC;


-- ==============================================
-- SUSPICIOUS ACTIVITY DETECTION
-- ==============================================

-- Multiple failed logins from same IP (potential attack)
SELECT
  'SUSPICIOUS IP' as alert_type,
  ip_address,
  COUNT(DISTINCT username) as unique_usernames_targeted,
  COUNT(*) as total_failed_attempts,
  array_agg(DISTINCT username ORDER BY username) as usernames,
  to_char(MIN(attempted_at), 'YYYY-MM-DD HH24:MI:SS') as first_attempt,
  to_char(MAX(attempted_at), 'YYYY-MM-DD HH24:MI:SS') as last_attempt
FROM login_attempts
WHERE success = false
  AND attempted_at > now() - interval '24 hours'
  AND ip_address != 'unknown'
GROUP BY ip_address
HAVING COUNT(*) > 10
ORDER BY COUNT(*) DESC;


-- Usernames with many failed attempts from different IPs (distributed attack)
SELECT
  'TARGETED USERNAME' as alert_type,
  username,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(*) as total_failed_attempts,
  to_char(MIN(attempted_at), 'YYYY-MM-DD HH24:MI:SS') as first_attempt,
  to_char(MAX(attempted_at), 'YYYY-MM-DD HH24:MI:SS') as last_attempt
FROM login_attempts
WHERE success = false
  AND attempted_at > now() - interval '24 hours'
GROUP BY username
HAVING COUNT(*) > 10
ORDER BY COUNT(*) DESC;


-- Unusual login patterns (rapid successive logins)
SELECT
  'RAPID LOGIN PATTERN' as alert_type,
  username,
  COUNT(*) as login_count,
  COUNT(DISTINCT ip_address) as unique_ips,
  to_char(MIN(attempted_at), 'HH24:MI:SS') as first,
  to_char(MAX(attempted_at), 'HH24:MI:SS') as last,
  EXTRACT(EPOCH FROM (MAX(attempted_at) - MIN(attempted_at)))::integer as seconds_span
FROM login_attempts
WHERE attempted_at > now() - interval '1 hour'
GROUP BY username
HAVING COUNT(*) > 20  -- More than 20 login attempts in 1 hour
ORDER BY COUNT(*) DESC;


-- ==============================================
-- LOGIN ACTIVITY ANALYSIS
-- ==============================================

-- Hourly login activity (last 24 hours)
SELECT
  to_char(date_trunc('hour', attempted_at), 'YYYY-MM-DD HH24:00') as hour,
  COUNT(*) FILTER (WHERE success = true) as successful,
  COUNT(*) FILTER (WHERE success = false) as failed,
  COUNT(*) as total,
  ROUND(COUNT(*) FILTER (WHERE success = true)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 1) as success_rate
FROM login_attempts
WHERE attempted_at > now() - interval '24 hours'
GROUP BY date_trunc('hour', attempted_at)
ORDER BY hour DESC;


-- Daily login activity (last 7 days)
SELECT
  to_char(DATE(attempted_at), 'YYYY-MM-DD (Dy)') as day,
  COUNT(*) FILTER (WHERE success = true) as successful,
  COUNT(*) FILTER (WHERE success = false) as failed,
  COUNT(*) as total,
  COUNT(DISTINCT username) as unique_users,
  ROUND(COUNT(*) FILTER (WHERE success = true)::numeric / NULLIF(COUNT(*), 0)::numeric * 100, 1) as success_rate
FROM login_attempts
WHERE attempted_at > now() - interval '7 days'
GROUP BY DATE(attempted_at)
ORDER BY day DESC;


-- Most active users (last 7 days)
SELECT
  username,
  COUNT(*) as total_logins,
  COUNT(*) FILTER (WHERE success = true) as successful,
  COUNT(*) FILTER (WHERE success = false) as failed,
  to_char(MAX(attempted_at), 'YYYY-MM-DD HH24:MI') as last_login,
  COUNT(DISTINCT ip_address) as unique_ips
FROM login_attempts
WHERE attempted_at > now() - interval '7 days'
GROUP BY username
ORDER BY COUNT(*) DESC
LIMIT 20;


-- ==============================================
-- ACCESS CODE MONITORING
-- ==============================================

-- Access code usage summary
SELECT
  code,
  current_uses,
  CASE
    WHEN max_uses IS NULL THEN '∞'
    ELSE max_uses::text
  END as max_uses,
  CASE
    WHEN max_uses IS NULL THEN NULL
    ELSE ROUND((current_uses::float / max_uses::float * 100)::numeric, 1)
  END as "percent_used",
  CASE
    WHEN NOT is_active THEN 'INACTIVE'
    WHEN expires_at IS NOT NULL AND expires_at < now() THEN 'EXPIRED'
    WHEN max_uses IS NOT NULL AND current_uses >= max_uses THEN 'EXHAUSTED'
    WHEN max_uses IS NOT NULL AND current_uses::float / max_uses::float > 0.9 THEN 'ALMOST FULL'
    ELSE 'ACTIVE'
  END as status,
  CASE
    WHEN expires_at IS NOT NULL THEN to_char(expires_at, 'YYYY-MM-DD HH24:MI')
    ELSE 'Never'
  END as expires,
  description
FROM access_codes
ORDER BY
  CASE
    WHEN is_active AND (expires_at IS NULL OR expires_at > now()) AND (max_uses IS NULL OR current_uses < max_uses) THEN 1
    ELSE 2
  END,
  current_uses DESC;


-- Access codes needing attention
SELECT
  code,
  CASE
    WHEN expires_at IS NOT NULL AND expires_at < now() THEN 'EXPIRED - Deactivate'
    WHEN max_uses IS NOT NULL AND current_uses >= max_uses THEN 'EXHAUSTED - Deactivate'
    WHEN max_uses IS NOT NULL AND current_uses::float / max_uses::float > 0.9 THEN
      'ALMOST EXHAUSTED - ' || (max_uses - current_uses)::text || ' uses remaining'
    WHEN expires_at IS NOT NULL AND expires_at < now() + interval '7 days' THEN
      'EXPIRING SOON - ' || EXTRACT(DAY FROM (expires_at - now()))::text || ' days'
    ELSE 'OK'
  END as action_needed,
  current_uses || ' / ' || COALESCE(max_uses::text, '∞') as usage,
  to_char(expires_at, 'YYYY-MM-DD') as expires,
  description
FROM access_codes
WHERE is_active = true
  AND (
    (expires_at IS NOT NULL AND expires_at < now() + interval '14 days')
    OR (max_uses IS NOT NULL AND current_uses::float / max_uses::float > 0.8)
    OR (expires_at IS NOT NULL AND expires_at < now())
    OR (max_uses IS NOT NULL AND current_uses >= max_uses)
  )
ORDER BY
  CASE
    WHEN expires_at IS NOT NULL AND expires_at < now() THEN 1
    WHEN max_uses IS NOT NULL AND current_uses >= max_uses THEN 2
    WHEN max_uses IS NOT NULL AND current_uses::float / max_uses::float > 0.9 THEN 3
    WHEN expires_at IS NOT NULL AND expires_at < now() + interval '7 days' THEN 4
    ELSE 5
  END;


-- ==============================================
-- SECURITY MAINTENANCE ACTIONS
-- ==============================================

-- Unlock all expired account locks (run this if needed)
-- UPDATE user_profiles_auth
-- SET failed_login_attempts = 0,
--     account_locked_until = NULL,
--     last_failed_login_at = NULL
-- WHERE account_locked_until < now();


-- Manually unlock specific user (replace 'username' with actual username)
-- UPDATE user_profiles_auth
-- SET failed_login_attempts = 0,
--     account_locked_until = NULL,
--     last_failed_login_at = NULL
-- WHERE username = 'username';


-- Deactivate expired access codes
-- UPDATE access_codes
-- SET is_active = false
-- WHERE expires_at IS NOT NULL
--   AND expires_at < now()
--   AND is_active = true;


-- Deactivate exhausted access codes
-- UPDATE access_codes
-- SET is_active = false
-- WHERE max_uses IS NOT NULL
--   AND current_uses >= max_uses
--   AND is_active = true;


-- Cleanup old login attempts (older than 30 days)
-- DELETE FROM login_attempts
-- WHERE attempted_at < now() - interval '30 days';


-- ==============================================
-- PASSWORD HASH AUDIT
-- ==============================================

-- Check which users are still using old SHA-256 hashes
SELECT
  username,
  CASE
    WHEN pin_hash LIKE '$2a$%' OR pin_hash LIKE '$2b$%' THEN 'bcrypt (secure)'
    WHEN length(pin_hash) = 64 THEN 'SHA-256 (legacy - will auto-upgrade on next login)'
    ELSE 'unknown'
  END as hash_type,
  to_char(last_login_at, 'YYYY-MM-DD HH24:MI:SS') as last_login,
  CASE
    WHEN last_login_at IS NULL THEN 'Never logged in'
    WHEN last_login_at < now() - interval '30 days' THEN 'Inactive 30+ days'
    WHEN last_login_at < now() - interval '7 days' THEN 'Inactive 7+ days'
    ELSE 'Active'
  END as activity_status
FROM user_profiles_auth
ORDER BY
  CASE
    WHEN pin_hash LIKE '$2%' THEN 2
    ELSE 1
  END,
  last_login_at DESC NULLS LAST;


-- Count users by hash type
SELECT
  CASE
    WHEN pin_hash LIKE '$2a$%' OR pin_hash LIKE '$2b$%' THEN 'bcrypt (secure)'
    WHEN length(pin_hash) = 64 THEN 'SHA-256 (legacy)'
    ELSE 'unknown'
  END as hash_type,
  COUNT(*) as user_count,
  ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM user_profiles_auth)::numeric * 100, 1) as percentage
FROM user_profiles_auth
GROUP BY
  CASE
    WHEN pin_hash LIKE '$2a$%' OR pin_hash LIKE '$2b$%' THEN 'bcrypt (secure)'
    WHEN length(pin_hash) = 64 THEN 'SHA-256 (legacy)'
    ELSE 'unknown'
  END
ORDER BY user_count DESC;


-- ==============================================
-- CUSTOM QUERIES
-- ==============================================

-- Find specific user's login history
-- SELECT
--   attempted_at,
--   success,
--   ip_address,
--   error_message
-- FROM login_attempts
-- WHERE username = 'username'
-- ORDER BY attempted_at DESC
-- LIMIT 50;


-- Find all logins from specific IP
-- SELECT
--   username,
--   attempted_at,
--   success,
--   error_message
-- FROM login_attempts
-- WHERE ip_address = 'IP_ADDRESS'
-- ORDER BY attempted_at DESC;
