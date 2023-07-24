"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    <main className="bg-background min-h-screen overflow-hidden text-text p-4 pt-8 box-border flex flex-col gap-1">
      <h1 className="text-4xl font-semibold fadeIn">Welcome back, {username}</h1>
      <p className="fadeIn animation-delay-600">It's currently <span className="fadeIn animation-delay-1200">{time}</span></p>

      {/* divider */}
      <div className="h-10"></div>

      <section className="bg-primary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-800">
        <h3 className="text-2xl font-semibold mb-2">The Vault</h3>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <p className="text-lg">Keep your data safe and access it from anywhere in the world.</p>
        </div>
        <a href="/vault/" className="mt-2 text-accent font-semibold">Visit the Vault</a>
      </section>

      {/* divider */}
      <div className="h-10"></div>

      <section className="bg-secondary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1000">
        <h3 className="text-xl font-semibold mb-2">Projects</h3>
        <div className="flex items-center gap-2 bg-secondary-darker px-3 py-2 rounded-lg">
          <p className="text-lg">No projects found!</p>
        </div>
      </section>

      {/* divider */}
      <div className="h-10"></div>
    </main>
  )
}