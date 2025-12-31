# 🌍 Travel Finance - ניהול הוצאות לטיולים

אפליקציית ניהול הוצאות לטיולים בעברית (RTL), בנויה עם Next.js, Prisma v7, ו-Neon PostgreSQL.

## ✨ תכונות

- 📊 מעקב אחר הוצאות בזמן אמת
- 💱 תמיכה ב-40+ מטבעות
- 👥 ניהול מבוגרים וילדים
- 🔐 התחברות באמצעות email (NextAuth + Resend)
- 📱 ממשק RTL מלא בעברית
- 🎨 עיצוב מודרני עם Tailwind CSS v4

## 🚀 התחלה מהירה

### שלב 1: הורד את הקוד

```bash
git clone <repository-url>
cd traveling
npm install
```

### שלב 2: הגדר משתני סביבה

**חשוב!** בלי `.env.local` האפליקציה לא תעבוד.

```bash
# בדוק מה חסר:
npm run check-env
```

אם רואה `MISSING!` - עקוב אחרי **CREATE_ENV_NOW.md** (3 דקות בלבד!)

### שלב 3: הפעל את השרת

```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן.

## 📚 מדריכים והגדרה

### 🔧 הגדרת Environment Variables

| מדריך | מתי להשתמש |
|--------|-----------|
| **CREATE_ENV_NOW.md** | 🚨 התחלה מהירה - אין לך .env.local |
| **QUICK_ENV_CHECKLIST.md** | ✅ בדיקת משתנים מהירה |
| **SETUP_ENV_INSTRUCTIONS.md** | 📖 מדריך מפורט עם דוגמאות |
| **env.local.template** | 📋 תבנית להעתקה |

### 🗄️ Database & Deployment

| מדריך | מתי להשתמש |
|--------|-----------|
| **UPDATE_ENV_LOCAL.md** | 🔄 עדכון URL של Neon |
| **DEBUG_DATABASE.md** | 🐛 בעיות התחברות ל-database |
| **TROUBLESHOOTING.md** | 💊 פתרון בעיות email sign-in |

## 🛠️ סקריפטים זמינים

```bash
# Development
npm run dev              # הפעל שרת פיתוח
npm run build            # בנה לייצור
npm run start            # הפעל build ייצור
npm run lint             # בדוק linting

# Environment & Database
npm run check-env        # בדוק משתני סביבה
npm run db:check         # בדוק חיבור ל-database

# Prisma
npx prisma migrate dev   # הרץ migrations
npx prisma studio        # פתח Prisma Studio
npx prisma db pull       # משוך schema מה-database
npx prisma generate      # צור Prisma Client
```

## 📦 טכנולוגיות

- **Framework:** Next.js 15+ (App Router)
- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Prisma v7 with Neon Adapter
- **Auth:** NextAuth.js v5 (Auth.js)
- **Email:** Resend
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Icons:** Lucide React

## 🗂️ מבנה הפרויקט

```
traveling/
├── app/                    # Next.js App Router
│   ├── page.tsx           # דף הבית - ניהול טיולים
│   ├── signin/            # דף התחברות
│   └── api/auth/          # NextAuth routes
├── components/            # קומפוננטות React
│   ├── CreateTripForm.tsx
│   └── TripDashboard.tsx
├── lib/                   # Utilities
│   ├── prisma.ts          # Prisma Client + Neon Pool
│   └── validation.ts      # Validation logic
├── types/                 # TypeScript types
│   ├── trip.ts
│   └── expense.ts
├── prisma/               # Prisma schema & migrations
│   └── schema.prisma
├── scripts/              # Helper scripts
│   └── check-env.js
├── .env.local            # Environment variables (לא ב-git!)
└── README.md             # את/ה כאן!
```

## ⚙️ Environment Variables

צריך את כל המשתנים הבאים ב-`.env.local`:

### נדרש:
- `DATABASE_URL` - Neon Pooled connection (עם `channel_binding=require`)
- `AUTH_SECRET` - סוד ל-NextAuth (צור עם `npx auth secret`)
- `AUTH_RESEND_KEY` - API key של Resend

### אופציונלי:
- `DIRECT_URL` - Neon Direct connection (ל-migrations)
- `AUTH_URL` - URL של האפליקציה (ברירת מחדל: http://localhost:3000)
- `AUTH_TRUST_HOST` - Trust host (ברירת מחדל: true)
- `AUTH_EMAIL_FROM` - כתובת שולח email (ברירת מחדל: Trip Finance <onboarding@resend.dev>)

**ראה `env.local.template` לדוגמה מלאה.**

## 🔐 אבטחה

- ✅ `.env.local` נמצא ב-`.gitignore`
- ✅ אין secrets ב-git
- ✅ Neon connection עם SSL + channel binding
- ✅ NextAuth עם email magic links
- ⚠️ **לעולם אל תעשה commit של .env.local!**

## 🐛 פתרון בעיות נפוצות

### "Cannot read properties of undefined"
→ ראה **CREATE_ENV_NOW.md** ליצירת `.env.local`

### "No database host or connection string"
→ ודא ש-`DATABASE_URL` כולל `channel_binding=require`  
→ ראה **UPDATE_ENV_LOCAL.md**

### "Failed to send email"
→ בדוק `AUTH_RESEND_KEY` ו-`AUTH_EMAIL_FROM`  
→ ראה **TROUBLESHOOTING.md**

### "Drift detected" / Prisma migration errors
→ ראה **DEBUG_DATABASE.md**

### Variables show "MISSING" במרות ש-.env.local קיים
→ ודא ש-`.env.local` בשורש הפרויקט (ליד `package.json`)  
→ הפעל מחדש את השרת (`Ctrl+C` → `npm run dev`)

## 📖 למידה נוספת

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://authjs.dev)
- [Neon Documentation](https://neon.tech/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 תרומה

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 רישיון

This project is open source and available under the [MIT License](LICENSE).

---

**צריך עזרה? התחל מ-`npm run check-env` ועקוב אחרי המדריכים! 🚀**
