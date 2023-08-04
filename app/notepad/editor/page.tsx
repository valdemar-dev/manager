"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import crypto from "crypto";
import Link from "next/link";

export default function Notepad() {
  const router = useRouter();

  //info modal stuff
  const infoModal = useRef<any>();
  const [infoText, setModalText] = useState<string>("");

  const [notepads, setNotepads] = useState<any>([]);
  const [loading, setLoading] = useState(true);

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

    fetch("/api/notepad/getNotepads").then(async (response) => {
      if (!response.ok) {
        if (response.status !== 404) {
          return router.push("/user/login");
        }
      }

      const notepads = await response.json();
      
      notepads.forEach((notepad: { title: string, id: string, titleAuthTag: string, iv: string, isPublic: boolean, }) => {
        const notepadKey = localStorage.getItem("notepadKey")!;

        if (notepad.isPublic === false) {
          let decryptedNotepad = notepad;
  
          decryptedNotepad.title = decrypt(notepad.title, notepadKey, notepad.iv, notepad.titleAuthTag)
        }
      });

      setNotepads(notepads);
      setLoading(false);
    })
  }, []);

  const encrypt = (text: string, key: string, iv: Buffer) => {
    let cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);

    let encryptedText = cipher.update(text);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    const tag = cipher.getAuthTag();

    return { encryptedText: encryptedText.toString("hex"), authTag: tag.toString("hex")}
  };

  const decrypt = (encryptedText: string, key: string, iv: string, tag: string) => {
    const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tag, "hex"))
    
    let decryptedText = decipher.update(encryptedTextBuffer);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString("utf-8");
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

  const mapNotepads = () => {
    return notepads!.map((notepad: { id: string, title: string, lastEdited: string }) => {
      return (
        <div className="px-3 py-2 bg-secondary-200 rounded-md flex" key={notepad.id}>
          <div>
            <p>{notepad.title}</p>
            <span className="text-sm unobstructive">{new Date(notepad.lastEdited || "1000").toLocaleString()}</span>
          </div>

          <Link
            href={`/notepad/editor/${notepad.id}`}
            className="rounded-md ml-auto h-fit bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2"
          >
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" 
                fill="var(--accent-100)"
              />  
            </svg>
          </Link>
      </div>
      )
    })
  };

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Notepad</h1>
        <p className="fadeIn animation-delay-800">Take notes, wherever, whenever.</p>
      </div>
      
      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">

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

        <Card
          title="Notepads"
          type="secondary"
          animationDelay="animation-delay-1200"        
        >
          <div className="mt-2 flex flex-col gap-3">
            {mapNotepads()}
          </div>
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