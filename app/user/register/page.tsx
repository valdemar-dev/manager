"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
import hashText from "@/utils/hashText";
import { detect } from "detect-browser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import crypto from "crypto";

export default function Register() {
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
        try {
          infoModal.current!.close();
        } catch {
          return;
        }
      }, 1000);
    }, duration + 1000);
  };

  useEffect(() => {
    fetch("/api/user/sessions/getSessionList").then((response) => {
      if (response.status === 200) {
        return router.push("/dashboard");
      }
    })
  }, []);

  const encrypt = (text: string, key: string,) => {
    const iv: Buffer = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);

    let encryptedText = cipher.update(text);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    const tag = cipher.getAuthTag();

    return { encryptedText: encryptedText.toString("hex"), authTag: tag.toString("hex"), iv: iv.toString("hex") }
  };

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      displayname: { value: string };
      email: { value: string };
      password: { value: string };
    }

    const authKey: string = (hashText(`${target.password}${hashText(target.email.value).output}`).output).slice(0, 32);

    const encryptedBrowserName = encrypt(browser?.name || "Not found.", authKey);
    const encryptedBrowserNameFinal = `${encryptedBrowserName.iv}${encryptedBrowserName.authTag}${encryptedBrowserName.encryptedText}`;

    const encryptedOs = encrypt(browser?.os || "Not found.", authKey);
    const encryptedOsFinal = `${encryptedOs.iv}${encryptedOs.authTag}${encryptedOs.encryptedText}`;

    let ip: string = "";
    fetch("/api/getIp").then(async (response) => {
      if (!response.ok) {
        return;
      }

      const res = await response.json();
      ip = res;
    })

    const encryptedIp = encrypt(ip, authKey);
    const encryptedIpFinal = `${encryptedIp.iv}${encryptedIp.authTag}${encryptedIp.encryptedText}`;

    const data = {
      displayname: target.displayname.value,
      email: hashText(target.email.value).output,
      password: hashText(target.password.value).output,
      browser: encryptedBrowserNameFinal,
      os: encryptedOsFinal,
      ip: encryptedIpFinal,
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
       setModalText(await response.text());
       return showModal(2000);
      }

      localStorage.setItem("username", target.displayname.value);
      sessionStorage.setItem("authKey", authKey);

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
            <span className="text-sm">Maximum 25 characters.</span>
            <input maxLength={25} className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="text" name="displayname" placeholder="What should we call you?"/>
            <span className="text-sm">You will need to confirm this.</span>
            <input pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="email" name="email" placeholder="Your email address"/>
            <span className="text-sm">Min eight characters, one uppercase letter, and one number</span>
            <br/>
            <span className="text-xs unobstructive">You won't be able to change this later!</span>
            <input pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" className="bg-secondary-200 focus:bg-secondary-300 duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2" required type="password" name="password" placeholder="Create a unique password!"/>

            <p className="my-2 unobsuctive">
              Have an account already? <br/>
              <Link href="/user/login" className="text-accent font-semibold">Login</Link>
            </p>

            <p className="mt-4 text-sm">By registering, you agree to our <Link href="/privacy" className="font-semibold">Privacy policy</Link></p>
            <button className="bg-primary-100 text-primary-text sm:hover:shadow-2xl transition-all duration-200 px-5 py-2 rounded-md mt-2 font-semibold" type="submit">Register</button>
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