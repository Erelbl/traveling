# Email Sign-In Troubleshooting Guide

## Current Status

The application now has detailed logging to help debug email sending issues.

## What Was Fixed

### 1. Added Comprehensive Logging in `auth.ts`

```typescript
[Auth] Environment check:
  AUTH_RESEND_KEY: ✓ Set / ✗ Missing
  AUTH_EMAIL_FROM: <value or default>
  DATABASE_URL: ✓ Set / ✗ Missing
```

### 2. Custom sendVerificationRequest

Logs every step of the email sending process:
- Email address
- Magic link URL
- Provider details
- API key presence
- From address
- Success/failure with details

### 3. Fixed Neon Pool Singleton

- Pool is now reused across hot reloads in development
- Prevents "No database host or connection string" errors
- Validates DATABASE_URL format

## How to Debug

### Step 1: Check Environment Variables

After restarting the server, look for these logs on startup:

```bash
[Auth] Environment check:
  AUTH_RESEND_KEY: ✓ Set     # ← Should show "✓ Set"
  AUTH_EMAIL_FROM: Trip Finance <onboarding@resend.dev>
  DATABASE_URL: ✓ Set         # ← Should show "✓ Set"
```

**If AUTH_RESEND_KEY shows "✗ Missing":**
1. Open `.env.local` (or create it if missing)
2. Add: `AUTH_RESEND_KEY=re_your_api_key_here`
3. Get your API key from: https://resend.com/api-keys
4. Restart the server

### Step 2: Test Email Sending

1. Go to http://localhost:3000/signin
2. Enter your email
3. Click "שלח קישור להתחברות"
4. **Watch the terminal logs**

**Expected logs on successful send:**

```bash
[Auth] Resend: sendVerificationRequest called
  Email: your@email.com
  URL: http://localhost:3000/api/auth/callback/resend?token=...
  Provider: resend
  API Key set: true
  From address: Trip Finance <onboarding@resend.dev>
[Auth] Resend: Email sent successfully { id: 're_...' }
```

**If you see an error:**

```bash
[Auth] Resend: Failed to send email { error details }
```

Common issues:
- **Invalid API key**: `AUTH_RESEND_KEY` is wrong or expired
- **Invalid from address**: Using unverified domain
- **Rate limit**: Too many requests to Resend

### Step 3: Check Resend Dashboard

1. Go to https://resend.com/emails
2. Look for the sent email
3. If it appears: Email was sent successfully, check spam folder
4. If it doesn't appear: The error is before reaching Resend API

## Common Errors & Solutions

### Error: "No database host or connection string was set"

**Cause:** DATABASE_URL not properly passed to Neon Pool

**Solution:**
1. Verify `.env.local` has: `DATABASE_URL=postgresql://...`
2. Restart the server (Ctrl+C, then `npm run dev`)
3. Look for: `[Prisma] Reusing existing Neon Pool`

### Error: "Failed to send email" (but no Resend logs)

**Cause:** Email provider configuration issue

**Solution:**
1. Check terminal for: `[Auth] Resend: sendVerificationRequest called`
2. If you don't see it, the provider isn't being called
3. Verify `AUTH_RESEND_KEY` is set in `.env.local`
4. Restart server

### Error: Resend API rejection

**Cause:** Invalid API key or from address

**Solution:**
1. Verify API key at https://resend.com/api-keys
2. For development, use: `AUTH_EMAIL_FROM="Trip Finance <onboarding@resend.dev>"`
3. For production, verify your domain at https://resend.com/domains

## Complete `.env.local` Template

```env
# Database (Get from Neon Console)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"

# NextAuth (Generate with: npx auth secret)
AUTH_SECRET="your-generated-secret"

# Resend Email (Get from resend.com/api-keys)
AUTH_RESEND_KEY="re_your_api_key_here"
AUTH_EMAIL_FROM="Trip Finance <onboarding@resend.dev>"
```

## Verification Checklist

Before testing, verify:
- [ ] `.env.local` exists in project root
- [ ] `DATABASE_URL` is set and starts with `postgresql://`
- [ ] `AUTH_RESEND_KEY` is set and starts with `re_`
- [ ] `AUTH_SECRET` is set (from `npx auth secret`)
- [ ] Server was restarted after env changes
- [ ] Terminal shows `[Auth] Environment check:` on startup
- [ ] All env vars show "✓ Set"

## Still Not Working?

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Check all logs:**
   - Look for `[Auth]` logs in terminal
   - Look for `[Prisma]` logs in terminal
   - Check browser console for errors

3. **Test Resend API directly:**
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "Trip Finance <onboarding@resend.dev>",
       "to": "your@email.com",
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

If direct API call works but app doesn't, check the server logs for specific errors.

