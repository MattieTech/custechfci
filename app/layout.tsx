import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from 'sonner';

import { SplashScreen } from '@/components/splash-screen';
import { AnnouncementPopup } from '@/components/announcement-popup';
import { PwaRegister } from '@/components/pwa-register';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  themeColor: '#7A5A42',
  applicationName: 'CUSTECH FCI',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CUSTECH FCI',
  },
  title: {
    template: '%s | CUSTECH FCI',
    default: 'CUSTECH FCI | Faculty of Computing and Informatics',
  },
  description: 'Official student portal for the Faculty of Computing and Informatics at CUSTECH Osara.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/school-logo-crest.png', type: 'image/png' },
    ],
    shortcut: '/images/school-logo-crest.png',
    apple: '/images/school-logo-crest.png',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body bg-brand-50 text-brand-950 dark:bg-brand-950 dark:text-brand-50 min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SplashScreen />
          <AnnouncementPopup />
          <PwaRegister />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-brand-100 text-brand-900 px-4 py-2 rounded-md font-medium">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
