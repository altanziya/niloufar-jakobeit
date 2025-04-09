import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'Immersive Interior Design Experience',
  description: 'Erleben Sie Räume, die Geschichten erzählen und zum Leben erwecken.',
  keywords: ['Innenarchitektur', 'Design', 'Räume', 'Gestaltung', 'Immersiv'],
  authors: [{ name: 'Ihr Name' }],
  openGraph: {
    title: 'Immersive Interior Design Experience',
    description: 'Erleben Sie Räume, die Geschichten erzählen und zum Leben erwecken.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Interior Design',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immersive Interior Design Experience',
    description: 'Erleben Sie Räume, die Geschichten erzählen und zum Leben erwecken.',
    images: ['/twitter-image.jpg'],
  },
};

// Viewport-Konfiguration separat exportieren
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="icon" href="/images/Logo2.png" />
      </head>
      <body className="scroll-smooth bg-white dark:bg-neutral-900 text-black dark:text-white">
        <ClientLayout>{children}</ClientLayout>

        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}