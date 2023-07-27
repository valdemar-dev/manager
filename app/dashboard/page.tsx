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
    <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 pt-12 box-border">
      <h1 className="text-4xl font-semibold fadeIn">Welcome back, {username}</h1>
      <div className="flex flex-row gap-1">
      <p className="fadeIn animation-delay-600 items-start">The time is</p> 
      <p className="fadeIn animation-delay-1200 font-semibold text-green-500">{time}</p>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title="The Vault"
          type="primary"
          animationDelay="animation-delay-1000"
        >
          <p>Your most valuable data kept encrypted in one place. Access from anywhere in the world.</p>
          <Link href="/vault/" className="mt-2 font-semibold">Enter your Vault</Link>
        </Card>

        <Card
          title="Profile"
          type="secondary"
          animationDelay="animation-delay-1200"
        >
          <p>Manage sessions, view notifications, change settings, etc.</p>
          <Link href="/user/" className=" mt-auto font-semibold">View your Profile</Link>
        </Card>

        <Card
          title="Projects"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <p className="text-lg">Releases in 1.0</p>
        </Card>
      </div>
    </main>
  )
}