import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerRegistration } from '@/components/pwa/sw-register';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'F-Solar Workspace',
  description: 'A collaborative workspace powered by Firebase and Google Drive',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'F-Solar',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
