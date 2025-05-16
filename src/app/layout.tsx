import type { Metadata } from "next";
import { poppins, montserrat } from './fonts';
import "./globals.css";
import Navbar from "../components/Navbar";
import AuthProvider from "../components/AuthProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Y62 YouTube Downloader | Premium Video Downloads",
  description: "Download YouTube videos with high quality and fast speed. Free and premium options available.",
  keywords: "youtube downloader, video downloader, mp3 converter, free youtube downloader, premium youtube downloader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
        <Script id="dark-mode-script" strategy="beforeInteractive">
          {`
            // Check for dark mode preference
            if (localStorage.getItem('darkMode') === 'true' || 
                (!('darkMode' in localStorage) && 
                window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
              localStorage.setItem('darkMode', 'true');
            } else {
              document.documentElement.classList.remove('dark');
              localStorage.setItem('darkMode', 'false');
            }
          `}
        </Script>
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] dark:bg-[url('/grid-dark.svg')] bg-center opacity-10 pointer-events-none"></div>
        <AuthProvider>
          <Navbar />
          <div className="pt-16 relative">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
