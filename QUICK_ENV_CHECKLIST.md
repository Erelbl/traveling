# ✅ Checklist מהיר לבדיקת Environment Variables

## 🚦 בדיקה מהירה (30 שניות)

### 1. הרץ את הבודק האוטומטי:
```powershell
npm run check-env
```

### 2. מה אתה אמור לראות:

#### ✅ **הכל בסדר:**
```
═══════════════════════════════════════
  Environment Variables Check
═══════════════════════════════════════
Required Variables:
────────────────────────────────────────
✓ DATABASE_URL: Valid PostgreSQL connection
✓ AUTH_SECRET: Set
✓ AUTH_RESEND_KEY: Valid Resend key (re_...)
Optional Variables:
────────────────────────────────────────
✓ AUTH_EMAIL_FROM: Trip Finance <onboarding@resend.dev>
✓ AUTH_URL: http://localhost:3000
✓ AUTH_TRUST_HOST: true
○ DIRECT_URL: (optional)
═══════════════════════════════════════
✓ All required variables are set!
```

**פעולה:** המשך ל-`npm run dev` 🚀

---

#### ❌ **משתנים חסרים:**
```
✗ DATABASE_URL: MISSING!
✗ AUTH_SECRET: MISSING!
✗ AUTH_RESEND_KEY: MISSING!
```

**פעולה:** לך ל-`CREATE_ENV_NOW.md` ועקוב אחרי ההוראות! ⚠️

---

## 🔍 בדיקות נוספות

### בדוק שהקובץ קיים במיקום הנכון:
```powershell
# צריך להחזיר את הקובץ:
dir c:\Users\dorel\traveling\.env.local
```

### בדוק שה-database נגיש:
```powershell
npx prisma db pull --print
```

אמור לראות:
```
Datasource "db": PostgreSQL database "neondb"...
✔ Introspected 6 models...
```

### בדוק שהשרת טוען את המשתנים:
```powershell
npm run dev
```

בלוגים אמור לראות:
```
[Prisma] ✓ DATABASE_URL loaded: postgresql://neondb_owner...
[Auth] Environment check:
  AUTH_RESEND_KEY: ✓ Set
  DATABASE_URL: ✓ Set
```

---

## 🆘 פתרון בעיות מהיר

### Problem: "MISSING!" למרות ש-.env.local קיים

**פתרון 1:** ודא מיקום
```powershell
# צריך להיות כאן:
c:\Users\dorel\traveling\.env.local
# לא כאן:
c:\Users\dorel\traveling\env\.env.local
```

**פתרון 2:** הפעל מחדש את השרת
```powershell
# עצור (Ctrl+C) והפעל:
npm run dev
```

**פתרון 3:** נקה cache
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

### Problem: "Invalid PostgreSQL connection"

ה-`DATABASE_URL` לא תקין.

**בדיקות:**
1. מתחיל ב-`postgresql://` (לא `postgres://`)? ✓
2. כולל `?sslmode=require&channel_binding=require`? ✓
3. יש מרכאות? `DATABASE_URL="..."`? ✓
4. אין רווחים? `DATABASE_URL="..."` (לא `DATABASE_URL = "..."`)? ✓

**URL נכון לדוגמה:**
```env
DATABASE_URL="postgresql://neondb_owner:npg_ABC@ep-host-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

---

### Problem: "Valid Resend key" אבל אימייל לא נשלח

1. לך ל-https://resend.com/api-keys
2. ודא שה-API Key פעיל
3. ודא שיש לך domain מאומת או משתמש ב-`resend.dev`
4. בדוק שה-key מתחיל ב-`re_`

---

## 📚 מדריכים מלאים

- **CREATE_ENV_NOW.md** - מדריך צעד-אחר-צעד ליצירת .env.local
- **SETUP_ENV_INSTRUCTIONS.md** - מדריך מפורט עם דוגמאות
- **UPDATE_ENV_LOCAL.md** - עדכון URL של Neon
- **DEBUG_DATABASE.md** - פתרון בעיות database
- **env.local.template** - תבנית להעתקה

---

## 🎯 סדר פעולות מומלץ

```
1. npm run check-env           ← בדוק מה חסר
2. CREATE_ENV_NOW.md          ← צור .env.local
3. npm run check-env           ← ודא שהכל עובד
4. npm run dev                 ← הפעל שרת
5. http://localhost:3000/signin ← נסה sign-in
```

---

## 💡 טיפים

- **אחרי כל שינוי ב-.env.local:** הפעל מחדש את השרת (Ctrl+C → `npm run dev`)
- **אם יש שגיאת cache:** `Remove-Item -Recurse -Force .next`
- **לא בטוח מה חסר?** הרץ `npm run check-env` תמיד קודם
- **DATABASE_URL מ-Neon:** השתמש ב-**Pooled connection** (עם `-pooler`)

---

**זהו! אם `npm run check-env` מראה ✓ לכל המשתנים - אתה מוכן לעבוד! 🎉**

