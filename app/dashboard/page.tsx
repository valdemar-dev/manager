"use client";
import { useState } from "react";
import Image from "next/image";

export default function Dashboard() {
  const [time, setTime] = useState("");

  setInterval(() => {
    setTime(new Date().toLocaleTimeString());
  }, 1000);

  return (
    <main className="bg-gradient-to-b from-background to-background-darker min-h-screen overflow-hidden text-text p-4 pt-8 box-border flex flex-col gap-1">
      <h1 className="text-4xl font-semibold">Welcome back, Valdemar</h1>
      <p>It's currently {time}</p>

      {/* divider */}
      <div className="h-10"></div>

      {/* accounts list */}
      <div className="bg-primary p-6 rounded-xl flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Accounts</h3>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Google</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Namecheap</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Discord</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Discord</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
          <span className="mr-auto text-lg">Spotify</span> 
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-secondary duration-200 active:bg-secondary-darker sm:hover:bg-secondary-darker p-2">
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
        <a href="/accounts/" className="mt-4 text-accent font-semibold">Go to Accounts</a>
      </div>

      {/* divider */}
      <div className="h-10"></div>

      <div className="bg-secondary p-6 rounded-xl flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Projects</h3>
        <div className="flex items-center gap-2 bg-secondary-darker px-3 py-2 rounded-lg">
          <p className="text-lg">No projects found!</p>
        </div>
      </div>
    </main>
  )
}