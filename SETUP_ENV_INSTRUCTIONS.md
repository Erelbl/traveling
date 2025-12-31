# 🔧 Environment Setup Instructions

## Problem
Environment variables in `/env` folder are NOT loaded by Next.js.
Next.js only loads `.env`, `.env.local`, `.env.development`, etc. from the **project root** (where `package.json` is).

## Solution

### Step 1: Create `.env.local` in Project Root

Create a new file called `.env.local` in the same directory as `package.json`:

```bash
# In project root (c:\Users\dorel\traveling)
# Create the file
touch .env.local
# OR on Windows:
# New-Item -Path .env.local -ItemType File
```

### Step 2: Copy This Content to `.env.local`

```env
# Database connection (Get from Neon Console)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth Configuration
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"
AUTH_SECRET="your-secret-here"

# Resend Email Provider
AUTH_RESEND_KEY="re_your_api_key"
AUTH_EMAIL_FROM="Trip Finance <onboarding@resend.dev>"
```

### Step 3: Fill in Your Actual Values

**If you have an `/env` folder with existing values:**
1. Open your existing env file in `/env` folder
2. Copy each value to the new `.env.local` in project root
3. Make sure to copy:
   - `DATABASE_URL`
   - `DIRECT_URL` (if you have it)
   - `AUTH_RESEND_KEY`
   - `AUTH_SECRET`
   - Any other auth-related variables

**If you don't have these values yet:**

1. **DATABASE_URL & DIRECT_URL:**
   - Go to: https://console.neon.tech/
   - Select your project
   - Go to: Settings → Connection Details
   - Copy "Pooled connection" → `DATABASE_URL`
   - Copy "Direct connection" → `DIRECT_URL`

2. **AUTH_SECRET:**
   ```bash
   npx auth secret
   ```
   This will generate and add it to `.env.local` automatically

3. **AUTH_RESEND_KEY:**
   - Go to: https://resend.com/api-keys
   - Create new API key
   - Copy the key (starts with `re_`)

### Step 4: Verify `.env.local` Location

Make sure `.env.local` is in the correct location:

```
c:\Users\dorel\traveling\
├── package.json          ← Should be here
├── .env.local           ← Your new file (SAME LEVEL)
├── auth.ts
├── app\
├── components\
└── ...
```

**NOT here:**
```
c:\Users\dorel\traveling\env\
└── .env.local           ← WRONG! Next.js won't find it
```

### Step 5: Verify `.gitignore` (Already Done ✅)

`.env.local` is already ignored by git (line 34 in `.gitignore`: `.env*`)
Your secrets are safe! ✅

### Step 6: Restart Dev Server

```bash
# Stop the current server (Ctrl+C in terminal)
# Then start it again:
npm run dev
```

### Step 7: Verify It Works

After server restarts, you should see these logs:

```
[Auth] Environment check:
  AUTH_RESEND_KEY: ✓ Set          ← Should show "✓ Set"
  AUTH_EMAIL_FROM: Trip Finance <onboarding@resend.dev>
  DATABASE_URL: ✓ Set             ← Should show "✓ Set"

[Prisma] Creating client with DATABASE_URL: ✓ Present
[Prisma] DATABASE_URL starts with: postgresql://...
[Prisma] Reusing existing Neon Pool
[Prisma] PrismaClient created successfully
```

## Troubleshooting

### Still seeing "✗ Missing" for environment variables?

**Check 1: File location**
```bash
# Should be in project root
ls -la | grep .env.local
# OR on Windows:
dir | findstr .env.local
```

**Check 2: File content**
```bash
# View the file (be careful not to share output!)
cat .env.local
# OR on Windows:
type .env.local
```

Make sure:
- No extra spaces around `=`
- Values are in quotes if they contain special characters
- No comments in the middle of a value

**Check 3: Restart server**
Next.js only reads env files on startup. You MUST restart after changes.

### Variables show "✓ Set" but database still fails?

Check the DATABASE_URL format:
```env
# ✅ CORRECT (with channel_binding for Neon):
DATABASE_URL="postgresql://user:pass@host-pooler.neon.tech/dbname?sslmode=require&channel_binding=require"

# ❌ WRONG:
DATABASE_URL=postgresql://...  (missing quotes)
DATABASE_URL="postgres://..."  (should be "postgresql://")
DATABASE_URL="postgresql://...?sslmode=require"  (missing channel_binding for Neon)
```

**IMPORTANT for Neon users:**
Your DATABASE_URL MUST include `channel_binding=require` at the end:
```env
DATABASE_URL="postgresql://...?sslmode=require&channel_binding=require"
                                                 ^^^^^^^^^^^^^^^^^^^^^^^^
                                                 This is REQUIRED!
```

## Example `.env.local` File

Here's what your complete `.env.local` should look like:

```env
# Database (Neon PostgreSQL)
# IMPORTANT: Include channel_binding=require for Neon!
DATABASE_URL="postgresql://neondb_owner:abc123@ep-host-pooler.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://neondb_owner:abc123@ep-host.aws.neon.tech/neondb?sslmode=require"

# NextAuth
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"
AUTH_SECRET="your-generated-secret-from-npx-auth-secret"

# Resend
AUTH_RESEND_KEY="re_abcdefghij123456789"
AUTH_EMAIL_FROM="Trip Finance <onboarding@resend.dev>"
```

## Quick Copy Template

Copy this to your `.env.local` and fill in the values:

```env
DATABASE_URL=""
DIRECT_URL=""
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"
AUTH_SECRET=""
AUTH_RESEND_KEY=""
AUTH_EMAIL_FROM="Trip Finance <onboarding@resend.dev>"
```

---

## After Setup

Once `.env.local` is set up correctly:
1. ✅ Database will connect without errors
2. ✅ Email sign-in will work
3. ✅ All `[Auth]` logs will show "✓ Set"
4. ✅ No more "AdapterError" messages

Good luck! 🚀

