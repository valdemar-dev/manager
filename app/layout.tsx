import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from "next/link";
import Image from "next/image";
import Divider from '@/components/Divider';
import LayoutProvider from '@/components/LayoutProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ManagerX',
  description: 'The All-Purpose Manager for Enhanced Productivity and Clarity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 box-border">
          <LayoutProvider>
            <Divider height='h-10'/>

            {children}
          </LayoutProvider>
        </main>
        <footer className="mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl py-12 box-border text-xs unobstructive grid grid-cols-3 auto-rows-auto gap-4 text-center">
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/about">About</a>

          Copyright © 2023 All Rights Reserved
        </footer>
      </body>
    </html>
  )
}
