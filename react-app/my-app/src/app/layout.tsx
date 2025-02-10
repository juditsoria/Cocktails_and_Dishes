'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './components/navbar';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/sketchy/bootstrap.min.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldShowNavbar = pathname !== '/';

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="d-flex flex-column min-vh-100">
          {shouldShowNavbar && <Navbar />}
          <main className="flex-grow-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
