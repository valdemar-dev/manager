import './globals.css'
import type { Metadata } from 'next'
import Link from "next/link";
import Image from "next/image";
import Divider from '@/components/Divider';
import LayoutProvider from '@/components/LayoutProvider';


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
    <LayoutProvider>
      <Divider height='h-10'/>

      {children}
    </LayoutProvider>
  )
}
