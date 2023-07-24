"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Vault() {
  const router = useRouter();

  useEffect(() => {
    const vaultKey = sessionStorage.getItem("vaultKey");

    if (!vaultKey) {
      return router.replace("/vault/auth");
    }
  }, []);

  return (
    <main className="bg-background min-h-screen overflow-hidden text-text p-4 pt-12 box-border flex flex-col gap-1">
      { /* navigation menu */}
      <div className="absolute top-2 flex justify-end gap-2">
        <Link href="/dashboard" className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2 fadeIn animation-delay-400">
          <Image src={"/back.svg"} height={"22"} width={"22"} alt={"home button"}/>
        </Link>
      </div>

      <div className="h-1"></div>
      <h1 className="text-4xl font-semibold fadeIn">The Vault</h1>
      <p className="fadeIn animation-delay-600">All your data, kept safe.</p>

      <div className="h-10"></div>

      {/* accounts list */}
      <section className="bg-primary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1100">
        <h3 className="text-xl font-semibold mb-2">Accounts</h3>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Google</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Namecheap</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Discord</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Discord</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Spotify</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <a href="/vault/accounts" className="mt-2 text-accent font-semibold">Go to Accounts</a>
      </section>
    </main>
  )
}