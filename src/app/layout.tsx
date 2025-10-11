import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { ConditionalLayout } from '../components/conditional-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'महाग्रामपंचायत - ग्रामपंचायत वेबसाइट टेम्प्लेट',
  description: 'ग्रामपंचायतांसाठी तयार केलेले वेबसाइट टेम्प्लेट. सहज सेटअप, मराठी-इंग्रजी समर्थन, व्यवस्थापक पैनल आणि सबडोमेन सिस्टम.',
  keywords: 'ग्रामपंचायत वेबसाइट, टेम्प्लेट, महाराष्ट्र, स्थानिक स्वराज्य, वेबसाइट निर्मिती',
  authors: [{ name: 'महाग्रामपंचायत' }],
  creator: 'महाग्रामपंचायत',
  publisher: 'महाग्रामपंचायत',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mahagp.in'),
  alternates: {
    canonical: '/',
    languages: {
      'mr-IN': '/',
      'en-IN': '/en',
    },
  },
  openGraph: {
    title: 'महाग्रामपंचायत - ग्रामपंचायत वेबसाइट टेम्प्लेट',
    description: 'ग्रामपंचायतांसाठी तयार केलेले वेबसाइट टेम्प्लेट. सहज सेटअप, मराठी-इंग्रजी समर्थन, व्यवस्थापक पैनल आणि सबडोमेन सिस्टम.',
    url: 'https://mahagp.in',
    siteName: 'महाग्रामपंचायत',
    locale: 'mr_IN',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'महाग्रामपंचायत - ग्रामपंचायत वेबसाइट टेम्प्लेट',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'महाग्रामपंचायत - ग्रामपंचायत वेबसाइट टेम्प्लेट',
    description: 'ग्रामपंचायतांसाठी तयार केलेले वेबसाइट टेम्प्लेट. सहज सेटअप, मराठी-इंग्रजी समर्थन, व्यवस्थापक पैनल आणि सबडोमेन सिस्टम.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google Fonts for Devanagari */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.className} antialiased font-sans`}>
        <ThemeProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          
          {/* Toast Notifications */}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}