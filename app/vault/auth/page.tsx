"use client";

import hashText from "@/utils/hashText";
import { useRouter } from "next/navigation";
import crypto from "crypto";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";

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
    <>
      <h1 className="text-2xl font-semibold fadeIn animation-delay-400">Hold on!</h1>
      <p className="flex items-center gap-2 text-lg mb-6 rounded-lg fadeIn animation-delay-800">Your vault may contain potentially sensitive information.</p>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title="Please enter your password"
          type="secondary"
          animationDelay="animation-delay-1000"
        >
          <form onSubmit={(event) => {handleAuth(event)}}>
            <span className="unobstructive text-sm">You won't be prompted again for the remainder of this session.</span>
            <input className="bg-gray-200 focus:bg-secondary-darker duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2 mt-2" type="password" required name="password" placeholder="password"/>
            <button className="bg-blue-300 sm:hover:shadow-2xl transition-all duration-200 px-5 py-2 rounded-md mt-2 font-semibold" type="submit">Authenticate</button>
          </form>
        </Card>
      </div>

      <dialog ref={infoModal} className="rounded-xl w-96 fadeIn delay-0">
        <div className="bg-gray-100 drop-shadow-xl p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-start flex-row gap-1">
            <h3 className="text-2xl font-semibold">Info</h3>
            <form method="dialog" className="flex ml-auto">
              <button className="rounded-md bg-gray-200 duration-200 active:bg-gray-400 sm:hover:bg-gray-300 p-1">
                <Image src={"/close.svg"} height={"20"} width={"20"} alt={"close icon"} className="fill-secondary"/>
              </button>              
            </form>
          </div>

          <p className="text-secondary text-lg rounded-lg">{infoText}</p>
        </div>
      </dialog>
    </>
  )
}