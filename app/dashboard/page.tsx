"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Divider from "@/components/Divider";
import Card from "@/components/CardComponent";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
declare const window: any;

Chart.register(ArcElement, Tooltip);

export default function Dashboard() {
  const router = useRouter();

  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const [entryTotal, setEntryTotal] = useState(0);

  useEffect(() => {
    const username = localStorage.getItem("username") || "";

    if (username.length < 1) {
      router.push("/user/login");
    }

    setUsername(username);
    
    fetch("/api/user/getEntryTotal").then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          return router.push("/user/login");
        }

        return;
      }
    
      setEntryTotal(await response.json());
    });
    
    return setLoading(false);
  }, []);

  setInterval(() => {
    setTime(new Date().toLocaleTimeString());
  }, 1000);


  const doughnutData = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: "Entries",
        data: [entryTotal, (350 - entryTotal)],
        backgroundColor: [
          "#252831",
          "#D3D5D8",
        ],
      },
    ],
  }

  const doughnutOptions = {
    elements: {
      arc: {
        weight: 0,
        borderWidth: 0,
      },
    },
    cutout: 35,
  };

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <>
      <h1 className="text-4xl font-semibold fadeIn">Welcome back,<br/>{username}</h1>
      <div className="flex flex-row gap-1">
        <p className="fadeIn animation-delay-600 items-start">The time is</p> 
        <p className="fadeIn animation-delay-1200 font-semibold text-accent-100">{time}</p>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
            title="Usage"
            animationDelay="animation-delay-1000"
            type="primary"
          >
            <div className="relative flex flex-row">
              <div className="w-1/2 flex flex-col mr-4">
                <p className="unobstructive">Accounts, contacts and notepads are worth 1 entry each.</p>
                <p className="text-lg pt-2 mt-auto">{entryTotal} / 350 entries.</p>
              </div>

              <div className="w-1/3 mr-4 ml-auto">
                <Doughnut className="" data={doughnutData} options={doughnutOptions}/>
              </div>
            </div>
          </Card>

        <Card
          title="Accounts"
          type="secondary"
          animationDelay="animation-delay-1200"
        >
          <p>Store your account details encrypted. Share with anyone you choose.</p>

          <Link href="/accounts/" className="mt-2 flex gap-1 items-center font-semibold">
            Go to Accounts
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_429_11072)">
                <path d="M11 3.99994H4V17.9999C4 19.1045 4.89543 19.9999 6 19.9999H18C19.1046 19.9999 20 19.1045 20 17.9999V12.9999" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 14.9999L20 3.99994" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 3.99994H20V8.99994" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>   
          </Link>
        </Card>

        <Card
          title="Profile"
          type="secondary"
          animationDelay="animation-delay-1400"
        >
          <p>Manage sessions, view notifications, change settings, etc.</p>
          <Link href="/user/" className="mt-2 flex gap-1 items-center font-semibold">
            View your Profile
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_429_11072)">
                <path d="M11 3.99994H4V17.9999C4 19.1045 4.89543 19.9999 6 19.9999H18C19.1046 19.9999 20 19.1045 20 17.9999V12.9999" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 14.9999L20 3.99994" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 3.99994H20V8.99994" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>  
          </Link>
        </Card>

        <Card
          title="Notepad"
          type="secondary"
          animationDelay="animation-delay-1600"
        >
          <p>
            Take notes whenever, wherever. 
            Share with anyone.
          </p>

          <Link href="/notepad/" className="mt-2 flex gap-1 items-center font-semibold">
            Go to Notepad
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_429_11072)">
              <path d="M11 3.99994H4V17.9999C4 19.1045 4.89543 19.9999 6 19.9999H18C19.1046 19.9999 20 19.1045 20 17.9999V12.9999" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 14.9999L20 3.99994" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 3.99994H20V8.99994" stroke="var(--accent-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>  
          </Link>
        </Card>

        <Card
          title="Projects"
          type="secondary"
          animationDelay="animation-delay-1800"
        >
          <p className="text-lg">Releases in 1.0</p>
        </Card>
      </div>
    </>
  )
}