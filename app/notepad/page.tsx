"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Notepad() {
  const router = useRouter();

  const [notepads, setNotepads] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [notepadsPageNumber, setNotepadsPageNumber] = useState<number>(1);
  const [notepadsPageMaxIndex, setNotepadsPageMaxIndex] = useState<number>(1);

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
    const authKey = sessionStorage.getItem("authKey");

    if (!authKey) {
      return router.push("/user/auth");
    }

    fetch("/api/user/notepads/getNotepads").then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          return router.push("/user/login");
        }

        setModalText(await response.text());
        return showModal(2000);
      }

      const res = await response.json();

      setNotepads(res);

      const notepadsPerPage: number = 5;
      setNotepadsPageMaxIndex(Math.ceil(res.length / notepadsPerPage));

      return setLoading(false);
    })
  }, []);

  const mapNotepads = () => {
    if (notepads.length < 1) {
      return (
        <>No notepads found!</>
      )
    }

    return notepads.map((notepad) => {
      return (
        <>{notepad.title}</>
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
        <p className="fadeIn animation-delay-800">Write down what's on your mind.</p>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title="Notepads"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <div className="flex flex-col gap-2 mt-2">
            {mapNotepads()}
          </div>

          <div className="flex gap-2 flex-row mt-2">
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {notepadsPageNumber === 1 ? null : setNotepadsPageNumber(notepadsPageNumber-1)}}>
              <svg width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <title>ionicons-v5-a</title>
                <polyline 
                  points="244 400 100 256 244 112" 
                  style={{"fill":"none","stroke":"var(--accent-100)","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"48px"}}
                />
                <line 
                  x1="120" y1="256" x2="412" y2="256" 
                  style={{"fill":"none","stroke":"var(--accent-100)","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"48px"}}
                />
              </svg>        
            </button>
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {notepadsPageNumber === notepadsPageMaxIndex ? null : setNotepadsPageNumber(notepadsPageNumber+1)}}>
              <svg width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <title>ionicons-v5-a</title>
                <polyline 
                  points="268 112 412 256 268 400" 
                  style={{"fill":"none","stroke":"var(--accent-100)","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"48px"}}
                />
                <line 
                  x1="392" y1="256" x2="100" y2="256" 
                  style={{"fill":"none","stroke":"var(--accent-100)","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"48px"}}
                />
              </svg>
            </button> 
          </div>
          <p className="text-sm">Showing page {notepadsPageNumber} of {notepadsPageMaxIndex}</p>
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