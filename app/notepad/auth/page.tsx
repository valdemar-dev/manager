"use client";

import Card from "@/components/CardComponent"
import hashText from "@/utils/hashText";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import crypto from "crypto";

export default function NotepadAuth() {
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

    await fetch("/api/notepad/validateNotepadKey", options).then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          return router.push("/user/login");
        }
        
        setModalText(await response.text());

        return showModal(2000)
      }
      
      const notepadKey = (hashText(`${target.password.value}${process.env.NOTEPAD_SECRET}`).output).slice(0,32);

      localStorage.setItem("notepadKey", notepadKey);

      return router.push("/notepad/editor")
    });
  };


  return (
    <>
      <h1 className="text-2xl font-semibold fadeIn animation-delay-400">Hold on!</h1>
      <p className="flex items-center gap-2 text-lg mb-6 rounded-lg fadeIn animation-delay-800">You might soon encrypt a notepad, but you don't have the necessary encryption keys.</p>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title="Please enter your password"
          type="secondary"
          animationDelay="animation-delay-1000"
        >
          <form onSubmit={(event) => {handleAuth(event)}}>
            <span className="unobstructive text-sm">You shouldn't be prompted again for at least 90 days.</span>
            <input className="bg-secondary-200 focus:bg-secondary-darker duration-200 text-text text-lg px-3 py-1 rounded-md w-full mb-2 mt-2" type="password" required name="password" placeholder="password"/>
            <button className="bg-primary-100 sm:hover:shadow-2xl text-primary-text transition-all duration-200 px-5 py-2 rounded-md mt-2 font-semibold" type="submit">Authenticate</button>
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