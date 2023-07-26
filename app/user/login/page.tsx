"use client";

import hashText from "@/utils/hashText";
import { detect } from "detect-browser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Login() {
  const browser = detect();
  const router = useRouter();
  
  const infoModal = useRef<any>();
  const [infoText, setInfoText] = useState<string>("");

  useEffect(() => {
    fetch("/api/user/getSessionList").then((response) => {
      if (response.status === 200) {
        return router.push("/dashboard");
      }
    })
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      username: { value: string };
      email: { value: string };
      password: { value: string };
    }

    const data = {
      username: hashText(target.username.value).output,
      email: hashText(target.email.value).output,
      password: hashText(target.password.value).output,
      browserName: browser?.name || "NULL",
      os: browser?.os || "NULL",
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch("/api/user/login", options).then(async (response) => {
      if (!response.ok) {
        setInfoText(await response.text());
        return infoModal.current!.showModal();
       }

      localStorage.setItem("username", target.username.value);

      setInfoText(await response.text());
      infoModal.current!.showModal();

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    })
  }

  return (
    <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 box-border">
      { /* navigation menu */}
      <div className="items-center flex gap-2">
        <Link href="/vault" className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2 fadeIn animation-delay-400">
          <Image src={"/back.svg"} height={"22"} width={"22"} alt={"back button"}/>
        </Link>

        <Link href="/dashboard" className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2 fadeIn animation-delay-400">
          <Image src={"/home.svg"} height={"22"} width={"22"} alt={"home button"}/>
        </Link>
        <span className="font-semibold ml-auto text-lg fadeIn">ManagerX</span>
      </div>

      {/* divider */}
      <div className="h-10"></div>

      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Login</h1>
        <p className="fadeIn animation-delay-800">Login to ManagerX</p>
      </div>

      {/* divider */}
      <div className="h-10"></div>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-primary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1200 h-min">
          <h3 className="text-xl font-semibold mb-2">Login</h3>
          <form onSubmit={async (event) => {await handleLogin(event)}}>
            <input className="bg-secondary focus:bg-secondary-darker duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="text" name="username" placeholder="username"/>
            <input className="bg-secondary focus:bg-secondary-darker duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="email" name="email" placeholder="email"/>
            <input className="bg-secondary focus:bg-secondary-darker duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="password" name="password" placeholder="password"/>

            <p className="mt-2 unobsuctive">
              Don't have an account? <br/>
              <Link href="/user/register" className="text-accent font-semibold">Register</Link>
            </p>

            <button className="bg-primary-darker active:bg-secondary-darker sm:hover:bg-secondary transition-all duration-200 text-text text-lg px-3 py-1 rounded-md mt-3" type="submit">Login</button>
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