"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import copy from "copy-to-clipboard";
import crypto from "crypto";
import Card from "@/components/CardComponent";

declare const window: any;

Chart.register(ArcElement, Tooltip);

export default function Vault() {
  const router = useRouter();

  const [entryTotal, setEntryTotal] = useState(0);
  const [accounts, setAccounts] = useState<any[]>([]);

  const decrypt = (encryptedText: string, key: string, iv: string, tag: string) => {
    const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tag, "hex"))
    
    let decryptedText = decipher.update(encryptedTextBuffer);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString("utf-8");
  };

  useEffect(() => {
    const vaultKey = sessionStorage.getItem("vaultKey");

    if (!vaultKey) {
      return router.replace("/vault/auth");
    }

    fetch("/api/vault/getAccounts").then(async (response) => {
      if (!response.ok) {
        return;
      }

      const res = await response.json();
      
      res.accounts.forEach((account: any) => {
        account.accountUsername = decrypt(account.accountUsername, vaultKey, account.iv, account.usernameAuthTag);
        account.accountEmail = decrypt(account.accountEmail, vaultKey, account.iv, account.emailAuthTag);
        account.accountPassword = decrypt(account.accountPassword, vaultKey, account.iv, account.passwordAuthTag);
        account.accountService = decrypt(account.accountService, vaultKey, account.iv, account.serviceAuthTag);
      });

      const accounts = [];

      // we only want to show the first 5 accounts
      for (let i = 0; i < res.accounts.length; ++i) {
        if (i === 5) break;

        accounts.push(res.accounts[i]);
      }
    
      setAccounts(accounts);
      setEntryTotal(res.vaultEntryTotal || 0);
    })
  }, []);

  const doughnutData = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: "Entries",
        data: [entryTotal, (200 - entryTotal)],
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

  const mapAccounts = () => {
    if (accounts.length < 1) {
      return (
        <div>No accounts found.</div>
      )
    }

    return accounts.map((account) => {
      return (
        <div className="flex-grow flex items-center gap-2 bg-gray-300 px-3 py-2 rounded-lg" key={account.id}>
          <span className="mr-auto text-lg">{account.accountService}</span> 
          <button className="rounded-md bg-gray-400 duration-200 active:bg-gray-600 sm:hover:bg-gray-500 p-2" onClick={() => {copy(account.accountPassword)}}>
            <Image src={"/password.svg"} height={"18"} width={"18"} alt={"password icon"}/>
          </button>
          <button className="rounded-md bg-primary duration-200 active:bg-gray-600 sm:hover:bg-gray-500 p-2" onClick={() => {copy(account.accountUsername)}}>
            <Image src={"/username.svg"} height={"18"} width={"18"} alt={"username icon"}/>
          </button>
          <button className="rounded-md bg-primary duration-200 active:bg-gray-600 sm:hover:bg-gray-500 p-2" onClick={() => {copy(account.accountEmail)}}>
            <Image src={"/email.svg"} height={"18"} width={"18"} alt={"email icon"}/>
          </button>
        </div>
      )
    })
  };

  return (
    <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 box-border">
      { /* navigation menu */}
      <div className="items-center flex gap-2">
        <Link href="/dashboard" className="rounded-md bg-gray-200 duration-200 active:bg-gray-400 sm:hover:bg-gray-300 p-2 fadeIn animation-delay-400">
          <Image src={"/home.svg"} height={"22"} width={"22"} alt={"home button"}/>
        </Link>
        <span className="font-semibold ml-auto text-lg fadeIn">ManagerX</span>
      </div>

      <div className="h-10"></div>

      <div>
        <h1 className="text-4xl font-semibold fadeIn animation-delay-400">The Vault</h1>
        <p className="fadeIn animation-delay-800">All your data, kept safe.</p>
      </div>

      <div className="h-10"></div>

      <div className="grid md:grid-cols-2 gap-10">
        <Card
          title="Usage"
          animationDelay="animation-delay-1000"
          type="primary"
        >
          <div className="relative flex flex-row">
            <div className="w-1/2 flex flex-col mr-4">
              <p className="unobstructive">Accounts and contacts are worth 1 entry each.</p>
              <p className="text-lg pt-2 mt-auto">{entryTotal} / 200 entries.</p>
            </div>

            <div className="w-1/3 mr-4 ml-auto">
              <Doughnut className="" data={doughnutData} options={doughnutOptions}/>
            </div>
          </div>
        </Card>

        {/* accounts list */}
        <Card
          title="Accounts"
          animationDelay="animation-delay-1200"
          type="secondary"
        >
          {mapAccounts()}
          <Link href="/vault/accounts" className="mt-2 text-accent font-semibold">Go to Accounts</Link>
        </Card>
      </div>
    </main>
  )
}