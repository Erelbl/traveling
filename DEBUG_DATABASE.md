# 🔍 Database Connection Debugging

## Quick Diagnosis

Run these commands to check if everything is configured correctly:

### 1. Check Environment Variables

```bash
npm run check-env
```

**Expected output:**
```
✓ DATABASE_URL: Set
✓ AUTH_SECRET: Set
✓ AUTH_RESEND_KEY: Set
✓ Format looks valid
```

**If you see errors:**
- Create `.env.local` in project root (same folder as `package.json`)
- Add the required variables (see `SETUP_ENV_INSTRUCTIONS.md`)

---

### 2. Test Database Connection

```bash
npx prisma db pull --print
```

**Expected output:**
```
Datasource "db": PostgreSQL database "neondb"...
✓ Successfully fetched schema from database
```

**If it fails:**
- Check DATABASE_URL is correct
- Verify Neon database is accessible
- Check firewall/network

---

### 3. Check Prisma Client

```bash
npx prisma generate
```

Should complete without errors.

---

## Common Errors & Solutions

### Error: "DATABASE_URL is not defined"

**Symptoms:**
```
❌ DATABASE_URL is not defined!
Please create .env.local in project root...
```

**Solution:**
1. Create `.env.local` **in project root** (not in `/env` folder!)
2. Add: `DATABASE_URL="postgresql://..."`
3. Get value from: https://console.neon.tech/
4. Restart server: `npm run dev`

---

### Error: "No database host or connection string was set"

**Symptoms:**
```
AdapterError: No database host or connection string was set...
(host: localhost, user: dorel, db: dorel, password: null)
```

**This means:** DATABASE_URL is not reaching the Neon Pool correctly.

**Solution:**
1. **Verify .env.local location:**
   ```bash
   # Should be in project root
   ls -la .env.local
   # OR on Windows:
   dir | findstr .env.local
   ```

2. **Check .env.local content:**
   ```bash
   # View file (careful not to share publicly!)
   cat .env.local
   # OR on Windows:
   type .env.local
   ```
   
   Should contain:
   ```env
   DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"
   ```

3. **Verify format:**
   - Must start with `postgresql://` (not `postgres://`)
   - Must have `@` (username:password@host)
   - Must end with database name
   - Add `?sslmode=require` for Neon

4. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

5. **Restart server completely:**
   - Stop: Ctrl+C
   - Start: `npm run dev`

---

### Error: "Invalid DATABASE_URL format"

**Solution:**
```env
# ✅ CORRECT:
DATABASE_URL="postgresql://neondb_owner:abc@host.neon.tech/neondb?sslmode=require"

# ❌ WRONG:
DATABASE_URL=postgresql://...  # Missing quotes
DATABASE_URL="postgres://..."  # Should be "postgresql://"
DATABASE_URL="postgresql://localhost/db"  # Not Neon format
```

---

## Verification Steps

After fixing, verify everything works:

### Step 1: Environment Check
```bash
npm run check-env
```
✓ All required vars should show "Set"

### Step 2: Database Connection
```bash
npx prisma db pull --print
```
✓ Should show your database schema

### Step 3: Start Dev Server
```bash
npm run dev
```

Look for these logs:
```
[Prisma] ✓ DATABASE_URL loaded: postgresql://neondb_...
[Prisma] Creating new Neon Pool
[Prisma] ✓ PrismaClient created successfully
[Auth] Environment check:
  AUTH_RESEND_KEY: ✓ Set
  DATABASE_URL: ✓ Set
```

### Step 4: Test Sign-in
1. Go to: http://localhost:3000/signin
2. Enter email
3. Submit

**Expected logs:**
```
[auth][debug]: adapter_getUserByEmail
[Auth] Resend: sendVerificationRequest called
[Auth] Resend: Email sent successfully
```

**No more AdapterError!** ✅

---

## File Checklist

Before running the app, verify:

- [ ] `.env.local` exists in: `c:\Users\dorel\traveling\.env.local`
- [ ] `.env.local` contains `DATABASE_URL="postgresql://..."`
- [ ] DATABASE_URL starts with `postgresql://` (not `postgres://`)
- [ ] DATABASE_URL includes `@` (username@host)
- [ ] DATABASE_URL ends with database name and `?sslmode=require`
- [ ] `.env.local` contains `AUTH_SECRET="..."`
- [ ] `.env.local` contains `AUTH_RESEND_KEY="re_..."`
- [ ] Server was restarted after creating/editing `.env.local`
- [ ] `npm run check-env` shows all ✓

---

## Get Help

If still not working after all steps:

1. **Run diagnostic:**
   ```bash
   npm run check-env
   npx prisma db pull --print
   ```

2. **Check logs** for exact error message

3. **Verify .env.local location:**
   ```bash
   # Must be here:
   c:\Users\dorel\traveling\.env.local
   
   # NOT here:
   c:\Users\dorel\traveling\env\.env.local  ❌
   ```

4. **See documentation:**
   - `SETUP_ENV_INSTRUCTIONS.md` - Setup guide
   - `CREATE_ENV_LOCAL.txt` - Quick steps
   - `TROUBLESHOOTING.md` - Common issues

---

## Quick Fix Command Sequence

```bash
# 1. Check environment
npm run check-env

# 2. If missing variables, edit .env.local
code .env.local
# OR
notepad .env.local

# 3. Test database connection
npx prisma db pull --print

# 4. Clear cache and restart
rm -rf .next
npm run dev
```

That's it! 🚀

