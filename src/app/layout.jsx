import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/common/Footer";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans min-h-full flex flex-col">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
