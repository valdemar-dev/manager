"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Account() {
  const router = useRouter();

  //info modal stuff
  const infoModal = useRef<any>();
  const [infoText, setModalText] = useState<string>("");

  const showModal = (duration: number) => {
    showModal(1000)
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

  const [sessions, setSessions] = useState<any[]>([]);
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);

  interface User {
    createdAt: Date,
    role: string,
    plan: string,
  }

  const [user, setUser] = useState<User>();

  const [sessionsPageNumber, setSessionsPageNumber] = useState<number>(1);
  const [sessionsPageMaxIndex, setSessionsPageMaxIndex] = useState<number>(1);

  useEffect(() => {
    fetch("/api/user/getSessionList").then(async (res) => {
      if (!res.ok) {
        return router.push("/user/login");
      }

      const resJSON = await res.json();

      setSessions(resJSON);

      const sessionsPerPage: number = 5;
      setSessionsPageMaxIndex(Math.ceil(resJSON.length / sessionsPerPage));
    })

    setUsername(localStorage.getItem("username") || "");

    fetch("/api/user/getUserInfo").then(async (response) => {
      if( (!response.ok)) {
        return router.push("/user/login");
      }

      const res = await response.json();
      setUser(res);
    })

    setLoading(false);
  }, []);

  const logout = () => {
    fetch("/api/user/logout").then(() => {
      return router.push("/user/login");
    })
  };

  const deleteSession = (sessionsToDelete: Array<Date> | string) => {
    interface Data {
      sessionList: Array<Date>,
    };

    let data: Data = { sessionList: [] };

    if (typeof sessionsToDelete === "string") {
      // del all
      const sessionList: Array<Date> = [];

      sessions.forEach(session => {
        sessionList.push(session.createdAt);
      });

      data.sessionList = sessionList;
    } else {
      data.sessionList = sessionsToDelete;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("/api/user/deleteSession", options).then(async (response) => {
      sessions.forEach((session, index) => {
        if (data.sessionList.includes(session.createdAt)) {
          sessions.splice(index);
        }
      })

      setSessions(sessions);

      if (sessions.length < 1) {
        setModalText("No sessions found. Redirecting to login page.");
        showModal(1000)

        setTimeout(() => {
          router.push("/user/login");
        }, 2000);
      }

      setModalText(await response.text());
      return showModal(1000)
    });
  };

  const setColorscheme = (colorscheme: string) => {
    if (user!.plan !== "Premium") {
      if (colorscheme === "dark") {
        localStorage.setItem("theme", colorscheme);
      } else if (colorscheme === "light") {
        localStorage.setItem("theme", colorscheme);
      } else return false;
    } else {
      localStorage.setItem("theme", colorscheme);
    }
    
    window.location.reload();
  };

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <>
      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Profile</h1>
        <p className="fadeIn animation-delay-800">Manage sessions, view notifications, change settings, etc.</p>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title={username || ""}
          type="primary"
          animationDelay="animation-delay-1000"
        >
          <p className="unobstructive text-secondary mb-2">{user?.role}</p>

          <p className="text-lg text-secondary">Plan: <span className="font-bold">{user?.plan}</span></p>
          <p className="text-lg text-secondary">Joined: <span
           className="font-bold">{new Date(user?.createdAt || "0").toLocaleDateString()}</span></p>
        </Card>

        <Card
          title="Sessions"
          type="secondary"
          animationDelay="animation-delay-1200"
        >
          <div className="mt-2">
            {sessions.map((session) => {
              return (
                <div className="relative bg-secondary-200 px-3 py-2 rounded-lg mb-2" key={session.lastActive.toString("hex")}>
                  <div className="flex flex-row items-start">
                    <h3 className="text-lg font-semibold">{session.os}</h3>
                    <button className="ml-auto rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {deleteSession([session.createdAt])}}>
                      <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Interface / Trash_Full">
                        <path id="Vector" d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="var(--warning-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                      </svg>
                    </button> 
                  </div>
                  <p className="mt-2">Last active: {new Date(session.lastActive || "1000").toLocaleString()}</p>
                  
                  <div className="break-words overflow-hidden">
                    <details className="break-words overflow-hidden">
                      <summary>Click to show IP</summary>
                      <span className="break-all">{session.userIp}</span>
                    </details>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2 flex-row mt-2">
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {sessionsPageNumber === 1 ? null : setSessionsPageNumber(sessionsPageNumber-1)}}>
              <svg width="22px" height="22px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
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
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {sessionsPageNumber === sessionsPageMaxIndex ? null : setSessionsPageNumber(sessionsPageNumber+1)}}>
              <svg width="22px" height="22px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
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
          <p className="text-sm">Showing page {sessionsPageNumber} of {sessionsPageMaxIndex}</p>
        </Card>


        <Card
          title="Theme"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <p className="text-sm unobstructive">This may require a page reload for changes to take affect.</p>
          
          <p className="mt-5">Free:</p>
          <div className="flex gap-4">
            <button onClick={() => {setColorscheme("light")}} className="h-20 w-1/3 rounded-lg border-4 box-border border-sky-500 bg-neutral-50 text-neutral-950">
              <span className="border-b-2 border-green-500">Light</span>
            </button>

            <button onClick={() => {setColorscheme("dark")}} className="h-20 w-1/3 rounded-lg border-4 box-border border-sky-500 text-neutral-50 bg-neutral-950">
              <span className="border-b-2 border-green-400">Dark</span>
            </button>
          </div>

          <p className="text-accent-100 mt-4">Premium:</p>
          <div className="flex flex-wrap gap-4">
            <button disabled={user?.plan !== "Premium"} onClick={() => {setColorscheme("protege")}} className="h-20 w-2/5  rounded-lg border-4 box-border border-purple-700 bg-neutral-950 text-neutral-50">
              <span className="border-b-2 border-amber-600">Protege</span>
            </button>

            <button disabled={user?.plan !== "Premium"} onClick={() => {setColorscheme("danger")}}  className="h-20 w-2/5 rounded-lg border-4 box-border border-red-500 bg-neutral-950 text-neutral-50">
              <span className="border-b-2 border-orange-500">Danger</span>
            </button>

            <button disabled={user?.plan !== "Premium"} onClick={() => {setColorscheme("forest")}}  className="h-20 w-2/5 rounded-lg border-4 box-border border-yellow-400 bg-emerald-950 text-neutral-50">
              <span className="border-b-2 border-blue-300">Forest</span>
            </button>

            <button disabled={user?.plan !== "Premium"} onClick={() => {setColorscheme("paulios")}}  className="h-20 w-2/5 rounded-lg border-4 box-border border-sky-300 bg-slate-950 text-neutral-50">
              <span className="border-b-2 border-amber-500">Paulios</span>
            </button>

            <button disabled={user?.plan !== "Premium"} onClick={() => {setColorscheme("marine")}}  className="h-20 w-2/5 rounded-lg border-4 box-border bg-sky-950 border-orange-500 text-neutral-50">
              <span className="border-b-2 border-green-500">Marine</span>
            </button>

            <button disabled={user?.plan !== "Premium"} onClick={() => {setColorscheme("bubblegum")}}  className="h-20 w-2/5 rounded-lg border-4 box-border bg-fuchsia-100 border-violet-500 text-neutral-950">
              <span className="border-b-2 border-violet-950">Bubblegum</span>
            </button>
          </div>
        </Card>

        <Card
          title="Account actions"
          type="secondary"
          animationDelay="animation-delay-1600"
        >
          <div className="mt-2 flex flex-row flex-wrap gap-2">
            <button className="w-fit flex flex-row gap-2 font-semibold text-warning-100 items-center rounded-md bg-secondary-200 active:bg-secondary-400 duration-200 sm:hover:bg-secondary-400 p-2" onClick={() => {logout()}}>
            <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Interface / Trash_Full">
                  <path id="Vector" d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="var(--warning-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg> Log out
            </button>

            <button className="w-fit flex flex-row gap-2 font-semibold text-warning-100 items-center rounded-md bg-secondary-200 active:bg-secondary-400 duration-200 sm:hover:bg-secondary-400 p-2" onClick={() => {deleteSession("all")}}>
              <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Interface / Trash_Full">
                  <path id="Vector" d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="var(--warning-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg> Kick all sessions
            </button>
          </div>
        </Card>
      </div>

      <dialog ref={infoModal} className="rounded-xl w-96 fadeIn delay-0">
        <div className="bg-accent drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1400">
          <div className="flex items-start flex-row gap-1">
            <h3 className="text-secondary text-2xl font-semibold">Info</h3>
            <form method="dialog" className="flex ml-auto">
              <button className="rounded-md bg-primary duration-200 active:bg-primary-darker sm:hover:bg-primary-darker p-1">
      
              </button>              
            </form>
          </div>

          <p className="text-secondary text-lg rounded-lg">{infoText}</p>
        </div>
      </dialog>
    </>
  )
}
