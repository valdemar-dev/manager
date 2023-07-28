"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
import hashText from "@/utils/hashText";
import { detect } from "detect-browser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Register() {
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

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
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

    await fetch("/api/user/register", options).then(async (response) => {
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
    <>
      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Register</h1>
        <p className="fadeIn animation-delay-800">Create an account today.</p>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
            title="Register"
            animationDelay="animation-delay-1000"
            type="secondary"
        >
          <form onSubmit={async (event) => {await handleRegister(event)}}>
            <span className="text-sm">3-20 characters. No spaces allowed.</span>
            <input className="bg-gray-200 focus:bg-gray-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="text" name="username" placeholder="username"/>
            <span className="text-sm">You will need to confirm this.</span>
            <input className="bg-gray-200 focus:bg-gray-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="email" name="email" placeholder="email"/>
            <span className="text-sm">At least 8 characters, 1 capital letter and 1 number.</span>
            <input className="bg-gray-200 focus:bg-gray-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="password" name="password" placeholder="password"/>

            <p className="my-2 unobsuctive">
              Have an account already? <br/>
              <Link href="/user/login" className="text-accent font-semibold">Login</Link>
            </p>

            <button className="bg-blue-300 sm:hover:shadow-2xl transition-all duration-200 px-5 py-2 rounded-md mt-2 font-semibold" type="submit">Register</button>

            <p className="mt-2 text-sm">By registering, you agree to our <Link href="/privacy" className="font-semibold">Privacy policy</Link></p>
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