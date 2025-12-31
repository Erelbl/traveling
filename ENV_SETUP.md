# Environment Variables Setup

## ⚠️ CRITICAL: File Location

**The `.env.local` file MUST be in the PROJECT ROOT** (same folder as `package.json`).

```
c:\Users\dorel\traveling\
├── package.json          ← This level
├── .env.local           ← Create here (NOT in /env folder!)
├── auth.ts
├── app\
└── ...
```

Next.js will **NOT** load env files from subdirectories like `/env`.

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

### 1. Database (Neon PostgreSQL)

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"
```

**Get your Neon connection strings from:**
- https://console.neon.tech/
- Project Settings → Connection Details
- Use the **pooled connection string** for `DATABASE_URL`
- Use the **direct connection string** for `DIRECT_URL`

### 2. NextAuth Configuration

```env
# Generate with: npx auth secret
AUTH_SECRET="your-generated-secret-here"
```

### 3. Email Provider (Resend)

```env
AUTH_RESEND_KEY="re_your_resend_api_key"
AUTH_EMAIL_FROM="Trip Finance <onboarding@resend.dev>"
```

**For development (no custom domain):**
- Use `onboarding@resend.dev` as the from address
- Get your API key from: https://resend.com/api-keys

**For production:**
- Verify your domain in Resend
- Update `AUTH_EMAIL_FROM` to use your domain
- Example: `"Trip Finance <noreply@yourdomain.com>"`

## Quick Setup

### Option A: You Have Existing `/env` Folder

1. **Create `.env.local` in project root:**
   ```bash
   # Windows PowerShell:
   New-Item -Path .env.local -ItemType File
   
   # OR Git Bash:
   touch .env.local
   ```

2. **Copy values from `/env` folder to `.env.local`:**
   - Open your existing env file in `/env` folder
   - Copy `DATABASE_URL` value
   - Copy `DIRECT_URL` value (if exists)
   - Copy `AUTH_RESEND_KEY` value
   - Copy any other auth values
   - Paste them into `.env.local` in project root

3. **Add missing variables:**
   ```env
   AUTH_URL="http://localhost:3000"
   AUTH_TRUST_HOST="true"
   AUTH_EMAIL_FROM="Trip Finance <onboarding@resend.dev>"
   ```

4. **Generate AUTH_SECRET if missing:**
   ```bash
   npx auth secret
   ```

5. **Restart the dev server:**
   ```bash
   npm run dev
   ```

### Option B: Starting Fresh

1. **Create `.env.local` in project root**

2. **Add your Neon database URLs**
   - Get from https://console.neon.tech/

3. **Generate AUTH_SECRET:**
   ```bash
   npx auth secret
   ```

4. **Add your Resend API key**
   - Get from https://resend.com/api-keys

5. **Add other required vars**

6. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Troubleshooting

### "No database host or connection string was set"
- **Cause:** `DATABASE_URL` is missing or malformed
- **Fix:** Check your `.env` or `.env.local` file
- **Verify:** The connection string should start with `postgresql://`

### "Failed to send email"
- **Cause:** Missing or invalid `AUTH_RESEND_KEY`
- **Fix:** Add a valid Resend API key to your env file
- **Test:** https://resend.com/api-keys

### Environment variables not loaded
- **Fix:** Restart the dev server after changing `.env` files
- **Note:** Next.js only reads env files on startup

