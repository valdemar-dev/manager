"use client";

import hashText from "@/utils/hashText";
import { useRouter } from "next/navigation";
import crypto from "crypto";

export default function VaultAuth() {
  const router = useRouter();

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
      if (response.status !== 200) {
        return alert(await response.text())
      }
      
      console.log()
      const vaultKey = hashText(`${target.password.value}${process.env.CLIENT_SECRET}`).output;

      sessionStorage.setItem("vaultKey", vaultKey);

      return router.push("/vault")
    });
  };

  return (
    <main className="bg-background min-h-screen overflow-hidden text-text p-4 pt-8 box-border flex flex-col gap-1">
      <h1 className="text-2xl font-semibold mb-2 fadeIn">Hold on!</h1>
      <p className="flex items-center gap-2 text-lg mb-6 rounded-lg fadeIn animation-delay-800">Your vault may contain potentially sensitive information. Please re-enter your password.</p>

      <section className="bg-primary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1200">
        <span className="unobstructive text-sm">You won't be prompted again for the remainder of this session.</span>
        <form onSubmit={(event) => {handleAuth(event)}}>
          <input className="bg-secondary focus:bg-secondary-darker duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" type="password" name="password" placeholder="password"/>
          <button className="bg-secondary active:bg-secondary-darker text-text text-lg px-3 py-1 rounded-md w-full" type="submit">Authenticate</button>
        </form>
      </section>
    </main>
  )
}