import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
        {children}
          <p className="text-xs unobstructive ml-4 py-4">Copyright © 2023 All rights reserved</p>
      </body>
    </html>
  )
}
