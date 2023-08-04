"use client";

import Card from "@/components/CardComponent";
import Divider from "@/components/Divider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import crypto from "crypto";

export default function Account() {
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

  const [notifications, setNotifications] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);

  interface User {
    createdAt: Date,
    role: string,
    tier: string,
  }

  const [user, setUser] = useState<User>();

  const [sessionsPageNumber, setSessionsPageNumber] = useState<number>(1);
  const [sessionsPageMaxIndex, setSessionsPageMaxIndex] = useState<number>(1);

  const decrypt = (text: string, key: string) => {
    const iv = text.slice(0,32);
    const tag = text.slice(32,64);
    const encryptedText = text.slice(64,text.length);

    const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tag, "hex"))
    
    let decryptedText = decipher.update(encryptedTextBuffer);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString("utf-8");
  };

  const encrypt = (text: string, key: string,) => {
    const iv: Buffer = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);

    let encryptedText = cipher.update(text);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    const tag = cipher.getAuthTag();

    return { encryptedText: encryptedText.toString("hex"), authTag: tag.toString("hex"), iv: iv.toString("hex") }
  };

  useEffect(() => {
    const authKey = sessionStorage.getItem("authKey");

    if (!authKey) {
      return router.push("/user/auth");
    }

    fetch("/api/user/sessions/getSessionList").then(async (res) => {
      if (!res.ok) {
        return router.push("/user/login");
      }

      const resJSON = await res.json();

      setSessions(resJSON);

      // decrypt sessions
      resJSON.forEach((session: any) => {
        session.ip = decrypt(session.ip, authKey);
        session.browser = decrypt(session.browser, authKey);
        session.os = decrypt(session.os, authKey);
      })

      const sessionsPerPage: number = 5;
      setSessionsPageMaxIndex(Math.ceil(resJSON.length / sessionsPerPage));
    })

    setUsername(localStorage.getItem("username") || "");

    fetch("/api/user/getUser").then(async (response) => {
      if(!response.ok) {
        return router.push("/user/login");
      }

      const res = await response.json();
      setUser(res);
    })

    fetch("/api/user/notifications/getNotifications").then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          return router.push("/user/login");
        }

        return router.push("/user/auth");
      }

      setNotifications(await response.json());
    })

    setLoading(false);
  }, []);

  const logout = () => {
    fetch("/api/user/logout").then(() => {
      return router.push("/user/login");
    })
  };

  const deleteSession = (sessionId: string) => {
    const data = {
      sessionId: sessionId
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("/api/user/sessions/deleteSession", options).then(async (response) => {
      if (!response.ok) {
        return;
      }

      sessions.forEach((session, index) => {
        if (session.id === sessionId) {
          sessions.splice(index);
        }

        if (sessions.length < 1) {
          return router.push("/user/login");
        }
      })

      setSessions(sessions);

      setModalText(await response.text());
      return showModal(1000)
    });
  };

  const setColorscheme = (colorscheme: string) => {
    if (user!.tier !== "Premium") {
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

  const mapSessions = () => {
    const accountsPerPage: number = 5;

    const maxIndex = sessionsPageNumber * accountsPerPage -1;
    const minIndex = maxIndex - accountsPerPage +1

    const filteredSessions = sessions.filter((session, index) => {
      if (
        index < minIndex ||
        index > maxIndex
      ) return false;

      return true;
    });

    return filteredSessions.map((session) => {
      return (
        <div className="relative bg-secondary-200 px-3 py-2 rounded-lg mb-2" key={session.lastUsedAt.toString("hex")}>
          <div className="flex flex-row items-start">
            <h3 className="text-lg font-semibold">{session.os}</h3>
            <button className="ml-auto rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {deleteSession(session.id)}}>
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Interface / Trash_Full">
                <path id="Vector" d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="var(--warning-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
            </button> 
          </div>
          <p className="mt-2">Last active: {new Date(session.lastUsedAt || "1000").toLocaleString()}</p>
          
          <div className="break-words overflow-hidden">
            <details className="break-words overflow-hidden">
              <summary>Click to show IP</summary>
              <span className="break-all">{session.ip}</span>
            </details>
          </div>
        </div>
      )
    })
  };

  const approveAccount = async (notificationData: any, notificationId: string) => {
    const tempKey = notificationData.key;
    const accountId = notificationData.id;

    const authKey = sessionStorage.getItem("authKey");

    if (!authKey) {
      return router.push("/user/auth");
    }

    const data = {
      authKey: tempKey,
      id: accountId,
      notificationId: notificationId,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("/api/user/accounts/approveAccount", options).then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          return router.push("/user/login");
        }

        setModalText(await response.text());
        return showModal(2000);
      }

      const res = await response.json();

      const key = res.key;

      const account = res.account;

      account.username = decrypt(account.username, key);
      account.email = decrypt(account.email, key);
      account.password = decrypt(account.password, key);
      account.service = decrypt(account.service, key);

      const encryptedUsername = encrypt(account.username, authKey);
      const encryptedUsernameFinal = `${encryptedUsername.iv}${encryptedUsername.authTag}${encryptedUsername.encryptedText}`;

      const encryptedEmail = encrypt(account.email, authKey);
      const encryptedEmailFinal = `${encryptedEmail.iv}${encryptedEmail.authTag}${encryptedEmail.encryptedText}`;

      const encryptedPassword = encrypt(account.password, authKey);
      const encryptedPasswordFinal = `${encryptedPassword.iv}${encryptedPassword.authTag}${encryptedPassword.encryptedText}`;

      const encryptedService = encrypt(account.service, authKey);
      const encryptedServiceFinal = `${encryptedService.iv}${encryptedService.authTag}${encryptedService.encryptedText}`;

      const data = {
        username: encryptedUsernameFinal,
        email: encryptedEmailFinal,
        password: encryptedPasswordFinal,
        service: encryptedServiceFinal,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "/application/json",
        },
        body: JSON.stringify(data),
      };

      fetch("/api/user/createAccount", options).then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            return router.push("/user/login");
          }

          setModalText(await response.text());
          return showModal(2000);
        }

        setModalText("Successfully received account details!");
        showModal(2000);

        setTimeout(() => {
          router.push("/accounts");
        }, 4000);
      })
    })

  };

  const deleteNotification = (id: string) => {
    const data = {
      id: id,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("/api/user/notifications/deleteNotification", options).then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          return router.push("/user/login");
        }

        setModalText(await response.text());
        return showModal(2000);
      }

      notifications.forEach((notification, index) => {
        if (notification.id === id) {
          notifications.splice(index);
        }
      })

      setNotifications(notifications);

      setModalText(await response.text());
      showModal(2000);
    })
  };

  const mapNotifications = () => {
    if (notifications.length < 1) {
      return (
        <div>No notifications found.</div>
      )
    }

    const notificationsPerPage: number = 5;

    const maxIndex = sessionsPageNumber * notificationsPerPage -1;
    const minIndex = maxIndex - notificationsPerPage +1

    const filteredNotifications = notifications.filter((notification, index) => {
      if (
        index < minIndex ||
        index > maxIndex
      ) return false;

      return true;
    });

    return filteredNotifications.map((notification) => {
      if (notification.type === "accountShare") {
        return (
          <div className="relative bg-secondary-200 px-3 py-2 rounded-lg mb-2" key={notification.id}>
            <div className="flex flex-row items-start gap-2">
              <h3 className="mr-4">{notification.title}</h3>
              <button className="ml-auto rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {approveAccount(JSON.parse(notification.data), notification.id)}}>
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.2287 6.60355C21.6193 6.99407 21.6193 7.62723 21.2287 8.01776L10.2559 18.9906C9.86788 19.3786 9.23962 19.3814 8.84811 18.9969L2.66257 12.9218C2.26855 12.5349 2.26284 11.9017 2.64983 11.5077L3.35054 10.7942C3.73753 10.4002 4.37067 10.3945 4.7647 10.7815L9.53613 15.4677L19.1074 5.89644C19.4979 5.50592 20.1311 5.50591 20.5216 5.89644L21.2287 6.60355Z" fill="var(--accent-100)"/>
                </svg>
              </button> 
              <button className="ml-auto rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {deleteNotification(notification.id)}}>
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="Interface / Trash_Full">
                  <path id="Vector" d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="var(--warning-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              </button> 
            </div>
          </div>
        )
      }

      else if (notification.type === "info") {
        return (
          <div className="relative bg-secondary-200 px-3 py-2 rounded-lg mb-2" key={notification.id}>
            <div className="flex flex-row items-start">
              <h3 className="text-lg font-semibold">{notification.title}</h3>
              <button className="ml-auto rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {deleteSession(notification.id)}}>
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="Interface / Trash_Full">
                  <path id="Vector" d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="var(--warning-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              </button> 
            </div>
          </div>
        )
      }
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

          <p className="text-lg text-secondary">Tier: <span className="font-bold">{user?.tier}</span></p>
          <p className="text-lg text-secondary">Joined: <span
            className="font-bold">{new Date(user?.createdAt || "0").toLocaleDateString()}</span></p>
        </Card>

        <Card
          title="Notifications"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <div className="flex flex-col gap-2 mt-2">
            {mapNotifications()}
          </div>

          <div className="flex gap-2 flex-row mt-2">
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {sessionsPageNumber === 1 ? null : setSessionsPageNumber(sessionsPageNumber-1)}}>
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
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {sessionsPageNumber === sessionsPageMaxIndex ? null : setSessionsPageNumber(sessionsPageNumber+1)}}>
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
          <p className="text-sm">Showing page {sessionsPageNumber} of {sessionsPageMaxIndex}</p>
        </Card>

        <Card
          title="Sessions"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <div className="flex flex-col gap-3 mt-2">
            {mapSessions()}
          </div>

          <div className="flex gap-2 flex-row mt-2">
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {sessionsPageNumber === 1 ? null : setSessionsPageNumber(sessionsPageNumber-1)}}>
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
            <button className="rounded-md bg-secondary-200 duration-200 active:bg-secondary-400 sm:hover:bg-secondary-300 p-2" onClick={() => {sessionsPageNumber === sessionsPageMaxIndex ? null : setSessionsPageNumber(sessionsPageNumber+1)}}>
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
          <p className="text-sm">Showing page {sessionsPageNumber} of {sessionsPageMaxIndex}</p>
        </Card>


        <Card
          title="Theme"
          type="secondary"
          animationDelay="animation-delay-1600"
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
            <button disabled={user?.tier !== "Premium"} onClick={() => {setColorscheme("protege")}} className="h-20 w-2/5  rounded-lg border-4 box-border border-purple-700 bg-neutral-950 text-neutral-50">
              <span className="border-b-2 border-amber-600">Protege</span>
            </button>

            <button disabled={user?.tier !== "Premium"} onClick={() => {setColorscheme("danger")}}  className="h-20 w-2/5 rounded-lg border-4 box-border border-red-500 bg-neutral-950 text-neutral-50">
              <span className="border-b-2 border-orange-500">Danger</span>
            </button>

            <button disabled={user?.tier !== "Premium"} onClick={() => {setColorscheme("forest")}}  className="h-20 w-2/5 rounded-lg border-4 box-border border-yellow-400 bg-emerald-950 text-neutral-50">
              <span className="border-b-2 border-blue-300">Forest</span>
            </button>

            <button disabled={user?.tier !== "Premium"} onClick={() => {setColorscheme("paulios")}}  className="h-20 w-2/5 rounded-lg border-4 box-border border-sky-300 bg-slate-950 text-neutral-50">
              <span className="border-b-2 border-amber-500">Paulios</span>
            </button>

            <button disabled={user?.tier !== "Premium"} onClick={() => {setColorscheme("marine")}}  className="h-20 w-2/5 rounded-lg border-4 box-border bg-sky-950 border-orange-500 text-neutral-50">
              <span className="border-b-2 border-green-500">Marine</span>
            </button>

            <button disabled={user?.tier !== "Premium"} onClick={() => {setColorscheme("bubblegum")}}  className="h-20 w-2/5 rounded-lg border-4 box-border bg-fuchsia-100 border-violet-500 text-neutral-950">
              <span className="border-b-2 border-violet-950">Bubblegum</span>
            </button>
          </div>
        </Card>

        <Card
          title="Account actions"
          type="secondary"
          animationDelay="animation-delay-1800"
        >
          <div className="mt-2 flex flex-row flex-wrap gap-2">
            <button className="w-fit flex flex-row gap-2 font-semibold text-warning-100 items-center rounded-md bg-secondary-200 active:bg-secondary-400 duration-200 sm:hover:bg-secondary-400 p-2" onClick={() => {logout()}}>
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Interface / Trash_Full">
                  <path id="Vector" d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="var(--warning-100)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg> Log out
            </button>
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
