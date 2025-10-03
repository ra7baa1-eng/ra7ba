import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'رحبة - Rahba | منصة التجارة الإلكترونية',
  description: 'منصة متكاملة لإنشاء المتاجر الإلكترونية في الجزائر',
  keywords: ['تجارة إلكترونية', 'متجر إلكتروني', 'الجزائر', 'e-commerce', 'Algeria'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-arabic antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
