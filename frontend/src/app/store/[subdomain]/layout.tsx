'use client';

import React from 'react';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 text-gray-900">
        {children}
      </body>
    </html>
  );
}
