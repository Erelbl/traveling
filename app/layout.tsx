import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ניהול הוצאות טיול - מעקב חכם אחרי כסף וזמן",
  description: "אפליקציה לניהול הוצאות טיול עם מעקב אחר תקציב, מדינות ומסלול",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${rubik.className} antialiased bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50`}>
        {children}
      </body>
    </html>
  );
}
