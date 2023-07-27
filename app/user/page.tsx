"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Account() {
  const router = useRouter();

  const infoModal = useRef<any>();
  const [infoText, setInfoText] = useState<string>("")

  const [sessions, setSessions] = useState<any[]>([]);
  const [username, setUsername] = useState("");

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
        setInfoText("No sessions found. Redirecting to login page.");
        infoModal.current!.showModal();

        setTimeout(() => {
          router.push("/user/login");
        }, 2000);
      }

      setInfoText(await response.text());
      return infoModal.current!.showModal();
    });
  };

  return (
    <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 box-border">
      { /* navigation menu */}
      <div className="items-center flex gap-2">
        <Link href="/dashboard" className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2 fadeIn animation-delay-400">
          <Image src={"/home.svg"} height={"22"} width={"22"} alt={"home button"}/>
        </Link>
        <span className="font-semibold ml-auto text-lg fadeIn">ManagerX</span>
      </div>

      <div className="h-10"></div>

      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">Profile</h1>
        <p className="fadeIn animation-delay-800">Manage sessions, view notifications, change settings, etc.</p>
      </div>

      <div className="h-10"></div>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-accent text-secondary shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1000 h-min">
          <div>
            <h3 className="text-xl font-semibold">{username}</h3>
            <p className="unobstructive text-secondary mb-2">{user?.role}</p>
            <p className="text-lg text-secondary">Plan: {user?.plan}</p>
            <p className="text-lg text-secondary">Member since: {new Date(user?.createdAt || 0).toLocaleDateString()}</p>
          </div>
        </section>

        <section className="bg-primary max-w-full shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1200 h-min">
          <h3 className="text-xl font-semibold mb-2">Sessions</h3>
          {sessions.map((session) => {
            return (
              <div className="relative bg-primary-darker px-3 py-2 rounded-lg" key={session.lastActive.toString("hex")}>
                <div className="flex flex-row items-start">
                  <h3 className="text-lg font-semibold">{session.os}</h3>
                  <button className="ml-auto rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2" onClick={() => {deleteSession([session.createdAt])}}>
                    <Image src={"/delete.svg"} height={"22"} width={"22"} alt={"deletion icon"}/>
                  </button>
                </div>
                Last active: {new Date(session.lastActive).toLocaleString()}
                
                <div className="break-words overflow-hidden">
                  <details className="break-words overflow-hidden">
                    <summary>Click to show IP</summary>
                    <span className="break-all">{session.userIp}</span>
                  </details>
                </div>
              </div>
            )
          })}

          <div className="flex gap-2 flex-row mt-2">
            <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2" onClick={() => {sessionsPageNumber === 1 ? null : setSessionsPageNumber(sessionsPageNumber-1)}}>
              <Image src={"/arrow-backward.svg"} height={"18"} width={"18"} alt={"back page button"}/>
            </button>
            <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2" onClick={() => {sessionsPageNumber === sessionsPageMaxIndex ? null : setSessionsPageNumber(sessionsPageNumber+1)}}>
              <Image src={"/arrow-forward.svg"} height={"18"} width={"18"} alt={"next page button"}/>
            </button> 
          </div>
          <p className="text-sm">Showing page {sessionsPageNumber} of {sessionsPageMaxIndex}</p>
        </section>

        <section className="bg-primary shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1400 h-min">
          <h3 className="text-xl font-semibold">Theme</h3>
          <p className="px-2 py-1 bg-primary-darker text-lg rounded-lg">Releases in 1.0</p>
        </section>

        <section className="bg-secondary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1600 h-min">
          <h3 className="text-xl font-semibold">Account actions</h3>
          <div className="flex flex-row flex-wrap gap-2">
            <button className="w-fit flex flex-row gap-2 items-center rounded-md bg-secondary-darker duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2" onClick={() => {logout()}}>
              <Image src={"/logout.svg"} height={"22"} width={"22"} alt={"deletion icon"}/> Log out
            </button>

            <button className="w-fit flex flex-row gap-2 items-center rounded-md bg-secondary-darker duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2" onClick={() => {deleteSession("all")}}>
              <Image src={"/logout.svg"} height={"22"} width={"22"} alt={"deletion icon"}/> Kick all sessions
            </button>
          </div>
        </section>
      </div>

      <dialog ref={infoModal} className="rounded-xl w-96 fadeIn delay-0">
        <div className="bg-accent drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1400">
          <div className="flex items-start flex-row gap-1">
            <h3 className="text-secondary text-2xl font-semibold">Info</h3>
            <form method="dialog" className="flex ml-auto">
              <button className="rounded-md bg-primary duration-200 active:bg-primary-darker sm:hover:bg-primary-darker p-1">
                <Image src={"/close.svg"} height={"20"} width={"20"} alt={"close icon"} className="fill-secondary"/>
              </button>              
            </form>
          </div>

          <p className="text-secondary text-lg rounded-lg">{infoText}</p>
        </div>
      </dialog>
    </main>
  )
}
