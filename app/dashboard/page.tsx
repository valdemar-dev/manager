"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <p className="fadeIn animation-delay-600">It's currently <span className="fadeIn animation-delay-1200">{time}</span></p>

      {/* divider */}
      <div className="h-10"></div>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-accent text-secondary shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1200 h-min">
          <h3 className="text-xl font-semibold">Profile</h3>
          <p>Manage sessions, view notifications, change settings, etc.</p>
          <Link href="/user/" className="mt-2 text-primary-darker font-semibold">View your Profile</Link>
        </section>

        <section className="bg-primary shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1400 h-min">
          <h3 className="text-xl font-semibold">The Vault</h3>
          <p>Your most valuable data kept encrypted in one place. Access from anywhere in the world.</p>
          <Link href="/vault/" className="mt-2 text-accent font-semibold">Enter your Vault</Link>
        </section>

        <section className="bg-primary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1600">
          <h3 className="text-xl font-semibold mb-2">Projects</h3>
          <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
            <p className="text-lg">Releases in 1.0</p>
          </div>
        </section>
      </div>
    </main>
  )
}