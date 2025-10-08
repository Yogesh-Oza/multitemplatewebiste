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
  title: 'ग्रामपंचायत - आमच्या गावात स्वागत आहे',
  description: 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख. सर्वांसाठी विकास आणि समृद्धी.',
  keywords: 'ग्रामपंचायत, गाव, महाराष्ट्र, स्थानिक स्वराज्य, ग्राम विकास',
  authors: [{ name: 'ग्रामपंचायत' }],
  creator: 'ग्रामपंचायत',
  publisher: 'ग्रामपंचायत',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://grampanchayat.com'),
  alternates: {
    canonical: '/',
    languages: {
      'mr-IN': '/',
      'en-IN': '/en',
    },
  },
  openGraph: {
    title: 'ग्रामपंचायत - आमच्या गावात स्वागत आहे',
    description: 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख',
    url: 'https://grampanchayat.com',
    siteName: 'ग्रामपंचायत',
    locale: 'mr_IN',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ग्रामपंचायत - आमच्या गावात स्वागत आहे',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ग्रामपंचायत - आमच्या गावात स्वागत आहे',
    description: 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख',
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
    <html lang="mr" className="scroll-smooth">
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
        
        {/* Google Translate */}
        <script
          type="text/javascript"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'mr',
                  includedLanguages: 'en,mr',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
              }
            `,
          }}
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