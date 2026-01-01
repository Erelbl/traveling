# 🔑 קבלת API Key חדש מ-Resend

## הבעיה שזיהינו:
```
API key is invalid (401)
```

ה-API Key הנוכחי לא עובד.

---

## ✅ פתרון - צור Key חדש (2 דקות):

### שלב 1: התחבר ל-Resend
לך ל: **https://resend.com/login**

### שלב 2: צור API Key חדש
1. לחץ על **"API Keys"** בתפריט הצד
2. לחץ על **"Create API Key"**
3. תן שם: `Travel Finance Dev`
4. Permission: **Full Access** (או Send Access)
5. לחץ **"Add"**

### שלב 3: העתק את ה-Key
```
⚠️ חשוב: ה-Key מוצג רק פעם אחת!
```
העתק אותו מיד - הוא יתחיל ב-`re_`

### שלב 4: עדכן את .env.local
```powershell
# פתח את הקובץ:
notepad c:\Users\dorel\traveling\.env.local
```

מצא את השורה:
```env
AUTH_RESEND_KEY=re_i13GSaRS_AB49qStq...
```

החלף אותה ב-key החדש:
```env
AUTH_RESEND_KEY=re_YOUR_NEW_KEY_HERE
```

שמור (Ctrl+S) וסגור.

### שלב 5: הפעל מחדש את השרת

בטרמינל 4 (שרץ `npm run dev`):
```
Ctrl+C  (עצור את השרת)
```

ואז:
```powershell
npm run dev
```

### שלב 6: בדוק שעובד
```powershell
node scripts/test-email.mjs
```

אמור לראות:
```
✅ Email sent successfully!
Response: { data: { id: '...' }, error: null }
```

---

## 🔍 אימות נוסף

אחרי שה-key עובד, נסה את ה-sign-in:

1. לך ל-http://localhost:3000/signin
2. הזן: `doreliraz@gmail.com`
3. לחץ **"שלח קישור"**
4. בדוק את התיבה (וגם Spam!)

---

## ❓ אם עדיין לא עובד

### בעיה: "Domain not verified"
אם רואה שגיאה על domain:
- השתמש ב-`<onboarding@resend.dev>` (כבר מוגדר!)
- או אמת domain משלך ב-Resend Console

### בעיה: "From address not verified"
וודא ש-`AUTH_EMAIL_FROM` ב-`.env.local` הוא:
```env
AUTH_EMAIL_FROM="Trip Finance <onboarding@resend.dev>"
```

---

**עכשיו לך וצור Key חדש! 🚀**

