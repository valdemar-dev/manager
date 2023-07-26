"use client";

import hashText from "@/utils/hashText";
import { useRouter } from "next/navigation";
import crypto from "crypto";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function VaultAuth() {
  const router = useRouter();

  const infoModal = useRef<any>();
  const [infoText, setInfoText] = useState<string>("");

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      password: { value: string };
    };

    const data = {
      password: hashText(target.password.value).output,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch("/api/vault/validateVaultKey", options).then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          return router.push("/user/login");
        }
        
        setInfoText(await response.text());

        return infoModal.current!.showModal();
      }
      
      const vaultKey = (hashText(`${target.password.value}${process.env.CLIENT_SECRET}`).output).slice(0,32);

      sessionStorage.setItem("vaultKey", vaultKey);

      return router.push("/vault")
    });
  };

  return (
    <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 pt-12 box-border">
      { /* navigation menu */}
      <div className="absolute top-3 items-center left-4 right-4 flex gap-2">
        <Link href="/dashboard" className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2 fadeIn animation-delay-400">
          <Image src={"/home.svg"} height={"22"} width={"22"} alt={"home button"}/>
        </Link>
        <span className="font-semibold ml-auto text-lg fadeIn">ManagerX</span>
      </div>

      <div className="h-10"></div>

      <h1 className="text-2xl font-semibold fadeIn">Hold on!</h1>
      <p className="flex items-center gap-2 text-lg mb-6 rounded-lg fadeIn animation-delay-800">Your vault may contain potentially sensitive information. Please re-enter your password.</p>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-primary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1200">
          <span className="unobstructive text-sm">You won't be prompted again for the remainder of this session.</span>
          <form onSubmit={(event) => {handleAuth(event)}}>
            <input className="bg-secondary focus:bg-secondary-darker duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" type="password" required name="password" placeholder="password"/>
            <button className="bg-secondary active:bg-secondary-darker text-text text-lg px-3 py-1 rounded-md w-full" type="submit">Authenticate</button>
          </form>
        </section>
      </div>

      <dialog ref={infoModal} className="rounded-xl fadeIn delay-0 sm:max-w-xl">
        <div className="bg-accent drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1400">
          <div className="flex items-start flex-row gap-1">
            <h3 className="text-secondary text-2xl font-semibold">Info</h3>
            <form method="dialog" className="flex ml-auto">
              <button className="rounded-md bg-primary duration-200 active:bg-primary-darker sm:hover:bg-primary-darker p-1">
                <Image src={"/close.svg"} height={"20"} width={"20"} alt={"close icon"} className="fill-secondary"/>
              </button>              
            </form>
          </div>

          <p className="text-secondary text-lg mt-1 px-2 py-1 bg-accent-lighter rounded-lg">{infoText}</p>
        </div>
      </dialog>
    </main>
  )
}