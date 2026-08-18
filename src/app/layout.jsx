import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"] });

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"] });

export const metadata = {
  title: "Stayr | Premium Vacation Rentals",
  description: "Find your next luxury getaway on Stayr." };

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  let themeStyles = "";
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (apiUrl.includes('localhost')) {
      apiUrl = apiUrl.replace('localhost', '127.0.0.1');
    }
    // Use no-store so the theme updates immediately on refresh
    const res = await fetch(`${apiUrl}/api/public/settings`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data?.theme) {
        const vars = Object.entries(data.data.theme)
          .map(([k, v]) => `${k}: ${v};`)
          .join(' ');
        themeStyles = `:root { ${vars} }`;
      }
    }
  } catch (e) {
    console.error("Failed to fetch public theme settings:", e.message);
  }

  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans min-h-full flex flex-col">
        <style dangerouslySetInnerHTML={{ __html: themeStyles || "" }} />
        {children}
      </body>
    </html>
  );
}
