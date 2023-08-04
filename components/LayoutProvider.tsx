"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Inter } from 'next/font/google'
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ['latin'] })

interface Props {
  children: React.ReactNode,
}

export default function LayoutProvider(props: Props) {
  const router = useRouter();
  const pathname = usePathname();


  const [theme, setTheme] = useState("dark");
  
  useEffect(() => {
    const theme: any = localStorage.getItem("theme");
    
    // this might look a bit dodgy so ill explain
    // dark and light are the free themes
    // if the user is on a premium theme, we have to make sure that
    // theyre a premium user. and if they're not (!response.ok),
    // we set them to dark mode by default.
    if (theme !== "dark" || theme !== "light") {
      fetch("/api/user/validatePremium").then(async (response) => {
        if (!response.ok) {
          setTheme("dark");
          localStorage.setItem("theme", "dark");
        }
      });
    }

    setTheme(theme);
  }, []);

  
  return (
    <html suppressHydrationWarning={true} data-theme={theme || "dark"}>
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
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/about">About</Link>
          </div>

          Copyright © 2023 All Rights Reserved
        </footer>
      </body>
    </html>
  )
}