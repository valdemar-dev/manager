"use client";

import crypto from "crypto";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Divider from "@/components/Divider";
import TextareaAutosize from 'react-textarea-autosize';
import Card from "@/components/CardComponent";

export default function NotepadEditor({ params, }: { params: { notepadId: string } }) {
  const router = useRouter();

  const [notepad, setNotepad] = useState<any>();
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");

  const notepadTitle = useRef<any>();
  const notepadContent = useRef<any>();

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

  const decrypt = (encryptedText: string, key: string, iv: string, tag: string) => {
    const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tag, "hex"))
    
    let decryptedText = decipher.update(encryptedTextBuffer);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString("utf-8");
  };

  const encrypt = (text: string, key: string, iv: Buffer) => {
    let cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);

    let encryptedText = cipher.update(text);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    const tag = cipher.getAuthTag();

    return { encryptedText: encryptedText.toString("hex"), authTag: tag.toString("hex")}
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

    const data = {
      notepadId: params.notepadId,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("/api/notepad/getNotepad", options).then(async (response) => {
      if (!response.ok) {
        return router.push("/notepad/editor")
      }

      const res = await response.json();

      let notepad = res.notepad;
      
      notepad.author = username;
      if (notepad.isPublic === false) {
        notepad.title = decrypt(notepad.title, notepadKey, notepad.iv, notepad.titleAuthTag);
        notepad.authorUsername = decrypt(notepad.authorUsername, notepadKey, notepad.iv, notepad.usernameAuthTag);
        notepad.content = decrypt(notepad.content, notepadKey, notepad.iv, notepad.contentAuthTag);
      }
      
      setUserId(res.userId);
      setNotepad(notepad);
      setLoading(false);
    });
  }, []);

  const handleReset = () => {
    window.location.reload();
  };

  const handleSave = async () => {
    const iv = crypto.randomBytes(16);

    const notepadKey = localStorage.getItem("notepadKey")!;

    let data: any = {};
    if (notepad.isPublic === false) {
      const encryptedNotepadTitle = encrypt(notepadTitle.current!.value, notepadKey, iv);
      const encryptedNotepadContent = encrypt(notepadContent.current!.value, notepadKey, iv);
      const encryptedAuthorUsername = encrypt(notepad.authorUsername, notepadKey, iv);
      
      data = {
        notepadTitle: encryptedNotepadTitle.encryptedText,
        notepadContent: encryptedNotepadContent.encryptedText,
        isPublic: notepad.isPublic,
        notepadId: notepad.id,
        titleAuthTag: encryptedNotepadTitle.authTag,
        iv: iv.toString("hex"),
        contentAuthTag: encryptedNotepadContent.authTag,
        authorUsername: encryptedAuthorUsername.encryptedText,
        usernameAuthTag: encryptedAuthorUsername.authTag,
      };
    } else {
      data = {
        notepadTitle: notepadTitle.current!.value,
        isPublic: notepad.isPublic,
        notepadContent: notepadContent.current!.value,
        notepadId: notepad.id,
        authorUsername: notepad.authorUsername,
      };
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    
    await fetch("/api/notepad/editNotepad", options).then(async (response) => {
      setModalText(await response.text());
      return showModal(2000);
    })
  }

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">
          <TextareaAutosize ref={notepadTitle} className="bg-transparent overflow-hidden resize-none h-max" defaultValue={notepad?.title}/>
        </h1>
        <p className="fadeIn animation-delay-800">By: {notepad.authorUsername}</p>
      </div>

      <div className={`${notepad.userId !== userId ? "hidden": "block"}`}>

      <Divider height="h-10"/>
      </div>

      <div className="flex flex-row gap-2">
        <button onClick={() => {handleSave()}} disabled={notepad.userId !== userId} className="bg-primary-100 disabled:hidden text-primary-text sm:hover:shadow-2xl transition-all duration-200 font-semibold text-lg px-5 py-2 rounded-md fadeIn animation-delay-800">Save </button>
        <button onClick={() => {handleReset()}} disabled={notepad.userId !== userId} className="bg-secondary-100 transition-all duration-200 disabled:hidden font-semibold text-lg px-5 py-2 rounded-md fadeIn animation-delay-900">Revert</button>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-1 gap-10">
        <Card
          title="Notepad"
          animationDelay="animation-delay-1000"
          type="secondary"
        >
          <TextareaAutosize disabled={notepad.userId !== userId} ref={notepadContent} className="bg-secondary-200 max-h-screen px-2 pb-6 py-1 text-lg rounded-md focus:bg-secondary-300 duration-200 resize-none h-max" defaultValue={notepad?.content}/>
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