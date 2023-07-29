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
        <div className="flex-grow flex items-center gap-2 bg-secondary-200 px-3 py-2 rounded-lg" key={account.id}>
          <span className="mr-auto text-lg">{account.accountService}</span> 
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {copy(account.accountPassword)}}>
            <svg width="20x" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M22 8.29344C22 11.7692 19.1708 14.5869 15.6807 14.5869C15.0439 14.5869 13.5939 14.4405 12.8885 13.8551L12.0067 14.7333C11.4883 15.2496 11.6283 15.4016 11.8589 15.652C11.9551 15.7565 12.0672 15.8781 12.1537 16.0505C12.1537 16.0505 12.8885 17.075 12.1537 18.0995C11.7128 18.6849 10.4783 19.5045 9.06754 18.0995L8.77362 18.3922C8.77362 18.3922 9.65538 19.4167 8.92058 20.4412C8.4797 21.0267 7.30403 21.6121 6.27531 20.5876L5.2466 21.6121C4.54119 22.3146 3.67905 21.9048 3.33616 21.6121L2.45441 20.7339C1.63143 19.9143 2.1115 19.0264 2.45441 18.6849L10.0963 11.0743C10.0963 11.0743 9.3615 9.90338 9.3615 8.29344C9.3615 4.81767 12.1907 2 15.6807 2C19.1708 2 22 4.81767 22 8.29344ZM15.681 10.4889C16.8984 10.4889 17.8853 9.50601 17.8853 8.29353C17.8853 7.08105 16.8984 6.09814 15.681 6.09814C14.4635 6.09814 13.4766 7.08105 13.4766 8.29353C13.4766 9.50601 14.4635 10.4889 15.681 10.4889Z" fill="var(--accent-100)"/>
            </svg>
          </button>
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {copy(account.accountUsername)}}>
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1C8.96243 1 6.5 3.46243 6.5 6.5C6.5 9.53757 8.96243 12 12 12C15.0376 12 17.5 9.53757 17.5 6.5C17.5 3.46243 15.0376 1 12 1Z" fill="var(--accent-100)"/>
              <path d="M7 14C4.23858 14 2 16.2386 2 19V22C2 22.5523 2.44772 23 3 23H21C21.5523 23 22 22.5523 22 22V19C22 16.2386 19.7614 14 17 14H7Z" fill="var(--accent-100)"/>
            </svg>
          </button>
          <button className="rounded-md bg-secondary-300 duration-200 active:bg-secondary-500 sm:hover:bg-secondary-400 p-2" onClick={() => {copy(account.accountEmail)}}>
            <svg height="20px" width="20px" fill="var(--accent-100)" viewBox="0 0 512 512">
            <g>
              <path stroke="#ffffff" className="st0" d="M440.917,67.925H71.083C31.827,67.925,0,99.752,0,139.008v233.984c0,39.256,31.827,71.083,71.083,71.083
                h369.834c39.255,0,71.083-31.827,71.083-71.083V139.008C512,99.752,480.172,67.925,440.917,67.925z M178.166,321.72l-99.54,84.92
                c-7.021,5.992-17.576,5.159-23.567-1.869c-5.992-7.021-5.159-17.576,1.87-23.567l99.54-84.92c7.02-5.992,17.574-5.159,23.566,1.87
                C186.027,305.174,185.194,315.729,178.166,321.72z M256,289.436c-13.314-0.033-26.22-4.457-36.31-13.183l0.008,0.008l-0.032-0.024
                c0.008,0.008,0.017,0.008,0.024,0.016L66.962,143.694c-6.98-6.058-7.723-16.612-1.674-23.583c6.057-6.98,16.612-7.723,23.582-1.674
                l152.771,132.592c3.265,2.906,8.645,5.004,14.359,4.971c5.706,0.017,10.995-2.024,14.44-5.028l0.074-0.065l152.615-132.469
                c6.971-6.049,17.526-5.306,23.583,1.674c6.048,6.97,5.306,17.525-1.674,23.583l-152.77,132.599
                C282.211,284.929,269.322,289.419,256,289.436z M456.948,404.771c-5.992,7.028-16.547,7.861-23.566,1.869l-99.54-84.92
                c-7.028-5.992-7.861-16.546-1.869-23.566c5.991-7.029,16.546-7.861,23.566-1.87l99.54,84.92
                C462.107,387.195,462.94,397.75,456.948,404.771z"/>
            </g>
          </svg>
          </button>
        </div>
      )
    })
  };

  return (
    <>
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
    </>
  )
}