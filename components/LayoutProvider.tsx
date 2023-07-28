"use client";

import { usePathname } from "next/navigation";
import Link from "next/navigation";
import Image from "next/image";

interface Props {
  children: React.ReactNode,
}

export default function LayoutProvider(props: Props) {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <div>
      { pathname !== "/" &&
        <div className="items-center flex gap-2">
          <a href="/dashboard" className="rounded-md bg-gray-200 duration-200 active:bg-gray-400 sm:hover:bg-gray-300 p-2 fadeIn animation-delay-400">
            <Image src={"/home.svg"} height={"22"} width={"22"} alt={"home button"}/>
          </a>
          <span className="font-semibold ml-auto text-lg fadeIn">ManagerX</span>
        </div>
      }

      { props.children }
    </div>
  )
}