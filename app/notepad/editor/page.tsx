"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import crypto from "crypto";

export default function Notepad() {
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
    const notepadKey = localStorage.getItem("notepadKey");
    const username = localStorage.getItem("username");

    if (!username) {
      return router.push("/user/login");
    }

    if (!notepadKey) {
      return router.push("/notepad/auth");
    }
  }, []);

  const encrypt = (text: string, key: string, iv: Buffer) => {
    let cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);

    let encryptedText = cipher.update(text);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    const tag = cipher.getAuthTag();

    return { encryptedText: encryptedText.toString("hex"), authTag: tag.toString("hex")}
  };

  async function createNotepad(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const iv = crypto.randomBytes(16);

    const target = event.target as typeof event.target & {
      notepadTitle: { value: string };
      isPublic: { checked: boolean };
    }

    const notepadKey = localStorage.getItem("notepadKey")!;
    const username = localStorage.getItem("username")!;

    let data = {};

    if (target.isPublic.checked === false) {
      const encryptedNotepadTitle = encrypt(target.notepadTitle.value, notepadKey, iv);
      const encryptedNotepadContent = encrypt("Click here to edit.", notepadKey, iv);
      const encryptedAuthorUsername = encrypt(username, notepadKey, iv);
  
      data = {
        notepadTitle: encryptedNotepadTitle.encryptedText,
        titleAuthTag: encryptedNotepadTitle.authTag,
        notepadContent: encryptedNotepadContent.encryptedText,
        contentAuthTag: encryptedNotepadContent.authTag,
        iv: iv.toString("hex"),
        isPublic: target.isPublic.checked,
        authorUsername: encryptedAuthorUsername.encryptedText,
        usernameAuthTag: encryptedAuthorUsername.authTag,
      };
    } else {
      data = {
        notepadTitle: target.notepadTitle.value,
        notepadContent: "Edit me!",
        isPublic: true,
        authorUsername: username,
      };
    }


    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    
    await fetch("/api/notepad/createNotepad", options).then(async (response) => {
      if (!response.ok) {
        setModalText(await response.text());
        return showModal(2000);
      }

      const res = await response.json();

      setModalText(res.text);
      showModal(1000);

      setTimeout(() => {
        router.push(`/notepad/editor/${res.notepadId}`);
      }, 3000);
    })
  }

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Notepad</h1>
        <p className="fadeIn animation-delay-800">Take notes, wherever, whenever.</p>
      </div>
      
      <Divider height="h-10"/>

      <Card
        title="Create"
        type="primary"
        animationDelay="animation-delay-1000"
      >
        <form className="mt-2" onSubmit={async (event) => {createNotepad(event)}}>
          <input className="bg-primary-200 focus:bg-primary-300 duration-200 text-primary-text text-lg px-3 py-1 placeholder-primary-text rounded-md w-full mb-2" type="text" required name="notepadTitle" placeholder="title"/>
          <div className="flex gap-2 items-center flex-row">
            Make this notepad public?
            <input className="checkmark"
              type="checkbox" 
              name="isPublic"
            />
          </div>

          <p className="mb-2 text-sm unobstructive">Public notepads can be accessed by anyone.</p>

          <button className="bg-primary-200 active:bg-primary-400 sm:hover:bg-primary-300 transition-all duration-200 text-primary-text text-lg px-3 py-1 rounded-md w-full mt-3" type="submit">Create</button>
        </form>
      </Card>

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