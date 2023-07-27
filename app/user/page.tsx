"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
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

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 box-border">
      { /* navigation menu */}
      <div className="items-center flex gap-2">
        <Link href="/dashboard" className="rounded-md bg-gray-200 duration-200 active:bg-gray-400 sm:hover:bg-gray-300 p-2 fadeIn animation-delay-400">
          <Image src={"/home.svg"} height={"22"} width={"22"} alt={"home button"}/>
        </Link>
        <span className="font-semibold ml-auto text-lg fadeIn">ManagerX</span>
      </div>

      <Divider height="h-10"/>

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
          <p className="text-lg text-secondary">Joined: <span className="font-bold">{new Date(user?.createdAt || "0").toLocaleDateString()}</span></p>
        </Card>

        <Card
          title="Sessions"
          type="secondary"
          animationDelay="animation-delay-1200"
        >
          <div className="mt-2">
            {sessions.map((session) => {
              return (
                <div className="relative bg-gray-200 px-3 py-2 rounded-lg" key={session.lastActive.toString("hex")}>
                  <div className="flex flex-row items-start">
                    <h3 className="text-lg font-semibold">{session.os}</h3>
                    <button className="ml-auto rounded-md bg-gray-300 duration-200 active:bg-gray-500 sm:hover:bg-gray-400 p-2" onClick={() => {deleteSession([session.createdAt])}}>
                      <Image src={"/delete.svg"} height={"22"} width={"22"} alt={"deletion icon"}/>
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
            <button className="rounded-md bg-gray-200 duration-200 active:bg-gray-400 sm:hover:bg-gray-300 p-2" onClick={() => {sessionsPageNumber === 1 ? null : setSessionsPageNumber(sessionsPageNumber-1)}}>
              <Image src={"/arrow-backward.svg"} height={"18"} width={"18"} alt={"back page button"}/>
            </button>
            <button className="rounded-md bg-gray-200 duration-200 active:bg-gray-400 sm:hover:bg-gray-300 p-2" onClick={() => {sessionsPageNumber === sessionsPageMaxIndex ? null : setSessionsPageNumber(sessionsPageNumber+1)}}>
              <Image src={"/arrow-forward.svg"} height={"18"} width={"18"} alt={"next page button"}/>
            </button> 
          </div>
          <p className="text-sm">Showing page {sessionsPageNumber} of {sessionsPageMaxIndex}</p>
        </Card>


        <Card
          title="Theme"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <p className="px-2 py-1 bg-primary-darker text-lg rounded-lg">Releases in 1.0</p>
        </Card>

        <Card
          title="Account actions"
          type="secondary"
          animationDelay="animation-delay-1600"
        >
          <div className="mt-2 flex flex-row flex-wrap gap-2">
            <button className="w-fit flex flex-row gap-2 font-semibold text-red-500 items-center rounded-md bg-gray-200 duration-200 active:bg-gray-400 sm:hover:bg-gray-300 p-2" onClick={() => {logout()}}>
              <Image src={"/logout.svg"} height={"22"} width={"22"} alt={"deletion icon"}/> Log out
            </button>

            <button className="w-fit flex flex-row gap-2 font-semibold text-red-500 items-center rounded-md bg-gray-200 duration-200 active:bg-gray-400 sm:hover:bg-gray-300 p-2" onClick={() => {deleteSession("all")}}>
              <Image src={"/logout.svg"} height={"22"} width={"22"} alt={"deletion icon"}/> Kick all sessions
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
