"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Divider from "@/components/Divider";
import Card from "@/components/CardComponent";

export default function Dashboard() {
  const router = useRouter();

  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username") || "";

    if (username.length < 1) {
      router.push("/user/login");
    }

    setUsername(username);
    return setLoading(false);
  }, []);

  setInterval(() => {
    setTime(new Date().toLocaleTimeString());
  }, 1000);

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <>
      <h1 className="text-4xl font-semibold fadeIn">Welcome back, {username}</h1>
      <div className="flex flex-row gap-1">
      <p className="fadeIn animation-delay-600 items-start">The time is</p> 
      <p className="fadeIn animation-delay-1200 font-semibold text-accent-100">{time}</p>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title="The Vault"
          type="primary"
          animationDelay="animation-delay-1000"
        >
          <p>Your passwords and contacts kept safe and fully encrypted. Accessible by only you.</p>

          <Link href="/vault/" className="mt-2 flex gap-1 items-center font-semibold">
            Enter your Vault
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_429_11072)">
              <path d="M11 3.99994H4V17.9999C4 19.1045 4.89543 19.9999 6 19.9999H18C19.1046 19.9999 20 19.1045 20 17.9999V12.9999" stroke="var(--primary-text)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 14.9999L20 3.99994" stroke="var(--primary-text)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 3.99994H20V8.99994" stroke="var(--primary-text" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>  
          </Link>
        </Card>

        <Card
          title="Profile"
          type="secondary"
          animationDelay="animation-delay-1200"
        >
          <p>Manage sessions, view notifications, change settings, etc.</p>
          <Link href="/user/" className="mt-2 flex gap-1 items-center font-semibold">
            View your Profile
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_429_11072)">
              <path d="M11 3.99994H4V17.9999C4 19.1045 4.89543 19.9999 6 19.9999H18C19.1046 19.9999 20 19.1045 20 17.9999V12.9999" stroke="var(--accent-100)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 14.9999L20 3.99994" stroke="var(--accent-100)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 3.99994H20V8.99994" stroke="var(--accent-100)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>  
          </Link>
        </Card>

        <Card
          title="Notepad"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <p>
            Take private and encrypted notes whenever, wherever. 
            Up to 10 thousand characters per notepad. 
            Now with full markdown support.
          </p>
          <Link href="/notepad/editor" className="mt-2 flex gap-1 items-center font-semibold">
            Visit
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_429_11072)">
              <path d="M11 3.99994H4V17.9999C4 19.1045 4.89543 19.9999 6 19.9999H18C19.1046 19.9999 20 19.1045 20 17.9999V12.9999" stroke="var(--accent-100)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 14.9999L20 3.99994" stroke="var(--accent-100)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 3.99994H20V8.99994" stroke="var(--accent-100)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>  
          </Link>
        </Card>

        <Card
          title="Projects"
          type="secondary"
          animationDelay="animation-delay-1600"
        >
          <p className="text-lg">Releases in 1.0</p>
        </Card>
      </div>
    </>
  )
}