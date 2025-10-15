import { Inter } from 'next/font/google';
import MerchantShell from '@/components/merchant/MerchantShell';

const inter = Inter({ subsets: ['latin'] });

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} bg-gray-50`}>
        <MerchantShell>{children}</MerchantShell>
      </body>
    </html>
  );
}
