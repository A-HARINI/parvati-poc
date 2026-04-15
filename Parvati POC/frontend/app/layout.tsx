import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parvati — Your Premium Online Store',
  description: 'Discover the best deals on electronics, audio gear, office essentials, wearables, and home products. Fast delivery & great prices.',
  keywords: 'ecommerce, electronics, audio, office, wearables, smart home, online shopping',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body className="bg-surface text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
