"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
import hashText from "@/utils/hashText";
import { detect } from "detect-browser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Login() {
  const browser = detect();
  const router = useRouter();
  
  //info modal stuff
  const infoModal = useRef<any>();
  const [infoText, setModalText] = useState<string>("");

  const showModal = (duration: number) => {
    infoModal.current!.showModal();
    infoModal.current!.className = "rounded-xl w-96 fadeIn delay-0";

    setTimeout(() => {
      infoModal.current!.className = "rounded-xl w-96 fadeOut delay-0";
    
      setTimeout(() => {
        infoModal.current!.close().catch(() => {return;});
      }, 1000);
    }, duration + 1000);
  };

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
      username: hashText(target.username.value.replace(/\s/g, "")).output,
      email: hashText(target.email.value.replace(/\s/g, "")).output,
      password: hashText(target.password.value.replace(/\s/g, "")).output,
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
        setModalText(await response.text());
        return showModal(2000);
      }

      localStorage.setItem("username", target.username.value);

      setModalText(await response.text());
      showModal(1000);

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    })
  }

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Login</h1>
        <p className="fadeIn animation-delay-800">Login to ManagerX</p>
      </div>

      <Divider height="h-10"/>


      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title="Login"
          animationDelay="animation-delay-1000"
          type="secondary"
        >
          <form className="mt-2" onSubmit={async (event) => {await handleLogin(event)}}>
            <input className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="text" name="username" placeholder="username"/>
            <input className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="email" name="email" placeholder="email"/>
            <input className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="password" name="password" placeholder="password"/>

            <p className="my-2 unobsuctive">
              Don't have an account? <br/>
              <Link href="/user/register" className="text-accent font-semibold">Register</Link>
            </p>

            <button className="bg-primary-100 text-primary-text sm:hover:shadow-2xl transition-all duration-200 px-5 py-2 rounded-md mt-2 font-semibold" type="submit">Login</button>
          </form>
        </Card>
      </div>

      <dialog ref={infoModal} className="rounded-xl w-96 fadeIn delay-0">
        <div className="bg-secondary-100 text-text drop-shadow-xl p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-start flex-row gap-1">
            <h3 className="text-2xl font-semibold">Info</h3>
          </div>
          <p className="text-secondary text-lg rounded-lg">{infoText}</p>
        </div>
      </dialog>
    </>
  )
}