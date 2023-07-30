"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Inter } from 'next/font/google'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ['latin'] })

interface Props {
  children: React.ReactNode,
}

export default function LayoutProvider(props: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [theme, setTheme] = useState("dark");
  
  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "dark");
  }, []);
  
  return (
    <html suppressHydrationWarning={true} data-theme={theme!}>
      <body className={inter.className + " " + "bg-background-color text-text"}>
        <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 box-border">
          { pathname !== "/" &&
            <div className="items-center flex gap-2">
              <Link href="/dashboard" className="rounded-md bg-secondary-100 duration-200 focus:bg-secondary-300 sm:hover:bg-secondary-200 p-2 fadeIn animation-delay-400">
                <svg height="22px" width="22px" fill="var(--accent-100)" viewBox="0 0 512 512">
                  <polygon className="st0" points="434.162,293.382 434.162,493.862 308.321,493.862 308.321,368.583 203.682,368.583 203.682,493.862 
                    77.841,493.862 77.841,293.382 256.002,153.862 	"/>
                  <polygon className="st0" points="0,242.682 256,38.93 512,242.682 482.21,285.764 256,105.722 29.79,285.764 	"/>
                  <polygon className="st0" points="439.853,18.138 439.853,148.538 376.573,98.138 376.573,18.138 	"/>
                </svg>              
              </Link>
              <span className="font-semibold ml-auto text-lg fadeIn">ManagerX</span>
            </div>
          }
          { props.children }
        </main>

        <footer className="mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl py-12 box-border text-xs unobstructive text-center">
          <div className="grid grid-cols-3 auto-rows-auto gap-4 mb-4">
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/about">About</a>
          </div>

          Copyright © 2023 All Rights Reserved
        </footer>
      </body>
    </html>
  )
}